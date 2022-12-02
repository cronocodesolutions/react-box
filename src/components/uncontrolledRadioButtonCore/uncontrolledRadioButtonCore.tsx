import Box from '../../box';

type BoxProps = React.ComponentProps<typeof Box<'input'>>;
type BoxTagProps = Required<BoxProps>['props'];

type UncontrolledRadioButtonCoreTagProps = Omit<
  BoxTagProps,
  'name' | 'onInput' | 'onChange' | 'type' | 'placeholder' | 'disabled' | 'value' | 'autoFocus' | 'readOnly' | 'required' | 'defaultChecked'
>;

interface Props extends Omit<BoxProps, 'props'> {
  name: string;
  props?: UncontrolledRadioButtonCoreTagProps;
  onInput?: (e: React.FormEvent<HTMLInputElement>) => void;
  onChange?: (e: React.FormEvent<HTMLInputElement>) => void;
  placeholder?: string;
  disabled?: boolean;
  value?: string | number;
  autoFocus?: boolean;
  readOnly?: boolean;
  required?: boolean;
  defaultChecked?: boolean;
}

export default function UncontrolledRadioButtonCore(props: Props) {
  const { props: tagProps, name, disabled, placeholder, value, onInput, onChange, autoFocus, readOnly, required, defaultChecked } = props;

  const newTagProps = {
    ...tagProps,
    type: 'radio',
    name,
    disabled,
    placeholder,
    onInput,
    onChange,
    value,
    autoFocus,
    readOnly,
    required,
    defaultChecked,
  } as BoxTagProps;

  return <Box tag="input" inline {...props} props={newTagProps} />;
}
