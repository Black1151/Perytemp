// components/HospitalityHubAdminClientInner.tsx
"use client";

import { useState, useEffect } from "react";
import {
  VStack,
  Text,
  Tabs,
  TabPanels,
  TabPanel,
  Flex,
  Box,
} from "@chakra-ui/react";
import { useBreakpointValue } from "@chakra-ui/react";
import AnalyticsDashboard from "./AnalyticsDashboard";
import BookingsDashboard from "./BookingsDashboard";
import ManagementDashboard from "./ManagementDashboard";
import BackButton from "@/components/BackButton";
import { AdminTabList } from "./tabs/AdminTabList";
import { useSearchParams, useRouter } from "next/navigation";

export const HospitalityHubAdminClientInner: React.FC = () => {
  // Tab name/index mapping
  const tabNameToIndex: Record<string, number> = {
    management: 0,
    analytics: 1,
    bookings: 2,
  };
  const indexToTabName = ["management", "analytics", "bookings"];

  const searchParams = useSearchParams();
  const router = useRouter();

  // Helper type guard
  function isTabKey(key: string | null): key is keyof typeof tabNameToIndex {
    return (
      key !== null && Object.prototype.hasOwnProperty.call(tabNameToIndex, key)
    );
  }

  const tabParam = searchParams.get("tab");
  const initialTabIndex = isTabKey(tabParam) ? tabNameToIndex[tabParam] : 0;
  const [tabIndex, setTabIndex] = useState(initialTabIndex);

  // Sync tabIndex with tab param in URL
  useEffect(() => {
    if (isTabKey(tabParam) && tabNameToIndex[tabParam] !== tabIndex) {
      setTabIndex(tabNameToIndex[tabParam]);
    }
    // If tab param is missing, reset to 0
    if (!tabParam && tabIndex !== 0) {
      setTabIndex(0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tabParam]);

  // Update URL when tab changes
  const handleTabChange = (index: number) => {
    setTabIndex(index);
    const tabName = indexToTabName[index];
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", tabName);
    router.replace(`?${params.toString()}`);
  };

  return (
    <VStack
      w="100%"
      spacing={0}
      align="stretch"
      flex={1}
      overflow="hidden"
      pt={20}
      pb={[4, 4, 0]}
      // px={[3, 2, 2]}
      maxW={"2000px"}
    >
      <Flex
        direction={["column", "column", "row"]}
        w="100%"
        gap={[0, 0, 4]}
        mb={[2, 4]}
        justifyContent="space-between"
      >
        <Flex align="center" gap={2} mb={2}>
          <BackButton
            color="white"
            iconSize={
              useBreakpointValue({ base: "medium", md: "large" }) as
                | "medium"
                | "large"
            }
          />
          <Text
            fontFamily="bonfire"
            fontSize={["2xl", "4xl", "3xl", "4xl"]}
            textAlign={"left"}
            color="white"
            flex={1}
            mb={-2}
          >
            Hospitality Hub Admin
          </Text>
        </Flex>

        {/* Abstracted Tab List */}
        <AdminTabList tabIndex={tabIndex} setTabIndex={setTabIndex} />
      </Flex>

      <Tabs
        index={tabIndex}
        onChange={handleTabChange}
        colorScheme="blue"
        variant="unstyled"
        mt={2}
        h="100%"
        flex={1}
        display="flex"
        overflow="hidden"
      >
        <TabPanels h="100%" flex={1} overflow="hidden">
          <TabPanel
            px={0}
            py={0}
            h="100%"
            flex={1}
            overflow="hidden"
            display="flex"
          >
            <Box w="100%" h="100%" flex={1} overflow="hidden" display="flex">
              <ManagementDashboard />
            </Box>
          </TabPanel>
          <TabPanel px={0} py={0}>
            <AnalyticsDashboard />
          </TabPanel>
          <TabPanel px={0} py={0}>
            <BookingsDashboard />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </VStack>
  );
};

export default HospitalityHubAdminClientInner;
