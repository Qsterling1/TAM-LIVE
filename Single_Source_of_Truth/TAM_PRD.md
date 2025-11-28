# TAM PROJECT REQUIREMENTS DOCUMENT (PRD)

> **SCOPE:** This document is the absolute source of truth for the product vision, feature set, and user experience of TAM v4.
> **MANDATE:** Any feature implementation must trace back to a requirement in this file. "Scope Creep" is forbidden without a PRD update.

---

## 1. PRODUCT IDENTITY & VISION
**Name:** TAM (Task Assistant Module)
**Type:** Desktop Accessibility Co-Pilot & Visual Agent.
**Core Value Proposition:** "The AI that sees what you see, at 4K resolution, and guides you hand-over-hand through complex software."

### 1.1 The "Why" (The Accessibility Gap)
Current AI tools (ChatGPT, Claude) are text-heavy and blind to the user's live context. They fail users with dyslexia, vision impairments, or software anxiety.
* **TAM Solution:** A "High-Fidelity Visual Agent" that bypasses reading/typing. It watches the screen via OBS, listens to voice commands, and reads instructions aloud while visually highlighting the path.

### 1.2 The "Lego" Construction Philosophy
We do not build from scratch. We assemble industry-standard, polished libraries to ensure stability and commercial viability.
* **UI:** Shadcn/UI (Professional, Accessible components).
* **Brain:** Vercel AI SDK (Robust streaming logic).
* **Vision:** OBS Virtual Camera (Industry standard broadcast video).

---

## 2. CORE CAPABILITIES (The "Must Haves")

### 2.1 High-Fidelity Vision (The Eyes)
* **Source:** Strictly **OBS Virtual Camera**.
* **Resolution Standard:** Must support **1440p / 4K** input to allow for OCR-level reading of tiny text (e.g., Unity Inspector variables, Blender node labels).
* **The Vision Loop:**
    1.  **Observe:** Analyze the OBS frame.
    2.  **Locate:** Identify specific UI elements (Buttons, Menus).
    3.  **Verify:** Detect state changes (e.g., "The user has clicked the box").

### 2.2 Deep Accessibility (The Interface)
* **Live Visual Dictation (Input):**
    * **Requirement:** As the user speaks, text must appear **instantly** in the input field.
    * **Goal:** Provide visual confirmation of speech-to-text accuracy before sending.
    * **Tech:** `react-speech-recognition`.
* **Auto-Read (Output):**
    * **Requirement:** AI responses must be read aloud automatically via high-quality TTS.
    * **UI:** Highlight active text or show a "Speaking" indicator.
* **Visual Clarity:**
    * **Theme:** High Contrast Dark Mode (`#0f111a`).
    * **Typography:** Large, sans-serif fonts (Inter/SF Pro). No "Wall of Text."

### 2.3 The "Tam" System (Swappable Brains)
* **Concept:** The user switches between specialized "Employees" (Tams) rather than prompting a generic bot.
* **The Workflow:**
    * **Sidebar List:** "Unity Expert", "Blender Guru", "Email Assistant".
    * **Context Injection:** Clicking a Tam loads a specific `.ts` context file (The Knowledge Base) into the AI's system prompt.
    * **Creation UI:** A simple Shadcn Modal to "Create New Tam" (Name + Instructions).

### 2.4 Autonomous Foundation (Future-Proofing)
* **Logic Structure:** The AI must be prompted to think in **Actions**, not just words.
* **Output Format:** While it cannot click yet, it should structure its advice spatially (e.g., "Top Left," "Coordinates X,Y") to prepare for future robotic process automation (RPA) modules.

---

## 3. USER EXPERIENCE (The "Stitch" Workspace)

### 3.1 The Layout
A professional, grounded desktop application. Not a floating widget.
* **Left Sidebar (260px):**
    * **Brain Manager:** List of Active Tams.
    * **History:** Date-grouped chat sessions.
    * **Bottom:** User Settings & Profile.
* **Center Stage (The Canvas):**
    * **Top (The Eye):** A persistent 16:9 Video Feed of the OBS Input.
        * *State:* Glowing border when active/listening.
    * **Middle (The Thread):** A scrolling chat history (Slack/Discord style).
        * *Bubbles:* Distinct colors for User vs AI.
* **Bottom (The Anchor):**
    * **The Composer:** A wide, pill-shaped input bar.
    * **Controls:** Large "Mic" button, "Send" button, "Attachment" paperclip.

### 3.2 The Interaction Loop
1.  **Idle:** App waits. Video feed shows "Ready."
2.  **Trigger:** User clicks Mic.
3.  **Listening:** Input box fills with text in real-time.
4.  **Processing:** User clicks Send. Video frame + Text sent to API.
5.  **Response:** AI speaks the answer ("Click the Red Button") while text bubbles appear.

---

## 4. TECHNICAL ARCHITECTURE (The Stack)

### 4.1 The Trinity of Intelligence (API Support)
The Settings Menu must allow hot-swapping between:
1.  **Google (Gemini 1.5 Pro):** The default Visual/Multimodal engine.
2.  **OpenAI (GPT-4o):** The Reasoning/Logic engine.
3.  **Anthropic (Claude 3.5 Sonnet):** The Coding/Scripting engine.

### 4.2 Data Persistence
* **Local Storage:** Tams (Custom Assistants) and Settings (API Keys) must persist between reboots.
* **Privacy:** No data sent to external servers other than the AI Provider.

---

## 5. QUALITY ASSURANCE METRICS
A feature is only "Complete" when:
1.  **Visuals:** It matches the "Stitch" dark aesthetic (Shadcn components).
2.  **Audio:** Dictation is instant; TTS is clear.
3.  **Vision:** The AI can correctly identify text on a 1440p screen via OBS.
4.  **Code:** No custom CSS files were created.