Session Ledger - TAM Genesis & Evolution
Date: November 27, 2025 Agent: ShadowRunner 2.5 (Lead Partner) Session Type: Strategic Planning & Tool Development Status: In Progress (TAM v4 "Assembly" Phase)

Session Start - Context Establishment
Time: Session Start Action: Strategic Pivot from "Internal Unity AI" to "External Visual Assistant."

Core Problem Identification
The Director identified that the Unity Internal AI was insufficient because it lacked "Vision" and Accessibility features (Speech-to-Text).

Goal: Create a "Hands-On Guide" that can see the screen and talk the Director through tasks.

Constraint: Must be accessible (Dyslexia-friendly, Voice-first) and aware of the Fly & Shadow project context.

Session Actions & Decisions
1. The "TAM" Concept (Task Assistant Module)
Concept: An "Over-the-Shoulder" AI companion.

Evolution:

v1 (Web): Google Multimodal Live Starter Kit (React).

v2 (Electron): Desktop wrapper for "Always On Top" functionality.

v3 (Glass): Transparent "Ghost Mode" overlay (Abandoned due to UI instability).

v4 (Workspace): Current iteration. A "Pro Chat" interface (similar to Claude/ChatGPT desktop apps) with a dedicated Video Feed.

2. Architecture Decisions
Vision Pipeline: Moved from native Electron Screen Sharing (unstable/blurry) to OBS Virtual Camera.

Rationale: OBS handles 4K scaling and window selection perfectly. TAM just treats it as a standard webcam.

Context Engine: Created the "Swappable Brain" system.

Universal Sys: General navigation helper.

Project Modules: Injectable context files (e.g., UnityModule.ts) containing the Fly & Shadow Layer Registry and Rules.

Tech Stack Pivot: Moved from "Scratch Coding" to "Lego Assembly."

UI: Shadcn/UI (for professional, accessible components).

Logic: Vercel AI SDK (for robust chat streaming).

Input: React Speech Recognition (for live visual dictation).

3. Accessibility Features (Mandated)
Live Dictation: User speaks -> Text appears instantly in input box (visual feedback) -> Sent to AI.

Text-to-Speech: AI responses are read aloud (using Browser/Google voices).

Visuals: High-contrast Dark Mode with "Breathing" focus indicators.

Troubleshooting Log (The "Fixes")
Resolved Issues
Electron Screen Share: Failed due to permission locking. Fix: Pivoted to OBS Virtual Camera.

"Ghost Window" Bug: App was invisible due to transparent: true on a blank frame. Fix: Forced frame: true / backgroundColor during dev.

Tailwind CSS Version Mismatch: AI installed v4 (Alpha), breaking the build. Fix: Downgraded to v3.4 stable.

TypeScript Extension Error: .ts files containing JSX. Fix: Renamed to .tsx.

Audio Echo: App played back microphone input. Fix: Muted the local <video> element.

Open Issues / Next Steps
API Wiring: postcss error resolved, now verifying npm run dev launch.

Key Management: .env updated with Gemini, OpenAI, and Anthropic keys. Need to implement the "Model Switcher" in the Settings UI to utilize them.

Voice Quality: Browser TTS is robotic. Need to hook up Google (Aoede) or OpenAI (Alloy) voices for final polish.

Current State
Project Location: Tools/DirectorsConsole/LiveDirection

Current Build: TAM v4 (Shadcn + Vercel AI + Electron).

Immediate Task: Verify the "Pro Chat" UI renders correctly after the PostCSS fix, then test the Live Dictation workflow.

End of Entry