import { useState, useEffect } from 'react';
import { getDashboardSummary } from '../api/dashboard';

export const useDashboard = (period = 'week') => {
  const [summary, setSummary] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const fetch = async () => {
      try {
        setIsLoading(true);
        setIsError(false);
        const data = await getDashboardSummary(period);
        if (!cancelled) setSummary(data);
      } catch {
        if (!cancelled) setIsError(true);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };
    fetch();
    return () => { cancelled = true; };
  }, [period]);

  return { summary, isLoading, isError };
};
