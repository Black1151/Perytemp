"use client";

import {
  Flex,
  VStack,
  Text,
  Button,
  Spinner,
  Box,
  useTheme,
  HStack,
  SimpleGrid,
  Select,
} from "@chakra-ui/react";
import { PerygonContainer } from "@/components/layout/PerygonContainer";
import { LetterFlyIn } from "@/components/animations/text/LetterFlyIn";
import { useUser } from "@/providers/UserProvider";
import { useEffect, useState, useCallback } from "react";
import { useFetchClient } from "@/hooks/useFetchClient";
import { Lock } from "@mui/icons-material";

interface ToolSelectionPageResponse {
  resource: ToolResource[];
}

interface ToolResource {
  id: number;
  displayName: string;
  previewText: string;
  showInSeeMoreList: boolean;
  logoImageUrl: string;
  appUrl: string;
  isTrialable: boolean;
  annualPriceId: string;
  monthlyPriceId: string;
}

// ── FreeToolCard ──────────────────────────────────────────────────────────────
export function FreeToolCard({ tool }: { tool: ToolResource }) {
  const theme = useTheme();
  const cardBg = theme.colors.darkGray;
  const textColor = "white";
  const freeBannerBg = theme.colors.green[500];
  const rightBg = `${theme.colors.gray[600]}80`;

  return (
    <Box
      position="relative"
      w="100%"
      border="1px solid"
      borderColor="white"
      borderRadius="md"
      overflow="hidden"
    >
      {/* Rotated FREE banner in corner */}
      <Box
        position="absolute"
        top="-20px"
        left="-60px"
        width={"120px"}
        bg={freeBannerBg}
        px={4}
        py={1}
        transform="rotate(-45deg)"
        transformOrigin="100% 0"
        fontSize="sm"
        fontWeight="bold"
        color={textColor}
        zIndex={1}
        alignContent={"center"}
        textAlign={"center"}
      >
        FREE
      </Box>

      <HStack spacing={0} align="stretch">
        {/* Left side: logo, description, button */}
        <VStack
          align="start"
          justify="space-between"
          spacing={4}
          p={4}
          bg={cardBg}
          color={textColor}
          flex={{ base: "4", md: "1" }}
        >
          <Box
            h="85px"
            w="100%"
            display="flex"
            alignItems="left"
            justifyContent="left"
          >
            <img
              src={tool.logoImageUrl}
              alt={tool.displayName}
              style={{ maxHeight: "85px", objectFit: "contain" }}
            />
          </Box>

          <Text fontSize="sm">{tool.previewText}</Text>

          <Button
            size="sm"
            variant="outline"
            colorScheme="primary"
            onClick={() => (window.location.href = tool.appUrl)}
          >
            Launch Tool
          </Button>
        </VStack>

        {/* Right side: title, email & schedule setup */}
        <VStack
          align="start"
          spacing={3}
          p={4}
          bg={rightBg}
          color={textColor}
          flex={{ base: "4", md: "1" }}
        >
          <Text fontSize="lg" fontWeight="bold">
            Setup your email schedule (Optional)
          </Text>
          <Text fontSize="sm">
            Select the time of the week you would like your employees to receive
            the happiness score forms via email.
          </Text>
          {/* Day and time selectors: responsive layout */}
          <SimpleGrid columns={1} spacing={3} w="100%">
            <Select
              placeholder="Select a day"
              size="sm"
              bg="white"
              color="black"
              borderRadius="sm"
            >
              {[
                "Monday",
                "Tuesday",
                "Wednesday",
                "Thursday",
                "Friday",
                "Saturday",
                "Sunday",
              ].map((day) => (
                <option key={day} value={day}>
                  {day}
                </option>
              ))}
            </Select>
            <Select
              placeholder="Select time of day"
              size="sm"
              bg="white"
              color="black"
              borderRadius="sm"
            >
              <option value="morning">Morning</option>
              <option value="afternoon">Afternoon</option>
              <option value="evening">Evening</option>
            </Select>
            <Button fontSize="sm" w="100%" fontWeight="normal">
              Submit
            </Button>
          </SimpleGrid>
        </VStack>
      </HStack>
    </Box>
  );
}

// ── PremiumToolCard ───────────────────────────────────────────────────────────
export function PremiumToolCard({ tool }: { tool: ToolResource }) {
  const theme = useTheme();
  const cardBg = theme.colors.darkGray;
  const textColor = "white";
  const premiumBannerBg =
    theme.colors.secondary?.[500] || theme.colors.purple[500];

  return (
    <Box
      position="relative"
      w="100%"
      border="1px solid"
      borderColor="white"
      borderRadius="md"
      overflow="hidden"
      h="100%"
      display="flex"
      flexDirection="column"
    >
      {/* Rotated PREMIUM banner in corner */}
      <Box
        position="absolute"
        top="65px"
        right="-20px"
        width={"120px"}
        bg={premiumBannerBg}
        px={4}
        py={1}
        transform="rotate(45deg)"
        transformOrigin="100% 0"
        fontSize="sm"
        fontWeight="bold"
        color={textColor}
        zIndex={1}
        alignContent={"center"}
        textAlign={"center"}
      >
        PREMIUM
      </Box>

      <Box
        position="absolute"
        px={3}
        py={3}
        fontSize="sm"
        fontWeight="bold"
        color={textColor}
        zIndex={1}
        alignContent="center"
        textAlign="center"
      >
        <Lock fontSize="small" sx={{ color: textColor }} />
      </Box>

      <VStack
        spacing={4}
        align="start"
        p={4}
        bg={cardBg}
        color={textColor}
        borderRadius="md"
        boxShadow="sm"
        flex="1"
      >
        <Box
          h="80px"
          w="100%"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <img
            src={tool.logoImageUrl}
            alt={tool.displayName}
            style={{ maxHeight: "80px", objectFit: "contain", width: "auto" }}
          />
        </Box>

        <Text fontSize="sm">{tool.previewText}</Text>
      </VStack>
    </Box>
  );
}

