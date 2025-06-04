"use client";

import React, { FC, useEffect, useState } from "react";
import { useBasket } from "./useBasket";
import {
  Tabs,
  TabList,
  Tab,
  Badge,
  Spinner,
  Flex,
  Text,
  Button,
  Box,
  HStack,
  useTheme,
} from "@chakra-ui/react";
import { PerygonModal } from "@/components/modals/PerygonModal";
import { useUser } from "@/providers/UserProvider";
import { useRouter } from "next/navigation";

const BillingCycleToggle: FC = () => {
  const { basket, loading, updateBasket } = useBasket();
  const [isSaving, setIsSaving] = useState(false);
  const user = useUser();
  const isUserFree = user?.user?.customerIsFree;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const theme = useTheme();
  const router = useRouter()

  // default to monthly if basket or flag is missing
  const isAnnual = Boolean(basket?.isAnnual);

  useEffect(() => {
    setIsSaving(false);
  }, [isModalOpen]);

  const handleChange = async (index: number) => {
    setIsSaving(true);
    if (!isUserFree) {
      setIsModalOpen(true);
      return;
    }
    const wantAnnual = index === 1;
    if (wantAnnual === isAnnual) return;

    try {
      await updateBasket({ isAnnual: wantAnnual });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      <PerygonModal
        title="Please Contact Sales"
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        body={
          <Box p={4} textAlign="center">
            <Text mb={8} color={theme.colors.primaryTextColor}>
              To change your billing cycle, please contact our sales team.
            </Text>
            <HStack spacing={2} mb={4} justify="center">
              <Button onClick={() => router.push("/tool-store/contact-sales")}>
                Contact Sales
              </Button>
              <Button onClick={() => setIsModalOpen(false)}>Close</Button>
            </HStack>
          </Box>
        }
      >
        <></>
      </PerygonModal>
      <Tabs
        index={isAnnual ? 1 : 0}
        onChange={handleChange}
        variant="line"
        isFitted
        borderRadius={"full"}
      >
        <TabList borderRadius={"full"}>
          <Tab
            isDisabled={loading || isSaving}
            borderRadius={"full"}
            borderWidth={1}
          >
            <Flex align="center" justify="center">
              <Text
                fontSize={["xs", "sm", "md"]}
                fontWeight={!isAnnual ? "bold" : "normal"}
              >
                Monthly
              </Text>
              {isSaving && isAnnual && <Spinner size="xs" ml={2} />}
            </Flex>
          </Tab>
          <Tab
            isDisabled={loading || isSaving}
            borderRadius={"full"}
            borderWidth={1}
            fontWeight={isAnnual ? "bold" : "normal"}
          >
            <Flex align="center" justify="center">
              <Text
                fontSize={["xs", "sm", "md"]}
                fontWeight={isAnnual ? "bold" : "normal"}
              >
                Annual
              </Text>
              {basket?.annualDiscountPercent && (
                <Badge ml={2} fontSize="xs" colorScheme="green">
                  SAVE {basket?.annualDiscountPercent}%
                </Badge>
              )}
              {isSaving && !isAnnual && <Spinner size="xs" ml={2} />}
            </Flex>
          </Tab>
        </TabList>
      </Tabs>
    </>
  );
};

export default BillingCycleToggle;
