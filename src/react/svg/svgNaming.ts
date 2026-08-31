/** The attributes that answer "what is this drawing called" — a caller who set one has decided. */
const NAMING_ATTRIBUTES = ['role', 'aria-label', 'aria-labelledby', 'aria-hidden'];

/**
 * A drawing nobody named is decoration, which `aria-hidden` says and silence leaves ambiguous; `label` is
 * the opt-in that makes it `role="img"`. The same rule for every `<svg>` this library puts on a page,
 * whether it renders the element (`Svg`) or hands the attributes to one somebody else renders (`Icon`).
 * `given` is naming the caller wrote by hand — if there is any, the decision was theirs.
 */
export default function svgNaming(label: string | undefined, given: object | undefined) {
  if (label !== undefined) return { role: 'img', 'aria-label': label };
  if (given && NAMING_ATTRIBUTES.some((name) => name in given)) return undefined;

  return { 'aria-hidden': true };
}
