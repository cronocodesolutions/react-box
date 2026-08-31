---
name: terse-comments
description: The comment rule for this repo (one or two lines) and the tooling for a bulk sweep. Use when writing or reviewing a comment, when a comment reads as too long, and whenever asked to shorten, clean up or sweep comments across a file, a directory or the whole repository.
---

# Comments

**One or two lines.** Say the thing the code cannot — the trap, the reason, the bug it came from —
and stop. Four or five lines only for a module-level doc that genuinely needs it: a code example, or
two conventions meeting. Nothing longer, anywhere.

A long comment is an obstacle between a reader and the code, and the long version is usually already
written somewhere a reader reaches on purpose: `CONTRIBUTING.md`, the docs site, or the roadmap in
the plans repo. Put it there and leave a clause behind.

## Writing one

Ask what the next reader cannot get from the code itself. That is the whole comment.

| Keep | Cut |
| --- | --- |
| The invariant the code depends on and cannot state | A restatement of the next line |
| Why the obvious alternative is wrong | The history of how it got here |
| The bug number and its one-line symptom | The retelling of the bug |
| A name collision or a cross-file contract | A summary of what the function does, if the name says it |
| A code example, where the API is easy to hold wrong | A second example making the same point |

```ts
// Before — six lines
/**
 * Build a stable cache key from the inputs that determine a Box's class list. Component
 * defaults are keyed via component/variant/clean (they are immutable per name), and JSON is
 * used for values so e.g. `p={4}` and `p="4"` never collide. Returns null if a value can't be
 * serialized, in which case the caller falls back to the uncached path (today's behavior).
 */

// After — two
/**
 * A stable cache key for the inputs that decide a class list. Values go through JSON so `p={4}` and
 * `p="4"` cannot collide; null when something will not serialize, and the caller falls back.
 */
```

Delete outright: a comment that names what the next line does (`// Create a unique key…` above
`const key = …`), a paragraph of narrative around a single fact, and commented-out code — that is
not a comment, it is dead weight, and git remembers it.

Two lines that must stay verbatim: a directive the toolchain reads (`@__PURE__`, `eslint-*`, `@ts-*`,
`<reference`) and `@deprecated`.

## Sweeping a file, a directory or the repo

Four steps, in batches of four to eight files. Never a whole tree in one pass — a batch is small
enough to re-do when the gate fails.

**1. Worklist.** Longest blocks first, since they hold most of the lines:

```bash
MIN=6 node .claude/skills/terse-comments/scripts/comment-blocks.mjs          # every tracked file, by size, then by file
MIN=6 PROSE=1 node .claude/skills/terse-comments/scripts/comment-blocks.mjs  # skip blocks holding a code fence
```

**2. Read the batch.** `TEXT=1` prints each block in full, which is all that is needed to write a
replacement — the file itself does not have to be read:

```bash
MIN=6 TEXT=1 node .claude/skills/terse-comments/scripts/comment-blocks.mjs src/core/engine/styleEngine.ts src/core/variables.ts
```

**3. Write a JSON plan and apply it.** Each edit is `[anchor, replacement]`: the anchor is any
substring unique to one line of the file, and the whole block containing it is replaced. `null`
deletes the block. Write the plan with the Write tool, to a scratchpad path:

```json
[
  {
    "file": "src/core/engine/styleEngine.ts",
    "edits": [
      ["Build a stable cache key", ["/**", " * A stable cache key for the inputs that decide a class list.", " */"]],
      ["Only generate rule if it hasn't been generated", null]
    ]
  }
]
```

```bash
node .claude/skills/terse-comments/scripts/condense-comments.mjs <scratchpad>/plan.json
```

**4. Gate the batch.** Nothing but comments may have changed:

```bash
node .claude/skills/terse-comments/scripts/verify-comments.mjs src/core/engine/styleEngine.ts src/core/variables.ts
```

It fails on a changed code line or a lost directive, and prints the file. Run it over everything at
the end too, for the total.

## Finishing

```bash
git diff --name-only | tr '\n' ' ' | xargs npx prettier --write   # source only — see the gotcha below
npm run compile && npm run lint && npx vitest run
```

`npm run check:boundaries` counts **lines**, so a sweep moves the adapter ratio the README publishes.
Re-run it and refresh that table in the same commit.

## Gotchas, each of which has bitten

- **A JSX comment opens with `{/*` and closes with `*/}`.** A block finder that only knows `/*` walks
  backwards past it and swallows the code above — it ate twelve lines of a `<Circle>` before the gate
  caught it. Both scripts here know both markers.
- **Write the plan with the Write tool, never a shell heredoc.** Backslashes are eaten in transit:
  `[\w-]` arrived as `[w-]` and a regex silently stopped matching. JSON also sidesteps the apostrophe
  that breaks a single-quoted JS string.
- **Anchors must be unique.** Condensing one block can make an earlier anchor ambiguous, since the
  replacement text is now in the file too. The script refuses rather than guessing.
- **Do not run prettier over `.md`.** The markdown in this repo is not prettier-formatted, and
  formatting it buries the diff. Pass source files only.
- **A keyboard-map table above a test file is redundant** when each test below names its own key.
  Keep the pattern URL and the one insight the test names cannot carry.
- Never judge a check through a pipe: `npm run x > log 2>&1; echo $?`, since a pipe masks the exit code.
