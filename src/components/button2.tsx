import { forwardRef, Ref } from 'react';
import Box2 from '../box2';

const moveTagProps = ['type', 'onClick'] as const;
type TagPropsType = (typeof moveTagProps)[number];

type ButtonProps = Omit<React.ComponentProps<typeof Box2<'button'>>, 'tag'>;
type ButtonTagProps = Omit<Required<ButtonProps>['props'], TagPropsType>;
type ButtonType = Required<React.ComponentProps<'button'>>['type'];

interface Props extends Omit<ButtonProps, 'props'> {
  props?: ButtonTagProps;
  onClick?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  type?: ButtonType;
}

function Button(props: Props, ref: Ref<HTMLButtonElement>) {
  const { type, onClick, props: tagProps, ...restProps } = props;

  const tagPropsToUse = (tagProps ?? {}) as Required<ButtonProps>['props'];
  type && (tagPropsToUse.type = type);
  onClick && (tagPropsToUse.onClick = onClick);

  return <Box2 ref={ref} tag="button" component="button" {...restProps} props={tagPropsToUse} />;
}

export default forwardRef(Button);
