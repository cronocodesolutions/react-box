import { forwardRef, Ref } from 'react';
import Box from '../../box';
import ObjectUtils from '../../utils/object/objectUtils';

type BoxProps = Omit<React.ComponentProps<typeof Box<'button'>>, 'ref' | 'tag'>;
type BoxTagProps = Required<BoxProps>['props'];

type ButtonTagProps = Omit<BoxTagProps, 'type' | 'onClick' | 'disabled'>;
type ButtonType = Required<React.ComponentProps<'button'>>['type'];

interface Props extends Omit<BoxProps, 'props'> {
  props?: ButtonTagProps;
  type?: ButtonType;
  onClick?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  disabled?: boolean;
}

function ButtonCore(props: Props, ref: Ref<HTMLButtonElement>) {
  const [tagProps, newProps] = ObjectUtils.moveToTagProps(props, 'type', 'onClick', 'disabled');

  return <Box ref={ref} tag="button" cursor="pointer" inline {...newProps} props={{ ...props.props, ...(tagProps as BoxTagProps) }} />;
}

export default forwardRef(ButtonCore);
