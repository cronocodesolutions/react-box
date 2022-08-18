import Box from '../../box';

interface Props<TTag extends keyof React.ReactHTML> extends React.ComponentProps<typeof Box<TTag>> {
  onClick?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  type?: React.ComponentProps<'button'>['type'];
}

export default function Button<TTag extends keyof React.ReactHTML = 'button'>(props: Props<TTag>) {
  const { props: tagProps, onClick, type } = props;

  const newTagProps = { ...tagProps, ...{ onClick, type: type || 'button' } } as React.ComponentProps<TTag>;
  const newProps: Props<TTag> = { ...{ props: newTagProps }, ...props };

  return <Box tag="button" cursor="pointer" display="inline-block" {...newProps} />;
}
