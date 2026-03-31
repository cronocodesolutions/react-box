---
name: sync-docs
description: Update react-box usage documentation across BOX_AI_CONTEXT.md, local skill, and marketplace skill, keeping all three files in sync
argument-hint: <description of what to add or change>
---

Synchronize the react-box library documentation across all three files that describe usage for AI assistants.

## Target Files

1. **`src/BOX_AI_CONTEXT.md`** — Comprehensive detailed reference. Full prop tables, extensive code examples, complete API docs.
2. **`.claude/skills/cronocode-react-box/SKILL.md`** — **Maximally condensed** Claude Code skill. Same topics but as compact as possible. Has YAML frontmatter.
3. **`marketplace-skill/skills/cronocode-react-box/SKILL.md`** — Must be **identical** to file #2. Always copy #2 to #3 after editing.

## Steps

1. **Read all three files** to understand their current content and structure.

2. **Understand the change**: interpret `$ARGUMENTS` as a description of what to add, update, or remove. If the change involves a new or modified component/prop, also read the relevant source files under `src/` to ensure documentation accuracy.

3. **Update `src/BOX_AI_CONTEXT.md`** (detailed version):
   - Maintain the existing style: markdown tables for prop references, 2–4 code examples per feature, TypeScript type signatures, `---` separators between major sections.
   - For new component sections, follow the structure of the Dropdown section (Usage examples, Props table, Sub-components table, Style Customization, Component Style Tree table). Scale down for simpler components.
   - Preserve the "Key Reminders for AI Assistants" and "Debugging Tips" sections — update them if the change affects their content.

4. **Update `.claude/skills/cronocode-react-box/SKILL.md`** (maximally condensed):
   - **Preserve the YAML frontmatter** (`name`, `description`). Only update `description` if a major new component is added.
   - **Be as compact as possible.** Every line must earn its place. Eliminate redundancy ruthlessly.
   - Use dense inline prop lists instead of tables. Combine related information onto single lines.
   - 1 code example per feature maximum — only when the usage isn't obvious from the prop list alone. Skip examples for features that are self-explanatory.
   - No horizontal rules, no `###` subsections, no verbose explanations.
   - Do NOT add sections unique to BOX_AI_CONTEXT.md ("Key Reminders for AI Assistants", "Debugging Tips").
   - Do NOT remove sections unique to SKILL.md ("Installation & Package Management").

5. **Copy to marketplace**: after editing file #2, copy its content **verbatim** to `marketplace-skill/skills/cronocode-react-box/SKILL.md`.

6. **Verify**: no broken markdown, valid YAML frontmatter, marketplace copy matches local skill exactly.

## Important

- Never remove existing documentation unless explicitly asked to
- If the user's description is ambiguous, ask for clarification before making changes
- If adding a new component, check whether it needs to be added to the "Component Shortcuts" table in both files
- If changing prop behavior, check whether "Numeric Value Formatters" or "Critical Rules" sections need updating too
