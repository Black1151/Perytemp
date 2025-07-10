import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  ModalCloseButton,
  HStack,
  Text,
  Box,
  VStack,
  useBreakpointValue,
  useTheme,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Button,
  Icon,
  Skeleton,
  SkeletonText,
  chakra,
} from "@chakra-ui/react";
import {
  KeyboardArrowDown,
  Check,
  Close as CloseIcon,
} from "@mui/icons-material";
import { ReactNode } from "react";
import { motion, Transition } from "framer-motion";
import { transparentize } from "@chakra-ui/theme-tools";
import MobileDrawerSelector from "./MobileDrawerSelector";
import { Box as ChakraBox } from "@chakra-ui/react";

type MobileSelectorItem = {
  id: string | number;
  label: React.ReactNode | string;
  isActive?: boolean;
  content: ReactNode;
};

type Props = {
  isOpen: boolean;
  onClose: () => void;

  icon: ReactNode;
  title: string;
  total?: number;

  sidebar: ReactNode;
  panel: ReactNode;

  mobileItems?: MobileSelectorItem[];
  mobileSelectedId?: string | number;
  onMobileSelect?: (id: string | number) => void;

  sidebarLoading?: boolean;
  sidebarSkeletonCount?: number;

  contentMaxW?: string;
  contentMaxH?: string;
  contentMinH?: string;

  footer?: ReactNode;
};

const MotionOverlay = chakra(motion.div);
const MotionContent = chakra(motion.div);
const MotionBox = motion(ChakraBox);

const overlayTransition: Transition = { duration: 0.2, ease: "easeOut" };
const contentTransition: Transition = {
  type: "spring",
  stiffness: 300,
  damping: 30,
};

export default function SplitPaneModal({
  isOpen,
  onClose,
  icon,
  title,
  total,
  sidebar,
  panel,
  mobileItems,
  mobileSelectedId,
  onMobileSelect,
  sidebarLoading = false,
  sidebarSkeletonCount = 6,
  contentMaxW = "1200px",
  contentMaxH = "85vh",
  contentMinH = "500px",
  footer,
}: Props) {
  const isMobile = useBreakpointValue({ base: true, md: false });
  const theme = useTheme();
  const bg = theme.colors.elementBG;
  const transparentBg = transparentize(theme.colors.elementBG, 0.65)(theme);
  const borderColor = transparentize(
    theme.colors.primaryTextColor,
    0.15
  )(theme);
  const textColor = theme.colors.primaryTextColor;
  const secondaryTextColor = theme.colors.primaryTextColor;
  const successColor = theme.colors.green[500];
  const errorColor = theme.colors.red[500];

  const SkeletonSidebar = () => (
    <VStack align="stretch" spacing={4}>
      {Array.from({ length: sidebarSkeletonCount }).map((_, i) => (
        <Box
          key={i}
          border="1px solid"
          borderColor={borderColor}
          borderRadius={theme.radii.md}
          p={3}
        >
          <Skeleton h="20px" mb={2} />
          <SkeletonText noOfLines={2} spacing="2" skeletonHeight="14px" />
        </Box>
      ))}
    </VStack>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="5xl"
      isCentered
      motionPreset="none"
    >
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
        maxW={["90vw", null, null, contentMaxW]}
        maxH={contentMaxH}
        minH={contentMinH}
        borderRadius={theme.radii.md}
        overflow="hidden"
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
          flex="1"
          minH="0"
        >
          <MotionBox
            display="flex"
            flexDirection="column"
            flex="1"
            minH="0"
            layout
            transition={{ type: "spring", duration: 0.4 }}
          >
            <HStack
              px={4}
              py={3}
              bg={bg}
              borderBottom="1px solid"
              borderColor={borderColor}
              fontSize="28px"
              align="center"
            >
              {icon}
              <Text
                fontSize={["xl", "2xl", "3xl"]}
                fontWeight="medium"
                fontFamily="bonfire"
                mb={-3}
                color={textColor}
              >
                {title}
              </Text>
              {total !== undefined && !isMobile && (
                <Text fontSize="sm" color={secondaryTextColor} ml={2}>
                  {total} total
                </Text>
              )}
            </HStack>

            <Box display="flex" flex="1" overflow="hidden" minH="0">
              {!isMobile && (
                <Box
                  width="30%"
                  overflowY="auto"
                  minH="0"
                  borderRight="1px solid"
                  borderColor={borderColor}
                  p={4}
                  bg={bg}
                >
                  {sidebarLoading ? <SkeletonSidebar /> : sidebar}
                </Box>
              )}

              <Box
                width={isMobile ? "100%" : "70%"}
                p={4}
                bg={transparentBg}
                overflowY="auto"
              >
                {sidebarLoading ? null : (
                  <>
                    {isMobile && mobileItems?.length && onMobileSelect && (
                      <Box mb={4}>
                        <MobileDrawerSelector
                          items={mobileItems}
                          selectedId={mobileSelectedId}
                          onSelect={onMobileSelect}
                        />
                      </Box>
                    )}
                    {panel}
                  </>
                )}
              </Box>
            </Box>
          </MotionBox>
          {footer && (
            <Box px={4} py={3} bg={bg} borderTop="1px solid" borderColor={borderColor}>
              {footer}
            </Box>
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
