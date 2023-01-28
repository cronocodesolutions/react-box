import Box from '../../box';

type BoxProps = React.ComponentProps<typeof Box<'button'>>;
type BoxTagProps = Required<BoxProps>['props'];

type ButtonTagProps = Omit<BoxTagProps, 'type' | 'onClick' | 'disabled'>;
type ButtonType = Required<React.ComponentProps<'button'>>['type'];

interface Props extends Omit<BoxProps, 'props'> {
  props?: ButtonTagProps;
  type?: ButtonType;
  onClick?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  disabled?: boolean;
}

export default function ButtonCore(props: Props) {
  const { tag, type, onClick, disabled, props: tagProps } = props;

  const newTagProps = { ...tagProps, type: type || 'button', onClick, disabled } as BoxTagProps;

  return <Box tag={tag || 'button'} cursor="pointer" inline {...props} props={newTagProps} />;
}
