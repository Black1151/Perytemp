"use client";

import React, { useRef, useEffect, useState } from "react";
import { useBasket, BasketItem, SubscriptionInfo } from "../useBasket";
import {
  Flex,
  Text,
  Box,
  HStack,
  VStack,
  Button,
  Stack,
  useTheme,
  useToast,
  IconButton,
  useBreakpointValue,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  useDisclosure,
  Spinner,
  Slide,
  ModalContent,
  Modal,
} from "@chakra-ui/react";
import { transparentize } from "@chakra-ui/theme-tools";
import { Check, Close } from "@mui/icons-material";
import AnimatedTillNumber from "@/components/animations/AnimatedTillNumber";
import BasketItemCard from "./BasketItemCard";
import ToolSelectedIndicators from "./ToolSelectedIndicators";
import LicenseAmountIndicator from "./LicenseAmountIndicator";
import { subscriptionLimits } from "@/utils/constants/subscriptionLimits";
import { PerygonModal } from "@/components/modals/PerygonModal";
import ToolInfoCard from "./ToolInfoCard";
import LicensePicker from "../LicensePicker";
import BillingAddressForm, {
  BillingAddressFormHandle,
} from "./BillingAddressForm";
import { useRouter } from "next/navigation";
import { Header } from "../Header";
import { useUser } from "@/providers/UserProvider";

