import Box from '../../box';

type BoxProps = React.ComponentProps<typeof Box>;

type UncontrolledTextboxCoreTypeAttribute =
  | 'date'
  | 'datetime-local'
  | 'email'
  | 'hidden'
  | 'month'
  | 'number'
  | 'password'
  | 'search'
  | 'tel'
  | 'text'
  | 'time'
  | 'url'
  | 'week';

interface Props extends BoxProps {
  onInput?: (e: React.FormEvent<HTMLInputElement>) => void;
  onChange?: (e: React.FormEvent<HTMLInputElement>) => void;
  type?: UncontrolledTextboxCoreTypeAttribute;
  placeholder?: string;
  disabled?: boolean;
  defaultValue?: string | number;
}

export default function UncontrolledTextboxCore(props: Props) {
  const { props: tagProps, type, disabled, placeholder, defaultValue, onInput, onChange } = props;

  const newTagProps = { ...{ type: type || 'text', disabled, placeholder, onInput, onChange, defaultValue }, ...tagProps };
  const newProps = { ...props, ...{ props: newTagProps } };

  return <Box tag="input" inline {...newProps} />;
}
