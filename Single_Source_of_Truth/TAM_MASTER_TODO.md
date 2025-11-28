# TAM MASTER EXECUTION PLAN

> **OBJECTIVE:** Zero to Shippable Product + Landing Page in ONE SPRINT.
> **RULE OF TRIPLE CONFIRMATION:** No item can be marked `[X]` until verified by all three parties.
> **LEGEND:**
> * **Builder:** The Internal AI (Codex/Gemini) confirms code generation.
> * **Architect:** ShadowRunner confirms alignment with PRD/Rules.
> * **Director:** You confirm it works in reality.

---

## PHASE 1: THE HANDSHAKE (Infrastructure)
*Goal: Ensure the "Factory Floor" is clean and the AI follows orders.*

- [ ] **1.1 Protocol Compliance Re-Test**
    * *Action:* Agent reads `TAM_WORKFLOW_GUIDE.md`, builds directory tree, and correctly files L001/L002 ledgers without error.
    * *Sign-offs:* Builder [x] | Architect [x] | Director [x]

- [ ] **1.2 Repo Lockdown**
    * *Action:* Git `foundation` branch is updated and secure.
    * *Sign-offs:* Builder [x] | Architect [x] | Director [x]

---

## PHASE 2: THE LEGO ASSEMBLY (Scaffolding)
*Goal: Install the "Immutable Tech Stack" defined in Architecture Rules.*

- [ ] **2.1 Vite + Electron Initialization**
    * *Action:* Scaffold React/TS app. Configure Main/Renderer processes. Ensure `npm run dev` opens a window.
    * *Sign-offs:* Builder [ ] | Architect [ ] | Director [ ]

- [ ] **2.2 The Library Injection**
    * *Action:* Install `tailwindcss`, `shadcn/ui`, `lucide-react`, `ai` (Vercel SDK), `react-speech-recognition`.
    * *Sign-offs:* Builder [ ] | Architect [ ] | Director [ ]

- [ ] **2.3 Plumbing Verification**
    * *Action:* Fix `postcss.config.js` and `tailwind.config.js`. Verify Tailwind classes are actually rendering colors.
    * *Sign-offs:* Builder [ ] | Architect [ ] | Director [ ]

---

## PHASE 3: THE "STITCH" UI (Visuals)
*Goal: Build the "Pro Chat" Workspace. No functionality, just looks.*

- [ ] **3.1 The Sidebar Component**
    * *Action:* Build `Sidebar.tsx`. Fixed width (260px). List of Tams. Settings button.
    * *Sign-offs:* Builder [ ] | Architect [ ] | Director [ ]

- [ ] **3.2 The Chat Interface**
    * *Action:* Build `ChatInterface.tsx` & `ChatBubble.tsx`. Vertical scroll. Distinct User/AI bubble styles (Blue/Gray).
    * *Sign-offs:* Builder [ ] | Architect [ ] | Director [ ]

- [ ] **3.3 The Composer (Input)**
    * *Action:* Build `Composer.tsx`. Pill-shaped input. Large Mic button.
    * *Sign-offs:* Builder [ ] | Architect [ ] | Director [ ]

- [ ] **3.4 The Vision Widget**
    * *Action:* Add the 16:9 Video Container at top of chat. Style with "Active State" glowing border.
    * *Sign-offs:* Builder [ ] | Architect [ ] | Director [ ]

---

## PHASE 4: THE BRAIN WIRING (Logic)
*Goal: Make it think, see, and speak.*

- [ ] **4.1 Visual Dictation (Input)**
    * *Action:* Connect `react-speech-recognition`. Text must appear in the Composer *instantly* as user speaks.
    * *Sign-offs:* Builder [ ] | Architect [ ] | Director [ ]

- [ ] **4.2 Vision Hookup (Eyes)**
    * *Action:* Connect `navigator.mediaDevices` to the Video Widget. Must select "OBS Virtual Camera" successfully.
    * *Sign-offs:* Builder [ ] | Architect [ ] | Director [ ]

- [ ] **4.3 The AI Loop (Brain)**
    * *Action:* Connect `use-tam-ai.ts` to Gemini API. Send Text + Video Frame. Receive Text response.
    * *Sign-offs:* Builder [ ] | Architect [ ] | Director [ ]

- [ ] **4.4 Auto-Read (Voice)**
    * *Action:* Connect `window.speechSynthesis`. AI text response is read aloud automatically on arrival.
    * *Sign-offs:* Builder [ ] | Architect [ ] | Director [ ]

- [ ] **4.5 The "Tam" Switcher**
    * *Action:* Clicking "Unity Expert" in Sidebar injects the Unity Context file into the next prompt.
    * *Sign-offs:* Builder [ ] | Architect [ ] | Director [ ]

---

## PHASE 5: SHIPPING (The Build)
*Goal: Create the standalone `.exe` file.*

- [ ] **5.1 Asset Generation**
    * *Action:* Create `icon.ico` / `icon.png` for the Desktop.
    * *Sign-offs:* Builder [ ] | Architect [ ] | Director [ ]

- [ ] **5.2 Electron Builder Config**
    * *Action:* Configure `electron-builder.yml` for Windows target.
    * *Sign-offs:* Builder [ ] | Architect [ ] | Director [ ]

- [ ] **5.3 The Build**
    * *Action:* Run `npm run dist`. Generate `TAM Setup 1.0.0.exe`.
    * *Sign-offs:* Builder [ ] | Architect [ ] | Director [ ]

- [ ] **5.4 The Install Test**
    * *Action:* Install the `.exe`. Launch it. Verify it remembers API keys.
    * *Sign-offs:* Builder [ ] | Architect [ ] | Director [ ]

---

## PHASE 6: MONETIZATION (The Launch)
*Goal: A high-conversion landing page to sell the tool.*

- [ ] **6.1 Landing Page Scaffold**
    * *Action:* Single HTML file + Tailwind CDN. Dark Mode "Stitch" aesthetic.
    * *Sign-offs:* Builder [ ] | Architect [ ] | Director [ ]

- [ ] **6.2 Hero Section**
    * *Action:* Headline: "The AI That Sees What You See." Subhead: "Your 4K Visual Co-Pilot."
    * *Sign-offs:* Builder [ ] | Architect [ ] | Director [ ]

- [ ] **6.3 Pricing Tiers**
    * *Action:*
        * **Free:** "TAM Basic" (Bring your own Key).
        * **Pro ($X):** "TAM Pro" (Pre-loaded Keys + Unity Module).
        * **Team:** "Studio License."
    * *Sign-offs:* Builder [ ] | Architect [ ] | Director [ ]

- [ ] **6.4 Download/Payment Button**
    * *Action:* Placeholder links for Stripe/LemonSqueezy checkout.
    * *Sign-offs:* Builder [ ] | Architect [ ] | Director [ ]