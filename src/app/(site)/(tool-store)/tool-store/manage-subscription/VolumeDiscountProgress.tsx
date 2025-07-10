import React, { useState, useEffect } from "react";
import {
  Box,
  Progress,
  Text,
  VStack,
  HStack,
  useColorModeValue,
  Tooltip,
  useTheme,
  Badge,
  IconButton,
} from "@chakra-ui/react";
import { useBasket } from "../useBasket";
import { motion, AnimatePresence, animate } from "framer-motion";
import ConfettiAlt from "@/components/animations/confetti/ConfettiAlt";
import { SpringModal } from "@/components/modals/springModal/SpringModal";
import InfoIcon from "@mui/icons-material/Info";
import { Info } from "@mui/icons-material";
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

/* ------------------------------------------------------------------ */
/*  tier table                                                        */
/* ------------------------------------------------------------------ */
const DISCOUNT_TIERS = [
  { minLicenses: 21, discountPercentage: 20 },
  { minLicenses: 101, discountPercentage: 30 },
  { minLicenses: 201, discountPercentage: 50 },
];

const MotionBox = motion(Box);

/* ------------------------------------------------------------------ */
/*  component                                                         */
/* ------------------------------------------------------------------ */
const VolumeDiscountProgress: React.FC = () => {
  /* ---------- derived data --------------------------------------- */
  const { basket } = useBasket();
  const theme = useTheme();
  const currentLicenses = basket?.quantity ?? 0;

  const nextTier = DISCOUNT_TIERS.find(
    (t) => t.minLicenses > currentLicenses
  );

  const targetProgress = nextTier
    ? (currentLicenses / nextTier.minLicenses) * 100
    : 100;

  const currentDiscountTier = [...DISCOUNT_TIERS]
    .reverse()
    .find((t) => currentLicenses >= t.minLicenses);
  const currentDiscountPct = currentDiscountTier?.discountPercentage ?? 0;
  const currentTierMin = currentDiscountTier?.minLicenses ?? 0;

  /* ---------- local state ---------------------------------------- */
  const [progress, setProgress] = useState(targetProgress);
  const [prevTierMin, setPrevTierMin] = useState(currentTierMin); // ← remember last tier
  const [showConfetti, setShowConfetti] = useState(false);
  const [showTierBanner, setShowTierBanner] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  /* ---------- animate progress bar ------------------------------- */
  useEffect(() => {
    const controls = animate(progress, targetProgress, {
      type: "spring",
      stiffness: 120,
      damping: 22,
      onUpdate: v => setProgress(v),
    });
    return controls.stop;
  }, [targetProgress]);

  /* ---------- fire confetti & banner on teir upgrade --------------- */

  /* 1️⃣ detect tier change                                              */
  useEffect(() => {
    const currentTierMin = currentDiscountTier?.minLicenses ?? 0;

    if (currentTierMin > prevTierMin) {
      // 🚀 climbed to a HIGHER tier → celebrate
      setShowTierBanner(true);
      setShowConfetti(true);
    }

    // 🔑 always keep prevTierMin in sync so future climbs re-trigger
    if (currentTierMin !== prevTierMin) setPrevTierMin(currentTierMin);
  }, [currentDiscountTier]);   // fires only when tier object changes

  /* 2️⃣ hide banner + reset flags after 2s                          */
  useEffect(() => {
    if (!showTierBanner) return;
    const id = setTimeout(() => {
      setShowTierBanner(false);
      setShowConfetti(false);
    }, 2000);
    return () => clearTimeout(id);
  }, [showTierBanner]);

  /* ---------- colours ------------------------------------------- */
  const cardBg = theme.colors.elementBG
  const textColour = theme.colors.primaryTextColor
  const trackCol = "gray.100"

  /* ------------------------------------------------------------------ */
  /*  modal body                                  */
  /* ------------------------------------------------------------------ */
  const DiscountTiersContent = () => (
    <VStack align="stretch" spacing={4} w="full">
      <VStack align="stretch" spacing={3} mb={4}>
        <Text fontSize="md" color="white">
          Volume discounts are automatically applied to your subscription when
          you reach certain license thresholds. The more Licences you purchase,
          the higher your discount percentage becomes.
        </Text>
      </VStack>

      {DISCOUNT_TIERS.map((tier, idx) => {
        const isAchieved = currentLicenses >= tier.minLicenses;
        const isNextTier =
          !isAchieved && tier.minLicenses === nextTier?.minLicenses;
        const isFutureTier = !isAchieved && !isNextTier;

        return (
          <motion.div
            key={idx}
            initial={{ opacity: 1, y: 0 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, type: "spring" }}
          >
            <Tooltip
              label={`${tier.discountPercentage}% off when you have ${tier.minLicenses} or more Licences`}
              placement="top"
            >
              <HStack
                spacing={2}
                p={3}
                bg="white"
                borderRadius="md"
                _hover={{ bg: "gray.50" }}
              >
                <Text fontSize="md" fontWeight="medium" color="gray.800">
                  {tier.discountPercentage}% off
                </Text>
                <Text fontSize="md" color="gray.700">
                  ({tier.minLicenses}+ Licences)
                </Text>
                {isAchieved &&
                  tier.minLicenses === currentDiscountTier?.minLicenses && (
                    <Badge colorScheme="green" ml={2}>
                      Your Tier
                    </Badge>
                  )}
              </HStack>
            </Tooltip>
          </motion.div>
        );
      })}
    </VStack>
  );

  /* ---------- render --------------------------------------------- */
  return (
    <VStack
      bg={cardBg}
      borderRadius="md"
      p={4}
      spacing={4}
      align="stretch"
      w="full"
      position="relative"
      overflow="hidden"
    >
      {/* banner (slides, does not affect height) */}
      <AnimatePresence>
        {showTierBanner && (
          <MotionBox
            key="banner"
            position="absolute"
            inset={0}
            bg="green.500"
            display="flex"
            alignItems="center"
            justifyContent="center"
            zIndex={2}
            initial={{ y: "-100%" }}
            animate={{ y: 0 }}
            exit={{ y: "-100%" }}
            transition={{ type: "spring", stiffness: 120, damping: 16 }}
          >
            <Text fontWeight="bold" fontSize="lg" color="white">
              🎉 Tier unlocked! Extra savings activated.
            </Text>
          </MotionBox>
        )}
      </AnimatePresence>

      <ConfettiAlt show={showConfetti} />

      {/* header */}
      <VStack align="left" spacing={1}>
        <HStack justify="space-between">
          <Text fontSize="lg" fontWeight="semibold" color={textColour}>
            Volume Discounts
          </Text>
          <IconButton
            aria-label="View discount tiers"
            icon={<InfoIcon />}
            size="sm"
            variant="ghost"
            color={textColour}
            onClick={() => setIsModalOpen(true)}
          />
        </HStack>

        <Text fontSize="md" color={textColour}>
          Add licences to unlock bigger discounts.
        </Text>
      </VStack>

      {nextTier && (
        <HStack spacing={1}>
          <ArrowForwardIosIcon fontSize="small"/>
          <Text fontSize="xl" fontWeight="bold" color={textColour}>
            Next tier: {nextTier.minLicenses} licences
          </Text>
        </HStack>
      )}

      {/* progress bar */}
      <Box>
        <Box
          position="relative"
          h="24px"
          bg={trackCol}
          borderRadius="full"
          overflow="hidden"
        >
          <Progress
            value={progress}
            h="full"
            hasStripe
            isAnimated
            sx={{ "& > div": { bgColor: theme.colors.primary } }}
          />
          <Box
            position="absolute"
            inset={0}
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <Text
              fontSize="sm"
              fontWeight="bold"
              color={textColour}
            >
              {Math.round(progress)}%
            </Text>
          </Box>
        </Box>
      </Box>

      {/* upsell */}
      {nextTier ? (
        <Text fontSize="md" color={textColour}>
          Add {nextTier.minLicenses - currentLicenses} more licences to unlock&nbsp;
          <Text as="span" fontWeight="bold">
            {nextTier.discountPercentage}% off
          </Text>
          .
        </Text>
      ) : (
        <Text fontSize="md" color="green.500">
          You're on the maximum discount tier – nice!
        </Text>
      )}

      {/* modal */}
      <SpringModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        showClose
        bg={theme.colors.primary}
        color="#fff"
        frontIcon={<Info fontSize="inherit" />}
        bgIcon={<Info fontSize="inherit"/>}
        header="Volume Discount Tiers"
        body={<DiscountTiersContent />}
      />
    </VStack>
  );
};

export default VolumeDiscountProgress;
