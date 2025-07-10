import React, { useEffect, useState, useCallback } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalCloseButton,
  ModalBody,
  Flex,
  Box,
  VStack,
  Text,
  Spinner,
  useBreakpointValue,
  Button,
  HStack,
  Image,
  IconButton,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerBody,
  useDisclosure,
  useTheme,
  chakra,
} from "@chakra-ui/react";
import { motion, Transition } from "framer-motion";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import {
  Article,
  Menu,
  Help,
  ArrowBack,
  ArrowForward,
} from "@mui/icons-material";
import { useFetchClient } from "@/hooks/useFetchClient";
import MarkAsRead from "./markAsRead";
import { useUser } from "@/providers/UserProvider";
import ZoomableImg from "@/components/ZoomableImg";
import { transparentize } from "@chakra-ui/theme-tools";

type GuideModalProps = {
  isOpen: boolean;
  onClose: () => void;
  guideType: "tool" | "admin" | "platform";
  toolId?: number | string | null;
};

type Guide = {
  guideId: number | string;
  title: string;
  type: "tool" | "admin" | "platform";
  role: string[];
  urlPath: string;
  guideImagePath: string;
  sortOrder: number;
  toolId?: number | string;
};

const MotionOverlay = chakra(motion.div);
const MotionContent = chakra(motion.div);

const overlayTransition: Transition = { duration: 0.2, ease: 'easeOut' };
const contentTransition: Transition = { type: 'spring', stiffness: 300, damping: 30 };

