import React, { createContext } from 'react';

interface PageContext {
  rightSidebar?: React.ReactNode;
  setRightSidebar(el: React.ReactNode): void;
}

const PageContext = createContext<PageContext>({
  setRightSidebar: (el: React.ReactNode) => {},
});

export default PageContext;
