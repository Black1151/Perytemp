import { useEffect, useState } from 'react';
import { HospitalityItem } from '../hospitalityHubConfig';

export const useHospitalityItems = (category: string | null) => {
  const [items, setItems] = useState<HospitalityItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!category) {
      setItems([]);
      return;
    }

    const fetchItems = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/hospitality-hub/${category}`);
        const data = await res.json();
        if (res.ok) {
          setItems(data.resource || []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, [category]);

  return { items, loading };
};

export default useHospitalityItems;
