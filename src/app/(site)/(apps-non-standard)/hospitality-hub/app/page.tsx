import { Center } from "@chakra-ui/react";
import { HospitalityHubMasonry } from "./components/HospitalityHubMasonry";

export default function HospitalityHubPage() {
  return (
    <Center minH="100vh" w="100%" p={4}>
      <HospitalityHubMasonry />
    </Center>
  );
}