export default function GuideModal({
  isOpen,
  onClose,
  toolId,
  guideType,
}: GuideModalProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [guideList, setGuideList] = useState<Guide[]>([]);
  const [selectedGuide, setSelectedGuide] = useState<Guide | null>(null);
  const [readGuides, setReadGuides] = useState<Record<string, boolean>>({});
  const [pdfLoading, setPdfLoading] = useState(false);
  const [iconImageUrl, setIconImageUrl] = useState<string | null>(null);
  const [recordIdMap, setRecordIdMap] = useState<
    Record<string, number | undefined>
  >({});
  const { fetchClient } = useFetchClient();
  const {
    isOpen: isDrawerOpen,
    onOpen: openDrawer,
    onClose: closeDrawer,
  } = useDisclosure();
  const theme = useTheme();
  const { user } = useUser();

  const bg = theme.colors.elementBG;
  const transparentBg = transparentize(theme.colors.elementBG, 0.65)(theme);
  const borderColor = transparentize(theme.colors.primaryTextColor, 0.15)(theme);
  const textColor = theme.colors.primaryTextColor;
  const secondaryTextColor = theme.colors.primaryTextColor;
  const successColor = theme.colors.green[500];
  const errorColor = theme.colors.red[500];

  // Reset PDF-spinner when guide changes
  useEffect(() => {
    if (selectedGuide) setPdfLoading(true);
  }, [selectedGuide]);

  useEffect(() => {
    if (!isOpen) {
      setGuideList([]);
      setSelectedGuide(null);
      setReadGuides({});
      setError(null);
      setIconImageUrl(null);
      setLoading(true);
      return;
    }

    const loadGuidesAndReads = async () => {
      setLoading(true);
      setError(null);
      try {
        let resGuides;
        if (guideType === "tool" && toolId != null) {
          resGuides = await fetchClient<{ resource: any[] }>(
            `/api/guide/findBy?type=tool&toolId=${toolId}`
          );
        } else if (guideType === "admin") {
          resGuides = await fetchClient<{ resource: any[] }>(
            "/api/guide/findBy?type=admin"
          );
        } else {
          resGuides = await fetchClient<{ resource: any[] }>(
            "/api/guide/findBy?type=platform"
          );
        }
        const raw = resGuides?.resource || [];
        const sorted: Guide[] = raw
          .filter((g) => g.isActive)
          .filter((g) =>
            guideType === "tool" && toolId != null
              ? String(g.toolId) === String(toolId)
              : g.type === guideType
          )
          .map((g) => ({
            guideId: g.guideId ?? g.id,
            title: g.guideTitle,
            type: g.type,
            role: g.userRole ? [g.userRole] : [],
            urlPath: g.guideFilePath,
            guideImagePath: g.guideImagePath ?? "",
            sortOrder: g.sortOrder,
            toolId: g.toolId,
          }))
          .sort((a, b) => a.sortOrder - b.sortOrder);
        setGuideList(sorted);
        setSelectedGuide(sorted[0] ?? null);

        const resRead = await fetchClient<{
          resource: Array<{ id: number; guideId: string | number }>;
        }>(`/api/guideRead/?userId=${user?.userId}`);
        const records = resRead?.resource || [];

        const boolMap: Record<string, boolean> = {};
        const recIdMap: Record<string, number> = {};

        sorted.forEach((g) => {
          const rec = records.find(
            (r) => String(r.guideId) === String(g.guideId)
          );
          boolMap[g.urlPath] = !!rec;
          if (rec) recIdMap[g.urlPath] = rec.id;
        });

        setReadGuides(boolMap);
        setRecordIdMap(recIdMap);
      } catch (e: any) {
        console.error("Error loading guides or reads:", e);
        setError(e.message || "Failed to load guides");
      } finally {
        setLoading(false);
      }
    };

    loadGuidesAndReads();
  }, [isOpen, toolId, guideType]);

  const sideW = useBreakpointValue({ base: "full", md: "30%" });
  const mainW = useBreakpointValue({ base: "full", md: "70%" });
  const isMobile = useBreakpointValue({ base: true, md: false });

  const currentIndex = selectedGuide
    ? guideList.findIndex((g) => g.urlPath === selectedGuide.urlPath)
    : -1;

  const handlePrev = useCallback(() => {
    if (currentIndex > 0) setSelectedGuide(guideList[currentIndex - 1]);
  }, [currentIndex, guideList]);

  const handleNext = useCallback(() => {
    if (currentIndex < guideList.length - 1)
      setSelectedGuide(guideList[currentIndex + 1]);
  }, [currentIndex, guideList]);

  const SidebarList = (
    <VStack align="stretch" spacing={4} sx={{
      '&::-webkit-scrollbar': {
        display: 'none'
      },
      '-ms-overflow-style': 'none',
      'scrollbar-width': 'none'
    }}>
      {guideList.length === 0 && (
        <Text color={secondaryTextColor} textAlign="center" mt={10}>
          No guides available.
        </Text>
      )}
      {guideList.map((g) => {
        const isSelected = selectedGuide?.urlPath === g.urlPath;
        return (
          <Box
            key={g.urlPath}
            position="relative"
            border="1px solid"
            borderColor={isSelected ? "blue.400" : borderColor}
            borderRadius="md"
            p={3}
            mb={2}
            _hover={{ bg: transparentize(bg, 0.8)(theme), cursor: "pointer" }}
            onClick={() => {
              setSelectedGuide(g);
              if (isMobile) closeDrawer();
            }}
          >
            <HStack spacing={2} flex={1} overflow="hidden">
              <Article fontSize={"medium"} />
              <Text isTruncated color={textColor}>{g.title}</Text>
            </HStack>
            {recordIdMap[g.urlPath] && (
              <Box position="absolute" top="2px" right="2px">
                <CheckCircleIcon
                  fontSize="small"
                  style={{ color: theme.colors.green[500] }}
                />
              </Box>
            )}
          </Box>
        );
      })}
    </VStack>
  );

  return (
    <>
      {isMobile && (
        <Drawer
          isOpen={isDrawerOpen}
          placement="left"
          onClose={closeDrawer}
          size="xs"
        >
          <DrawerOverlay />
          <DrawerContent bg={bg}>
            <DrawerCloseButton color={textColor} />
            <DrawerBody px={4} sx={{
              '&::-webkit-scrollbar': {
                display: 'none'
              },
              '-ms-overflow-style': 'none',
              'scrollbar-width': 'none'
            }}>
              <VStack align="top" spacing={0} my={3}>
                <Text
                  fontSize={"3xl"}
                  fontWeight="medium"
                  fontFamily={"bonfire"}
                  mb={-1}
                  color={textColor}
                >
                  Guide List
                </Text>
                <Text fontSize="sm" color={secondaryTextColor} mb={4}>
                  ({Object.values(readGuides).filter(Boolean).length} of{" "}
                  {guideList.length} guides completed)
                </Text>
                {SidebarList}
              </VStack>
            </DrawerBody>
          </DrawerContent>
        </Drawer>
      )}

      <Modal isOpen={isOpen} onClose={onClose} size="6xl" isCentered motionPreset="none">
        <ModalOverlay
          as={MotionOverlay}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={overlayTransition as any}
          backdropFilter="blur(4px)"
          bg={transparentize(theme.colors.black, 0.4)(theme)}
        />
        <ModalContent
          as={MotionContent}
          initial={{ scale: 0, rotate: 12.5, opacity: 0 }}
          animate={{ scale: 1, rotate: 0, opacity: 1 }}
          exit={{ scale: 0, rotate: 0, opacity: 0 }}
          transition={contentTransition as any}
          maxH={{ base: "95dvh", md: "95vh" }}
          maxW="90vw"
          minW="80vw"
          h={{ base: "95dvh", md: "900px" }}
          borderRadius="md"
          overflow="hidden"
          display="flex"
          flexDirection="column"
          bg="transparent"
          boxShadow={theme.shadows.xl}
        >
          <ModalCloseButton 
            color={textColor}
            _hover={{ bg: transparentize(bg, 0.8)(theme) }}
          />
          <ModalBody
            p={0}
            display="flex"
            flexDirection="column"
            bg={bg}
            flex="1"
            overflow="hidden"
          >
            <HStack
              px={4}
              py={3}
              bg={bg}
              borderBottom="1px solid"
              borderColor={borderColor}
              justify="left"
              borderRadius={"md"}
              overflow={"none"}
            >
              {isMobile && (
                <IconButton
                  aria-label="Open guide list"
                  icon={<Menu />}
                  onClick={openDrawer}
                  size="md"
                  variant="outline"
                  color={textColor}
                />
              )}
              {iconImageUrl ? (
                <Image src={iconImageUrl} boxSize="40px" alt="Tool icon" />
              ) : (
                <Box
                  boxSize="40px"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  color={theme.colors.primary}
                >
                  <Help fontSize="large" />
                </Box>
              )}
              <Text
                fontSize={["2xl", "2xl", "3xl"]}
                fontWeight="medium"
                fontFamily={"bonfire"}
                mb={-2}
                color={textColor}
              >
                {guideType === "tool"
                  ? "Tool Guide"
                  : guideType === "admin"
                    ? "Admin Guide"
                    : "Platform Guide"}
              </Text>
              <Text
                fontSize="sm"
                color={secondaryTextColor}
                display={{ base: "none", md: "block" }}
              >
                ({Object.values(readGuides).filter(Boolean).length} of{" "}
                {guideList.length} guides completed)
              </Text>
            </HStack>

            {guideList.length === 0 && !loading ? (
              <VStack
                w={mainW}
                width="100%"
                textAlign="center"
                height="100%"
                justify="center"
                pt={4}
              >
                <Text fontFamily="bonfire" fontSize={36} color={textColor}>
                  Oops! No Guides Yet...
                </Text>
                <Text color={secondaryTextColor}>Please contact support if you need assistance</Text>
              </VStack>
            ) : (
              <Flex flex="1" overflow="hidden">
                {!isMobile && (
                  <Box
                    w={sideW}
                    borderRight="1px solid"
                    borderColor={borderColor}
                    overflowY="auto"
                    p={4}
                    bg={bg}
                    sx={{
                      '&::-webkit-scrollbar': {
                        display: 'none'
                      },
                      '-ms-overflow-style': 'none',
                      'scrollbar-width': 'none'
                    }}
                  >
                    {SidebarList}
                  </Box>
                )}
                <Box
                  w={mainW}
                  display="flex"
                  flexDirection="column"
                  flex="1"
                  borderRadius={"md"}
                  overflow={"none"}
                >
                  {selectedGuide ? (
                    <>
                      <Box
                        flex="1"
                        overflowY="auto"
                        bg={transparentBg}
                        position="relative"
                      >
                        {isMobile ? (
                          <Box
                            width="100%"
                            height={"full"}
                            bg={transparentBg}
                          >
                            <ZoomableImg src={selectedGuide.guideImagePath} />
                          </Box>
                        ) : (
                          <>
                            {pdfLoading && (
                              <Flex
                                position="absolute"
                                inset="0"
                                align="center"
                                justify="center"
                                bg={transparentBg}
                                zIndex={1}
                              >
                                <Spinner size="lg" />
                              </Flex>
                            )}
                            <iframe
                              src={`${selectedGuide.urlPath}#toolbar=0&navpanes=0&scrollbar=0&zoom=100`}
                              width="100%"
                              height="100%"
                              onLoad={() => setPdfLoading(false)}
                              aria-label={`Guide PDF: ${selectedGuide.title}`}
                            />
                          </>
                        )}
                      </Box>
                      <Flex
                        px={{ base: 4, md: 6 }}
                        py={{ base: 3, md: 4 }}
                        bg={bg}
                        borderTop="1px solid"
                        borderColor={borderColor}
                        position="sticky"
                        bottom={0}
                        align="center"
                        justify="space-between"
                        minH="48px"
                        borderRadius={"md"}
                        overflow={"none"}
                      >
                        <HStack justify={"start"} color={textColor}>
                          <Button
                            onClick={handlePrev}
                            isDisabled={currentIndex <= 0}
                            px={{ base: 4, md: 3 }}
                            py={{ base: 4, md: 3 }}
                            borderRadius={"full"}
                            variant={"outline"}
                            color={textColor}
                          >
                            <ArrowBack />
                          </Button>
                          <Button
                            onClick={handleNext}
                            isDisabled={currentIndex >= guideList.length - 1}
                            px={{ base: 4, md: 3 }}
                            py={{ base: 4, md: 3 }}
                            borderRadius={"full"}
                            variant={"outline"}
                            color={textColor}
                          >
                            <ArrowForward />
                          </Button>
                        </HStack>
                        {selectedGuide && (
                          <MarkAsRead
                            guideId={selectedGuide.guideId}
                            customerId={user?.customerId ?? ""}
                            userId={user?.userId ?? ""}
                            initialRecordId={recordIdMap[selectedGuide.urlPath]}
                            onMark={(newId) =>
                              setRecordIdMap((prev) => ({
                                ...prev,
                                [selectedGuide.urlPath]: newId,
                              }))
                            }
                            onUnmark={() =>
                              setRecordIdMap((prev) => ({
                                ...prev,
                                [selectedGuide.urlPath]: undefined,
                              }))
                            }
                          />
                        )}
                      </Flex>
                    </>
                  ) : (
                    <Flex flex="1" align="center" justify="center">
                      <Spinner size="lg" />
                    </Flex>
                  )}
                </Box>
              </Flex>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}
