import { useContext, useEffect } from 'react';
import PageContext, { TocEntry } from '../pageContext';

export default function useTableOfContents(entries: readonly TocEntry[]) {
  const { setTocEntries } = useContext(PageContext);

  useEffect(() => {
    setTocEntries(entries as TocEntry[]);
    return () => setTocEntries([]);
  }, []);
}
