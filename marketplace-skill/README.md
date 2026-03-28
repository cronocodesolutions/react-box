# @cronocode/react-box — Claude Code Plugin

AI skill for the [@cronocode/react-box](https://github.com/cronocodesolutions/react-box) runtime CSS-in-JS library. Helps AI assistants correctly use Box props, component shortcuts, numeric formatters, themes, Dropdown, Select, DataGrid, and the full extension system.

## Install

### Via Claude Code plugin system

```bash
/plugin marketplace add cronocodesolutions/react-box-skill
```

Then install:

```bash
/plugin install cronocode-react-box@cronocodesolutions-react-box-skill
```

### Manual install (global — works across all projects)

```bash
git clone https://github.com/cronocodesolutions/react-box-skill.git
cp -r react-box-skill/skills/cronocode-react-box ~/.claude/skills/
```

### Manual install (project-level)

```bash
mkdir -p .claude/skills
cp -r node_modules/@cronocode/react-box/.claude/skills/react-box .claude/skills/
```

## What it does

When active, the AI assistant will:

- **Never use inline `style={{ }}`** — always use Box props
- **Never use `<Box tag="...">`** — use semantic component shortcuts (`<Button>`, `<Flex>`, `<H1>`, etc.)
- **Apply correct numeric formatters** — fontSize divider 16, spacing divider 4, border direct px
- **Use Dropdown** correctly with compound pattern, sub-components, variants, `itemsProps`/`iconProps`
- **Use Select** correctly with data + def pattern for data-driven dropdowns
- **Use DataGrid** correctly with columns, filters, sorting, pagination, style customization
- **Configure themes** with `Box.Theme`, `storageKey`, `setTheme(null)` reset
- **Extend Box** with `Box.extend()` and `Box.components()` for custom props and component styles
- **Detect package manager** (npm/yarn/pnpm/bun) and suggest correct install/update commands

## Compatibility

Works with Claude Code. The skill follows the Agent Skills open standard and may also work with other AI coding assistants that support SKILL.md format (Cursor, Windsurf, Codex).

## License

MIT
