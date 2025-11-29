/**
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import "./react-select.scss";
import cn from "classnames";
import { useEffect, useRef, useState } from "react";
import { RiSidebarFoldLine, RiSidebarUnfoldLine } from "react-icons/ri";
import Select from "react-select";
import { useLiveAPIContext } from "../../contexts/LiveAPIContext";
import { useLoggerStore } from "../../lib/store-logger";
import Logger, { LoggerFilterType } from "../logger/Logger";
import "./side-panel.scss";
import { LocalRagClient } from "../../lib/rag/local-rag";
import { AI_ENGINE, GEMINI_API_KEY } from "../../config";
import { routeChat } from "../../lib/chat-router";
import { useConversationStore } from "../../lib/conversation-store";

const filterOptions = [
  { value: "conversations", label: "Conversations" },
  { value: "tools", label: "Tool Use" },
  { value: "none", label: "All" },
];

export default function SidePanel() {
  const { connected, client } = useLiveAPIContext();
  const [open, setOpen] = useState(true);
  const loggerRef = useRef<HTMLDivElement>(null);
  const loggerLastHeightRef = useRef<number>(-1);
  const { log, logs } = useLoggerStore();
  const { addUser, addAssistant, getRecap } = useConversationStore();

  const [textInput, setTextInput] = useState("");
  const [selectedOption, setSelectedOption] = useState<{
    value: string;
    label: string;
  } | null>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const ragClientRef = useRef<LocalRagClient | null>(null);
  const [ragInfo, setRagInfo] = useState<{
    builtAt?: string;
    sourceRoot?: string;
  } | null>(null);

  useEffect(() => {
    const client = new LocalRagClient();
    ragClientRef.current = client;
    client.loadIndex().then((index) => {
      if (index) {
        setRagInfo({
          builtAt: index.builtAt,
          sourceRoot: index.sourceRoot,
        });
      }
    });
  }, []);

  //scroll the log to the bottom when new logs come in
  useEffect(() => {
    if (loggerRef.current) {
      const el = loggerRef.current;
      const scrollHeight = el.scrollHeight;
      if (scrollHeight !== loggerLastHeightRef.current) {
        el.scrollTop = scrollHeight;
        loggerLastHeightRef.current = scrollHeight;
      }
    }
  }, [logs]);

  // listen for log events and store them
  useEffect(() => {
    client.on("log", log);
    return () => {
      client.off("log", log);
    };
  }, [client, log]);

  const handleSubmit = async () => {
    const userMessage = textInput.trim();
    if (!userMessage.length) return;

    let parts: { text: string }[] = [{ text: userMessage }];
    addUser(userMessage);

    if (ragClientRef.current && GEMINI_API_KEY) {
      const hits = await ragClientRef.current.search(userMessage, 4);
      if (!hits.length) {
        log({
          date: new Date(),
          type: "rag.miss",
          message: "No local RAG hits (rebuild index?)",
        });
      } else {
        const formatted = hits
          .map(
            (hit, idx) =>
              `[${idx + 1}] ${hit.source}\n${hit.text.trim()}`.trim()
          )
          .join("\n\n");
        const sourceRoot = ragInfo?.sourceRoot
          ? `Source root: ${ragInfo.sourceRoot}`
          : "Local knowledge base";
        parts = [
          {
            text: `${sourceRoot}${
              ragInfo?.builtAt ? ` (indexed ${ragInfo.builtAt})` : ""
            }`,
          },
          {
            text: `Local knowledge snippets:\n${formatted}`,
          },
          {
            text: `Respond to the user. If you use the snippets, cite them like [1], [2]. User request: ${userMessage}`,
          },
        ];
      }
    }

    // Google Live API path (existing)
    if (AI_ENGINE === "google") {
      client.send(parts);
      setTextInput("");
      if (inputRef.current) {
        inputRef.current.innerText = "";
      }
      return;
    }

    // Local or external HTTP chat engines
    log({
      date: new Date(),
      type: "client.send",
      message: { turns: parts as any, turnComplete: true },
    });

    const prompt = parts.map((p) => p.text).join("\n\n");
    try {
      const reply = await routeChat([
        { role: "system", content: "You are a helpful assistant." },
        { role: "user", content: prompt },
      ]);
      addAssistant(reply);
      log({
        date: new Date(),
        type: "server.content",
        message: { modelTurn: { parts: [{ text: reply }] } } as any,
      });
    } catch (err: any) {
      log({
        date: new Date(),
        type: "server.error",
        message: (err as Error).message,
      });
    }

    setTextInput("");
    if (inputRef.current) {
      inputRef.current.innerText = "";
    }
  };

  // capture assistant replies into conversation store
  useEffect(() => {
    const onContent = (data: any) => {
      const parts = data?.modelTurn?.parts || [];
      parts.forEach((p: any) => {
        if (p.text) {
          addAssistant(p.text);
        }
      });
    };
    client.on("content", onContent);
    return () => {
      client.off("content", onContent);
    };
  }, [client, addAssistant]);

  // on reconnect, replay recap to restore context
  const prevConnected = useRef<boolean>(connected);
  useEffect(() => {
    if (!prevConnected.current && connected) {
      const recap = getRecap(1800);
      if (recap.trim().length && AI_ENGINE === "google") {
        client.send([
          {
            text: `Context recap from previous session:\n${recap}\nContinue naturally.`,
          },
        ]);
      }
    }
    prevConnected.current = connected;
  }, [connected, client, getRecap]);

  return (
    <div className={`side-panel ${open ? "open" : ""}`}>
      <header className="top">
        <h2>Console</h2>
        {open ? (
          <button className="opener" onClick={() => setOpen(false)}>
            <RiSidebarFoldLine color="#b4b8bb" />
          </button>
        ) : (
          <button className="opener" onClick={() => setOpen(true)}>
            <RiSidebarUnfoldLine color="#b4b8bb" />
          </button>
        )}
      </header>
      <section className="indicators">
        <Select
          className="react-select"
          classNamePrefix="react-select"
          styles={{
            control: (baseStyles) => ({
              ...baseStyles,
              background: "var(--Neutral-15)",
              color: "var(--Neutral-90)",
              minHeight: "33px",
              maxHeight: "33px",
              border: 0,
            }),
            option: (styles, { isFocused, isSelected }) => ({
              ...styles,
              backgroundColor: isFocused
                ? "var(--Neutral-30)"
                : isSelected
                  ? "var(--Neutral-20)"
                  : undefined,
            }),
          }}
          defaultValue={selectedOption}
          options={filterOptions}
          onChange={(e) => {
            setSelectedOption(e);
          }}
        />
        <div className={cn("streaming-indicator", { connected })}>
          {connected
            ? `🔵${open ? " Streaming" : ""}`
            : `⏸️${open ? " Paused" : ""}`}
        </div>
      </section>
      <div className="side-panel-container" ref={loggerRef}>
        <Logger
          filter={(selectedOption?.value as LoggerFilterType) || "none"}
        />
      </div>
      <div className={cn("input-container", { disabled: !connected })}>
        <div className="input-content">
          <textarea
            className="input-area"
            ref={inputRef}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                e.stopPropagation();
                handleSubmit();
              }
            }}
            onChange={(e) => setTextInput(e.target.value)}
            value={textInput}
          ></textarea>
          <span
            className={cn("input-content-placeholder", {
              hidden: textInput.length,
            })}
          >
            Type&nbsp;something...
          </span>

          <button
            className="send-button material-symbols-outlined filled"
            onClick={handleSubmit}
          >
            send
          </button>
        </div>
      </div>
    </div>
  );
}
