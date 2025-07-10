"use client";

import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  Text,
  Spinner,
  VStack,
  Image,
  SimpleGrid,
  Box,
  Button,
  HStack,
  Tabs,
  TabList,
  TabPanels,
  TabPanel,
  Tab,
  useBreakpointValue,
  Flex,
  IconButton,
  useToast,
  Badge,
  Tooltip,
  Link,
} from "@chakra-ui/react";
import { motion, Variants } from "framer-motion";
import { HospitalityItem } from "@/types/hospitalityHub";
import { useState, useEffect, ReactElement, useRef } from "react";
import BookingModal from "../BookingModal";
import { chakra } from "@chakra-ui/react";
import CloseIcon from "@mui/icons-material/Close";
import InfoIcon from "@mui/icons-material/InfoOutlined";
import LocationOnIcon from "@mui/icons-material/LocationOnOutlined";
import EventAvailableIcon from "@mui/icons-material/EventAvailableOutlined";
import RoomIcon from "@mui/icons-material/Room";
import { getMuiIconByName } from "@/utils/muiIconMapper";
import MobileDrawerSelector from "@/components/modals/MobileDrawerSelector";
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import LinkIcon from "@mui/icons-material/Link";
import ContentCopy from "@mui/icons-material/ContentCopy";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import { useUser } from "@/providers/UserProvider";
import ConfettiAlt from "@/components/animations/confetti/ConfettiAlt";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import InfoRow, { InfoKind } from "./InfoRow";
import DetailsSection from "./DetailsSection";
import LocationSection from "./LocationSection";
import BookingSection from "./BookingSection";
import ItemDetailModalHeader from "./ItemDetailModalHeader";
import ItemDetailModalTabs from "./ItemDetailModalTabs";
import { getCtaText } from "./utils";

interface ItemDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  item?: HospitalityItem | null;
  loading?: boolean;
  siteNames?: string[];
  isPreview?: boolean;
}

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

const MotionVStack = motion(VStack);

const MotionImage = motion(Image);

const MotionHStack = motion(HStack);

const MotionOverlay = chakra(motion.div);
const MotionContent = chakra(motion.div);

const overlayTransition = { duration: 0.2, ease: "easeOut" };
const contentTransition = {
  type: "spring",
  stiffness: 300,
  damping: 30,
};


