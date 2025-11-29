import { create } from "zustand";

export type ConversationTurn = {
  role: "user" | "assistant";
  text: string;
  ts: number;
};

type ConversationState = {
  turns: ConversationTurn[];
  addUser: (text: string) => void;
  addAssistant: (text: string) => void;
  getRecap: (maxChars?: number) => string;
  clear: () => void;
};

export const useConversationStore = create<ConversationState>((set, get) => ({
  turns: [],
  addUser: (text) =>
    set((state) => ({
      turns: [
        ...state.turns.slice(-30),
        { role: "user", text, ts: Date.now() },
      ],
    })),
  addAssistant: (text) =>
    set((state) => ({
      turns: [
        ...state.turns.slice(-30),
        { role: "assistant", text, ts: Date.now() },
      ],
    })),
  getRecap: (maxChars = 1800) => {
    const ordered = get().turns.slice(-30);
    let recap = ordered
      .map((t) => `${t.role === "user" ? "User" : "Assistant"}: ${t.text}`)
      .join("\n");
    if (recap.length > maxChars) {
      recap = recap.slice(recap.length - maxChars);
    }
    return recap;
  },
  clear: () => set({ turns: [] }),
}));
