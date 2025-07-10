import React, {
  Dispatch,
  SetStateAction,
  useState,
  useRef,
  useLayoutEffect,
} from "react";
import {
  Box,
  Flex,
  Icon,
  VStack,
  Text,
  Badge,
  IconButton,
  chakra,
  shouldForwardProp,
  useToken,
  useTheme,
  Spinner,
  HStack,
} from "@chakra-ui/react";
import { motion, isValidMotionProp, AnimatePresence } from "framer-motion";
import DashboardIcon from "@mui/icons-material/Dashboard";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import ComputerIcon from "@mui/icons-material/Computer";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import LocalOfferOutlinedIcon from "@mui/icons-material/LocalOfferOutlined";
import BarChartIcon from "@mui/icons-material/BarChart";
import GroupIcon from "@mui/icons-material/Group";
import ChevronRightOutlinedIcon from "@mui/icons-material/ChevronRightOutlined";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { transparentize } from "@chakra-ui/theme-tools";
import { darken, lighten } from "@chakra-ui/theme-tools";

export interface MenuItem {
  label: string;
  icon: JSX.Element;
  onClick: () => void;
  category?: string;
  active?: boolean;
  locked?: boolean;
  badgeNumber?: number;
}

export interface NavigationSidebarProps {
  // SidebarProps fields (copy as needed)
  drawerState: "closed" | "half-open" | "fully-open";
  canHalf?: boolean;
  canFull?: boolean;
  onOpen?: () => void;
  onToggle?: () => void;
  onClose?: () => void;
  title?: string;
  side?: "left" | "right";
  loading?: boolean;
  fadeOnFull?: boolean;
  openButtonIcon?: any;
  menuItems: MenuItem[];
}

