import Box from '../../box';

type BoxProps = React.ComponentProps<typeof Box>;

interface Props extends BoxProps {
  onClick?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  type?: React.ComponentProps<'button'>['type'];
  disabled?: boolean;
}

export default function Button(props: Props) {
  const { props: tagProps, onClick, type, disabled } = props;

  const newTagProps = { ...{ onClick, type: type || 'button', disabled }, ...tagProps };
  const newProps = { ...props, ...{ props: newTagProps } };

  return <Box tag="button" cursor="pointer" display="inline-block" {...newProps} />;
}
