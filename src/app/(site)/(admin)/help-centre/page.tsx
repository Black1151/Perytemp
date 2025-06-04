"use client";

import React, { useEffect, useState } from "react";
import {
  Flex,
  Box,
  VStack,
  Text,
  Spinner,
  useBreakpointValue,
  useColorModeValue,
  Button,
  HStack,
  Image,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerBody,
  IconButton,
  Input,
  useDisclosure,
  Center,
  Stack,
} from "@chakra-ui/react";
import { Menu, Search } from "@mui/icons-material";
import { useFetchClient } from "@/hooks/useFetchClient";
import AdminHeading from "@/components/AdminHeader";
import ArticleOutlinedIcon from "@mui/icons-material/ArticleOutlined";

// Define Guide and ToolConfig types
type Guide = {
  title: string;
  type: "tool" | "admin" | "platform";
  urlPath: string;
  sortOrder: number;
  toolId?: number | string;
};

type ToolConfig = {
  id: number;
  displayName: string;
  iconImageUrl: string;
};

export default function HelpCentrePage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [guideList, setGuideList] = useState<Guide[]>([]);
  const [toolConfigs, setToolConfigs] = useState<Record<string, ToolConfig>>(
    {}
  );
  const [selectedGuide, setSelectedGuide] = useState<Guide | null>(null);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [embedError, setEmbedError] = useState(false);
  const [filterText, setFilterText] = useState("");

  const { fetchClient } = useFetchClient();
  const {
    isOpen: isDrawerOpen,
    onOpen: openDrawer,
    onClose: closeDrawer,
  } = useDisclosure();

  // Fetch guides and tools
  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      setError(null);
      try {
        const [guideRes, toolRes] = await Promise.all([
          fetchClient<{ resource: any[] }>(`/api/guide/allBy`),
          fetchClient<{ resource: any[] }>(`/api/toolConfig/allBy`),
        ]);
        const rawGuides = guideRes?.resource || [];
        const rawTools = toolRes?.resource || [];

        // Process guides
        const guides: Guide[] = rawGuides
          .filter((g) => g.isActive)
          .map((g) => ({
            title: g.guideTitle,
            type: g.type,
            urlPath: g.guideFilePath,
            sortOrder: g.sortOrder,
            toolId: g.toolId,
          }))
          .sort((a, b) => a.sortOrder - b.sortOrder);
        setGuideList(guides);
        setSelectedGuide(guides[0] ?? null);

        // Process tool configs
        const configMap: Record<string, ToolConfig> = {};
        rawTools
          .filter((t) => t.isActive)
          .forEach((t) => {
            configMap[String(t.id)] = {
              id: t.id,
              displayName: t.displayName,
              iconImageUrl: t.iconImageUrl,
            };
          });
        setToolConfigs(configMap);
      } catch (e: any) {
        console.error(e);
        setError(e.message || "Failed to load data");
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  // Reset PDF load state
  useEffect(() => {
    setPdfLoading(false);
    setEmbedError(false);
    if (selectedGuide) setPdfLoading(true);
  }, [selectedGuide]);

  // Theme values
  const bg = useColorModeValue("gray.50", "gray.800");
  const cardBg = useColorModeValue("white", "gray.700");

  // Layout breakpoints
  const sideW = useBreakpointValue({ base: "full", md: "30%" });
  const mainW = useBreakpointValue({ base: "full", md: "70%" });
  const isMobile = useBreakpointValue({ base: true, md: false });

  // Filter function
  const filter = (g: Guide) =>
    g.title.toLowerCase().includes(filterText.toLowerCase());

  // Categorize guides
  const platformGuides = guideList.filter(
    (g) => g.type === "platform" && filter(g)
  );
  const adminGuides = guideList.filter((g) => g.type === "admin" && filter(g));
  const toolGuides = guideList.filter(
    (g) => g.type === "tool" && g.toolId != null && filter(g)
  );

  // Group guides by toolId for sidebar sections
  const toolGroups = toolGuides.reduce<Record<string, Guide[]>>((acc, g) => {
    const key = String(g.toolId);
    (acc[key] = acc[key] || []).push(g);
    return acc;
  }, {});

  if (loading)
    return (
      <Center h="100vh">
        <Spinner size="xl" />
      </Center>
    );
  if (error)
    return (
      <Center h="100vh">
        <Text color="red.500">{error}</Text>
      </Center>
    );

  // Sidebar component
  const Sidebar = (
    <VStack
      align="start"
      spacing={2}
      p={4}
      w="100%"
      borderRadius={"md"}
      mt={[8, 7, 0]}
    >
      <HStack w="full">
        <Search fontSize={"small"} />
        <Input
          placeholder="Search guides..."
          size={["xs", "xs", "md"]}
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
          mb={0}
          border={"none"}
          borderBottom={"1px"}
          borderRadius={0}
          borderColor={"gray.200"}
          py={2}
          px={[0, 0, 1]}
          w="full"
          transition="border-color 0.2s, box-shadow 0.2s, padding-left 0.2s"
          _focus={{
            boxShadow: "none",
            borderBottom: "1px",
            borderColor: "gray.500",
            paddingLeft: "4px",
          }}
        />
      </HStack>

      {[
        { label: "Platform", items: platformGuides, icon: "" },
        { label: "Admin", items: adminGuides, icon: "" },
        // One section per tool
        ...Object.entries(toolGroups).map(([toolId, items]) => {
          const cfg = toolConfigs[toolId];
          return {
            label: `${cfg?.displayName || `Tool ${toolId}`}`,
            items,
            icon: cfg?.iconImageUrl ? (
              <Image
                boxSize="32px"
                src={cfg.iconImageUrl}
                alt={cfg.displayName}
              />
            ) : (
              <ArticleOutlinedIcon />
            ),
          };
        }),
      ].map(({ label, items, icon }, idx, arr) => {
        if (!items.length) return null;
        return (
          <React.Fragment key={label}>
            <Box w="100%">
              <HStack mb={2} spacing={2}>
                {icon}
                <Text fontSize={["base", "base", "lg"]} fontWeight="semibold">
                  {label}
                </Text>
              </HStack>
              <VStack align="stretch" spacing={2}>
                {items.map((g) => (
                  <Button
                    key={g.urlPath}
                    variant={
                      selectedGuide?.urlPath === g.urlPath ? "solid" : "ghost"
                    }
                    color={
                      selectedGuide?.urlPath === g.urlPath
                        ? "white"
                        : "gray.700"
                    }
                    justifyContent="left"
                    leftIcon={<ArticleOutlinedIcon />}
                    _hover={{ bg: "gray.100", color: "gray.800" }}
                    _active={{ transform: "scale(0.98)" }}
                    onClick={() => {
                      setSelectedGuide(g);
                      if (isMobile) closeDrawer();
                    }}
                    fontSize={14}
                  >
                    {g.title}
                  </Button>
                ))}
              </VStack>
            </Box>
            {/* Add border between categories except after the last one */}
            {idx < arr.length - 1 && (
              <Box
                w="100%"
                borderBottom="1px solid"
                borderColor="gray.200"
                my={2}
              />
            )}
          </React.Fragment>
        );
      })}
    </VStack>
  );

  return (
    <VStack w="full" spacing={4} h="full" overflow="hidden">
      <AdminHeading headingText="help-centre" />
      <Flex
        h="80vh"
        w="full"
        borderRadius="md"
        overflow="hidden"
        bgGradient="linear(to-br, pink.50, white)"
        boxShadow="sm"
        direction={["column", "column", "row"]}
      >
        {/* Mobile toggle */}
        {isMobile && (
          <>
            <Button
              aria-label="Open guide list"
              m={4}
              w={"min"}
              onClick={openDrawer}
              gap={1}
              color={"white"}
            >
              <Menu />
              <Text fontSize={"sm"}>All Guides</Text>
            </Button>
            <Drawer
              isOpen={isDrawerOpen}
              placement="left"
              onClose={closeDrawer}
            >
              <DrawerOverlay />
              <DrawerContent>
                <DrawerCloseButton />
                <DrawerBody p={0}>
                  <Box bg={cardBg} h="full" overflowY="auto">
                    {Sidebar}
                  </Box>
                </DrawerBody>
              </DrawerContent>
            </Drawer>
          </>
        )}

        {/* Sidebar */}
        {!isMobile && (
          <Box
            w={sideW}
            bg={cardBg}
            borderRight="1px solid"
            borderColor="gray.200"
            boxShadow="sm"
          >
            {Sidebar}
          </Box>
        )}

        {/* PDF Viewer */}
        <Box w={mainW} display="flex" flexDirection="column" p={4} h="full">
          <Box
            flex="1"
            bg={cardBg}
            rounded="md"
            overflow="hidden"
            position="relative"
          >
            {pdfLoading && (
              <Flex
                position="absolute"
                inset={0}
                align="center"
                justify="center"
              >
                <Spinner size="xl" />
              </Flex>
            )}
            {!embedError ? (
              <iframe
                src={`${selectedGuide?.urlPath}#toolbar=0&navpanes=0&scrollbar=0`}
                width="100%"
                height="100%"
                onError={() => setEmbedError(true)}
                onLoad={() => setPdfLoading(false)}
              />
            ) : (
              <Center h="full" p={8}>
                <Stack spacing={4} textAlign="center">
                  <Text fontSize="4xl" fontWeight="bold" color="pink.500">
                    Error...
                  </Text>
                  <Text fontSize="lg">
                    Oops! An error occurred loading this guide.
                  </Text>
                </Stack>
              </Center>
            )}
          </Box>
        </Box>
      </Flex>
    </VStack>
  );
}
