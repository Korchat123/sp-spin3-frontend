import { useCallback, useEffect, useState } from 'react';
import { createTable, getTables, updateTable } from '../api/tables';

export const useTables = () => {
  const [tables, setTables] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  const fetchTables = useCallback(async () => {
    try {
      setIsLoading(true);
      setIsError(false);
      const data = await getTables();
      setTables(Array.isArray(data) ? data : []);
    } catch {
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { fetchTables(); }, [fetchTables]);

  const updateTableStatus = async ({ id, status }) => {
    await updateTable(id, { status });
    await fetchTables();
  };

  const addTable = async (table) => {
    await createTable(table);
    await fetchTables();
  };

  return { tables, isLoading, isError, updateTableStatus, addTable, refetch: fetchTables };
};
