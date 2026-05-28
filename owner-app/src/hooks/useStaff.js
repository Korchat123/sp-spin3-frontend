import { useState, useEffect, useCallback } from 'react';
import { getStaff, updateStaffStatus, inviteStaff } from '../api/staff';

export const useStaff = () => {
  const [staff, setStaff] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  const fetchStaff = useCallback(async () => {
    try {
      setIsLoading(true);
      setIsError(false);
      const data = await getStaff();
      setStaff(data ?? []);
    } catch {
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { fetchStaff(); }, [fetchStaff]);

  const toggleLock = async ({ id, isLocked }) => {
    await updateStaffStatus(id, isLocked);
    await fetchStaff();
  };

  const inviteStaffFn = async ({ email, role }) => {
    await inviteStaff(email, role);
    await fetchStaff();
  };

  return {
    staff,
    isLoading,
    isError,
    toggleLock,
    inviteStaff: inviteStaffFn,
  };
};
