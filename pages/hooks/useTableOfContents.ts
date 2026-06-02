import { useContext, useEffect } from 'react';
import PageContext, { TocEntry } from '../pageContext';

export default function useTableOfContents(entries: readonly TocEntry[]) {
  const { setTocEntries } = useContext(PageContext);

  useEffect(() => {
    setTocEntries(entries as TocEntry[]);
    return () => setTocEntries([]);
    // Run once on mount — `entries` is a fresh array each render and would otherwise loop.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
