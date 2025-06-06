import { useState, useEffect } from 'react';
import { HospitalityItem } from '@/types/hospitalityHub';

export function useHospitalityItems(categoryKey?: string | null) {
  const [items, setItems] = useState<HospitalityItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!categoryKey) return;

    const fetchItems = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/hospitality-hub/${categoryKey}`);
        const data = await res.json();
        if (res.ok) {
          setItems(data.resource || []);
        } else {
          throw new Error(data?.error || 'Failed to fetch items');
        }
      } catch (err: any) {
        console.error(err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, [categoryKey]);

  return { items, loading, error };
}

export default useHospitalityItems;
