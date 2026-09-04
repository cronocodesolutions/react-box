import { marked } from 'marked';

/** The `##` headings of a document, for the table of contents. */
export function headings(markdown: string): { id: string; label: string }[] {
  return marked
    .lexer(markdown)
    .flatMap((token) => (token.type === 'heading' && token.depth === 2 ? [{ id: slugify(token.text), label: plainText(token.text) }] : []));
}

/** GitHub's heading anchors — lowercase, punctuation gone, spaces to hyphens — so `[…](#the-rename)` in the file resolves here too. */
export function slugify(text: string): string {
  return plainText(text)
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s_-]/gu, '')
    .trim()
    .replace(/\s+/g, '-');
}

/** Emphasis and code markers taken off, for a label or an id. */
export function plainText(text: string): string {
  return text.replace(/[`*]/g, '');
}