const NavigationSidebar: React.FC<NavigationSidebarProps> = (props) => {
  const {
    menuItems,
    drawerState,
    canHalf,
    canFull,
    onOpen,
    onToggle,
    onClose,
    title,
    side,
    loading,
    fadeOnFull,
    openButtonIcon,
  } = props;
  const theme = useTheme();
  const primary = theme.colors.primary;
  const elementBG = theme.colors.elementBG;
  const primaryTextColor = theme.colors.primaryTextColor;
  const elementBGTransparent = transparentize(elementBG, 0.75)(theme);
  const [open, setOpen] = useState<boolean>(drawerState !== "closed");
  const [loadingLabel, setLoadingLabel] = useState<string | null>(null);
  const labelMeasureRef = useRef<HTMLDivElement>(null);
  const [maxLabelWidth, setMaxLabelWidth] = useState<number>(0);

  // Measure the longest label width after render
  useLayoutEffect(() => {
    if (labelMeasureRef.current) {
      const widths = Array.from(labelMeasureRef.current.children).map(
        (el) => (el as HTMLElement).offsetWidth
      );
      setMaxLabelWidth(Math.max(0, ...widths));
    }
  }, [menuItems]);

  const stackRef = useRef<HTMLDivElement>(null);
  const [hasTopShadow, setHasTopShadow] = useState(false);
  const [hasBottomShadow, setHasBottomShadow] = useState(false);

  useLayoutEffect(() => {
    const el = stackRef.current;
    if (!el) return;

    const update = () => {
      setHasTopShadow(el.scrollTop > 0);
      setHasBottomShadow(el.scrollHeight - el.scrollTop > el.clientHeight + 1);
    };

    update(); // run once after mount
    el.addEventListener("scroll", update);
    return () => el.removeEventListener("scroll", update);
  }, []);

  // Calculate sidebar width: icon (32px) + gap (12px) + label + padding (32px)
  const expandedSidebarW = maxLabelWidth
    ? `${32 + 12 + maxLabelWidth + 32}px`
    : "215px";
  const sidebarW = open ? expandedSidebarW : "44px";

  const handleOptionClick = (item: MenuItem) => async () => {
    setLoadingLabel(item.label);
    try {
      await item.onClick?.();
    } finally {
      setLoadingLabel(null);
    }
  };

  // Group menu items by category
  const groupedMenuItems = menuItems.reduce(
    (acc, item) => {
      const cat = item.category || "";
      if (!acc[cat]) acc[cat] = [];
      acc[cat].push(item);
      return acc;
    },
    {} as Record<string, MenuItem[]>
  );

  /* ----------  variants  ---------- */
  const sidebarVariants = {
    open: {
      width: expandedSidebarW,
      transition: { ease: [0.33, 1, 0.68, 1], duration: 0.35 },
    },
    closed: {
      width: "55px",
      transition: { ease: [0.65, 0, 0.35, 1], duration: 0.28 },
    },
  };

  return (
    <>
      {/* Hidden label measurer */}
      <Box
        ref={labelMeasureRef}
        position="absolute"
        visibility="hidden"
        height={0}
        overflow="hidden"
        whiteSpace="nowrap"
        pointerEvents="none"
        zIndex={-1}
      >
        {menuItems.map((item) => (
          <Text
            key={item.label}
            fontSize="md"
            fontWeight={item.active ? "bold" : "medium"}
            px={0}
            py={0}
            m={0}
            fontFamily="inherit"
          >
            {item.label}
          </Text>
        ))}
      </Box>
      <motion.nav
        variants={sidebarVariants}
        animate={open ? "open" : "closed"}
        initial={false} // ← no mount-time jump
        style={{
          position: "fixed",
          /* left side stays parked 8 px from the viewport – only width changes */
          left: 8, // ← pin it to the left instead of margin
          top: 65,
          bottom: 40,
          zIndex: 160,
          borderRight: `1px solid ${elementBG}`,
          background: elementBGTransparent,
          borderRadius: 8,
          display: "flex",
          flexDirection: "column",
          backdropFilter: "blur(6px)",
          overflow: "hidden",
        }}
      >
        <Box position="relative" flex={1} overflow="hidden" display={"flex"}>
          {/*  scrollable list  */}
          <VStack
            ref={stackRef}
            spacing={1}
            align="start"
            flex={1}
            overflowY="auto"
            gap={0}
            px={1}
            py={2}
            sx={{
              "::-webkit-scrollbar": { display: "none" },
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
          >
            {Object.entries(groupedMenuItems).map(([category, items]) => (
              <React.Fragment key={category || "uncategorized"}>
                {category && (
                  <Box
                    h="24px"
                    display="flex"
                    alignItems="center"
                    mb={"4px"}
                  >
                    <motion.div
                      initial={false}
                      animate={open ? { opacity: 1, width: "auto" } : { opacity: 0, width: 0 }}
                      transition={{ type: "spring", stiffness: 300, damping: 40 }}
                      style={{
                        overflow: "hidden",
                        whiteSpace: "nowrap",
                        display: "flex",
                        alignItems: "center",
                        height: "100%",
                      }}
                    >
                      <Text
                        fontSize="xs"
                        fontWeight="semibold"
                        color={theme.colors.primaryTextColor}
                        textTransform="uppercase"
                        letterSpacing="wider"
                        textAlign={"left"}
                        px={2}
                      >
                        {category}
                      </Text>
                    </motion.div>
                    {!open && (
                      <Box w="100%" display="flex" alignItems="center" justifyContent="left" p={0} m={0}>
                        <Box h="1px" w="55px" borderRadius="full" bg={theme.colors.primaryTextColor} opacity={0.25} />
                      </Box>
                    )}
                  </Box>
                )}
                {items.map((item, idx) => (
                  <Option
                    key={item.label}
                    Icon={item.icon.type}
                    title={item.label}
                    active={item.active}
                    open={open}
                    notifs={item.badgeNumber}
                    onClick={handleOptionClick(item)}
                    loading={loadingLabel === item.label}
                    primary={primary}
                  />
                ))}
              </React.Fragment>
            ))}
          </VStack>
          {/*  top fade  */}
          <Box
            position="absolute"
            top={0}
            left={0}
            right={0}
            h="16px"
            pointerEvents="none"
            bg={`linear-gradient(to bottom,rgb(144, 144, 144), transparent)`}
            opacity={hasTopShadow ? 1 : 0}
            transition="opacity 0.2s"
            zIndex={180}
          />
          {/*  bottom fade  */}
          <Box
            position="absolute"
            bottom={0}
            left={0}
            right={0}
            h="16px"
            pointerEvents="none"
            bg={`linear-gradient(to top, rgb(144, 144, 144), transparent)`}
            opacity={hasBottomShadow ? 1 : 0}
            transition="opacity 0.2s"
            zIndex={180}
          />
        </Box>
        <ToggleClose open={open} setOpen={setOpen} />
      </motion.nav>
    </>
  );
};

export default NavigationSidebar;

/**
 * -----------------------------------------------------------------------------
 * Motion‑enabled Chakra component helpers
 * -----------------------------------------------------------------------------
 */
const MotionBox = chakra(motion.div, {
  shouldForwardProp: (prop) =>
    isValidMotionProp(prop) || shouldForwardProp(prop),
});
const MotionFlex = chakra(motion.div, {
  shouldForwardProp: (prop) =>
    isValidMotionProp(prop) || shouldForwardProp(prop),
});

/* put this near the Option component */
const labelVariants = {
  open: {
    scaleX: 1,
    opacity: 1,
    transition: { ease: "easeOut", duration: 0.18 },
  },
  closed: {
    scaleX: 0,
    opacity: 0,
    transition: { ease: "easeIn", duration: 0.12 },
  },
};

/**
 * -----------------------------------------------------------------------------
 * Option button
 * -----------------------------------------------------------------------------
 */
interface OptionProps {
  Icon: typeof DashboardIcon; // Any MUI icon component type
  title: string;
  active?: boolean;
  open: boolean;
  notifs?: number;
  onClick?: () => void;
  loading?: boolean;
  primary?: string;
}

const Option: React.FC<OptionProps> = ({
  Icon,
  title,
  active,
  open,
  notifs,
  onClick,
  loading,
  primary,
}) => {
  const theme = useTheme();
  const activeBg = safeColor(darken(safeColor(transparentize(primary as string, 0.12)(theme), primary as string), 0.08)(theme), primary as string);
  const hoverBg = safeColor(lighten(safeColor(transparentize(primary as string, 0.08)(theme), primary as string), 0.12)(theme), primary as string);
  const normalBg = safeColor(transparentize(theme.colors.elementBG as string, 0.4)(theme), theme.colors.elementBG as string);
  const activeText = safeColor(lighten(theme.colors.primaryTextColor as string, 0.12)(theme), theme.colors.primaryTextColor as string);
  const hoverText = safeColor(darken(primary as string, 0.18)(theme), primary as string);
  const normalText = safeColor(transparentize(theme.colors.primaryTextColor as string, 0.8)(theme), theme.colors.primaryTextColor as string);
  return (
    <MotionFlex
      layout
      as="button"
      h="56px"
      w="full"
      px="0px"
      borderRadius="xl"
      flexDirection="row"
      alignItems="center"
      justifyContent="center"
      gap={0}
      bg="rgba(255,255,255,0.12)"
      border="1.5px solid rgba(255,255,255,0.25)"
      boxShadow="0 2px 8px rgba(0,0,0,0.08), 0 1.5px 4px rgba(0,0,0,0.10)"
      backdropFilter="blur(8px)"
      color={active ? '#222' : '#333'}
      fontWeight={active ? 'bold' : 'medium'}
      fontSize="md"
      transition="all 0.18s cubic-bezier(.4,2,.6,1)"
      _hover={{
        bg: "rgba(255,255,255,0.22)",
        border: "1.5px solid rgba(255,255,255,0.45)",
        boxShadow: "0 4px 16px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.12)",
        transform: "translateY(-2px) scale(1.03)",
        color: "#111",
      }}
      _active={{
        bg: "rgba(255,255,255,0.28)",
        border: "1.5px solid rgba(255,255,255,0.65)",
        boxShadow: "0 6px 24px rgba(0,0,0,0.16), 0 3px 12px rgba(0,0,0,0.16)",
        color: "#000",
        textShadow: "0 1px 8px rgba(255,255,255,0.25)",
      }}
      style={{
        WebkitBackdropFilter: "blur(8px)",
        backdropFilter: "blur(8px)",
      }}
      onClick={onClick}
      position="relative"
      cursor="pointer"
      my={1}
    >
      <HStack h="44px" w={open? "full" : "55px"} justifyContent={open? "flex-start" : "center"}>
        <Box
          as="span"
          fontSize="xl"
          display="flex"
          alignItems="center"
          justifyContent="center"
          color={active ? primary : activeText}
        >
          {loading ? <Spinner size="sm" /> : <Icon />}
        </Box>
        {/* replace the existing wrapper inside Option */}
        <motion.div
          variants={labelVariants}
          initial={false}
          animate={open ? "open" : "closed"}
          style={{
            originX: 0, // ← left-edge anchor
            display: "flex",
            alignItems: "center",
            whiteSpace: "nowrap",
            overflow: "hidden",
          }}
        >
          <Text
            fontSize="md"
            fontWeight={active ? "bold" : "medium"}
            noOfLines={1}
            ml={1} // ← simple static gap
          >
            {title}
          </Text>
        </motion.div>
        {open && notifs && (
          <Badge
            colorScheme="primary"
            borderRadius="full"
            fontSize="xs"
            px={2}
            py={0.5}
            ml="auto"
          >
            {notifs}
          </Badge>
        )}
      </HStack>
    </MotionFlex>
  );
};
/**
 * -----------------------------------------------------------------------------
 * Toggle / Collapse control
 * -----------------------------------------------------------------------------
 */
interface ToggleCloseProps {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

const ToggleClose: React.FC<ToggleCloseProps> = ({ open, setOpen }) => {
  const borderColor = useToken("colors", "gray.200");
  return (
    <MotionBox
      layout
      borderTopWidth="1px"
      borderColor={borderColor}
      as="button"
      _hover={{ bg: "gray.50" }}
      onClick={() => setOpen((prev) => !prev)}
      w="full"
      mt="auto"
      bg="white"
      px={3}
      py={3}
      alignItems="center"
      justifyContent="flex-start"
    >
      <Flex align="center">
        <MotionFlex
          layout
          w="22px"
          h="22px"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Icon
            as={ChevronRightOutlinedIcon}
            transition="transform 0.2s"
            transform={open ? "rotate(180deg)" : undefined}
            color="gray.500"
          />
        </MotionFlex>
      </Flex>
    </MotionBox>
  );
};

function safeColor(result: string | void, fallback: string): string {
  return typeof result === 'string' && result ? result : fallback;
}
