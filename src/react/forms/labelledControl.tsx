import type { BoxProps } from '../../box';
import Flex from '../../components/flex';

export interface LabelledControlProps {
  /** The text beside the control. Nothing is wrapped while this is absent. */
  label?: React.ReactNode;
  /** Styles for the `<label>` that wraps the pair — layout, not the control's own appearance. */
  labelProps?: BoxProps<'label'>;
  /** The control itself: an `<input>` that must end up *inside* the label element. */
  children: React.ReactNode;
}

/**
 * A form control and its text, inside the one `<label>` that ties them together.
 *
 * The association is implicit — the label wraps the control rather than pointing at it with
 * `for`/`id`. Two reasons, and the second is the one that decided it:
 *
 * - Nothing has to be unique. An explicit pair needs a generated id, and a generated id needs
 *   `useId`, which is a hook — so `RadioButton` would stop rendering in a Server Component for
 *   the sake of an attribute the platform does not need here.
 * - There is one element to click. A wrapping label makes the whole row a hit target for free,
 *   which is what a checkbox row is expected to do.
 *
 * A consumer's own `id`, `aria-label` or `aria-labelledby` still wins: an explicit name beats the
 * content of the label element, per accname.
 *
 * The text is a bare child rather than a `<Span>` around it. `Span` comes from the `semantics`
 * entry, and a module several component chunks share must not import a component chunk: the build
 * put this one in with the modules the server-safe components share, `semantics` imports from
 * there too, and the cycle left `StringUtils` undefined the moment `semantics.mjs` was loaded. It
 * lives in its own `forms` chunk now (vite.config.ts) — and one element fewer is the right markup
 * anyway, since an anonymous flex item aligns exactly like a wrapped one.
 */
export default function LabelledControl({ label, labelProps, children }: LabelledControlProps): React.ReactNode {
  if (label === undefined || label === null || label === false) return children;

  return (
    <Flex inline tag="label" ai="center" gap={2} cursor="pointer" {...labelProps}>
      {children}
      {label}
    </Flex>
  );
}
