import { useState, useEffect, useCallback } from 'react';
import { getMenu, patchMenuItemAvailability } from '../api/menu';

export const useMenu = () => {
  const [menu, setMenu] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  const fetchMenu = useCallback(async () => {
    try {
      setIsLoading(true);
      setIsError(false);
      const data = await getMenu();
      setMenu(data ?? []);
    } catch {
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { fetchMenu(); }, [fetchMenu]);

  const toggleAvailability = async ({ id, available }) => {
    await patchMenuItemAvailability(id, available);
    await fetchMenu();
  };

  return { menu, isLoading, isError, toggleAvailability };
};
