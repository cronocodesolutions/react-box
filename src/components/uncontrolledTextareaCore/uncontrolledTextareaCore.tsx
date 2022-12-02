import Box from '../../box';

type BoxProps = React.ComponentProps<typeof Box<'textarea'>>;
type BoxTagProps = Required<BoxProps>['props'];

type UncontrolledTextareaCoreTagProps = Omit<
  BoxTagProps,
  | 'name'
  | 'onInput'
  | 'onChange'
  | 'placeholder'
  | 'disabled'
  | 'defaultValue'
  | 'rows'
  | 'cols'
  | 'autoFocus'
  | 'maxLength'
  | 'minLength'
  | 'readOnly'
  | 'required'
>;

interface Props extends Omit<BoxProps, 'props'> {
  name: string;
  props?: UncontrolledTextareaCoreTagProps;
  onInput?: (e: React.FormEvent<HTMLInputElement>) => void;
  onChange?: (e: React.FormEvent<HTMLInputElement>) => void;
  placeholder?: string;
  disabled?: boolean;
  defaultValue?: string | number;
  rows?: number;
  cols?: number;
  autoFocus?: boolean;
  maxLength?: number;
  minLength?: number;
  readOnly?: boolean;
  required?: boolean;
}

export default function UncontrolledTextboxCore(props: Props) {
  const {
    props: tagProps,
    name,
    disabled,
    placeholder,
    defaultValue,
    onInput,
    onChange,
    rows,
    cols,
    autoFocus,
    maxLength,
    minLength,
    readOnly,
    required,
  } = props;

  const newTagProps = {
    ...tagProps,
    name,
    disabled,
    placeholder,
    onInput,
    onChange,
    defaultValue,
    rows,
    cols,
    autoFocus,
    maxLength,
    minLength,
    readOnly,
    required,
  } as BoxTagProps;

  return <Box tag="textarea" inline {...props} props={newTagProps} />;
}
