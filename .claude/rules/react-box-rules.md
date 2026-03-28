---
description: Critical rules for @cronocode/react-box — prevents the most common AI mistakes
globs: "**/*.{ts,tsx,jsx}"
---

# @cronocode/react-box Rules

1. **NEVER use `style={{ }}`** — always use Box props. Missing prop? Create with `Box.extend()`
2. **NEVER `<Box tag="...">`** for common elements — use `<Button>`, `<Link>`, `<H1>`, `<P>`, `<Nav>`, `<Flex>`, `<Grid>`, etc.
3. **NEVER `<Box display="flex/grid">`** — use `<Flex>` / `<Grid>` components
4. **fontSize divider is 16** (not 4): `fontSize={14}` → 14px
5. **Spacing divider is 4**: `p={4}` → 16px (1rem)
6. **Border/borderRadius/lineHeight are direct px**: `b={1}` → 1px
7. **HTML attributes go in `props` prop**: `<Link props={{ href: '/about' }}>` not `<Link href>`
8. **Size shortcuts**: `width="fit"` = 100%, `width="fit-screen"` = 100vw, `width="1/2"` = 50%

Full reference: `src/BOX_AI_CONTEXT.md` or invoke `/react-box` skill.
