"use client";

import React, { useEffect, useState } from "react";
import {
  Badge,
  Box,
  Button,
  Flex,
  HStack,
  Image,
  SimpleGrid,
  Spinner,
  Stack,
  Text,
  VStack,
  useTheme,
} from "@chakra-ui/react";
import WarningIcon from "@mui/icons-material/Warning";
import { Cancel } from "@mui/icons-material";
import { transparentize } from "@chakra-ui/theme-tools";
import { useRouter } from "next/navigation";

import { useBasket } from "../useBasket";
import BillingCycleToggle from "../BillingCyleToggle";
import { Header } from "../Header";
import { useFetchClient } from "@/hooks/useFetchClient";
import { SpringModal } from "@/components/modals/springModal/SpringModal";
import SubscriptionActions from "./subscriptionActions";

/* ------------------------------------------------------------------ */

export default function CurrentSubscriptionPage() {
  const { subscription, getSubscription, basket } = useBasket();
  const [loading, setLoading] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [cancelLoading, setCancelLoading] = useState(false);

  const theme = useTheme();
  const router = useRouter();
  const fetchClient = useFetchClient();

  const borderColor = "rgba(255, 255, 255, 0.65)";
  const cardBg = transparentize(theme.colors.elementBG, 0.95)(theme);
  const primaryTransparent = transparentize(theme.colors.primary, 1)(theme);

  /* fetch on mount / basket change */
  useEffect(() => {
    setLoading(true);
    getSubscription().finally(() => setLoading(false));
  }, [basket]);

  /* cancel handler */
  const handleCancel = async () => {
    setCancelLoading(true);
    const resp = await fetchClient.fetchClient<{ resource?: string }>(
      "/api/checkout/cancel",
      { method: "POST" }
    );
    if (resp?.resource === "success") {
      await getSubscription();
      router.push("/tool-store");
    }
    setCancelLoading(false);
  };

  /* loading / empty */
  if (loading) return <Spinner />;
  if (!subscription) {
    return (
      <VStack h="70vh" justify="center" spacing={4} color={theme.colors.primaryTextColor}>
        <WarningIcon fontSize="large" />
        <Text fontSize={{ base: "lg", md: "xl" }}>
          No active subscription found.
        </Text>
        <HStack>
          <Button onClick={() => router.push("/tool-store")}>
            Browse Tools
          </Button>
          <Button
            onClick={() => router.push("/tool-store/manage-subscription")}
          >
            Add Licences
          </Button>
        </HStack>
      </VStack>
    );
  }

  /* helpers */
  const { subtotal, discountsTotal, taxTotal, grandTotal } =
    subscription.totals;

  /* render */
  return (
    <VStack w="full" spacing={0}>
      <Header title="My Subscription" />

      <Flex
        direction={{ base: "column-reverse", lg: "row-reverse" }}
        gap={4}
        w="full"
      >
        {/* ——— Tool rows ——— */}
        <Stack flex="1" spacing={3}>
          {subscription.ownedSubscriptionInfo.map((item, idx) => (
            <Flex
              key={item.id}
              align="center"
              bg={theme.colors.elementBG}
              rounded="md"
              shadow="sm"
              px={3}
              py={3}
              color={theme.colors.primaryTextColor}
            >
              {/* icon */}
              <Flex
                bg={theme.colors.primary}
                boxSize="64px"
                borderRadius="md"
                align="center"
                justify="center"
                mr={4}
                flexShrink={0}
              >
                {item.iconImageUrl && (
                  <Image
                    src={item.iconImageUrl}
                    alt={item.displayName}
                    boxSize="52px"
                    objectFit="fill"
                  />
                )}
              </Flex>

              {/* name + licences */}
              <Box flex="1">
                <Text fontWeight="semibold" fontSize={{ base: "md", md: "lg" }}>
                  {item.displayName}
                </Text>
                <Text fontSize={{ base: "sm", md: "md" }} color={theme.colors.secondaryTextColor}>
                  {subscription.licensedUsers} licences
                </Text>
              </Box>

              {/* price */}
              <Box textAlign="right">
                <Text fontWeight="semibold" fontSize={{ base: "md", md: "lg" }}>
                  £{Number(item.itemGrandTotal).toFixed(2)}
                  <Text
                    as="span"
                    fontSize={{ base: "sm", md: "md" }}
                    color={theme.colors.secondaryTextColor}
                  >
                    /{subscription.isAnnual ? "yr" : "mo"}
                  </Text>
                </Text>
                <Text fontSize={{ base: "sm", md: "md" }} color={theme.colors.secondaryTextColor}>
                  £{(Number(item.itemGrandTotal) * 1.2).toFixed(2)} (incl. VAT)
                </Text>
              </Box>
            </Flex>
          ))}
        </Stack>

        <VStack gap={4} h={"min"}>
          {/* ——— Totals card ——— */}
          <Box
            bg={theme.colors.elementBG}
            borderWidth="1px"
            borderColor={borderColor}
            borderRadius="md"
            boxShadow="sm"
            p={5}
            h={"min"}
            flex="1"
            w="full"
          >
            <SimpleGrid columns={2} spacingY={4} spacingX={6} mb={5}>
              {subtotal !== "0" && (
                <>
                  <Text fontSize={{ base: "sm", md: "md" }} color={theme.colors.secondaryTextColor}>
                    {subscription.isAnnual ? "Annual" : "Monthly"} Subtotal
                  </Text>
                  <Text textAlign="right" fontSize={{ base: "md", md: "lg" }} color={theme.colors.primaryTextColor}>
                    £{Number(subtotal).toFixed(2)}
                  </Text>
                </>
              )}
              {discountsTotal !== "0" && (
                <>
                  <Text fontSize={{ base: "sm", md: "md" }} color={theme.colors.primaryTextColor}>
                    Discounts
                  </Text>
                  <Text
                    textAlign="right"
                    fontSize={{ base: "md", md: "lg" }}
                    color="green.600"
                  >
                    -£{Number(discountsTotal).toFixed(2)}
                  </Text>
                </>
              )}
              {taxTotal !== "0" && (
                <>
                  <Text fontSize={{ base: "sm", md: "md" }} color={theme.colors.primaryTextColor}>
                    VAT
                  </Text>
                  <Text textAlign="right" fontSize={{ base: "md", md: "lg" }} color={theme.colors.primaryTextColor}>
                    £{Number(taxTotal).toFixed(2)}
                  </Text>
                </>
              )}
              <Text fontWeight="medium" fontSize={{ base: "sm", md: "md" }} color={theme.colors.primaryTextColor}>
                Total
              </Text>
              <Text
                fontWeight="bold"
                textAlign="right"
                fontSize={{ base: "lg", md: "xl" }}
                color={theme.colors.primaryTextColor}
              >
                £{Number(grandTotal).toFixed(2)}
              </Text>
            </SimpleGrid>

            {/* dates */}
            <HStack
              spacing={3}
              pb={4}
              flexWrap="wrap"
              fontSize={{ base: "xs", md: "sm" }}
              color="gray.600"
            >
              <Badge colorScheme="blue">
                Start:{" "}
                {new Date(subscription.updatedAt).toLocaleDateString("en-GB")}
              </Badge>
              {subscription.renewalDate && (
                <Badge colorScheme="blue">
                  Renewal:{" "}
                  {new Date(subscription.renewalDate).toLocaleDateString(
                    "en-GB"
                  )}
                </Badge>
              )}
              <Badge colorScheme="blue">
                ID: {subscription.uniqueId?.slice(0, 6)}
              </Badge>
            </HStack>
          </Box>

          {/* action buttons */}
          <Box
            bg={theme.colors.elementBG}
            borderWidth="1px"
            borderColor={borderColor}
            borderRadius="md"
            boxShadow="sm"
            p={5}
            h={"min"}
            flex="1"
            w="full"
          >
            <SubscriptionActions
              subscription={subscription}
              onOpenCancel={() => setIsCancelModalOpen(true)}
            />
          </Box>
        </VStack>
      </Flex>

      {/* modal */}
      <SpringModal
        bgIcon={<Cancel fontSize="inherit" />}
        frontIcon={<Cancel fontSize="inherit" />}
        header="Cancel Subscription?"
        body="Are you sure you want to cancel?  You will lose access to your tools and licences."
        isOpen={isCancelModalOpen}
        showClose={false}
        primaryLabel="No, keep it"
        onPrimaryClick={() => setIsCancelModalOpen(false)}
        secondaryLabel="Yes, cancel"
        onSecondaryClick={handleCancel}
        isSecondaryLoading={cancelLoading}
        onClose={() => setIsCancelModalOpen(false)}
        bg="red.600"
      />
    </VStack>
  );
}
