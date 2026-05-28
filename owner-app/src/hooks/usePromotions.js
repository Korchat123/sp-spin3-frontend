import { useState, useEffect, useCallback } from 'react';
import { getPromotions, updatePromotion, deletePromotion } from '../api/promotions';

export const usePromotions = () => {
  const [promotions, setPromotions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  const fetchPromotions = useCallback(async () => {
    try {
      setIsLoading(true);
      setIsError(false);
      const data = await getPromotions();
      setPromotions(data ?? []);
    } catch {
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { fetchPromotions(); }, [fetchPromotions]);

  const updatePromotionFn = async ({ id, updates }) => {
    await updatePromotion(id, updates);
    await fetchPromotions();
  };

  const deletePromotionFn = async (id) => {
    await deletePromotion(id);
    await fetchPromotions();
  };

  return {
    promotions,
    isLoading,
    isError,
    updatePromotion: updatePromotionFn,
    deletePromotion: deletePromotionFn,
  };
};
