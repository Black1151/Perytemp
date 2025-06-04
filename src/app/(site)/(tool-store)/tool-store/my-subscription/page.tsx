"use client";

import React, { useEffect, useState } from "react";
import { BasketItem, useBasket, ToolConfig } from "../useBasket";
import {
  Flex,
  Text,
  Box,
  HStack,
  VStack,
  Button,
  Stack,
  useTheme,
  Image,
  SimpleGrid,
  Badge,
  Spinner,
} from "@chakra-ui/react";
import { transparentize } from "@chakra-ui/theme-tools";
import { useRouter } from "next/navigation";
import BillingCycleToggle from "../BillingCyleToggle";
import AnimatedTillNumber from "@/components/animations/AnimatedTillNumber";
import { useUser } from "@/providers/UserProvider";
import WarningIcon from "@mui/icons-material/Warning";
import BackButton from "@/components/BackButton";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import { Call, Close } from "@mui/icons-material";
import { Header } from "../Header";

export default function CurrentSubscriptionPage() {
  const { subscription, getSubscription, basket } = useBasket();
  const [noSubscription, setNoSubscription] = useState(true);
  const [loading, setLoading] = useState(false);
  const theme = useTheme();
  const user = useUser();
  const router = useRouter();

  const borderColor = "rgba(255, 255, 255, 0.65)";
  const cardBg = transparentize(theme.colors.elementBG, 0.95)(theme);
  const cardBgLighter = theme.colors.elementBG;

  useEffect(() => {
    setLoading(true);
    getSubscription().finally(() => setLoading(false));
  }, [basket]);

  if (loading) {
    return <Spinner />;
  }

  // don’t render until we know how many licenses we have
  if (subscription && subscription?.licensedUsers === undefined) {
    return null;
  }

  if (!subscription) {
    return (
      <VStack
        spacing={2}
        align="center"
        justify="center"
        w="100%"
        h="70vh"
        fontSize={[20, 20, 22, 24]}
        color={theme.colors.elementBG}
      >
        <WarningIcon color="inherit" fontSize="large" />
        <Text fontWeight="400">
          You don’t have an active paid subscription.
        </Text>
        <Text fontWeight="400" fontSize={[14, 14, 16, 18]}>
          Add some tools or user licenses to get started.
        </Text>
        <HStack spacing={1} fontSize="md" align="center" mt={4}>
          <Button onClick={() => router.push("/tool-store")}>
            Browse Tools
          </Button>
          <Button
            onClick={() => router.push("/tool-store/manage-subscription")}
          >
            Add Licenses
          </Button>
        </HStack>
      </VStack>
    );
  }

  return (
    <VStack spacing={0} align="center" justify="center" w="100%">
      <Header title="My Subscription" />

      <Flex
        direction={{ base: "column-reverse", lg: "column" }}
        gap={4}
        w="100%"
      >
        <Stack flex="1" spacing={4}>
          {subscription.ownedSubscriptionInfo.map((item) => (
            <HStack
              key={`config-${item.id}`}
              bg={cardBgLighter}
              borderColor={borderColor}
              borderRadius="md"
              boxShadow="sm"
              p={0}
              justify="space-between"
              align="stretch"
              spacing={4}
              overflow="hidden"
              w="full"
            >
              {/* Icon column */}
              <VStack
                bg={theme.colors.primary}
                p={4}
                flexShrink={0}
                minW="60px"
                align="center"
                justify="center"
              >
                {item.iconImageUrl && (
                  <Image
                    src={item.iconImageUrl}
                    alt={item.displayName}
                    boxSize="60px"
                    objectFit="contain"
                    borderRadius="md"
                    flexShrink={0}
                  />
                )}
              </VStack>

              <VStack flex="1" align="flex-start" spacing={0} p={4} minW={0}>
                <Text fontSize={[16, 18, 20]} fontWeight="semibold">
                  {item.displayName}
                </Text>
                <Text fontSize={[14, 16]} color="gray.500">
                  {subscription.licensedUsers} licenses
                </Text>
              </VStack>

              <VStack spacing={0} p={4} align="flex-end" justify="center">
                <HStack spacing={1} align="baseline">
                  <Text fontSize={[16, 18, 20]} fontWeight="semibold">
                    £{Number(item.itemGrandTotal).toFixed(2)}
                  </Text>
                  <Text fontSize={[12, 14, 16]} color="gray.500">
                    {subscription.isAnnual ? "/year" : "/month"}
                  </Text>
                </HStack>
                <Text fontSize={[14, 16]} color="gray.500">
                  £{(Number(item.itemGrandTotal) * 1.2).toFixed(2)} (incl. VAT)
                </Text>
              </VStack>
            </HStack>
          ))}
        </Stack>
        <Box
          bg={cardBg}
          borderWidth="1px"
          borderColor={borderColor}
          borderRadius="md"
          boxShadow="sm"
          p={6}
          flex="1"
        >
          {/* 2-column grid for Subtotal, Discounts, VAT, Total */}
          <SimpleGrid columns={2} spacingY={4} spacingX={6} mb={6} w="100%">
            {[
              {
                label: "Subtotal",
                value: subscription.totals.subtotal,
                isCurrency: true,
              },
              {
                label: "Discounts",
                value: subscription.totals.discountsTotal,
                isCurrency: true,
                isNegative: true,
              },
              {
                label: "VAT",
                value: subscription.totals.taxTotal,
                isCurrency: true,
              },
              {
                label: "Total",
                value: subscription.totals.grandTotal,
                isCurrency: true,
              },
            ].map(({ label, value, isCurrency, isNegative }) => (
              <Box
                key={label}
                borderBottom="inset"
                borderColor="gray.200"
                gridColumn="1 / span 2"
                display="contents"
              >
                <Text fontWeight="medium" color="gray.600">
                  {subscription.isAnnual ? "Annual " : "Monthly "}
                  {label}
                </Text>
                <Flex align="baseline" justify="flex-end">
                  <Text
                    fontSize={[16, 18, 20]}
                    fontWeight="semibold"
                    color={isNegative ? "green.600" : undefined}
                  >
                    {isNegative ? "-" : ""}
                    {isCurrency ? "£" : ""}
                    {Number(value).toFixed(2)}
                  </Text>
                </Flex>
              </Box>
            ))}
          </SimpleGrid>

          {/* Dates & licenses */}
          <Stack
            spacing={2}
            mb={6}
            direction={{ base: "column", md: "row" }}
            flexWrap="wrap"
            shouldWrapChildren
          >
            <Badge colorScheme="blue">
              Start Date:{" "}
              {new Date(subscription.updatedAt).toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
              })}
            </Badge>
            <Badge colorScheme="blue">
              Renewal Date:{" "}
              {subscription.renewalDate
              ? new Date(subscription.renewalDate).toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
                })
              : ""}
            </Badge>
            <Badge colorScheme="blue">Subscription ID: {subscription.id}</Badge>
          </Stack>

          {/* Action buttons */}
          <Stack direction={{ base: "column", md: "row" }} spacing={3}>
            <Button
              variant="outline"
              onClick={() => {
                if (subscription.invoiceUrl) {
                  window.open(
                    subscription.invoiceUrl,
                    "_blank",
                    "noopener,noreferrer"
                  );
                }
              }}
              rightIcon={<OpenInNewIcon fontSize="small" />}
            >
              Invoice
            </Button>
            <Button
              variant="outline"
              onClick={() => router.push("/tool-store/manage-subscription")}
            >
              Manage Subscription
            </Button>
            <Button
              variant="outline"
              disabled
              onClick={() => router.push("/tool-store/manage-subscription")}
            >
              Past Subscriptions
            </Button>
            <Button
              variant="outline"
              onClick={() => router.push("/tool-store/contact-sales")}
              rightIcon={<Call fontSize="small" />}
            >
              Contact Sales
            </Button>
            <Button
              rightIcon={<Close />}
              variant="outline"
              colorScheme="red"
              disabled
              onClick={() => router.push("/tool-store/manage-subscription")}
            >
              Cancel Subscription
            </Button>
          </Stack>
        </Box>
      </Flex>
    </VStack>
  );
}
