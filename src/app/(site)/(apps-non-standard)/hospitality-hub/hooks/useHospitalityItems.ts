import { useState, useEffect } from "react";
import { HospitalityItem } from "@/types/hospitalityHub";

export function useHospitalityItems(
  categoryKey?: string | null,
  locationLatLng?: { lat: number; lng: number } | null,
  radius?: number
) {
  const [items, setItems] = useState<HospitalityItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [lastApiResult, setLastApiResult] = useState<any>(null);

  const fetchItems = async () => {
    setLoading(true);
    try {
      let data;
      let res;
      if (locationLatLng && radius) {
        // Use new location-based endpoint
        res = await fetch("/api/hospitality-hub/itemsNearby", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            hospitalityCatId: categoryKey,
            centreLatitude: locationLatLng.lat,
            centreLongitude: locationLatLng.lng,
            radiusM: radius,
          }),
        });
        data = await res.json();
      } else {
        // Fallback to old endpoint
        let url = "/api/hospitality-hub/items";
        if (categoryKey) {
          url += `?hospitalityCatId=${categoryKey}`;
        }
        res = await fetch(url);
        data = await res.json();
      }
      setLastApiResult(data);
      if (res.ok && data.resource) {
        setItems(data.resource.filter((item: HospitalityItem) => item.isActive));
      } else {
        throw new Error(data?.error || "Failed to fetch items");
      }
    } catch (err: any) {
      console.error(err);
      setError(err);
      setLastApiResult(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categoryKey, locationLatLng?.lat, locationLatLng?.lng, radius]);

  return { items, loading, error, refresh: fetchItems, lastApiResult };
}

export default useHospitalityItems;
