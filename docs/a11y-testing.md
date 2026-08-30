# Accessibility testing

How accessibility is checked in this repo: what CI proves on every push, what it cannot prove, and the manual screen-reader pass that covers the difference.

The target is the [WAI-ARIA Authoring Practices Guide](https://www.w3.org/WAI/ARIA/apg/patterns/) (APG). Each component names the pattern it implements.

```bash
npm test                                        # everything, a11y included
npx vitest run src/components/a11y.test.tsx     # the axe sweep over every component
npx vitest run src/components/checkbox.a11y     # one component's keyboard tests
```

---

## What runs in CI

### 1. The axe sweep — `src/components/a11y.test.tsx`

Every shipped component is rendered in the smallest form its docs show (`dev/a11y/fixtures.tsx`) and put through [axe-core](https://github.com/dequelabs/axe-core). The gate is two-sided:

- a rule that fires and is **not** in that fixture's `knownViolations` fails the build — the regression guard;
- a rule that **is** listed and no longer fires fails the build too.

The second half is what keeps the ledger honest. `knownViolations` is not a mute button: each entry names the roadmap step that owns the fix, and closing that issue means deleting the line in the same commit. A ledger that only ever grows would make the gate meaningless within a release.

```tsx
{
  name: 'DataGrid',
  render: () => ( /* ... */ ),
  knownViolations: {
    'aria-required-parent': 'A7 — role="row"/"columnheader" hang off a role="presentation" root, so the grid structure is not announced.',
  },
}
```

Fixtures live in `dev/` rather than beside the components because `src/components/*` is the build's entry glob — a fixture file there would ship as a published entry point.

### 2. Keyboard-interaction tests — `*.a11y.test.tsx`

APG is mostly a specification of _where focus goes_, which no static check can see. These tests drive the component with a real keyboard ([user-event](https://testing-library.com/docs/user-event/intro), so DOM focus actually moves and `tabindex`/`disabled` are respected) and assert the result.

`src/components/checkbox.a11y.test.tsx` and `src/components/tooltip.a11y.test.tsx` are the two templates, and `src/components/dropdown.a11y.test.tsx` is the third shape: a pattern whose state is not focus. There, `expectFocusOn` proves DOM focus **never moves** — every assertion about _where the user is_ reads `aria-activedescendant` instead, because that is the only place a select-only combobox keeps it. Checkbox is the case where the platform already supplies the pattern and there is something passing to assert. Tooltip is the case where the library implements the whole pattern itself — semantics, keyboard and pointer, each in its own block — and it is also the file that shows what this layer catches and axe does not: the three WCAG 1.4.13 tests (dismissible, hoverable, persistent) are about _when the markup exists_, and a tooltip that vanishes the moment you reach for it has perfect markup right up until it disappears.

That file started life as A1 wrote it: four `it.todo`s naming the contract, and one test asserting the pattern was **absent**, so the gap could not be closed silently. A3 deleted that test and promoted the todos, which is the intended life cycle — a todo here is a commitment with a date on it, not a note.

The helpers are in `dev/a11y/`:

| Helper                                         | What it does                                                            |
| ---------------------------------------------- | ----------------------------------------------------------------------- |
| `keyboard()`                                   | A keyboard driving the document. Call it **before** `render`.           |
| `.pressTab()` / `.pressShiftTab()`             | Move focus through the real tab order.                                  |
| `.pressArrow('Down')`                          | Arrow keys on whatever has focus — list and grid navigation.            |
| `.press('Enter' \| 'Escape' \| 'Home' \| ' ')` | Any other named key.                                                    |
| `.type('ala')`                                 | Printable characters, for typeahead and search boxes.                   |
| `.click(element)`                              | A real pointer click — "open with the mouse, then drive with the keys". |
| `.hover(el)` / `.unhover(el)`                  | Pointer travel, for hover-triggered content and WCAG 1.4.13.            |
| `expectFocusOn(element)`                       | Asserts DOM focus, and says what has it instead when it does not.       |
| `expectNoAxeViolations(container)`             | Fails with the full axe report — rule, impact, markup, fix.             |

[jest-dom](https://github.com/testing-library/jest-dom) matchers (`toBeChecked`, `toHaveFocus`, `toHaveAccessibleName`, `toHaveAttribute`) are registered globally in `dev/vitest.setup.ts`.

### 3. The behaviour primitives — `src/react/a11y/*.test.tsx`

The mechanics the components are built from are tested on their own, away from any component:
arrow-key movement and typeahead, dismissal layers, focus return, controlled state with change
reasons ([docs/a11y-primitives.md](a11y-primitives.md)). `primitives.a11y.test.tsx` then assembles
all five into a select-only combobox and drives it from the keyboard, because the failures that
matter for a set of hooks are the ones that only appear in combination — a dismissal firing while
the list is still taking focus, focus returning to a trigger a roving index has moved away from.

`npm run test:a11y` runs all three groups (`vitest run a11y` matches the paths).

---

## What the automated checks cannot prove

**axe judges the ARIA that is there; it cannot see semantics that are missing.** A listbox built from bare `<div>`s with no roles at all looks perfectly clean to it — which is precisely the shape of this library's biggest gap. Every violation the sweep reports today is a case where the markup says something _wrong_, not something _absent_. Treat a clean sweep as a floor, never as evidence that a pattern is implemented; the keyboard tests are what carry that claim.

**Two rules are switched off** for every run (`DEFAULT_DISABLED_RULES` in `dev/a11y/axe.ts`), so a pass never claims more than it checked:

- `color-contrast` samples rendered pixels — it needs real layout and a canvas, and happy-dom has neither, so axe parks it in `incomplete` forever. Contrast is a browser or manual check.
- `region` wants all content inside a landmark. That is a property of the _page_; a fixture is a fragment dropped into `document.body`, so the rule would only ever measure the fixture.

**The DOM is happy-dom, not a browser.** Anything that depends on real layout — focus visibility, scroll-into-view on arrow navigation, tooltip placement, virtualized rows outside the viewport — is not covered here.

**No screen reader is involved.** Correct ARIA and an announcement a person can use are different things; the matrix below is how that gets checked.

**No media query is ever true.** happy-dom evaluates none of them, so nothing here can prove that a rule written under `motionReduce`, `forcedColors` or `contrastMore` actually takes effect — only that the engine emitted it, with the right condition, in the right place in the cascade. That is what `mediaFeatures.test.ts` asserts. Whether the result is _usable_ under the preference is a browser check: Chrome DevTools' Rendering panel emulates all three.

---

## The preferences the engine answers

A user states these once, in their operating system, and every page is expected to listen. They are Box props, shaped exactly like a breakpoint (see `BOX_AI_CONTEXT.md`):

| Prop           | Media query                      | Default behaviour in this library                                                                                                                                      |
| -------------- | -------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `motionReduce` | `prefers-reduced-motion: reduce` | **On by default.** Every Box transitions on `--transitionTime`; the preference sets it (and `--svgTransitionTime`) to `0s`, so the library stops animating on its own. |
| `forcedColors` | `forced-colors: active`          | Tooltip grows a border, the one edge a forced-colors mode keeps once it has thrown away both of its colours.                                                           |
| `contrastMore` | `prefers-contrast: more`         | Nothing yet — the prop is there for a consumer's own rules.                                                                                                            |

Two components had to say something the variable default could not: **Switch** names its own `150ms`, so it opts out by name (the thumb still arrives on the other side, it just stops travelling), and the **DataGrid loader**'s indeterminate sweep — the library's only `@keyframes` — is applied from a class rather than an inline style precisely so a `prefers-reduced-motion` rule can outrank it. An animation that repeats forever is the clearest case the preference exists for.

---

## The baseline, as of A1

What the sweep finds today, with the step that owns each fix. This is the measured starting point the accessibility work is judged against.

| Component                       | Rule                   | What is wrong                                                                      | Owner |
| ------------------------------- | ---------------------- | ---------------------------------------------------------------------------------- | ----- |
| ~~Dropdown (open)~~             | `aria-allowed-attr`    | Items carry `aria-selected` on a plain `div` — legal only with `role="option"`     | A5 ✅ |
| ~~Dropdown (searchable, open)~~ | `nested-interactive`   | The search input renders inside the trigger `<button>`: a focusable in a focusable | A6 ✅ |
| ~~Select (open)~~               | `button-name`          | With nothing selected and no placeholder, the trigger renders empty and unnamed    | A5 ✅ |
| ~~DataGrid~~                    | `aria-required-parent` | `role="row"`/`"columnheader"` hang off a `role="presentation"` root                | A7 ✅ |
| ~~DataGrid~~                    | `button-name`          | The group and column-chooser buttons are icon-only with no accessible name         | A7 ✅ |

Every row is closed as of A7. Everything else in the sweep is clean — including, and this is the point of the section above, Dropdown and Select in the states where they have no ARIA at all to get wrong.

⚠️ **The searchable row stopped firing before it was fixed, and that is worth reading twice.** A5 turned the trigger into a `role="combobox"`, and a combobox is one of the roles that _may_ contain a focusable descendant — so `nested-interactive` simply stopped applying to the input nested inside it. Nothing about the markup had improved. The entry was deleted from `knownViolations` because it no longer fired, and replaced by a test in `dropdown.a11y.test.tsx` that asserted the nesting was still there and failed the moment A6 removed it. That is what closed the row: A6 made the input the combobox, the test flipped to asserting `combobox.closest('button')` is null, and the sweep never had an opinion either way. The same manoeuvre A1 used for the absent Tooltip pattern, and the same reason: a gap the tooling cannot see needs a test that can.

**Closed since:**

- **A8 — the preference media features** closed no rows either, and for the same reason as A10: axe reads one rendered state, and these are three states it never renders. What changed is that the library now has an answer for a preference it used to ignore — see "The preferences the engine answers" above.
- **A10 — the grid keyboard's remainder** closed no rows at all, and could not have: both of the gaps it fixed are invisible to axe. The column resizer had no keyboard path — a mouse-only control that is perfectly valid markup, because it had no ARIA claiming otherwise — and is now APG's window splitter, a `role="separator"` with the column's width in pixels that the arrows move and Home/End take to its bounds. Vertical movement counted cell _ordinals_, so a move down out of a grouped header landed under whichever cell shared its ordinal rather than under the column it left; `useRovingFocus` travels in column-index space now. Neither is a rule violation; both are the pattern being wrong, which is what `dataGrid.a11y.test.tsx` is for — 26 → 31 tests there, plus two in `useRovingFocus.test.tsx` over ragged rows.
- **A7 — the DataGrid** closed the last two rows, and the sweep gained the fixture that makes them mean something: a **virtualized 10,000-row grid**, grouped, selectable, filterable, with a detail row — the shape where a grid's ARIA usually breaks, because the rows in the DOM stop being the rows in the grid. `role="grid"` moved onto the scrolling element (not the root, which also holds the top and bottom bars), the header and body became `rowgroup`s, the scroll spacers became `presentation`, and every icon-only control the grid draws for itself was given a name. Two violations nobody had recorded turned up on the way and were fixed in the same change: `empty-table-header` on the row-number and row-detail columns, whose headers are blank by design, and the loader's `role="progressbar"` sitting inside the grid as something that is not a row — the grid carries `aria-busy` instead. 26 tests in `dataGrid.a11y.test.tsx` cover the APG grid map.
- **A6 — the searchable Dropdown** moved `role="combobox"` onto the search `<input>` itself, which is what took the input out of the trigger `<button>` and closed the row above. 16 tests in `dropdown.a11y.test.tsx` cover the editable map (28 → 42 for the file, the two that pinned the old nesting being gone) — where the printable keys type instead of navigating, Home/End and the left/right arrows hand the highlight back to the field, and Escape closes before it clears.
- **A5 — Dropdown and Select** closed both of their rows at once. Items are `role="option"` inside a `role="listbox"`, which is what makes the `aria-selected` beside them legal, and the trigger takes its name from a `label` prop instead of from whatever happens to be selected. The sweep gained nothing new, but `dropdown.a11y.test.tsx` did: 28 tests over the APG select-only combobox map, which is the layer that can see a pattern rather than an attribute.
- **A3 — Tooltip** had no violations to fix here, which is exactly the limitation this document opens with: it had no ARIA at all, and axe cannot fail what is not there. A3 made it the APG pattern, and the sweep now covers it open as well as closed.
- **A4 — Checkbox and RadioButton** both failed `label`. Both now render the `<label>` themselves from a `label` prop, so their fixtures carry no `knownViolations` and the sweep would fail if the rule came back. The sweep also gained `Checkbox (indeterminate)` — where `aria-checked="mixed"` has to agree with the DOM property — plus `Switch` and `RadioGroup`, neither of which existed when the baseline was measured.

---

## The manual screen-reader matrix

Automated tests cannot tell you whether an announcement makes sense. Each component gets a manual pass on the combinations below before its accessibility claim is published (A9).

| Platform | Screen reader                     | Browser | Why this pair                                     |
| -------- | --------------------------------- | ------- | ------------------------------------------------- |
| Windows  | [NVDA](https://www.nvaccess.org/) | Firefox | The most-used pair among screen-reader users      |
| Windows  | NVDA                              | Chrome  | Different accessibility-tree mapping from Firefox |
| macOS    | VoiceOver                         | Safari  | The only fully supported VoiceOver pairing        |

NVDA + Firefox and VoiceOver + Safari are the minimum. NVDA + Chrome is run for components with custom ARIA (Dropdown, Select, DataGrid), where the two engines diverge most.

### The pass, per component

1. **Reach it with Tab only.** The control takes focus, and the focus indicator is visible.
2. **Hear it announced.** Role, name and state (expanded, checked, selected, sorted) are all read — and match what is on screen.
3. **Operate it with the keys the APG pattern specifies**, from the component's keyboard table. Every state change is announced as it happens.
4. **Leave it.** Escape (where the pattern has it) and Tab both work, and focus lands somewhere sensible — for a popup, back on the trigger that opened it.
5. **Browse mode** (NVDA): the component is readable with the virtual cursor, not only in forms mode.

Record the reader and browser versions with the date — an old result is a claim about software nobody is running any more.

### Results

Filled in as A3–A7 land each component; published per component by A9.

| Component  | Pattern | NVDA + Firefox | NVDA + Chrome | VoiceOver + Safari | Date |
| ---------- | ------- | -------------- | ------------- | ------------------ | ---- |
| _none yet_ |         |                |               |                    |      |

---

## Adding a component

1. Add a fixture to `dev/a11y/fixtures.tsx` — the minimal form the docs show. It is in the sweep from that moment.
2. If it fails a rule you are not fixing now, add it to `knownViolations` with the owning step. If there is no such step, the fix belongs in this change.
3. For anything interactive, add `<component>.a11y.test.tsx` next to the component: the APG keyboard map as tests, `it.todo` for the parts not implemented yet.
4. Add its keyboard table to the component's docs page, and its row to the matrix above once the manual pass is done.
