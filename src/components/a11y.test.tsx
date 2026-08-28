import { cleanup, render } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { formatViolations, runAxe } from '../../dev/a11y/axe';
import { fixtures } from '../../dev/a11y/fixtures';
import { ignoreLogs } from '../../dev/tests';

/**
 * Every component, rendered the way its docs show it, put through axe.
 *
 * The gate is two-sided. A rule that fires and is *not* in the fixture's `knownViolations` fails
 * the build — that is the regression guard. A rule that is listed and no longer fires fails it too,
 * so the ledger cannot silently turn into a list of excuses: fixing an issue in A3–A7 means
 * deleting its line here, in the same commit.
 *
 * What this cannot do is notice missing semantics. axe judges the ARIA that *is* there; a listbox
 * built from bare `<div>`s with no roles at all looks clean to it. The APG keyboard tests next to
 * this file are what prove a pattern is actually implemented — see docs/a11y-testing.md.
 */
describe('Component accessibility (axe)', () => {
  ignoreLogs();

  afterEach(() => {
    cleanup();
  });

  it.each(fixtures)('$name', async (fixture) => {
    render(fixture.render());
    fixture.setup?.();

    // document.body, not the render container: Tooltip and the Dropdown popup render through a
    // portal, and a container-scoped scan would quietly skip exactly the markup under test.
    const violations = await runAxe(document.body);
    const known = fixture.knownViolations ?? {};

    const unexpected = violations.filter((violation) => !(violation.id in known));
    expect(formatViolations(unexpected), `${fixture.name}: ${unexpected.length} unrecorded accessibility violation(s)`).toBe('');

    const fired = new Set(violations.map((violation) => violation.id));
    const noLongerFiring = Object.keys(known).filter((rule) => !fired.has(rule));
    expect(noLongerFiring, `${fixture.name}: these rules pass now — delete them from knownViolations in dev/a11y/fixtures.tsx`).toEqual([]);
  });
});
