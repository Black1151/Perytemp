import { useState, useEffect } from "react";
import { HospitalityItem } from "@/types/hospitalityHub";

export function useHospitalityItems(categoryKey?: string | null) {
  const [items, setItems] = useState<HospitalityItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchItems = async () => {
    if (!categoryKey) return;
    setLoading(true);
    try {
      const res = await fetch(
        `/api/hospitality-hub/category-items?hospitalityCatId=${categoryKey}`,
      );
      const data = await res.json();
      if (res.ok) {
        setItems(data.resource || []);
      } else {
        throw new Error(data?.error || "Failed to fetch items");
      }
    } catch (err: any) {
      console.error(err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categoryKey]);

  return { items, loading, error, refresh: fetchItems };
}

export default useHospitalityItems;
