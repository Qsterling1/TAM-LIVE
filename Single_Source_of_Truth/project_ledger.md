# TAM Project Ledger (Master History)

> **PROTOCOL:** This is the living memory of the TAM project. Every AI agent must READ this file before acting and WRITE to it after completing any task.

---

## Session L001: Genesis & Evolution (Nov 27, 2025 12:00 PST)
**Agent:** ShadowRunner 2.5
**Type:** Strategic Planning & Tool Development
**Status:** In Progress (TAM v4 "Assembly" Phase)

### Core Problem Identification
The Director identified that the Unity Internal AI was insufficient because it lacked "Vision" and Accessibility features (Speech-to-Text). Goal: Create a "Hands-On Guide" that can see the screen and talk the Director through tasks.

### The "TAM" Concept Evolution
- **v1 (Web):** Google Multimodal Live Starter Kit (React)
- **v2 (Electron):** Desktop wrapper for "Always On Top" functionality
- **v3 (Glass):** Transparent "Ghost Mode" overlay (Abandoned due to UI instability)
- **v4 (Workspace):** Current iteration - "Pro Chat" interface with dedicated Video Feed

### Architecture Decisions
**Vision Pipeline:** Moved from native Electron Screen Sharing (unstable/blurry) to OBS Virtual Camera.
- Rationale: OBS handles 4K scaling and window selection perfectly. TAM treats it as a standard webcam.

**Context Engine:** Created "Swappable Brain" system
- Universal Sys: General navigation helper
- Project Modules: Injectable context files (e.g., UnityModule.ts) containing Fly & Shadow Layer Registry and Rules

**Tech Stack Pivot:** "Lego Assembly" approach
- UI: Shadcn/UI (professional, accessible components)
- Logic: Vercel AI SDK (robust chat streaming)
- Input: React Speech Recognition (live visual dictation)

### Accessibility Features (Mandated)
- Live Dictation: User speaks → Text appears instantly in input box → Sent to AI
- Text-to-Speech: AI responses read aloud (Browser/Google voices)
- Visuals: High-contrast Dark Mode with "Breathing" focus indicators

### Resolved Issues
- Electron Screen Share: Failed due to permission locking → Pivoted to OBS Virtual Camera
- "Ghost Window" Bug: App invisible due to transparent: true → Forced frame: true / backgroundColor
- Tailwind CSS Version Mismatch: v4 (Alpha) breaking build → Downgraded to v3.4 stable
- TypeScript Extension Error: .ts files containing JSX → Renamed to .tsx
- Audio Echo: App played back microphone input → Muted local `<video>` element

---

## Session L002: The Great Reset (Nov 27, 2025 14:35 PST)
**Agent:** ShadowRunner 2.5
**Type:** Strategic Pivot & Infrastructure Setup
**Status:** Complete (Foundation Established)

### Context & Trigger
Director invoked **Primacy of Observation Protocol (POOP)** during TAM v4 build attempt.
- **Observation:** Previous codebase (`LiveDirection`) suffered from severe fragmentation
- **Diagnosis:** Project lacked "Single Source of Truth" - AI agents hallucinating code from conflicting context

### Decisions & Actions

**Action 1: The "Burn Down"**
- Abandoned and deleted `LiveDirection` repository to eliminate "ghost code" and bad configs
- Created clean slate repository: `TAMLIVE`

**Action 2: The "Protocol First" Strategy**
Before writing any application code, established the "Single Source of Truth" (SSOT) directory:
1. `TAM_WORKFLOW_GUIDE.md`: Defined "Per-Prompt Ledger" protocol and agent roles
2. `TAM_PRD.md`: Defined exact features (OBS Vision, Live Dictation, "Stitch" UI)
3. `TAM_ARCHITECTURE_RULES.md`: Defined strict "Lego Block" stack (React + Vite + Electron + Shadcn + Tailwind)
4. `TAM_ALIGNMENT_AND_ASSIGNMENT.md`: Created Audit Checklist to prevent future drift

**Action 3: Repository Safety**
- Established `foundation` branch in Git immediately after SSOT creation
- Goal: Permanent "Safe Harbor" state containing only protocols for total reset capability

### Current State (End of L002)
- Repo: `TAMLIVE` (Clean)
- Branch: `main` (Active), `foundation` (Backup)
- Next Steps: Execute System Scaffolding via Internal Agent

---

## Session L003: Protocol Compliance Test (Nov 27, 2025 - Current)
**Agent:** Claude Code (Internal Builder)
**Type:** Infrastructure Organization & Protocol Validation
**Status:** In Progress

### Actions Completed
1. **Protocol Analysis:** Read `TAM_WORKFLOW_GUIDE.md` and identified missing directory structure definition
2. **Documentation Update:** Updated [TAM_WORKFLOW_GUIDE.md:29-44](Single_Source_of_Truth/TAM_WORKFLOW_GUIDE.md#L29-L44) with complete directory map including:
   - `Docs/reports/living_ledger/` (Active session work)
   - `Docs/reports/living_ledger_archive/` (Past session ledgers)
   - `Docs/reports/audits/` (Compliance reports)
3. **Infrastructure Build:** Created complete `Docs/` directory tree structure
4. **File Organization:** Moved historical ledgers to archive:
   - `L001_ShadowRunner2.5_11_27_2025_12-00-PST.md` → [Docs/reports/living_ledger_archive/](Docs/reports/living_ledger_archive/)
   - `L002_ShadowRunner2.5_11_27_2025_14-35_PST.md` → [Docs/reports/living_ledger_archive/](Docs/reports/living_ledger_archive/)
5. **Master Ledger Initialization:** Created this `project_ledger.md` with consolidated history from L001 and L002

### Current State
- Root folder: Clean (no loose ledger files)
- Directory structure: Compliant with [TAM_WORKFLOW_GUIDE.md](Single_Source_of_Truth/TAM_WORKFLOW_GUIDE.md)
- Historical context: Preserved in archive
- Master ledger: Active and tracking

---

## Ledger Update Protocol
**Format for future entries:**
```
## [Date/Time]: [Brief Action Description]
**Agent:** [Agent Name]
**Files Modified:** [List of files]
**Summary:** [1-2 sentence description of what was done and why]
```
