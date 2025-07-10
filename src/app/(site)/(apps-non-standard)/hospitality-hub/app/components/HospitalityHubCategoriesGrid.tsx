import {
  Box,
  HStack,
  Image,
  Text,
  useBreakpointValue,
  Button,
  Fade,
  SlideFade,
  Flex,
  IconButton,
} from "@chakra-ui/react";
import React, { useRef, useState, WheelEvent, useEffect } from "react";
import PerygonCard from "@/components/layout/PerygonCard";
import {
  AnimatedList,
  AnimatedListItem,
} from "@/components/animations/AnimatedList";
import { HospitalityCategory } from "@/types/hospitalityHub";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import BackButton from "@/components/BackButton";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import HospitalityHubCategoriesCarouselMobile from "./HospitalityHubCategoriesGridMobile";
import HospitalityHubCategoriesGridDesktop from "./HospitalityHubCategoriesGridDesktop";
import HospitalityHubHeader from "./HospitalityHubHeader";

interface Props {
  categories: HospitalityCategory[];
  onSelectCategory: (id: string) => void;
  /** how many skinny posters stay visible beside the hero */
  visibleSkinnies?: number;
}

/* px helper */
const px = (v: number | string, fallback: number) =>
  typeof v === "number" ? v : fallback;

/* variants */
const heroExit = (w: number) => ({ x: -w - 32, opacity: 0 });
const heroFade = {
  hidden: { opacity: 0 },
  shown: { opacity: 1, transition: { duration: 0.25 } },
};

/* returns initial offset for the skinny that re-enters */
const skinnyFromSide = (heroW: number, dir: 1 | -1) => ({
  x: dir * (heroW + 32),
  opacity: 0,
});

// Main export
export default function HospitalityHubCategoriesGrid(props: Props) {
  const isMobile = useBreakpointValue({
    base: true,
    sm: true,
    md: true,
    lg: false,
  });
  const [featured, setFeatured] = React.useState(0);
  const HERO_W =
    useBreakpointValue({ base: 260, sm: 440, md: 540, lg: 900 }) ?? 260;
  const HERO_H =
    useBreakpointValue({ base: 320, sm: 320, md: 400, lg: 480 }) ?? 320;
  const SKINNY_W =
    useBreakpointValue({ base: 100, sm: 140, md: 180, lg: 220 }) ?? 100;
  const SKINNY_H =
    useBreakpointValue({ base: 180, sm: 220, md: 260, lg: 320 }) ?? 180;

  return (
    <Box w="100vw" py={2} px={4} maxW="2000px" position="relative" overflow={"hidden"}>
      <Box mb={4}>
        <HospitalityHubHeader onBack={() => {}} title="Hospitality Hub" />
      </Box>
      {isMobile ? (
        <HospitalityHubCategoriesCarouselMobile
          categories={props.categories}
          onSelectCategory={props.onSelectCategory}
          featured={featured}
          setFeatured={setFeatured}
          HERO_W={HERO_W}
          SKINNY_W={SKINNY_W}
          HERO_H={HERO_H}
        />
      ) : (
        <HospitalityHubCategoriesGridDesktop
          categories={props.categories}
          onSelectCategory={props.onSelectCategory}
          visibleSkinnies={props.visibleSkinnies}
          featured={featured}
          setFeatured={setFeatured}
          HERO_W={HERO_W}
          SKINNY_W={SKINNY_W}
          HERO_H={HERO_H}
        />
      )}
      {/* description under the hero */}
      <AnimatePresence mode="wait">
        {props.categories[featured]?.description && (
          <motion.div
            key={featured}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Box
              mt={4}
              flexDirection={"column"}
              maxW={["full", "full", HERO_W]}
              display="flex"
              alignItems={["center", "left"]}
              mb={["12", "12", "0"]}
            >
              <Text
                color="whiteAlpha.900"
                textAlign={["center", "center", "left"]}
                w={["90%","80%","full"]}
              >
                {props.categories[featured].description}
              </Text>
              {/* Only show the View button here on desktop */}
              {!isMobile && (
                <Button
                  mt={4}
                  color="hospitalityHubPremium"
                  border="1px solid rgba(238, 228, 88, 0.5)"
                  backdropFilter="blur(10px)"
                  bg="rgba(66, 66, 66, 0.6)"
                  fontWeight="bold"
                  onClick={() =>
                    props.onSelectCategory(props.categories[featured].id)
                  }
                  borderRadius="full"
                  w="min"
                  rightIcon={
                    <Box
                      as={ArrowForwardIcon}
                      transition="transform 0.3s"
                      _groupHover={{ transform: "rotate(-45deg)" }}
                    />
                  }
                  role="group"
                  _hover={{
                    bg: "hospitalityHubPremium",
                    color: "black",
                    borderColor: "hospitalityHubPremium",
                  }}
                >
                  {`View ${props.categories[featured]?.itemsCount ?? 0} item${props.categories[featured]?.itemsCount === 1 ? "" : "s"}`}
                </Button>
              )}
            </Box>
          </motion.div>
        )}
      </AnimatePresence>
      {/* Fixed View button for mobile */}
      {isMobile && (
        <Box
          position="fixed"
          zIndex={120}
          right={["12px", "12px"]}
          bottom={["10px", "45px"]}
          w="auto"
        >
          <Button
            color="hospitalityHubPremium"
            border="1px solid rgba(238, 228, 88, 0.5)"
            backdropFilter="blur(4px)"
            bg="rgba(66, 66, 66, 0.6)"
            fontWeight="bold"
            onClick={() =>
              props.onSelectCategory(props.categories[featured].id)
            }
            w="auto"
            borderRadius="full"
            h="40px"
            rightIcon={
              <Box
                as={ArrowForwardIcon}
                transition="transform 0.3s"
                _groupHover={{ transform: "rotate(-45deg)" }}
              />
            }
            role="group"
            boxShadow="0 2px 16px 0 rgba(0,0,0,0.18)"
          >
            {`View ${props.categories[featured]?.itemsCount ?? 0} item${props.categories[featured]?.itemsCount === 1 ? "" : "s"}`}
          </Button>
        </Box>
      )}
    </Box>
  );
}
