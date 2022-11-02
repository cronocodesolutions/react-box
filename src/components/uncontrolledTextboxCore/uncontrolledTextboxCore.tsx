import Box from '../../box';

type BoxProps = React.ComponentProps<typeof Box>;
type BoxTagProps = Required<BoxProps>['props'];

type UncontrolledTextboxCoreTagProps = Omit<
  BoxTagProps,
  'name' | 'onInput' | 'onChange' | 'type' | 'placeholder' | 'disabled' | 'defaultValue'
>;
type UncontrolledTextboxCoreType =
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

interface Props extends Omit<BoxProps, 'props'> {
  name: string;
  props?: UncontrolledTextboxCoreTagProps;
  onInput?: (e: React.FormEvent<HTMLInputElement>) => void;
  onChange?: (e: React.FormEvent<HTMLInputElement>) => void;
  type?: UncontrolledTextboxCoreType;
  placeholder?: string;
  disabled?: boolean;
  defaultValue?: string | number;
}

export default function UncontrolledTextboxCore(props: Props) {
  const { props: tagProps, name, type, disabled, placeholder, defaultValue, onInput, onChange } = props;

  const newTagProps = {
    ...tagProps,
    type: type || 'text',
    name,
    disabled,
    placeholder,
    onInput,
    onChange,
    defaultValue,
  } as BoxTagProps;

  return <Box tag="input" inline {...props} props={newTagProps} />;
}
