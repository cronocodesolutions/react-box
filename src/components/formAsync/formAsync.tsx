import { useCallback, useRef } from 'react';
import Box from '../../box';

interface Props<T> {
  children: React.ReactNode;
  onSubmit: (obj: T, e: React.FormEvent<HTMLFormElement>) => void;
}

type ValueType = string | string[] | number | number[] | boolean;

function getFormEntries(form: HTMLFormElement) {
  const elementsGroupByName = Array.from(form.elements).reduce((state, element) => {
    const name = (element as HTMLInputElement).name;

    if (!state[name]) {
      state[name] = [];
    }

    state[name].push(element as HTMLInputElement);

    return state;
  }, {} as Record<string, HTMLInputElement[]>);

  return Object.entries(elementsGroupByName).reduce((obj, [name, elements]) => {
    if (elements.length === 1) {
      const el = elements[0];

      obj[name] = el.type === 'checkbox' || el.type === 'radio' ? el.checked : el.value;
    } else {
      obj[name] = [];

      elements.forEach((el) => {
        if (el.type === 'checkbox') {
          if (el.checked) {
            (obj[name] as string[]).push(el.value);
          }
        } else if (el.type === 'radio') {
          (obj[name] as any) = elements.find((e) => e.checked)?.value;
        } else {
          (obj[name] as string[]).push(el.value);
        }
      });
    }

    return obj;
  }, {} as Record<string, ValueType>);
}

export default function FormAsync<T>(props: Props<T>) {
  const { children, onSubmit } = props;
  const formRef = useRef(null);

  const formSubmitHandler = useCallback((e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const obj = getFormEntries(formRef.current!);

    onSubmit(obj as T, e);
  }, []);

  return (
    <Box tag="form" props={{ ref: formRef, onSubmit: formSubmitHandler }}>
      {children}
    </Box>
  );
}
