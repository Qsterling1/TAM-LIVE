# UNIVERSAL PROJECT WORKFLOW GUIDE

> **IMMUTABLE CORE DIRECTIVE:** This file is the operational clockwork of the project.
> **RULE:** It defines the mandatory sequence of events for every interaction. You must read and execute this sequence thoroughly before doing anything else. Deviation from this sequence is a critical failure.

---

## 1. MANDATORY CONFIRMATION INDICATORS
To ensure the sequence is initiated, you must trigger these status checks inside your internal "Thinking" process or at the start of your response:
1.  **"Workflow guide read"** - Confirms ingestion of this sequence.
2.  **"Workflow guide understood"** - Confirms readiness to follow the cascade.
3.  **"Workflow guide executed"** - Confirms the sequence has begun.
4.  **"Moving to next task"** - Signals the transition from planning to action.

---

## 2. THE CASCADING WORKFLOW (The Order of Operations)
You must treat every prompt as a new "Day at Work." Follow this checklist in exact order.

### Phase 1: The Pre-Flight Check (Alignment)
* **Action:** Before processing the user's request, you must READ the **Alignment & Assignment** document.
* **Goal:** Orient yourself. Understand who you are, who the Director is, and what the safety rules are.
* **Check:** Am I aligned with the project's current state and constraints?

### Phase 2: The Context Check (Memory)
* **Action:** Open and READ the `project_ledger.md` (Master Ledger).
* **Goal:** Download the project history. Understand what happened "yesterday."
* **Check:** Is there an active **Session Ledger** in `Docs/reports/living_ledger/`?
    * **NO:** Create one immediately. (See Section 3).
    * **YES:** Read it. **CRITICAL:** Check the Agent Name on the file.
        * If it matches YOU: Append to it.
        * If it matches a DIFFERENT Agent: Archive it (Move to `living_ledger_archive/`) and create a NEW file for yourself.

### Phase 3: The Work (Execution)
* **Action:** Consult the **Project Requirements (PRD)** and **Architecture Rules**.
* **Goal:** Plan the work using only the approved tools and features defined in those documents.
* **Constraint:** Do not invent features. Do not invent tech stacks. Build only what is approved.
* **Execute:** Generate the code, text, or analysis requested by the Director.

### Phase 4: The Clock-Out (Reporting)
* **Action:** Write to your **Session Ledger** immediately after execution.
* **Goal:** Document exactly what you just did so the next agent knows the state of the "factory floor."

---

## 3. THE MEMORY PROTOCOL
Memory is the survival mechanism. You must maintain it religiously.

### 3.1 Short-Term Memory (The Session Ledger)
**Trigger:** Start of Session or First Prompt.
**Location:** `Docs/reports/living_ledger/`
**Naming Convention:**
`L[Number]_[AgentName]_[DD]_[MM]_[YYYY]_[HH]-[MM]_[TimeZone].md`
*Example:* `L004_ClaudeCode_27_11_2025_16-30_PST.md`

**The Loop:**
* You must log **EVERY** action taken after every prompt.
* **Log Format:** Timestamp -> Command Received -> Files Touched -> Outcome -> Next Steps.
* **Constraint:** This file is your "Notepad." Keep it open and active.

### 3.2 Long-Term Memory (The Master Ledger)
**Trigger:** End of Session or Explicit "Archive" Command.
**Location:** `Single_Source_of_Truth/project_ledger.md`
**The Handoff:**
1.  Read your Session Ledger.
2.  Summarize the key accomplishments (The "Widgets Built").
3.  Append this summary to the top of the Master Ledger.
4.  Move the Session Ledger to `Docs/reports/living_ledger_archive/`.

---

## 4. OPERATIONAL BOUNDARIES
* **No Guessing:** If a folder path, filename, or requirement is not explicitly found in the **Single Source of Truth** folder, you must STOP.
* **Ask for Orders:** Do not assume the architecture. Do not assume the directory structure. If the map is missing, ask the Director for the map.
* **Stay in Lane:** Do not modify the SSOT documents unless explicitly ordered to perform a "Governance Update."

---

## 5. EXIT CONDITION
Before finishing your turn, perform this self-audit:
1.  Did I read the Alignment Doc first?
2.  Did I read the Ledger second?
3.  Did I check the Architecture Rules third?
4.  Did I update my Session Ledger last?

**Final Directive:** Accuracy of sequence > Speed of code.