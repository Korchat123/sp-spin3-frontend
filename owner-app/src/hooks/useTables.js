import { useState, useEffect } from 'react';
import { getTables } from '../api/tables';

export const useTables = () => {
  const [tables, setTables] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const fetch = async () => {
      try {
        setIsLoading(true);
        setIsError(false);
        const data = await getTables();
        if (!cancelled) setTables(data ?? []);
      } catch {
        if (!cancelled) setIsError(true);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };
    fetch();
    return () => { cancelled = true; };
  }, []);

  return { tables, isLoading, isError };
};
