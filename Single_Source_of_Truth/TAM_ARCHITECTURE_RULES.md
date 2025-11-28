# TAM ARCHITECTURE & TECHNICAL RULES

> **CORE MANDATE:** We build with "Lego Blocks" (Established, Polished Libraries), NOT "Raw Clay" (Custom Code).
> **ENFORCEMENT:** Any code generated that violates these rules must be rejected immediately.

---

## 1. THE TECH STACK (The Immutable Lego Set)
You are forbidden from introducing new libraries without explicit Director approval. You must use these specific industry-standard tools:

### 1.1 Core Runtime
* **Runtime:** **Electron** (Latest Stable).
    * *Configuration:* Main Process + Renderer Process separation.
    * *Security:* `contextIsolation: false` and `nodeIntegration: true` are PERMITTED for this local-only tool to facilitate OBS/System access without complex IPC bridges.
* **Framework:** **React 18+** (via **Vite**).
    * *Build Tool:* Vite (Not Create-React-App).
* **Language:** **TypeScript** (Strict Mode).

### 1.2 The UI/UX Engine (Visuals)
* **Component Library:** **Shadcn/UI** (Radix Primitives).
    * *Rule:* Do not build a Modal, Slider, or Dropdown from scratch. Install the Shadcn component.
* **Styling:** **Tailwind CSS**.
    * *Rule:* **ZERO CUSTOM CSS FILES.** All styling must be done via utility classes within the JSX (e.g., `className="flex h-screen bg-sidebar"`).
    * *Exception:* `index.css` is allowed for Tailwind directives and base font settings only.
* **Icons:** **Lucide-React**.
* **Animations:** `framer-motion` (Only if complex physics are needed), otherwise CSS transitions via Tailwind `animate-` classes.

### 1.3 The Intelligence Engine (The Brain)
* **AI Orchestration:** **Vercel AI SDK** (`ai/react`).
    * *Usage:* Use `useChat` and `streamText` for handling the conversation loop.
* **Speech-to-Text (Input):** **React Speech Recognition** (Web Speech API Wrapper).
    * *Requirement:* Must support "Live Transcription" (words appear in the input box *while* the user speaks).
* **Text-to-Speech (Output):** **Window.speechSynthesis** (Web Standard).
    * *Future Upgrade:* ElevenLabs API (but start with Browser TTS for speed).

---

## 2. THE THREE-BRAIN PROTOCOL
The application must be architected to support three distinct API providers. Hard-coding a single provider is a violation.

### 2.1 Credential Management
* **Storage:** `.env` file (local dev) and `localStorage` (production/runtime persistence).
* **Required Keys:**
    1.  `VITE_GEMINI_API_KEY` (Google)
    2.  `VITE_OPENAI_API_KEY` (OpenAI)
    3.  `VITE_ANTHROPIC_API_KEY` (Anthropic)

### 2.2 The Model Switcher logic
* The `use-tam-ai.ts` hook must accept a `provider` argument.
* **Google (Gemini 1.5 Pro/Flash):** The Default. Best for Multimodal (Video+Audio).
* **OpenAI (GPT-4o):** The Logic Specialist. Used for complex reasoning tasks.
* **Anthropic (Claude 3.5 Sonnet):** The Coder. Used when the user asks for code generation.

---

## 3. FILE SYSTEM & NAMING CONVENTIONS
Fragmentation is the enemy. Follow this map exactly.

### 3.1 File Extensions (The "Crash Prevention" Rule)
* **Logic Only:** Must end in `.ts` (e.g., `utils.ts`, `hooks.ts`).
* **UI / JSX:** Must end in `.tsx` (e.g., `Sidebar.tsx`).
* **Violation:** A `.ts` file containing `<Component />` tags causes an immediate build failure.

---

## 4. CODING PATTERNS & ANTI-PATTERNS

### 4.1 The "No Ghost" Rule (Vision)
* **Anti-Pattern:** Attempting to capture the screen using `navigator.mediaDevices.getDisplayMedia` via Electron (Causes permission bugs).
* **Mandated Pattern:** The "Sidecar" Protocol.
    * The app **MUST** treat the video input as a Webcam.
    * The user **MUST** select "OBS Virtual Camera" from the device list.
    * Code Logic: `navigator.mediaDevices.getUserMedia({ video: { deviceId: obsCameraId } })`.

### 4.2 The "Visual Dictation" Rule (Accessibility)
* **Anti-Pattern:** Sending audio buffers directly to the LLM without showing text.
* **Mandated Pattern:**
    1.  User holds Mic button.
    2.  `react-speech-recognition` transcribes audio to text in real-time.
    3.  Text populates the `<Textarea />` instantly.
    4.  User releases Mic -> Text is finalized -> Sent to AI.

### 4.3 The "Lego" Component Rule
* **Never** write `button { background: blue; }` in CSS.
* **Always** write `<Button className="bg-blue-500">` using the Shadcn component.

---

## 5. QUALITY ASSURANCE (QA)
Before submitting code, the Agent must verify:
1.  Are there any `.css` files created? (If yes, delete them).
2.  Did I import a component from `lucide-react` instead of making an SVG?
3.  Is the OBS Virtual Camera logic present in the video handler?
4.  Are the API keys pulled from the environment, not hardcoded?


### 6. Directory Structure
```text
src/
├── components/
│   ├── ui/             # Shadcn primitives (Button.tsx, Input.tsx, etc.)
│   ├── layout/         # Layout shells (Sidebar.tsx, MainLayout.tsx)
│   ├── chat/           # Chat-specific (ChatBubble.tsx, Composer.tsx, ChatInterface.tsx)
│   └── settings/       # Configuration (SettingsModal.tsx, ApiKeyInput.tsx)
├── lib/
│   ├── utils.ts        # Tailwind class merger (clsx + tailwind-merge)
│   └── tams.ts         # Data definitions for the Assistant Modules
├── hooks/
│   ├── use-tam-ai.ts   # Unified AI handler (Vercel SDK wrapper)
│   └── use-speech.ts   # Speech recognition logic
├── styles/
│   └── globals.css     # Tailwind imports ONLY. No custom classes.
├── App.tsx             # The Root Component (Provider wrapping only)
└── main.tsx            # Entry Point
