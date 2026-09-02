import { describe, expect, it } from 'vitest';
import Groups from './groups';

/**
 * The grammar behind `group`/`peer`, a pure key → selector question. What the engine builds around the
 * answer — and how the five original `*Group` props rewrite into it — is `engine/groups.test.ts`.
 */
describe('Groups.parent', () => {
  it('takes a state on the default class, the way Tailwind names it', () => {
    expect(Groups.parent('group', 'hover')).toEqual({ kind: 'group', name: 'hover-group', selector: '.group:hover', combinator: ' ' });
    expect(Groups.parent('peer', 'checked')).toEqual({
      kind: 'peer',
      name: 'peer-checked-peer',
      selector: '.peer:checked',
      combinator: '~',
    });
  });

  it('addresses a named ancestor after the last slash', () => {
    expect(Groups.parent('group', 'card/hover')?.selector).toBe('.card:hover');
    expect(Groups.parent('group', 'card/focusVisible')?.selector).toBe('.card:focus-visible');
    expect(Groups.parent('peer', 'agree/checked')?.selector).toBe('.agree:checked');
  });

  it('shares the state vocabulary with `not`, attributes included', () => {
    expect(Groups.parent('group', 'row/data-state=open')?.selector).toBe('.row[data-state="open"]');
    expect(Groups.parent('group', 'row/data-loading')?.selector).toBe('.row[data-loading]');
    expect(Groups.parent('group', 'row/aria-selected')?.selector).toBe('.row[aria-selected="true"]');
  });

  it('names the compiled parts, not the key, so the two spellings of one selector share a class', () => {
    // `hoverGroup={{ card: … }}` compiles through this same call, so it cannot produce a second class
    // for a rule that already exists.
    expect(Groups.parent('group', 'card/hover')?.name).toBe('hover-card');
    expect(Groups.parent('peer', 'card/hover')?.name).toBe('peer-hover-card');
  });

  it('rejects a key whose state or name it cannot compile', () => {
    expect(Groups.parent('group', 'nonsense')).toBeNull();
    expect(Groups.parent('group', 'card/nonsense')).toBeNull();
    expect(Groups.parent('group', 'card/before')).toBeNull();
    // The name lands in rule text as a class selector: a CSS identifier, or nothing at all.
    expect(Groups.parent('group', 'my card/hover')).toBeNull();
    expect(Groups.parent('group', '1card/hover')).toBeNull();
    expect(Groups.parent('group', '.card/hover')).toBeNull();
    expect(Groups.parent('group', '')).toBeNull();
  });
});

describe('Groups.theme', () => {
  it('is an ancestor with no state of its own', () => {
    expect(Groups.theme('dark')).toEqual({ kind: 'theme', name: 'theme-dark', selector: '.dark', combinator: ' ' });
  });

  it('holds a theme name to the same identifier rule', () => {
    expect(Groups.theme('high-contrast')?.selector).toBe('.high-contrast');
    expect(Groups.theme('two words')).toBeNull();
  });
});
