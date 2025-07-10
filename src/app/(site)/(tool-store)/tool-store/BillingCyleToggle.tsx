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
import { SpringModal } from "@/components/modals/springModal/SpringModal";
import { useUser } from "@/providers/UserProvider";
import { useRouter } from "next/navigation";
import { Message, Phone, Send, Sms } from "@mui/icons-material";

const BillingCycleToggle: FC = () => {
  const { basket, loading, updateBasket } = useBasket();
  const [isSaving, setIsSaving] = useState(false);
  const user = useUser();
  const isUserFree = user?.user?.customerIsFree;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const theme = useTheme();
  const router = useRouter();

  // default to monthly if basket or flag is missing
  const isAnnual = Boolean(basket?.isAnnual);

  useEffect(() => {
    // Reset saving state whenever the modal closes
    if (!isModalOpen) {
      setIsSaving(false);
    }
  }, [isModalOpen]);

  const handleChange = async (index: number) => {
    setIsSaving(true);

    // If user is not on a free plan, pop up the “contact sales” modal
    if (!isUserFree) {
      setIsModalOpen(true);
      return;
    }

    const wantAnnual = index === 1;
    if (wantAnnual === isAnnual) {
      setIsSaving(false);
      return;
    }

    try {
      await updateBasket({ isAnnual: wantAnnual });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      <SpringModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        bgIcon={<Message fontSize="inherit"/>}
        frontIcon={<Phone fontSize="inherit"/>}
        header="Please Contact Sales"
        body={
              "To change your billing cycle, please contact our sales team."
        }
        primaryLabel="Contact Sales Team"
        onPrimaryClick={() => router.push("/tool-store/contact-sales")}
        bg={theme.colors.primary}
        showClose={true}
      />

      <Tabs
        index={isAnnual ? 1 : 0}
        onChange={handleChange}
        variant="line"
        isFitted
        borderRadius="full"
        color={theme.colors.primaryTextColor}
      >
        <TabList borderRadius="full">
          <Tab
            isDisabled={loading || isSaving}
            borderRadius="full"
            borderWidth={1}
          >
            <Flex align="center" justify="center">
              <Text
                fontSize={["xs", "sm", "md"]}
                fontWeight={!isAnnual ? "extrabold" : "normal"}
                color={theme.colors.primaryTextColor}
              >
                Monthly
              </Text>
              {isSaving && isAnnual && <Spinner size="xs" ml={2} />}
            </Flex>
          </Tab>
          <Tab
            isDisabled={loading || isSaving}
            borderRadius="full"
            borderWidth={1}
          >
            <Flex align="center" justify="center">
              <Text
                fontSize={["xs", "sm", "md"]}
                fontWeight={isAnnual ? "extrabold" : "normal"}
                color={theme.colors.primaryTextColor}
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