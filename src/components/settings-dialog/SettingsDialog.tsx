import {
  ChangeEvent,
  FormEventHandler,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import * as Dialog from "@radix-ui/react-dialog";
import "./settings-dialog.scss";
import { useLiveAPIContext } from "../../contexts/LiveAPIContext";
import VoiceSelector from "./VoiceSelector";
import ResponseModalitySelector from "./ResponseModalitySelector";
import { FunctionDeclaration, LiveConnectConfig, Tool } from "@google/genai";
import { usePromptStore, MAX_DOC_SIZE } from "../../lib/prompt-store";
import { AI_ENGINE, AIEngine } from "../../config";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { nanoid } from "nanoid";
import cn from "classnames";

type FunctionDeclarationsTool = Tool & {
  functionDeclarations: FunctionDeclaration[];
};

const engineOptions: { value: AIEngine; label: string }[] = [
  { value: "google", label: "Google Live" },
  { value: "lmstudio", label: "LM Studio (local)" },
  { value: "openai", label: "OpenAI" },
  { value: "anthropic", label: "Anthropic" },
];

const getStoredEngine = (): AIEngine => {
  if (typeof window === "undefined") return AI_ENGINE;
  const stored = window.localStorage.getItem(
    "aiEngineOverride"
  ) as AIEngine | null;
  return stored || AI_ENGINE;
};

export default function SettingsDialog() {
  const [open, setOpen] = useState(false);
  const { config, setConfig, connected, model, setModel } = useLiveAPIContext();

  const {
    personas,
    knowledgeDocs,
    addPersona,
    updatePersona,
    removePersona,
    activePersonaId,
    setActivePersona,
    selectedDocIds,
    toggleDocSelection,
    setDocSelection,
    setSessionBrief,
    sessionBrief,
    upsertDoc,
    removeDoc,
  } = usePromptStore();

  const personaSchema = useMemo(
    () =>
      z.object({
        name: z.string().min(2, "Name is required"),
        role: z.string().min(2, "Role is required"),
        prompt: z.string().min(10, "Add a short persona prompt"),
      }),
    []
  );

  const { register, handleSubmit, reset, formState, setValue } = useForm<
    z.infer<typeof personaSchema>
  >({
    resolver: zodResolver(personaSchema),
    defaultValues: {
      name: "",
      role: "",
      prompt: "",
    },
  });

  const [editingPersonaId, setEditingPersonaId] = useState<string | undefined>(
    undefined
  );
  const [modelInput, setModelInput] = useState(model);
  const [lmStudioUrl, setLmStudioUrl] = useState(() => {
    if (typeof window !== "undefined") {
      return (
        window.localStorage.getItem("lmstudioBaseUrl") ||
        "http://192.168.0.27:1234/v1"
      );
    }
    return "http://192.168.0.27:1234/v1";
  });
  const [engine, setEngine] = useState<AIEngine>(getStoredEngine());

  useEffect(() => {
    setModelInput(model);
  }, [model]);

  const onPersonaSubmit = handleSubmit((data) => {
    if (editingPersonaId) {
      updatePersona(editingPersonaId, data);
    } else {
      addPersona({ ...data });
    }
    reset();
    setEditingPersonaId(undefined);
  });

  const startEditPersona = useCallback(
    (id: string) => {
      const persona = personas.find((p) => p.id === id);
      if (!persona) return;
      setEditingPersonaId(id);
      setValue("name", persona.name);
      setValue("role", persona.role);
      setValue("prompt", persona.prompt);
    },
    [personas, setValue]
  );

  const functionDeclarations: FunctionDeclaration[] = useMemo(() => {
    if (!Array.isArray(config.tools)) {
      return [];
    }
    return (config.tools as Tool[])
      .filter((t: Tool): t is FunctionDeclarationsTool =>
        Array.isArray((t as any).functionDeclarations)
      )
      .map((t) => t.functionDeclarations)
      .filter((fc) => !!fc)
      .flat();
  }, [config]);

  const systemInstruction = useMemo(() => {
    if (!config.systemInstruction) {
      return "";
    }
    if (typeof config.systemInstruction === "string") {
      return config.systemInstruction;
    }
    if (Array.isArray(config.systemInstruction)) {
      return config.systemInstruction
        .map((p) => (typeof p === "string" ? p : p.text))
        .join("\n");
    }
    if (
      typeof config.systemInstruction === "object" &&
      "parts" in config.systemInstruction
    ) {
      return (
        config.systemInstruction.parts?.map((p) => p.text).join("\n") || ""
      );
    }
    return "";
  }, [config]);

  const [userInstruction, setUserInstruction] = useState(systemInstruction);

  const updateUserInstruction: FormEventHandler<HTMLTextAreaElement> =
    useCallback((event: ChangeEvent<HTMLTextAreaElement>) => {
      setUserInstruction(event.target.value);
    }, []);

  useEffect(() => {
    setUserInstruction(systemInstruction);
  }, [systemInstruction]);

  const updateFunctionDescription = useCallback(
    (editedFdName: string, newDescription: string) => {
      const newConfig: LiveConnectConfig = {
        ...config,
        tools:
          config.tools?.map((tool) => {
            const fdTool = tool as FunctionDeclarationsTool;
            if (!Array.isArray(fdTool.functionDeclarations)) {
              return tool;
            }
            return {
              ...tool,
              functionDeclarations: fdTool.functionDeclarations.map((fd) =>
                fd.name === editedFdName
                  ? { ...fd, description: newDescription }
                  : fd
              ),
            };
          }) || [],
      };
      setConfig(newConfig);
    },
    [config, setConfig]
  );

  const selectedPersona = useMemo(
    () => personas.find((p) => p.id === activePersonaId),
    [activePersonaId, personas]
  );

  const selectedDocs = useMemo(
    () => knowledgeDocs.filter((doc) => selectedDocIds.includes(doc.id)),
    [knowledgeDocs, selectedDocIds]
  );

  const composeSystemInstruction = useCallback(() => {
    const parts: string[] = [];
    if (selectedPersona) {
      parts.push(
        `# Persona: ${selectedPersona.name}\nRole: ${selectedPersona.role}\n\n${selectedPersona.prompt}`
      );
    }
    if (sessionBrief.trim().length) {
      parts.push(`# Session brief\n${sessionBrief.trim()}`);
    }
    if (selectedDocs.length) {
      const docs = selectedDocs
        .map((doc) => `# Knowledge: ${doc.name}\n${doc.content}`)
        .join("\n\n");
      parts.push(docs);
    }
    if (userInstruction.trim().length) {
      parts.push(`# Additional instructions\n${userInstruction.trim()}`);
    }
    return parts.join("\n\n---\n\n");
  }, [selectedPersona, sessionBrief, selectedDocs, userInstruction]);

  const applyToSession = useCallback(() => {
    const combined = composeSystemInstruction();
    const newConfig: LiveConnectConfig = {
      ...config,
      systemInstruction: combined,
    };
    setConfig(newConfig);
    if (modelInput.trim().length) {
      setModel(modelInput.trim());
    }
    if (typeof window !== "undefined") {
      window.localStorage.setItem("aiEngineOverride", engine);
      window.localStorage.setItem(`${engine}Model`, modelInput.trim());
      if (engine === "lmstudio") {
        window.localStorage.setItem("lmstudioBaseUrl", lmStudioUrl.trim());
      }
      if (engine !== AI_ENGINE) {
        window.location.reload();
      }
    }
    setOpen(false);
  }, [
    composeSystemInstruction,
    config,
    setConfig,
    setModel,
    modelInput,
    engine,
    lmStudioUrl,
  ]);

  const handleFiles = useCallback(
    async (fileList: FileList | null) => {
      if (!fileList) return;
      const files = Array.from(fileList);
      for (const file of files) {
        if (file.size > MAX_DOC_SIZE) {
          console.warn(
            `Skipping ${file.name}: exceeds ${Math.round(MAX_DOC_SIZE / 1024)}kb`
          );
          continue;
        }
        const text = await file.text();
        const id = nanoid();
        upsertDoc({
          id,
          name: file.name,
          content: text,
          size: file.size,
          mimeType: file.type,
          lastModified: file.lastModified,
        });
        if (!selectedDocIds.includes(id)) {
          setDocSelection([...selectedDocIds, id]);
        }
      }
    },
    [selectedDocIds, setDocSelection, upsertDoc]
  );

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <button className="action-button material-symbols-outlined">
          settings
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="settings-overlay" />
        <Dialog.Content className="settings-content" aria-label="Settings">
          <div className={`dialog-container ${connected ? "disabled" : ""}`}>
            <div className="dialog-header">
              <div className="header-left">
                <h3>Session settings</h3>
                <p className="muted tiny">
                  Apply to save persona/knowledge, model, and engine.
                  {connected ? " Changes apply on next connect." : ""}
                </p>
              </div>
              <div className="engine-pill">
                Engine: <strong>{engine}</strong>
              </div>
              <Dialog.Close className="close-button" aria-label="Close">
                ×
              </Dialog.Close>
            </div>

            <div className="mode-selectors">
              <ResponseModalitySelector />
              <VoiceSelector />
              <div className="select-group wide">
                <label>Engine</label>
                <select
                  value={engine}
                  onChange={(e) => setEngine(e.target.value as AIEngine)}
                >
                  {engineOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
                <small className="muted">
                  Reloads to swap stacks (Live vs HTTP).
                </small>
              </div>
              <div className="select-group wide">
                <label>Model ({engine})</label>
                <input
                  type="text"
                  value={modelInput}
                  onChange={(e) => setModelInput(e.target.value)}
                  placeholder={
                    engine === "google"
                      ? "models/gemini-2.0-flash-exp"
                      : "lmstudio/openai/anthropic model id"
                  }
                />
                <small className="muted">Saved on apply.</small>
              </div>
              {engine === "lmstudio" && (
                <div className="select-group wide">
                  <label>LM Studio URL</label>
                  <input
                    type="text"
                    value={lmStudioUrl}
                    onChange={(e) => setLmStudioUrl(e.target.value)}
                    placeholder="http://192.168.0.27:1234/v1"
                  />
                  <small className="muted">OpenAI-compatible base URL.</small>
                </div>
              )}
            </div>

            <div className="prompt-grid">
              <div className="prompt-card">
                <header>
                  <div>
                    <h3>Persona</h3>
                    <p className="muted">Save and reuse short system prompts.</p>
                  </div>
                  <button
                    className="link-button"
                    onClick={() => {
                      reset();
                      setEditingPersonaId(undefined);
                    }}
                  >
                    New
                  </button>
                </header>

                <form onSubmit={onPersonaSubmit} className="stacked-form">
                  <label>
                    Name
                    <input type="text" {...register("name")} />
                    {formState.errors.name?.message && (
                      <span className="error">
                        {formState.errors.name.message}
                      </span>
                    )}
                  </label>
                  <label>
                    Role
                    <input type="text" {...register("role")} />
                    {formState.errors.role?.message && (
                      <span className="error">
                        {formState.errors.role.message}
                      </span>
                    )}
                  </label>
                  <label>
                    Prompt
                    <textarea rows={4} {...register("prompt")} />
                    {formState.errors.prompt?.message && (
                      <span className="error">
                        {formState.errors.prompt.message}
                      </span>
                    )}
                  </label>
                  <div className="actions-row">
                    <button className="primary" type="submit">
                      {editingPersonaId ? "Update persona" : "Save persona"}
                    </button>
                    {editingPersonaId && (
                      <button
                        className="ghost"
                        type="button"
                        onClick={() => {
                          reset();
                          setEditingPersonaId(undefined);
                        }}
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </form>

                <div className="persona-list">
                  {personas.length === 0 && (
                    <p className="muted">No personas saved yet.</p>
                  )}
                  {personas.map((persona) => (
                    <div
                      key={persona.id}
                      className={cn("persona-row", {
                        active: persona.id === activePersonaId,
                      })}
                    >
                      <div className="persona-meta">
                        <strong>{persona.name}</strong>
                        <span className="muted">{persona.role}</span>
                      </div>
                      <div className="persona-actions">
                        <button onClick={() => setActivePersona(persona.id)}>
                          Use
                        </button>
                        <button onClick={() => startEditPersona(persona.id)}>
                          Edit
                        </button>
                        <button onClick={() => removePersona(persona.id)}>
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="prompt-card">
                <header>
                  <div>
                    <h3>Knowledge Pack</h3>
                    <p className="muted">
                      Attach files (text/markdown) for the current session.
                    </p>
                  </div>
                  <label className="upload-button">
                    <input
                      type="file"
                      multiple
                      accept=".txt,.md,.json,.log"
                      onChange={(e) => handleFiles(e.target.files)}
                    />
                    Add files
                  </label>
                </header>

                <div className="doc-list">
                  {knowledgeDocs.length === 0 && (
                    <p className="muted">No knowledge files added.</p>
                  )}
                  {knowledgeDocs.map((doc) => (
                    <div key={doc.id} className="doc-row">
                      <div className="doc-meta">
                        <strong>{doc.name}</strong>
                        <span className="muted">
                          {Math.round(doc.size / 1024)}kb
                        </span>
                      </div>
                      <div className="doc-actions">
                        <label className="checkbox">
                          <input
                            type="checkbox"
                            checked={selectedDocIds.includes(doc.id)}
                            onChange={() => toggleDocSelection(doc.id)}
                          />
                          <span>Include</span>
                        </label>
                        <button onClick={() => removeDoc(doc.id)}>Remove</button>
                      </div>
                    </div>
                  ))}
                </div>
                <p className="muted tiny">
                  Max per file: {Math.round(MAX_DOC_SIZE / 1024)}kb.
                </p>
              </div>

              <div className="prompt-card">
                <h3>Session Brief</h3>
                <p className="muted">
                  Short note about the current task/bug and key files.
                </p>
                <textarea
                  className="system"
                  rows={6}
                  value={sessionBrief}
                  onChange={(e) => setSessionBrief(e.target.value)}
                />

                <h3>Additional Instructions</h3>
                <p className="muted">
                  Optional extra system prompt text to merge with persona +
                  knowledge.
                </p>
                <textarea
                  className="system"
                  rows={6}
                  onChange={updateUserInstruction}
                  value={userInstruction}
                />

                <div className="apply-row">
                  <button className="primary" onClick={applyToSession}>
                    Apply to session
                  </button>
                  <span className="muted">
                    Applied prompts take effect on the next connect.
                  </span>
                </div>
              </div>
            </div>

            <h4>Function declarations</h4>
            <div className="function-declarations">
              <div className="fd-rows">
                {functionDeclarations.map((fd, fdKey) => (
                  <div className="fd-row" key={`function-${fdKey}`}>
                    <span className="fd-row-name">{fd.name}</span>
                    <span className="fd-row-args">
                      {Object.keys(fd.parameters?.properties || {}).map(
                        (item, k) => (
                          <span key={k}>{item}</span>
                        )
                      )}
                    </span>
                    <input
                      key={`fd-${fd.description}`}
                      className="fd-row-description"
                      type="text"
                      defaultValue={fd.description}
                      onBlur={(e) =>
                        updateFunctionDescription(fd.name!, e.target.value)
                      }
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
