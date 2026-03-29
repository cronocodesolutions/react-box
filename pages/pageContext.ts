import { createContext } from 'react';

export type TocEntry = { id: string; label: string } | { label: string; section: true };

interface PageContext {
  tocEntries: TocEntry[];
  setTocEntries(entries: TocEntry[]): void;
}

const PageContext = createContext<PageContext>({
  tocEntries: [],
  setTocEntries: () => {},
});

export default PageContext;
