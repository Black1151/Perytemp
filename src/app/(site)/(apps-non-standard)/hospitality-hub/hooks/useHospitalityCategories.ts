import { useState, useEffect } from "react";
import { HospitalityCategory } from "@/types/hospitalityHub";

export function useHospitalityCategories(initialCategories: HospitalityCategory[] = []) {
  const [categories, setCategories] = useState<HospitalityCategory[]>(initialCategories);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/hospitality-hub/categories');
      const data = await res.json();
      if (res.ok) {
        setCategories(data.resource || []);
      } else {
        throw new Error(data?.error || 'Failed to fetch categories');
      }
    } catch (err: any) {
      console.error(err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return { categories, loading, error, refresh: fetchCategories };
}

export default useHospitalityCategories;
