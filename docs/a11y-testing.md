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
  name: 'Dropdown (open)',
  render: () => ( /* ... */ ),
  setup: openPopup,
  knownViolations: {
    'aria-allowed-attr': 'A5 — items carry aria-selected on a plain div; the attribute is only legal once they are role="option".',
  },
}
```

Fixtures live in `dev/` rather than beside the components because `src/components/*` is the build's entry glob — a fixture file there would ship as a published entry point.

### 2. Keyboard-interaction tests — `*.a11y.test.tsx`

APG is mostly a specification of _where focus goes_, which no static check can see. These tests drive the component with a real keyboard ([user-event](https://testing-library.com/docs/user-event/intro), so DOM focus actually moves and `tabindex`/`disabled` are respected) and assert the result.

`src/components/checkbox.a11y.test.tsx` and `src/components/tooltip.a11y.test.tsx` are the two templates. Checkbox is the case where the platform already supplies the pattern and there is something passing to assert. Tooltip is the case where the library implements the whole pattern itself — semantics, keyboard and pointer, each in its own block — and it is also the file that shows what this layer catches and axe does not: the three WCAG 1.4.13 tests (dismissible, hoverable, persistent) are about _when the markup exists_, and a tooltip that vanishes the moment you reach for it has perfect markup right up until it disappears.

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

---

## The baseline, as of A1

What the sweep finds today, with the step that owns each fix. This is the measured starting point the accessibility work is judged against.

| Component                   | Rule                   | What is wrong                                                                      | Owner |
| --------------------------- | ---------------------- | ---------------------------------------------------------------------------------- | ----- |
| Dropdown (open)             | `aria-allowed-attr`    | Items carry `aria-selected` on a plain `div` — legal only with `role="option"`     | A5    |
| Dropdown (searchable, open) | `nested-interactive`   | The search input renders inside the trigger `<button>`: a focusable in a focusable | A6    |
| Select (open)               | `button-name`          | With nothing selected and no placeholder, the trigger renders empty and unnamed    | A5    |
| DataGrid                    | `aria-required-parent` | `role="row"`/`"columnheader"` hang off a `role="presentation"` root                | A7    |
| DataGrid                    | `button-name`          | The group and column-chooser buttons are icon-only with no accessible name         | A7    |

Everything else in the sweep is clean — including, and this is the point of the section above, Dropdown and Select in the states where they have no ARIA at all to get wrong.

**Closed since:**

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
