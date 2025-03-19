import React, { useContext, useEffect } from 'react';
import PageContext from '../pageContext';

export default function usePageContext(el: React.ReactNode) {
  const { setRightSidebar } = useContext(PageContext);
  useEffect(() => {
    setRightSidebar(el);

    return () => setRightSidebar(null);
  }, []);
}
