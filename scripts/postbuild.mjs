// Copy publish metadata, docs, and Claude skill/rules into dist/ after the library build.
// Uses Node's fs (not shell cp/mkdir) so it runs identically on macOS, Linux, and Windows.
import { cpSync, mkdirSync } from 'node:fs';

// Ensure target directories exist (recursive = cross-platform `mkdir -p`).
mkdirSync('dist/.claude/skills/cronocode-react-box', { recursive: true });
mkdirSync('dist/.claude/rules', { recursive: true });

const copies = [
  ['package.json', 'dist/package.json'],
  ['LICENSE', 'dist/LICENSE'],
  ['README.md', 'dist/README.md'],
  ['src/BOX_AI_CONTEXT.md', 'dist/BOX_AI_CONTEXT.md'],
  ['.claude/skills/cronocode-react-box/SKILL.md', 'dist/.claude/skills/cronocode-react-box/SKILL.md'],
  ['.claude/rules/react-box-rules.md', 'dist/.claude/rules/react-box-rules.md'],
];

for (const [from, to] of copies) {
  cpSync(from, to);
}
