import Box from '../../box';

type BoxProps = React.ComponentProps<typeof Box>;

interface Props extends BoxProps {
  onClick?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  type?: React.ComponentProps<'button'>['type'];
}

export default function Button(props: Props) {
  const { props: tagProps, onClick, type } = props;

  const newTagProps: React.ComponentProps<keyof React.ReactHTML> = { ...{ type: type || 'button', onClick }, ...tagProps };
  const newProps = { ...{ props: newTagProps }, ...props };

  return <Box tag="button" cursor="pointer" display="inline-block" {...newProps} />;
}
