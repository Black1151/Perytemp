import { Center } from "@chakra-ui/react";
import { HospitalityHubAdminClientInner } from "./components/HospitalityHubAdminClientInner";

export default function HospitalityHubAdminPage() {
  return (
    <Center minH="100vh" w="100%" p={4}>
      <HospitalityHubAdminClientInner />
    </Center>
  );
}
