namespace ClassNameUtils {
  export type ClassNameType = undefined | string | string[] | Record<string, boolean> | ClassNameType[];

  export function classNames(...classNameRules: ClassNameType[]): string[] {
    return classNameRules.reduce<string[]>((names, classNameRule) => {
      if (!classNameRule) {
        return names;
      }

      if (typeof classNameRule === 'string') {
        names.push(classNameRule);

        return names;
      }

      if (Array.isArray(classNameRule)) {
        names.push(...classNames(...classNameRule));

        return names;
      }

      Object.entries(classNameRule).forEach(([name, condition]) => {
        condition && names.push(name);
      });

      return names;
    }, []);
  }
}

export default ClassNameUtils;
