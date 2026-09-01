import { describe, expect, it } from 'vitest';
import { generatedRulesOf, makeEngine, renderStyles } from '../../dev/engineHarness';
import { BoxStyleProps } from '../types';
import Content from './content';

/**
 * `content` is the one prop whose value is *text*, and text written by a caller is the only thing in this
 * library that reaches rule text unformatted. So the grammar has three answers: a keyword, CSS the caller
 * wrote, or text — and text is quoted, which is what stops a value ending the declaration it lands in.
 */
describe('what content accepts', () => {
  it.each([
    ['empty', "''"],
    ['none', 'none'],
    ['normal', 'normal'],
    ['open-quote', 'open-quote'],
  ])('maps the keyword %s to %s', (value, expected) => {
    expect(Content.keyword(value)).toBe(expected);
  });

  it.each([
    '"Step "',
    "'—'",
    'attr(data-label)',
    'counter(step)',
    'counters(item, ".")',
    'url(/tick.svg)',
    'var(--marker)',
    'var(--marker, "•")',
    'image-set(url(a.png) 1x)',
    // The reason this shape has to exist at all: a sequence cannot be expressed by quoting.
    '"Step " counter(step) ": "',
  ])('takes %s as CSS the caller wrote', (value) => {
    expect(Content.isCssValue(value)).toBe(true);
  });

  it.each([
    // Each of these would end the declaration or the block it lands in.
    ['"a"; color: red', 'a semicolon outside the string'],
    ['"a"} body{display:none', 'a closing brace'],
    ['attr(x) @import "evil"', 'an at-rule'],
    ['attr(data-x', 'an unclosed function'],
    ['counter(a))', 'one parenthesis too many'],
    ['"unterminated', 'an unclosed string'],
  ])('refuses %s (%s)', (value) => {
    expect(Content.isCssValue(value)).toBe(false);
  });

  it('reads a parenthesis inside a string as a character, not as a function', () => {
    expect(Content.isCssValue('"(:"')).toBe(true);
    expect(Content.isCssValue('"\\""')).toBe(true);
  });

  it('quotes text, and escapes what would end the string early', () => {
    expect(Content.quote('New')).toBe('"New"');
    expect(Content.quote('say "hi"')).toBe('"say \\"hi\\""');
    expect(Content.quote('a\\b')).toBe('"a\\\\b"');
    // The trailing space is part of the escape: CSS reads hex digits until one.
    expect(Content.quote('a\nb')).toBe('"a\\A b"');
  });
});

describe('content as a rule', () => {
  it.each([
    ['empty', "content:''"],
    ['none', 'content:none'],
    ['New', 'content:"New"'],
    ['"Step " counter(step)', 'content:"Step " counter(step)'],
    ['attr(data-label)', 'content:attr(data-label)'],
  ])('writes content=%s as %s', (value, expected) => {
    const engine = makeEngine(`content-${value}`);

    renderStyles(engine, { before: { content: value } } as BoxStyleProps);

    expect(generatedRulesOf(engine)).toContain(`::before{${expected}}`);
  });

  it('emits no rule and no class name for a value the grammar refuses', () => {
    const engine = makeEngine('content-refused');

    // Not a string, so no definition matches — the same answer an unsupported colour gets.
    const classNames = renderStyles(engine, { before: { content: 4 } } as unknown as BoxStyleProps);

    expect(generatedRulesOf(engine)).not.toContain('content:4');
    expect(classNames.some((name) => name.includes('content'))).toBe(false);
  });
});