export const ItemDetailModal = ({
  isOpen,
  onClose,
  item,
  loading,
  siteNames: siteNamesProp,
  isPreview = false,
}: ItemDetailModalProps) => {
  const [bookingOpen, setBookingOpen] = useState(false);
  const siteNames = siteNamesProp || [];
  const isMobile = useBreakpointValue({ base: true, md: false });
  const [tabIndex, setTabIndex] = useState(0);
  const [mapLoading, setMapLoading] = useState(true);
  const toast = useToast();
  const { user } = useUser();
  const [showConfetti, setShowConfetti] = useState(false);
  const engagementLoggedRef = useRef<string | null>(null);

  // Use utility for CTA text
  const ctaText = getCtaText(item);

  const handleCopy = async (value: string) => {
    if (isPreview) return;
    navigator.clipboard.writeText(value);
    toast({
      title: "Copied!",
      description: "Value copied to clipboard.",
      status: "success",
      duration: 1500,
      isClosable: true,
    });
    // Log engagement: offerTaken (only once per item per render)
    if (user?.userId && user?.customerId && item?.id && engagementLoggedRef.current !== item.id) {
      engagementLoggedRef.current = item.id;
      try {
        await fetch("/api/hospitality-hub/engagement", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: user.userId,
            customerId: user.customerId,
            hospitalityItemId: item.id,
            engagementType: "offerTaken",
          }),
        });
      } catch (err) {
        // Optionally log error, but do not block UI
        console.error("Failed to log engagement", err);
      }
    }
  };

  // Drawer items for mobile
  const drawerItems = [
    item && (item.howToDetails || item.extraDetails || item.startDate || item.endDate || item.location || ((item.itemType === "info(tel)" || item.itemType === "info(code)" || item.itemType === "info(email)" || item.itemType === "info(link)") && item.infoContent))
      ? {
          id: "details",
          label: "Details",
          content: <DetailsSection item={item} isPreview={isPreview} handleCopy={handleCopy} />,
          searchableLabel: "Details",
        }
      : null,
    item && item.latitude && item.longitude && item.fullAddress
      ? {
          id: "location",
          label: "Location",
          content: <LocationSection item={item} mapLoading={mapLoading} setMapLoading={setMapLoading} />,
          searchableLabel: "Location",
        }
      : null,
    ctaText
      ? {
          id: "booking",
          label: "Booking",
          content: <BookingSection ctaText={ctaText} isPreview={isPreview} item={item} setBookingOpen={setBookingOpen} />,
          searchableLabel: "Booking",
        }
      : null,
  ].filter(
    (
      i
    ): i is {
      id: string;
      label: string;
      content: ReactElement;
      searchableLabel: string;
    } => i !== null
  );

  const [selectedDrawerId, setSelectedDrawerId] = useState<
    string | number | undefined
  >(drawerItems[0]?.id);
  useEffect(() => {
    setTabIndex(0);
    // Reset engagement tracking when item changes
    engagementLoggedRef.current = null;
  }, [isOpen, item, drawerItems.length]);

  return (
    <>
      <ConfettiAlt
        show={showConfetti}
        colors={[
          "rgb(238, 228, 88)",
          "rgb(118, 114, 64)",
          "#000",
          "#fff",
          "#222",
          "#eee",
        ]}
      />
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        size="xl"
        isCentered
        motionPreset="none"
        closeOnOverlayClick={true}
      >
        <ModalOverlay
          as={MotionOverlay}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={overlayTransition as any}
          bg="blackAlpha.700"
          backdropFilter="blur(8px)"
        />
        <ModalContent
          as={MotionContent}
          initial={{ scale: 0, rotate: 12.5, opacity: 0 }}
          animate={{ scale: 1, rotate: 0, opacity: 1 }}
          exit={{ scale: 0, rotate: 0, opacity: 0 }}
          transition={contentTransition as any}
          maxW="1400px"
          minH="80vh"
          maxH="90vh"
          borderRadius="2xl"
          overflowY="auto"
          m={4}
          bg="rgba(0,0,0,0.75)"
          color="gray.100"
          position="relative"
          display="flex"
          flexDirection="column"
          border="1px solid rgba(238, 228, 88, 0.5)"
          sx={
            isMobile
              ? {
                  "&::-webkit-scrollbar": { display: "none" },
                  scrollbarWidth: "none",
                  msOverflowStyle: "none",
                }
              : {}
          }
          overflowX="hidden"
        >
          {isPreview && (
            <Badge
              position="absolute"
              top={4}
              left={4}
              zIndex={10}
              bg="gray.700"
              color="white"
              px={3}
              py={2}
              borderRadius="md"
              fontSize="md"
              display="flex"
              alignItems="center"
              gap={2}
              boxShadow="md"
              letterSpacing="0.08em"
              fontWeight="bold"
            >
              <VisibilityOutlinedIcon
                style={{ marginRight: 6, fontSize: 20 }}
              />
              PREVIEW MODE
            </Badge>
          )}
          {/* Close button */}
          <IconButton
            aria-label="Close"
            icon={<CloseIcon style={{ fontSize: 24 }} />}
            position="absolute"
            top={[2, 4]}
            right={[2, 4]}
            bg="blackAlpha.400"
            border="none"
            color="white"
            _hover={{ bg: "whiteAlpha.600" }}
            onClick={onClose}
            size={isMobile ? "md" : "sm"}
            zIndex={20}
            borderRadius="md"
            px={isMobile ? 1 : 1}
            py={isMobile ? 1 : 1}
            style={{ backdropFilter: 'blur(6px)' }}
          />
          {/* Main Content: Image + Info */}
          <Flex
            direction={isMobile ? "column" : "row"}
            gap={[0, 2, 8]}
            w="100%"
            align="flex-start"
            px={isMobile ? 3 : 6}
            py={isMobile ? 3 : 6}
            pb={isMobile ? 3 : 6}
          >
            <ItemDetailModalHeader
              item={item}
              isMobile={isMobile}
              siteNames={siteNames}
              getMuiIconByName={getMuiIconByName}
            />
          </Flex>
          <Box w="100%" h="1px" bg="whiteAlpha.200" mb={2} />
          {/* Tabs for Details, Location, Booking (conditionally rendered) */}
          <ItemDetailModalTabs
            drawerItems={drawerItems}
            tabIndex={tabIndex}
            setTabIndex={setTabIndex}
            isMobile={isMobile}
          />
          {item && (
            <BookingModal
              item={item}
              isOpen={bookingOpen}
              onClose={() => setBookingOpen(false)}
              onSuccess={() => {
                setShowConfetti(true);
                setBookingOpen(false);
                onClose();
                setTimeout(() => setShowConfetti(false), 5000);
              }}
            />
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default ItemDetailModal;