export default function ToolSelection() {
  const { user } = useUser();
  const { fetchClient } = useFetchClient();
  const [loading, setLoading] = useState(true);
  const [tools, setTools] = useState<ToolResource[]>([]);
  const theme = useTheme();
  const [formattedEndDate, setFormattedEndDate] = useState<string | null>(null);

  // Define callbacks unconditionally
  const getTools = useCallback(async () => {
    if (!user) return;
    try {
      const data = await fetchClient<ToolSelectionPageResponse>(
        "/api/toolConfig/allBy",
        { method: "GET" }
      );
      if (data?.resource) setTools(data.resource);
    } catch (error) {
      console.error("Error fetching tools:", error);
    }
  }, [fetchClient, user]);

  const getEndDate = useCallback(async () => {
    if (!user) return;
    try {
      const response = await fetchClient<{ resource: any[] }>(
        `/api/toolCustomer/allBy?customerId=${user.customerId}`,
        { method: "GET" }
      );
      if (!response || !response.resource) {
        throw new Error("Failed to fetch resources");
      }
      const { resource } = response;
      const sub = resource[0];
      if (!sub?.subStartDate) {
        throw new Error("No subscription start date found");
      }
      const startDate = new Date(sub.subStartDate);
      const endDate = new Date(startDate);
      endDate.setDate(startDate.getDate() + 45);
      const formatted = `${endDate.getDate().toString().padStart(2, "0")}-${
        (endDate.getMonth() + 1)
          .toString()
          .padStart(2, "0")
      }-${endDate.getFullYear()}`;
      setFormattedEndDate(formatted);
    } catch (error) {
      console.error("Error fetching end date:", error);
    }
  }, [fetchClient, user]);

  // Effect runs in the same order every render
  useEffect(() => {
    if (!user) return;
    setLoading(true);
    const fetchAll = async () => {
      await getTools();
      await getEndDate();
      setLoading(false);
    };
    fetchAll();
  }, [user, getTools, getEndDate]);

  if (!user) return null;
  const userName = user.firstName;

  // Filter and split tools
  const visibleTools = tools.filter(
    (t) => t.showInSeeMoreList && !!t.logoImageUrl
  );
  const trialTools = visibleTools.filter((t) => t.isTrialable);
  const premiumTools = visibleTools.filter((t) => !t.isTrialable);

  return (
    <VStack minH="100svh" width="100%" flex={1}>
      <Flex
        direction="column"
        flex={1}
        pt={12}
        pb={16}
        alignItems="center"
        w="100%"
        px={{ base: 4, sm: 6, md: 8 }}
      >
        <VStack pt="50px" pb={8} spacing={4} align="center" w="100%">
          <Text
            as="span"
            display="inline-block"
            color={theme.colors.elementBG}
            fontFamily="bonfire"
            whiteSpace="nowrap"
            fontSize={{ base: 28, sm: 32, md: 38 }}
            lineHeight={1}
            textAlign="center"
          >
            Congratulations, {userName}!
          </Text>
          <Text
            fontSize={{ base: 48, sm: 56, md: 64 }}
            color={theme.colors.white}
            fontFamily={"bonfire"}
            textAlign={"center"}
          >
            Perygon Is ready for you.
          </Text>
        </VStack>

        <Flex
          direction="column"
          align="center"
          justify="center"
          gap={{ base: 6, md: 8 }}
          w="full"
        >
          {loading ? (
            <Flex direction="column" align="center" gap={4}>
              <Spinner size="lg" color="white" />
              <Text color={theme.colors.white}>Loading tools...</Text>
            </Flex>
          ) : (
            <Flex direction="column" w="full" gap={{ base: 6, md: 10 }}>
              <Text color={theme.colors.white} textAlign="center">
                Your free Happiness Score Tool is now live. You can use it until {formattedEndDate} to get a better understanding of your team’s
                happiness and well-being.
              </Text>

              <Flex direction="column" w="full" gap={4}>
                <Flex wrap="wrap" justify={{ base: "center", md: "start" }} gap={6}>
                  {trialTools.map((tool) => (
                    <FreeToolCard key={tool.id} tool={tool} />
                  ))}
                </Flex>
              </Flex>

              <Flex direction="column" w="full" gap={4}>
                <SimpleGrid
                  columns={{ base: 1, sm: 2, md: 2 }}
                  spacing={6}
                  w="full"
                  alignItems="stretch"
                >
                  {premiumTools.map((tool) => (
                    <PremiumToolCard key={tool.id} tool={tool} />
                  ))}
                </SimpleGrid>
              </Flex>
            </Flex>
          )}
        </Flex>
      </Flex>
    </VStack>
  );
}
