import { useCallback, useRef } from 'react';
import Box from '../../box';

interface Props<T> {
  children: React.ReactNode;
  onSubmit: (obj: T, e: React.FormEvent<HTMLFormElement>) => void;
}

export default function FormAsync<T>(props: Props<T>) {
  const { children, onSubmit } = props;
  const formRef = useRef(null);

  const formSubmitHandler = useCallback((e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const data = new FormData(formRef.current!);
    const obj = Object.fromEntries(data.entries()) as T;

    onSubmit(obj, e);
  }, []);

  return (
    <Box tag="form" props={{ ref: formRef, onSubmit: formSubmitHandler }}>
      {children}
    </Box>
  );
}
