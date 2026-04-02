import { useEffect } from 'react';

/**
 * Custom hook to set the document title dynamically.
 * @param {string} title - The title to set.
 */
export const usePageTitle = (title) => {
  useEffect(() => {
    const prevTitle = document.title;
    document.title = `${title} | BettingBread`;

    return () => {
      document.title = prevTitle;
    };
  }, [title]);
};
