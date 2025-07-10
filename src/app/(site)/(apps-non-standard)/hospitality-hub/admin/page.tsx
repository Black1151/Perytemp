import { HospitalityHubAdminClientInner } from "./components/HospitalityHubAdminClientInner";
import { Flex } from "@chakra-ui/react";

export default function HospitalityHubAdminPage() {
  return (
    <Flex w="100%" justify="center" px={4}>
      <HospitalityHubAdminClientInner />
    </Flex>
  );
}
