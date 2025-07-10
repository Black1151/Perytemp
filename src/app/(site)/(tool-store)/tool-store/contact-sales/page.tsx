"use client";

import React, { useEffect, useState } from "react";
import {
  VStack,
  HStack,
  Text,
  Link,
  Box,
  Stack,
  useToast,
  useTheme,
  Icon,
  Badge,
  Skeleton,
  SkeletonText,
  Textarea,
  Button,
} from "@chakra-ui/react";
import { useBasket } from "../useBasket";
import { useUser } from "@/providers/UserProvider";
import { Header } from "../Header";
import { Phone, Email } from "@mui/icons-material";
import { SALES_EMAIL } from "@/utils/emailAddresses";

const SUPPORT_EMAIL = "sales@perygon.co.uk";
const SUPPORT_TEL = "0333 222 4445";

const ContactSales: React.FC = () => {
  const { subscription, getSubscription } = useBasket();
  const user = useUser();
  const toast = useToast();
  const theme = useTheme();
  const [isLoading, setIsLoading] = useState(true);
  const [contactMessage, setContactMessage] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      if (!subscription?.uniqueId) {
        await getSubscription();
      }
      setIsLoading(false);
    };
    fetchData();
  }, [subscription]);

  const handleContactSubmit = () => {
    if (!contactMessage.trim()) {
      toast({
        title: "Missing information",
        description: "Please enter your message before submitting.",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    const emailBody = `
Hi,

I would like to discuss the following with the sales team:

${contactMessage}

Submitted by:
Name: ${user.user?.fullName || 'Not provided'}
Email: ${user.user?.email || 'Not provided'}
Customer Name: ${user.user?.customerName || 'Not provided'}
Customer ID: ${user.user?.customerId || 'Not provided'}
Subscription ID: ${subscription?.uniqueId.slice(0, 6) || 'Not provided'}

Many thanks
`.trim();

    const subject = encodeURIComponent("Perygon Sales Inquiry");
    const body = encodeURIComponent(emailBody);
    window.location.href = `mailto:${SALES_EMAIL}?subject=${subject}&body=${body}`;
    setContactMessage("");
  };

  return (
    <VStack spacing={6} align="center" justify="center" w="100%">
      <Header title="Contact Sales" showBillingCycle={false} />

      <Box
        bg={theme.colors.elementBG}
        borderRadius="md"
        boxShadow="md"
        p={6}
        color={theme.colors.primaryTextColor}
        w="100%"
      >
        <SkeletonText isLoaded={!isLoading} noOfLines={3} spacing={6}>
          <Text fontSize={["sm", "md", "lg"]}>
            To discuss an order, change your billing cycle, adjust an annual
            subscription, or any other sales inquiries, please contact us using
            the information below.
          </Text>
        </SkeletonText>
      </Box>

      <Stack
        direction={["column", "column", "row"]}
        w="100%"
        spacing={6}
      >
        <Box
          bg={theme.colors.elementBG}
          borderRadius="md"
          boxShadow="md"
          w="100%"
          p={6}
          color={theme.colors.primaryTextColor}
          transition="all 0.2s"
          _hover={{ transform: "translateY(-2px)", boxShadow: "lg" }}
        >
          <VStack align="start" spacing={6}>
            <HStack spacing={6}>
              <Skeleton isLoaded={!isLoading}>
                <Icon as={Phone} boxSize={6} color={theme.colors.primary} />
              </Skeleton>
              <SkeletonText isLoaded={!isLoading} noOfLines={1}>
                <Text fontSize={["sm", "md", "lg"]}>
                  <strong>Phone:</strong>{" "}
                  <Link
                    href={`tel:${SUPPORT_TEL}`}
                    color={theme.colors.primary}
                    _hover={{ textDecoration: "none", color: theme.colors.primary }}
                  >
                    {SUPPORT_TEL}
                  </Link>
                </Text>
              </SkeletonText>
            </HStack>
            <HStack spacing={6}>
              <Skeleton isLoaded={!isLoading}>
                <Icon as={Email} boxSize={6} color={theme.colors.primary} />
              </Skeleton>
              <SkeletonText isLoaded={!isLoading} noOfLines={1}>
                <Text fontSize={["sm", "md", "lg"]}>
                  <strong>Email:</strong>{" "}
                  <Link
                    href={`mailto:${SALES_EMAIL}`}
                    color={theme.colors.primary}
                    _hover={{ textDecoration: "none", color: theme.colors.primary }}
                  >
                    {SALES_EMAIL}
                  </Link>
                </Text>
              </SkeletonText>
            </HStack>
          </VStack>
        </Box>

        <Box
          bg={theme.colors.elementBG}
          borderRadius="md"
          boxShadow="md"
          p={6}
          w="100%"
          color={theme.colors.primaryTextColor}
          transition="all 0.2s"
          _hover={{ transform: "translateY(-2px)", boxShadow: "lg" }}
        >
          <VStack align="start" spacing={6}>
            <HStack spacing={6}>
              <SkeletonText isLoaded={!isLoading} noOfLines={1}>
                <Text fontWeight="bold" fontSize={["sm", "md", "lg"]}>Your Subscription ID:</Text>
              </SkeletonText>
              <Skeleton isLoaded={!isLoading}>
                <Badge
                  textTransform="uppercase"
                  colorScheme="blue"
                  px={2}
                  py={0.75}
                  borderRadius="md"
                  letterSpacing="0.5em"
                  fontSize={["xs", "sm", "md"]}
                >
                  {subscription?.uniqueId
                    ? subscription.uniqueId.slice(0, 6)
                    : "N/A"}
                </Badge>
              </Skeleton>
            </HStack>

            <HStack spacing={6}>
              <SkeletonText isLoaded={!isLoading} noOfLines={1}>
                <Text fontWeight="bold" fontSize={["sm", "md", "lg"]}>Your Customer ID:</Text>
              </SkeletonText>
              <Skeleton isLoaded={!isLoading}>
                <Badge
                  textTransform="uppercase"
                  colorScheme="blue"
                  px={2}
                  py={0.75}
                  borderRadius="md"
                  letterSpacing="0.5em"
                  fontSize={["xs", "sm", "md"]}
                >
                  {user.user?.customerUniqueId?.slice(0, 6) || "Unknown"}
                </Badge>
              </Skeleton>
            </HStack>
          </VStack>
        </Box>
      </Stack>

      <Box
        bg={theme.colors.elementBG}
        borderRadius="md"
        boxShadow="md"
        p={6}
        w="100%"
        color={theme.colors.primaryTextColor}
      >
        <VStack spacing={4} align="stretch">
          <Text fontSize={["sm", "md", "lg"]} fontWeight="bold">
            Send us a message
          </Text>
          <Textarea
            placeholder="Please describe what you would like to discuss with our sales team..."
            value={contactMessage}
            onChange={(e) => setContactMessage(e.target.value)}
            size="md"
            rows={6}
            bg="white"
            color="gray.800"
          />
          <Button
            colorScheme="blue"
            onClick={handleContactSubmit}
            isLoading={isLoading}
            loadingText="Preparing..."
          >
            Send Message
          </Button>
        </VStack>
      </Box>
    </VStack>
  );
};

export default function Page() {
  return <ContactSales />;
}
