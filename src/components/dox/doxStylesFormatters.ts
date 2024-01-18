export namespace DoxStylesFormatters {
  export namespace ClassName {
    export function fraction(key: string, value: string | number | boolean) {
      return `${key}${(value as string).replace('/', '-')}`;
    }
  }

  export namespace Value {
    export function rem(_key: string, value: string | number | boolean) {
      return `${(value as number) / 4}rem`;
    }
    export function px(_key: string, value: string | number | boolean) {
      return `${value}px`;
    }
    export function fraction(_key: string, value: string | number | boolean) {
      const [a, b] = (value as string).split('/');
      return `${(+a / +b) * 100}%`;
    }
    export function widthHeight(key: string, value: string | number | boolean) {
      switch (value) {
        case 'fit':
          return '100%';
        case 'fit-screen':
          return key.toLocaleLowerCase().includes('height') ? '100vh' : '100vw';
        default:
          return value as string;
      }
    }
    export function variables(prefix: string) {
      return (key: string, value: string | number | boolean) => `var(--${prefix}${value});`;
    }
    export function gridColumns(key: string, value: string | number | boolean) {
      return `repeat(${value},minmax(0,1fr))`;
    }
    export function gridColumn(key: string, value: string | number | boolean) {
      if (value === 'full-row') {
        return '1/-1';
      }

      return `span ${value}/span ${value}`;
    }
    export function ms(key: string, value: string | number | boolean) {
      return `${value}ms`;
    }
  }
}
