import { BoxPseudoElementStyles } from '../../types';

/**
 * `placeholder` is an attribute on an `<input>` and a pseudo-element on a Box, and both readings are
 * right — the same collision `Rect`'s `width` and `Path`'s `d` have, settled per element. A string is the
 * text, an object is the `::placeholder` styles, and both at once means the text goes in `props`, where
 * every other attribute already goes.
 */
export type PlaceholderProp = string | BoxPseudoElementStyles;

/** The prop split into the two things it can be: `text` for the attribute, `styles` for the Box prop. */
export default function splitPlaceholder(placeholder: PlaceholderProp | undefined): {
  text?: string;
  styles?: BoxPseudoElementStyles;
} {
  if (placeholder === undefined || placeholder === null) return {};

  return typeof placeholder === 'string' ? { text: placeholder } : { styles: placeholder };
}
