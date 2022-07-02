import Box from '../../box';

interface Props extends Omit<React.ComponentProps<typeof Box<'button'>>, 'tag'> {
  onClick?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}

export default function Button(props: Props) {
  const { props: tagProps, onClick } = props;

  const newTagProps: React.ComponentProps<'button'> = { ...{ type: 'button', onClick }, ...tagProps };
  const newProps = { ...{ props: newTagProps }, ...props };

  return <Box tag="button" cursor="pointer" display="inline-block" {...newProps} />;
}
