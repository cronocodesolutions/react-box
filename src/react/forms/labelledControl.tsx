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
 * A form control and its text inside the one `<label>` that ties them together, implicitly: nothing has to
 * be unique (an explicit `for`/`id` pair needs `useId`, a hook, so `RadioButton` would stop rendering on a
 * server) and there is one element to click, so the whole row is a hit target. The text is a bare child
 * rather than a `<Span>`, because a module several chunks share must not import a component chunk — that
 * cycle left `StringUtils` undefined as soon as `semantics.mjs` loaded.
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
