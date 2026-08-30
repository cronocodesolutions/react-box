/** The attributes that answer "what is this drawing called" — a caller who set one has decided. */
const NAMING_ATTRIBUTES = ['role', 'aria-label', 'aria-labelledby', 'aria-hidden'];

/**
 * A drawing nobody named is decoration, and a screen reader should walk straight past it — which is
 * what `aria-hidden` says and what saying nothing leaves ambiguous. `label` is the opt-in: an
 * `<svg>` with a name becomes `role="img"`, the role that says this picture carries meaning.
 *
 * The same rule for every `<svg>` this library puts on a page, whether it renders the element
 * itself (`Svg`) or hands the attributes to one somebody else renders (`Icon`). `given` is
 * whatever naming the caller wrote by hand: if there is any, the decision was theirs.
 */
export default function svgNaming(label: string | undefined, given: object | undefined) {
  if (label !== undefined) return { role: 'img', 'aria-label': label };
  if (given && NAMING_ATTRIBUTES.some((name) => name in given)) return undefined;

  return { 'aria-hidden': true };
}
