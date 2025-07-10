// subscription-actions.tsx
"use client";

import React from "react";
import {
  Box,
  Grid,
  Text,
  useColorModeValue,
  chakra,
  shouldForwardProp as chakraShouldForwardProp,
  Icon as ChakraIcon,
  BoxProps,
  useTheme,
} from "@chakra-ui/react";
import {
  motion,
  isValidMotionProp,
  HTMLMotionProps,
  Transition,
} from "framer-motion";
import { useRouter } from "next/navigation";
import { SvgIconComponent } from "@mui/icons-material";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import SubscriptionsIcon from "@mui/icons-material/Subscriptions";
import HistoryIcon from "@mui/icons-material/History";
import ContactMailIcon from "@mui/icons-material/ContactMail";
import CancelIcon from "@mui/icons-material/Cancel";
import { darken } from "polished";
import { ChevronRight } from "@mui/icons-material";
import { useBreakpointValue } from "@chakra-ui/react";

/* --------------------------------------------------------------------------------
  Types
-------------------------------------------------------------------------------- */
interface SubscriptionLike {
  invoiceUrl?: string | null;
}

interface CardDef {
  title: string;
  subtitle: string;
  Icon: SvgIconComponent;
  onClick?: () => void;
  disabled?: boolean;
}

interface SubscriptionActionsProps {
  subscription: SubscriptionLike;
  onOpenCancel: () => void;
}

const ActionCard: React.FC<CardDef> = ({
  title,
  subtitle,
  Icon,
  onClick,
  disabled,
}) => {
  const theme       = useTheme();
  const primary     = theme.colors.primary;
  const secondary   = theme.colors.secondary ?? primary;
  const iconTint    = darken(0.1, primary);
  const textMuted   = "gray.400";

  const isInteractive   = Boolean(onClick) && !disabled;
  /** ⬇︎ hover/press only on md ↑ */
  const enableHover     = useBreakpointValue({ base: false, md: true }) ?? false;

  /* helpers so we don’t repeat ternaries */
  const liftHover   =
    isInteractive && enableHover
      ? { transform: "translateY(-4px)", boxShadow: "lg" }
      : undefined;

  const pressActive =
    isInteractive && enableHover ? { transform: "scale(0.97)" } : undefined;

  const sheetHover  =
    isInteractive && enableHover ? { transform: "translateY(0%)" } : {};

  const bigIconHover =
    isInteractive && enableHover
      ? { color: iconTint, transform: "rotate(12deg)" }
      : {};

  const fgHoverCol    = isInteractive && enableHover ? { color: "white" } : {};
  const titleHoverCol = fgHoverCol;
  const subHoverCol   =
    isInteractive && enableHover ? { color: "gray.200" } : {};

  return (
    <Box
      role="group"
      as="button"
      onClick={isInteractive ? onClick : undefined}
      cursor={isInteractive ? "pointer" : "default"}
      position="relative"
      display={{ base: "flex", md: "block" }}
      alignItems={{ base: "center", md: "initial" }}
      justifyContent={{ base: "space-between", md: "initial" }}
      p={{ base: 3, md: 4 }}
      bg="white"
      borderWidth="1px"
      borderColor="gray.200"
      rounded="md"
      overflow="hidden"
      opacity={disabled ? 0.5 : 1}
      _hover={liftHover}
      _active={pressActive}
      transition="transform 0.2s ease, box-shadow 0.2s ease"
    >
      {/* ── Sliding gradient sheet (md ↑) ── */}
      <Box
        display={{ base: "none", md: "block" }}
        position="absolute"
        inset={0}
        bgGradient={`linear(to-r, ${primary}, ${secondary})`}
        transform="translateY(100%)"
        transition="transform 0.3s ease"
        _groupHover={sheetHover}
        pointerEvents="none"
        zIndex={0}
      />

      {/* ── Large decorative icon (md ↑) ── */}
      <ChakraIcon
        as={Icon}
        display={{ base: "none", md: "block" }}
        position="absolute"
        top={{ md: "-1rem", lg: "-1.75rem" }}
        right={{ md: "-1rem", lg: "-1.5rem" }}
        fontSize={{ md: "7xl", lg: "8xl" }}
        color="gray.100"
        transition="all 0.3s ease"
        _groupHover={bigIconHover}
        pointerEvents="none"
        zIndex={0}
      />

      {/* ── Foreground content ── */}
      <Box
        position="relative"
        zIndex={1}
        display={{ base: "flex", md: "block" }}
        alignItems="center"
      >
        <ChakraIcon
          as={Icon}
          mr={{ base: 3, md: 0 }}
          fontSize={{ base: "xl", md: "2xl" }}
          color={primary}
          transition="color 0.3s ease"
          _groupHover={fgHoverCol}
        />
        <Box textAlign={{ base: "left", md: "inherit" }}>
          <Text
            fontSize={{ base: "md", md: "lg" }}
            fontWeight="medium"
            transition="color 0.3s ease"
            _groupHover={titleHoverCol}
          >
            {title}
          </Text>
          <Text
            fontSize={{ base: "xs", md: "sm" }}
            color={textMuted}
            transition="color 0.3s ease"
            _groupHover={subHoverCol}
          >
            {subtitle}
          </Text>
        </Box>
      </Box>

      {/* Chevron on phones */}
      <ChakraIcon
        as={ChevronRight}
        display={{ base: "block", md: "none" }}
        fontSize="md"
        color="gray.300"
      />
    </Box>
  );
};

export const SubscriptionActions: React.FC<SubscriptionActionsProps> = ({
  subscription,
  onOpenCancel,
}) => {
  const router = useRouter();

  const cards: CardDef[] = [
    {
      title: "Invoice",
      subtitle: "View latest invoice",
      Icon: ReceiptLongIcon,
      onClick: subscription.invoiceUrl
        ? () =>
            window.open(
              subscription.invoiceUrl!,
              "_blank",
              "noopener,noreferrer"
            )
        : undefined,
      disabled: !subscription.invoiceUrl,
    },
    {
      title: "Manage Subscription",
      subtitle: "Update plan / payment",
      Icon: SubscriptionsIcon,
      onClick: () => router.push("/tool-store/manage-subscription"),
    },
    {
      title: "Past Subscriptions",
      subtitle: "See history (coming soon)",
      Icon: HistoryIcon,
      disabled: true,
    },
    {
      title: "Contact Sales",
      subtitle: "Get in touch",
      Icon: ContactMailIcon,
      onClick: () => router.push("/tool-store/contact-sales"),
    },
    {
      title: "Cancel Subscription",
      subtitle: "Stop future billing",
      Icon: CancelIcon,
      onClick: onOpenCancel,
      disabled: true
    },
  ];

  return (
    <Grid
      templateColumns={{
        base: "1fr",
        md: "repeat(2, 2fr)",
        lg: "repeat(2, 1fr)",
        xl: "repeat(2, 1fr)",
      }}
      gap={4}
    >
      {cards.map((c) => (
        <ActionCard key={c.title} {...c} />
      ))}
    </Grid>
  );
};

export default SubscriptionActions;
