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
  useTheme,
  Textarea,
} from "@chakra-ui/react";
import { Menu, Search, Chat } from "@mui/icons-material";
import { useFetchClient } from "@/hooks/useFetchClient";
import AdminHeading from "@/components/AdminHeader";
import ArticleOutlinedIcon from "@mui/icons-material/ArticleOutlined";
import ZoomableImg from "@/components/ZoomableImg";
import { SpringModal } from "@/components/modals/springModal/SpringModal";
import { useUser } from "@/providers/UserProvider";
import { ContactSupportModal } from "@/components/modals/ContactSupportModal";
import { SUPPORT_EMAIL } from "@/utils/emailAddresses";

// Define Guide and ToolConfig types
type Guide = {
  title: string;
  type: "tool" | "admin" | "platform";
  urlPath: string;
  sortOrder: number;
  toolId?: number | string;
  guideImagePath: "string";
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
  const [toolConfigs, setToolConfigs] = useState<Record<string, ToolConfig>>({});
  const [selectedGuide, setSelectedGuide] = useState<Guide | null>(null);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [embedError, setEmbedError] = useState(false);
  const [filterText, setFilterText] = useState("");
  const [contactMessage, setContactMessage] = useState("");
  const theme = useTheme();
  const { user } = useUser();

  const { fetchClient } = useFetchClient();
  const {
    isOpen: isDrawerOpen,
    onOpen: openDrawer,
    onClose: closeDrawer,
  } = useDisclosure();
  const {
    isOpen: isContactOpen,
    onOpen: openContact,
    onClose: closeContact,
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
            guideImagePath: g.guideImagePath,
          }))
          .sort((a, b) => a.sortOrder - b.sortOrder);
        setGuideList(guides);
        
        // Find and set the first admin guide as selected
        const firstAdminGuide = guides.find(g => g.type === "admin");
        setSelectedGuide(firstAdminGuide ?? guides[0] ?? null);

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

  // Create ordered sections array
  const orderedSections = [
    { label: "Admin", items: adminGuides, icon: "" },
    { label: "Platform", items: platformGuides, icon: "" },
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
  ].filter(section => section.items.length > 0);

  // Set the first guide as selected if none is selected
  useEffect(() => {
    if (!selectedGuide && orderedSections.length > 0) {
      const firstSection = orderedSections[0];
      if (firstSection.items.length > 0) {
        setSelectedGuide(firstSection.items[0]);
      }
    }
  }, [orderedSections, selectedGuide]);

  const handleContactSubmit = () => {
    const userDetails = `
Customer Name: ${user?.customerName || 'N/A'}
Customer ID: ${user?.customerId || 'N/A'}
User Email: ${user?.email || 'N/A'}

Message:
${contactMessage}`;
    
    const emailBody = encodeURIComponent(userDetails);
    window.location.href = `mailto:${SUPPORT_EMAIL}?subject=Help Centre Support Request&body=${emailBody}`;
    closeContact();
    setContactMessage("");
  };

  if (loading)
    return (
      <Center h="100vh">
        <Spinner size="xl" />
      </Center>
    );
  if (error)
    return (
      <Center h="100vh">
        <Text color={theme.colors.danger}>{error}</Text>
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

      {orderedSections.map(({ label, items, icon }, idx, arr) => {
        return (
          <React.Fragment key={label}>
            <Box w="100%">
              <HStack mb={2} spacing={2}>
                {icon}
                <Text fontSize={["base", "base", "lg"]} fontWeight="semibold" color={theme.colors.primaryTextColor}>
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
                        ? (theme.colors.buttonTextSelected || "white")
                        : theme.colors.primaryTextColor
                    }
                    justifyContent="left"
                    leftIcon={<ArticleOutlinedIcon />}
                    _hover={{ bg: theme.colors.elementBG, color: theme.colors.primaryTextColor }}
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
    <VStack w="full" spacing={4} h={["71vh", "71vh", "82vh"]} overflow="hidden">
      <VStack w="full" h="min" align={"left"}>
        <AdminHeading headingText="Help Centre" />
        {/* Mobile toggle and contact button */}
        <HStack spacing={2}>
          {isMobile && (
            <Button
              aria-label="Open guide list"
              w={"min"}
              onClick={openDrawer}
              gap={1}
              color={"white"}
              size={"sm"}
            >
              <Menu />
              <Text fontSize={"xs"}>Guides</Text>
            </Button>
          )}
          <Button
            aria-label="Contact support"
            w={"min"}
            onClick={openContact}
            gap={1}
            color={"white"}
            size={"sm"}
            leftIcon={<Chat />}
          >
            <Text fontSize={"xs"}>{isMobile ? "Contact" : "Contact Support"}</Text>
          </Button>
        </HStack>

        {/* Contact Modal */}
        <ContactSupportModal isOpen={isContactOpen} onClose={closeContact} />

        {/* Mobile drawer */}
        {isMobile && (
          <Drawer
            isOpen={isDrawerOpen}
            placement="left"
            onClose={closeDrawer}
          >
            <DrawerOverlay />
            <DrawerContent>
              <DrawerCloseButton />
              <DrawerBody p={0}>
                <Box 
                  bg={theme.colors.elementBG} 
                  h="full" 
                  overflowY="auto"
                  sx={{
                    '&::-webkit-scrollbar': {
                      display: 'none'
                    },
                    '-ms-overflow-style': 'none',
                    'scrollbar-width': 'none'
                  }}
                >
                  {Sidebar}
                </Box>
              </DrawerBody>
            </DrawerContent>
          </Drawer>
        )}
      </VStack>

      <Flex
        h="full"
        w="full"
        borderRadius="md"
        overflow="hidden"
        bg={theme.colors.elementBG}
        boxShadow="sm"
        direction={["column", "column", "row"]}
      >

        {/* Sidebar */}
        {!isMobile && (
          <Box
            w={sideW}
            bg={theme.colors.elementBG}
            borderRight="1px solid"
            borderColor="gray.200"
            boxShadow="sm"
            overflowY="auto"
          >
            {Sidebar}
          </Box>
        )}

        <Box w={mainW} display="flex" flexDirection="column" p={4} h="full">
          <Box
            flex="1"
            bg={theme.colors.elementBG}
            rounded="md"
            position="relative"
            overflow="hidden"
          >
            {!embedError ? (
              // Scrollable container for the "A4 portrait" image
              <Box
                width="100%"
                height="100%"
                overflowY="auto" // only vertical scrolling
                overflowX="hidden" // no horizontal scroll
                bg={theme.colors.elementBG}
              >
                {selectedGuide ? (
                  isMobile ? (
                    <ZoomableImg
                      src={selectedGuide.guideImagePath}
                      alt={selectedGuide.title}
                    />
                  ) : (
                    <iframe
                      src={`${selectedGuide.urlPath}#toolbar=0&navpanes=0&scrollbar=0`}
                      title={selectedGuide.title}
                      width="100%"
                      height="100%"
                      style={{ border: "none" }}
                    />
                  )
                ) : (
                  <Center h="full" p={8}>
                    <Text fontSize="lg" color={theme.colors.secondaryTextColor}>
                      No guide selected.
                    </Text>
                  </Center>
                )}
              </Box>
            ) : (
              // Error state if the image failed to load
              <Center h="full" p={8}>
                <Stack spacing={4} textAlign="center">
                  <Text fontSize="4xl" fontWeight="bold" color={theme.colors.danger}>
                    Error...
                  </Text>
                  <Text fontSize="lg" color={theme.colors.secondaryTextColor}>
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
