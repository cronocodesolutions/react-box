export function searchItemText(item: React.ReactElement): string {
  if (item === null || item === undefined) return '';

  if (typeof item === 'object') {
    const children = item.props?.children;

    if (children === null || children === undefined) return '';

    if (typeof children === 'object') {
      const arr: React.ReactElement[] = Array.isArray(children) ? children : [children];

      return arr.map((i) => searchItemText(i)).join('');
    }

    return children.toString();
  }

  return (item as string).toString();
}
