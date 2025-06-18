import { Center } from "@chakra-ui/react";
import { HospitalityHubMasonry } from "./components/HospitalityHubMasonry";
import apiClient from "@/lib/apiClient";
import { HospitalityCategory } from "@/types/hospitalityHub";

export const dynamic = "force-dynamic";

export default async function HospitalityHubPage() {
  let initialCategories: HospitalityCategory[] = [];
  try {
    const res = await apiClient("/userHospitalityCategory/allBy", {
      method: "GET",
      cache: "no-store",
    });
    const data = await res.json();
    if (res.ok) {
      const fetched: HospitalityCategory[] = data.resource || [];
      initialCategories = fetched.filter((cat) => cat.isActive);
    }
  } catch (err) {
    console.error("Failed to fetch categories", err);
  }

  return (
    <Center minH="100vh" w="100%" p={4}>
      <HospitalityHubMasonry initialCategories={initialCategories} />
    </Center>
  );
}