export default function BasketPage() {
  const {
    basket,
    clearBasket,
    getBasket,
    removeItemFromBasket,
    addVoucher,
    error,
  } = useBasket();
  const router = useRouter();
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [addingVoucher, setAddingVoucher] = useState(false);
  const isMobile = useBreakpointValue({ base: true, lg: false });
  const billingRef = useRef<BillingAddressFormHandle>(null);
  const [removingIds, setRemovingIds] = useState<Set<string>>(new Set());
  const user = useUser();

  // Drawers for mobile
  const voucherDrawer = useDisclosure();
  const billingDrawer = useDisclosure();

  const theme = useTheme();
  const cardBg = transparentize(theme.colors.elementBG, 1)(theme);

  // ----- Basket data parsing -----
  const newItems: BasketItem[] = React.useMemo(() => {
    setLoading(true);
    if (!basket) return [];
    return Array.isArray(basket.content)
      ? basket.content.filter(
          (item): item is BasketItem => "basketUniqueId" in item
        )
      : [];
  }, [basket]);

  const oldItems: SubscriptionInfo[] = React.useMemo(() => {
    setLoading(true);
    if (!basket) return [];
    return Array.isArray(basket.ownedSubscriptionInfo)
      ? basket.ownedSubscriptionInfo.filter(
          (item): item is SubscriptionInfo => "name" in item
        )
      : [];
  }, [basket]);

  useEffect(() => {
    if (error) {
      toast({
        title: "Error",
        description: "Failed to load basket. Please reload the page.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
    if (basket) {
      setLoading(false);
    } else {
      getBasket();
    }
  }, [basket, error]);

  if (basket?.licensedUsers === undefined) {
    return null;
  }

  const handleRemove = async (uniqueId: string) => {
    setRemovingIds((prev) => {
      const next = new Set(prev);
      next.add(uniqueId);
      return next;
    });
    try {
      await removeItemFromBasket(uniqueId);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to remove item.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setRemovingIds((prev) => {
        const next = new Set(prev);
        next.delete(uniqueId);
        return next;
      });
    }
  };

  const handleClearBasket = async () => {
    setLoading(true);
    try {
      await clearBasket();
      toast({
        title: "Basket cleared",
        description: "Your basket has been cleared.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to clear basket.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCheckout = async () => {
    setCheckoutLoading(true);

    const addr = billingRef.current?.getAddress();
    if (!addr) {
      toast({
        title: "Error",
        description: "Please fill in your billing address.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      setCheckoutLoading(false);
      return;
    }

    const payload = {
      address: {
        line1: addr.address1,
        city: addr.city,
        postalCode: addr.postcode,
        country: addr.country,
      },
    };

    try {
      const response = await fetch("/api/basket/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to create basket.");
      }

      const redirectUrl = data?.resource?.original?.redirectUrl;
      if (redirectUrl) {
        window.open(redirectUrl);
      } else {
        toast({
          title: "Error",
          description: "No redirect URL received from server.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
      return data;
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setCheckoutLoading(false);
    }
  };

  return (
    <VStack spacing={0} align="center" justify="center" w="100%">
      <Header title="Manage Subscription" />

      {basket.totals ? (
        <Flex
          direction={{ base: "column-reverse", lg: "row" }}
          gap={4}
          w="100%"
        >
          {/* Left: Items */}
          <Stack flex="1" spacing={4}>
            <LicensePicker />

            {oldItems
              .filter(
                (item) =>
                  !newItems.some(
                    (newItem) =>
                      newItem.toolConfigUniqueId === item.uniqueId ||
                      newItem.id === item.id
                  )
              )
              .map((item) => (
                <ToolInfoCard
                  key={item.uniqueId}
                  info={item}
                  licensedUsers={basket.licensedUsers}
                  isNew={false}
                />
              ))}

            {newItems.length === 0 ? (
              <Box p={6} bg={cardBg} borderRadius="md" boxShadow="sm">
                <Text>You have no changes made to your subscription</Text>
              </Box>
            ) : (
              newItems.map((item) => (
                <BasketItemCard
                  key={item.basketUniqueId}
                  item={item}
                  removingIds={removingIds}
                  licensedUsers={basket.quantity}
                  isNew={!oldItems.some((sub) => sub.id === item.toolConfig.id)}
                  handleRemove={handleRemove}
                />
              ))
            )}
          </Stack>

          {/* Right: Totals & Controls */}
          <Box w={{ base: "100%", lg: "400px" }} gap={4}>
            <Box bg="white" borderRadius="lg" boxShadow="sm" p={6} mb={4}>
              {/* Totals */}
              <HStack justify="space-between" mb={4}>
                <Text fontSize={[14, 18]} fontWeight="semibold">
                  Subscription Totals
                </Text>
              </HStack>
              <Stack spacing={2} mb={4}>
                <HStack justify="space-between">
                  <Text>{basket.isAnnual ? "Yearly" : "Monthly"} Total</Text>
                  <HStack spacing={1} fontSize="md">
                    <Text>£</Text>
                    <AnimatedTillNumber
                      value={parseFloat(basket.totals.subtotal)}
                      fontSize="md"
                      duration={0.65}
                    />
                  </HStack>
                </HStack>
                {parseFloat(basket.totals.discountsTotal) > 0 && (
                  <HStack justify="space-between">
                    <Text>Total Discount</Text>
                    <HStack spacing={1} fontSize="md">
                      <Text color="green.500">–£</Text>
                      <AnimatedTillNumber
                        value={parseFloat(basket.totals.discountsTotal)}
                        fontSize="md"
                        duration={0.65}
                        color="green.500"
                      />
                    </HStack>
                  </HStack>
                )}
                <HStack justify="space-between">
                  <Text>VAT</Text>
                  <HStack spacing={1} fontSize="md">
                    <Text>£</Text>
                    <AnimatedTillNumber
                      value={parseFloat(basket.totals.taxTotal)}
                      fontSize="md"
                      duration={0.65}
                    />
                  </HStack>
                </HStack>
                <HStack justify="space-between">
                  <Text fontWeight="bold">Total</Text>
                  <HStack spacing={1} fontSize="lg">
                    <Text fontWeight="bold">£</Text>
                    <AnimatedTillNumber
                      value={parseFloat(basket.totals.grandTotal)}
                      fontSize="lg"
                      duration={0.65}
                    />
                    <Text fontWeight="bold">
                      {basket.isAnnual ? "/year" : "/mo"}
                    </Text>
                  </HStack>
                </HStack>
              </Stack>

              {basket.isAnnual && !basket.isFree ? (
                <Button
                  colorScheme="brand"
                  w="full"
                  mb={3}
                  onClick={() => router.push("/tool-store/contact-sales")}
                  isLoading={checkoutLoading}
                  disabled={basket.quantity === 0}
                  spinner={<Spinner thickness="2px" speed="0.65s" size="sm" />}
                  spinnerPlacement="start"
                >
                  Contact Sales
                </Button>
              ) : (
                <Button
                  colorScheme="brand"
                  w="full"
                  mb={3}
                  onClick={handleCheckout}
                  isLoading={checkoutLoading}
                  disabled={basket.quantity === 0}
                  spinner={<Spinner thickness="2px" speed="0.65s" size="sm" />}
                  spinnerPlacement="start"
                >
                  Checkout
                </Button>
              )}

              <Button
                variant="outline"
                w="full"
                mb={3}
                onClick={handleClearBasket}
              >
                Clear Changes
              </Button>

              {isMobile ? (
                <>
                  {/*<Button
                    w="full"
                    mb={2}
                    onClick={voucherDrawer.onOpen}
                    variant={"outline"}
                  >
                    Add Voucher Code
                  </Button> */}
                  <Button
                    w="full"
                    onClick={billingDrawer.onOpen}
                    variant={"outline"}
                  >
                    Edit Billing Address
                  </Button>
                </>
              ) : (
                <>
                  {/* <Button
                    variant="outline"
                    w="full"
                    mb={3}
                    onClick={() => setAddingVoucher((v) => !v)}
                  >
                    Add Voucher Code
                  </Button> */}
                </>
              )}
            </Box>

            {!isMobile && addingVoucher && (
              <Box bg="white" borderRadius="lg" boxShadow="sm" p={6}>
                <HStack justify="space-between" mb={4}>
                  <Text fontSize={[14, 18]} fontWeight="semibold">
                    Add Voucher
                  </Text>
                  <IconButton
                    aria-label="Close"
                    icon={<Close />}
                    size="sm"
                    onClick={() => setAddingVoucher(false)}
                  />
                </HStack>
                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    const code = (
                      e.currentTarget.elements.namedItem(
                        "voucher"
                      ) as HTMLInputElement
                    ).value.trim();
                    if (!code) {
                      toast({
                        title: "Enter a code",
                        status: "warning",
                        duration: 2000,
                      });
                      return;
                    }
                    setLoading(true);
                    try {
                      await addVoucher(code);
                      toast({
                        title: "Voucher applied!",
                        status: "success",
                        duration: 3000,
                      });
                    } catch (err) {
                      toast({
                        title: "Error",
                        description:
                          err instanceof Error
                            ? err.message
                            : "Unexpected error",
                        status: "error",
                        duration: 3000,
                      });
                    } finally {
                      setLoading(false);
                    }
                  }}
                >
                  <Stack spacing={3}>
                    <input
                      name="voucher"
                      placeholder="Voucher code"
                      style={{
                        flex: 1,
                        padding: "8px 12px",
                        borderRadius: 4,
                        border: "1px solid #CBD5E0",
                        fontSize: 16,
                      }}
                      disabled={loading}
                      autoComplete="off"
                    />
                    <Button
                      type="submit"
                      colorScheme="brand"
                      isLoading={loading}
                    >
                      Apply
                    </Button>
                  </Stack>
                </form>
              </Box>
            )}

            {!isMobile && <BillingAddressForm ref={billingRef} />}
          </Box>
        </Flex>
      ) : (
        <VStack spacing={4} w="100%">
          <VStack
            spacing={2}
            align="center"
            justify="center"
            w="100%"
            fontSize={[20, 22, 24]}
            bg={cardBg}
            py={8}
            borderRadius="md"
          >
            <Text fontWeight="semibold" textAlign="center">
              You haven't made any changes to your subscription.
            </Text>
            <Text fontWeight="400" fontSize={[14, 16, 18]} textAlign="center">
              Add some tools or user licenses to get started.
            </Text>
          </VStack>

          <Stack
            spacing={4}
            align="center"
            direction={{ base: "column", lg: "row" }}
            w="100%"
          >
            <VStack
              spacing={4}
              align="center"
              w={["100%", "100%", "100%"]}
              bg={cardBg}
              borderRadius="md"
              p={4}
              pt={6}
              minH={["", "", "300px"]}
              justify="center"
            >
              {basket.licensedUsers === 0 ? (
                <VStack spacing={2}>
                  <HStack spacing={2} fontSize={[14, 18]}>
                    <LicenseAmountIndicator
                      amount={subscriptionLimits.free.maxUsers}
                    />
                  </HStack>
                  <HStack align="flex-end" spacing={2} justify="center">
                    <AnimatedTillNumber
                      value={subscriptionLimits.free.maxUsers}
                      fontSize="32"
                      duration={0.65}
                      isCurrency={false}
                    />
                    <Text fontSize={[14, 18]}>Free Trial Licenses</Text>
                  </HStack>
                </VStack>
              ) : (
                <HStack spacing={4}>
                  <HStack spacing={2} fontSize={[14, 18]}>
                    <LicenseAmountIndicator amount={basket.licensedUsers} />
                  </HStack>
                </HStack>
              )}
              <HStack maxW={"450px"}>
                <LicensePicker showAlreadySubscribedText={false} />
              </HStack>
            </VStack>

            <VStack
              spacing={4}
              align="center"
              w={["100%", "100%", "100%"]}
              bg={cardBg}
              borderRadius="md"
              p={4}
              pt={6}
              minH="300px"
              justify="center"
            >
              <ToolSelectedIndicators
                subscriptionInfo={basket.ownedSubscriptionInfo}
              />
              <Button size="lg" onClick={() => router.push("/tool-store")}>
                Browse Tools
              </Button>
            </VStack>
          </Stack>
        </VStack>
      )}
      {/* Mobile Voucher Drawer */}
      <Drawer
        isOpen={voucherDrawer.isOpen}
        placement="right"
        onClose={voucherDrawer.onClose}
        size="xs"
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader borderBottomWidth="1px">Add Voucher Code</DrawerHeader>
          <DrawerBody>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                const code = (
                  e.currentTarget.elements.namedItem(
                    "voucher"
                  ) as HTMLInputElement
                ).value.trim();
                if (!code) {
                  toast({
                    title: "Enter a code",
                    status: "warning",
                    duration: 2000,
                  });
                  return;
                }
                setLoading(true);
                try {
                  await addVoucher(code);
                  toast({
                    title: "Voucher applied!",
                    status: "success",
                    duration: 3000,
                  });
                  voucherDrawer.onClose();
                } catch (err) {
                  toast({
                    title: "Error",
                    description:
                      err instanceof Error ? err.message : "Unexpected",
                    status: "error",
                    duration: 3000,
                  });
                } finally {
                  setLoading(false);
                }
              }}
            >
              <Stack spacing={4} mt={4}>
                <input
                  name="voucher"
                  placeholder="Voucher code"
                  style={{
                    flex: 1,
                    padding: "8px 12px",
                    borderRadius: 4,
                    border: "1px solid #CBD5E0",
                    fontSize: 16,
                  }}
                  disabled={loading}
                  autoComplete="off"
                />
                <Button type="submit" colorScheme="brand" isLoading={loading}>
                  Apply
                </Button>
              </Stack>
            </form>
          </DrawerBody>
        </DrawerContent>
      </Drawer>

      {/* Mobile “drawer” via Slide + backdrop */}
      {billingDrawer.isOpen && (
        <Box
          pos="fixed"
          inset={0}
          bg="blackAlpha.600"
          zIndex="overlay"
          onClick={billingDrawer.onClose}
        />
      )}

      <Slide
        direction="right"
        in={billingDrawer.isOpen}
        unmountOnExit={false}
        style={{ zIndex: 1400 }}
      >
        <Box
          bg="white"
          w="xs"
          h="full"
          pos="fixed"
          top="0"
          right="0"
          shadow="md"
          p={4}
          onClick={(e) => e.stopPropagation()}
        >
          <Flex justify="space-between" align="center" mb={4}>
            <Text fontSize="lg" fontWeight="semibold">
              Billing Address
            </Text>
            <IconButton
              aria-label="Check"
              icon={<Check />}
              size="sm"
              onClick={billingDrawer.onClose}
            />
          </Flex>

          <BillingAddressForm ref={billingRef} />
        </Box>
      </Slide>
    </VStack>
  );
}
