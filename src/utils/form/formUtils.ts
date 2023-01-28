type FormValueType = string | string[] | number | number[] | boolean;

namespace FormUtils {
  export function getFormEntries(form: HTMLFormElement) {
    const elementsGroupByName = Array.from(form.elements).reduce((state, element) => {
      const name = (element as HTMLInputElement).name;
      if (!name) {
        return state;
      }

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
    }, {} as Record<string, FormValueType>);
  }
}

export default FormUtils;
