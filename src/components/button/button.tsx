import { forwardRef, Ref } from 'react';
import Box from '../../box';
import ObjectUtils from '../../utils/object/objectUtils';

type BoxProps = Omit<React.ComponentProps<typeof Box<'button'>>, 'ref' | 'tag'>;
type BoxTagProps = Required<BoxProps>['props'];

const tagProps = ['type', 'onClick', 'disabled'] as const;
type TagPropsType = (typeof tagProps)[number];

type ButtonTagProps = Omit<BoxTagProps, TagPropsType>;
type ButtonType = Required<React.ComponentProps<'button'>>['type'];

interface Props extends Omit<BoxProps, 'props'> {
  props?: ButtonTagProps;
  type?: ButtonType;
  onClick?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}

function Button(props: Props, ref: Ref<HTMLButtonElement>) {
  const newProps = ObjectUtils.buildProps(props, tagProps);

  return <Box ref={ref} tag="button" component="button" {...newProps} />;
}

export default forwardRef(Button);
