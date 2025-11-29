import { nanoid } from "nanoid";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type Persona = {
  id: string;
  name: string;
  role: string;
  prompt: string;
};

export type KnowledgeDoc = {
  id: string;
  name: string;
  content: string;
  size: number;
  mimeType?: string;
  lastModified?: number;
  includeByDefault?: boolean;
};

type PromptState = {
  personas: Persona[];
  knowledgeDocs: KnowledgeDoc[];
  activePersonaId?: string;
  selectedDocIds: string[];
  sessionBrief: string;
  addPersona: (input: Omit<Persona, "id">) => void;
  updatePersona: (id: string, updates: Partial<Omit<Persona, "id">>) => void;
  removePersona: (id: string) => void;
  setActivePersona: (id?: string) => void;
  upsertDoc: (doc: KnowledgeDoc) => void;
  removeDoc: (id: string) => void;
  toggleDocSelection: (id: string) => void;
  setDocSelection: (ids: string[]) => void;
  setSessionBrief: (brief: string) => void;
};

export const MAX_DOC_SIZE = 400 * 1024; // 400kb to avoid blowing up local storage

export const usePromptStore = create<PromptState>()(
  persist(
    (set, get) => ({
      personas: [],
      knowledgeDocs: [],
      selectedDocIds: [],
      sessionBrief: "",
      activePersonaId: undefined,
      addPersona: (input) =>
        set((state) => ({
          personas: [...state.personas, { ...input, id: nanoid() }],
        })),
      updatePersona: (id, updates) =>
        set((state) => ({
          personas: state.personas.map((p) =>
            p.id === id ? { ...p, ...updates } : p
          ),
        })),
      removePersona: (id) =>
        set((state) => ({
          personas: state.personas.filter((p) => p.id !== id),
          activePersonaId:
            state.activePersonaId === id ? undefined : state.activePersonaId,
        })),
      setActivePersona: (id) => set({ activePersonaId: id }),
      upsertDoc: (doc) =>
        set((state) => {
          const existing = state.knowledgeDocs.find((d) => d.id === doc.id);
          if (existing) {
            return {
              knowledgeDocs: state.knowledgeDocs.map((d) =>
                d.id === doc.id ? { ...d, ...doc } : d
              ),
            };
          }
          return { knowledgeDocs: [...state.knowledgeDocs, doc] };
        }),
      removeDoc: (id) =>
        set((state) => ({
          knowledgeDocs: state.knowledgeDocs.filter((d) => d.id !== id),
          selectedDocIds: state.selectedDocIds.filter((docId) => docId !== id),
        })),
      toggleDocSelection: (id) =>
        set((state) => ({
          selectedDocIds: state.selectedDocIds.includes(id)
            ? state.selectedDocIds.filter((docId) => docId !== id)
            : [...state.selectedDocIds, id],
        })),
      setDocSelection: (ids) => set({ selectedDocIds: ids }),
      setSessionBrief: (brief) => set({ sessionBrief: brief }),
    }),
    {
      name: "prompt-store",
      storage: createJSONStorage(() => localStorage),
      version: 1,
    }
  )
);
