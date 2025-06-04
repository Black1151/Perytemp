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
  useColorModeValue,
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
} from "@chakra-ui/react";
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
  sortOrder: number;
  toolId?: number | string;
};

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
        if (guideType === 'tool' && toolId != null) {
          resGuides = await fetchClient<{ resource: any[] }>(
            `/api/guide/findBy?type=tool&toolId=${toolId}`
          );
        } else if (guideType === 'admin') {
          resGuides = await fetchClient<{ resource: any[] }>(
            '/api/guide/findBy?type=admin'
          );
        } else {
          resGuides = await fetchClient<{ resource: any[] }>(
            '/api/guide/findBy?type=platform'
          );
        }
        const raw = resGuides?.resource || [];
        const sorted: Guide[] = raw
          .filter(g => g.isActive)
          .filter(g =>
            guideType === 'tool' && toolId != null
              ? String(g.toolId) === String(toolId)
              : g.type === guideType
          )
          .map(g => ({
            guideId: g.guideId ?? g.id,
            title: g.guideTitle,
            type: g.type,
            role: g.userRole ? [g.userRole] : [],
            urlPath: g.guideFilePath,
            sortOrder: g.sortOrder,
            toolId: g.toolId,
          }))
          .sort((a, b) => a.sortOrder - b.sortOrder);
        setGuideList(sorted);
        setSelectedGuide(sorted[0] ?? null);

        const resRead = await fetchClient<{ resource: Array<{ id: number; guideId: string | number }> }>(
          `/api/guideRead/?userId=${user?.userId}`
        );
        const records = resRead?.resource || [];

        const boolMap: Record<string, boolean> = {};
        const recIdMap: Record<string, number> = {};

        sorted.forEach(g => {
          const rec = records.find(r => String(r.guideId) === String(g.guideId));
          boolMap[g.urlPath] = !!rec;
          if (rec) recIdMap[g.urlPath] = rec.id;
        });

        setReadGuides(boolMap);
        setRecordIdMap(recIdMap);
      } catch (e: any) {
        console.error('Error loading guides or reads:', e);
        setError(e.message || 'Failed to load guides');
      } finally {
        setLoading(false);
      }
    };

    loadGuidesAndReads();
  }, [isOpen, toolId, guideType]);

  const bg = useColorModeValue("white", "gray.800");
  const pdfBg = useColorModeValue("white", "gray.50");
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
    <VStack align="stretch" spacing={2}>
      {guideList.map((g) => (
        <Button
          key={g.urlPath}
          justifyContent="space-between"
          variant={selectedGuide?.urlPath === g.urlPath ? "solid" : "ghost"}
          onClick={() => {
            setSelectedGuide(g);
            if (isMobile) closeDrawer();
          }}
          px={{ base: 2, md: 2 }}
          py={{ base: 6, md: 2 }}
          fontSize={{ base: "md", md: "sm" }}
          _hover={{ bg: "gray.100" }}
        >
          <HStack spacing={2} justify="left" flex={1} overflow="hidden">
            {isMobile ? (
              <Article fontSize="medium" />
            ) : (
              <Article fontSize="small" />
            )}
            <Text>{g.title}</Text>
          </HStack>
          {recordIdMap[g.urlPath] && (
            <CheckCircleIcon style={{ color: "#07ad4c" }} />
          )}
        </Button>
      ))}
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
          <DrawerContent>
            <DrawerCloseButton />
            <DrawerBody px={4}>
              <VStack align="top" spacing={0} my={3}>
                <Text fontSize="xl" fontWeight="bold">
                  Guide List
                </Text>
                <Text fontSize="sm" color="gray.500" mb={4}>
                  ({Object.values(readGuides).filter(Boolean).length} of{" "}
                  {guideList.length} guides completed)
                </Text>
                {SidebarList}
              </VStack>
            </DrawerBody>
          </DrawerContent>
        </Drawer>
      )}

      <Modal isOpen={isOpen} onClose={onClose} size="6xl" isCentered>
        <ModalOverlay />
        <ModalContent
          maxH="90vh"
          maxW="90vw"
          minH="80vh"
          minW="80vw"
          borderRadius={"md"}
          overflow={"none"}
        >
          <ModalCloseButton />
          <ModalBody
            p={0}
            display="flex"
            flexDirection="column"
            bg={bg}
            borderRadius={"md"}
            overflow={"none"}
          >
            <HStack
              px={4}
              py={3}
              bg={bg}
              borderBottom="1px solid"
              borderColor="gray.200"
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
              <Text fontSize="xl" fontWeight="bold">
                {guideType === "tool"
                  ? "Tool Guide"
                  : guideType === "admin"
                    ? "Admin Guide"
                    : "Platform Guide"}
              </Text>
              <Text
                fontSize="sm"
                color="gray.500"
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
                <Text fontFamily="bonfire" fontSize={36}>
                  Oops! No Guides Yet...
                </Text>
                <Text>Please contact support if you need assistance</Text>
              </VStack>
            ) : (
              <Flex flex="1" overflow="hidden">
                {!isMobile && (
                  <Box
                    w={sideW}
                    borderRight="1px solid"
                    borderColor="gray.200"
                    overflowY="auto"
                    p={4}
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
                        // position="relative"
                        bg={pdfBg}
                      >
                        {pdfLoading && (
                          <Flex
                            position="absolute"
                            inset="0"
                            align="center"
                            justify="center"
                            bg={pdfBg}
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
                      </Box>
                      <Flex
                        px={{ base: 4, md: 6 }}
                        py={{ base: 3, md: 4 }}
                        bg={bg}
                        borderTop="1px solid"
                        borderColor="gray.200"
                        position="sticky"
                        bottom={0}
                        align="center"
                        justify="space-between"
                        minH="48px"
                        borderRadius={"md"}
                        overflow={"none"}
                      >
                        <HStack justify={"start"} color="white">
                          <Button
                            onClick={handlePrev}
                            isDisabled={currentIndex <= 0}
                            px={{ base: 4, md: 3 }}
                            py={{ base: 4, md: 3 }}
                            borderRadius={"full"}
                            variant={"outline"}
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
