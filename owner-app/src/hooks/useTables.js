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

  useEffect(() => {
    const BASE_URL_RAW = import.meta.env.VITE_API_URL || 'http://localhost:3000'
    const BASE_URL = BASE_URL_RAW.endsWith('/api')
      ? BASE_URL_RAW.slice(0, -4)
      : BASE_URL_RAW.replace(/\/$/, '')
    const es = new EventSource(BASE_URL + '/api/tables/stream')
    es.onmessage = () => { fetchTables() }
    es.onerror = () => { es.close() }
    return () => { es.close() }
  }, [fetchTables])

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
