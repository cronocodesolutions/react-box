import { useCallback, useRef } from 'react';
import Box from '../../box';
import FormUtils from '../../utils/form/formUtils';

type BoxProps = React.ComponentProps<typeof Box<'form'>>;
type BoxTagProps = Required<BoxProps>['props'];

type FormAsyncTagProps = Omit<BoxTagProps, 'onSubmit' | 'ref'>;

interface Props<T> extends Omit<BoxProps, 'props' | 'tag'> {
  props?: FormAsyncTagProps;
  onSubmit: (obj: T, e: React.ChangeEvent<HTMLFormElement>) => void;
}

export default function FormAsync<T>(props: Props<T>) {
  const { onSubmit, props: tagProps } = props;
  const formRef = useRef(null);

  const formSubmitHandler = useCallback((e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();

    const obj = FormUtils.getFormEntries(formRef.current!);

    onSubmit(obj as T, e);
  }, []);

  const newTagProps = { ...tagProps, onSubmit: formSubmitHandler, ref: formRef } as BoxTagProps;

  return <Box tag="form" {...props} props={newTagProps} />;
}
