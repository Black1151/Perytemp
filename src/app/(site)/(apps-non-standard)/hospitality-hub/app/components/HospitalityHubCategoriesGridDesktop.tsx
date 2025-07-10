import React from "react";
import { Box, HStack, Image, Text, IconButton } from "@chakra-ui/react";
import PerygonCard from "@/components/layout/PerygonCard";
import { HospitalityCategory } from "@/types/hospitalityHub";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";

interface DesktopProps {
  categories: HospitalityCategory[];
  onSelectCategory: (id: string) => void;
  visibleSkinnies?: number;
  featured: number;
  setFeatured: React.Dispatch<React.SetStateAction<number>>;
  HERO_W: number | string;
  SKINNY_W: number | string;
  HERO_H: number | string;
}

const px = (v: number | string, fallback: number) =>
  typeof v === "number" ? v : fallback;
type Dir = 1 | -1;
const heroExit = () => ({ opacity: 0 });
const heroFade = {
  hidden: { opacity: 0 },
  shown:  { opacity: 1, transition: { duration: 0.25 } },
};
const skinnyFromSide = (heroW: number, dir: 1 | -1) => ({
  x: dir * (heroW + 32),
  opacity: 0,
});
const MotionBox = motion(Box);
const MotionHStack = motion(HStack);

function HospitalityHubCategoriesGridDesktop({
  categories,
  onSelectCategory,
  visibleSkinnies,
  featured,
  setFeatured,
  HERO_W,
  SKINNY_W,
  HERO_H,
}: DesktopProps) {
  const rotated = React.useMemo(
    () => [...categories.slice(featured), ...categories.slice(0, featured)],
    [categories, featured]
  );
  const heroW   = px(HERO_W, 320);
  const skinnyW = px(SKINNY_W, 140);
  const [outgoing, setOutgoing] = React.useState<{
    id: string | null;
    dir: 1 | -1;
  }>({ id: null, dir: 1 });
  const goTo = (idx: number, dir: 1 | -1) => {
    setOutgoing({ id: categories[featured].id, dir });
    setFeatured(idx);
  };
  const next = () => goTo((featured + 1) % categories.length, 1);
  const prev = () => goTo((featured - 1 + categories.length) % categories.length, -1);
  const wheelAccum = React.useRef(0);
  const wheelTimeout = React.useRef<NodeJS.Timeout | null>(null);

  React.useEffect(() => {
    const wheelListener = (e: WheelEvent) => {
      // Use horizontal if available, otherwise vertical
      const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
      wheelAccum.current += delta;
      const threshold = 60;
      if (wheelAccum.current > threshold) {
        next();
        wheelAccum.current = 0;
      } else if (wheelAccum.current < -threshold) {
        prev();
        wheelAccum.current = 0;
      }
      if (wheelTimeout.current) clearTimeout(wheelTimeout.current);
      wheelTimeout.current = setTimeout(() => {
        wheelAccum.current = 0;
      }, 400);
    };
    window.addEventListener('wheel', wheelListener, { passive: false });
    return () => {
      window.removeEventListener('wheel', wheelListener);
      if (wheelTimeout.current) clearTimeout(wheelTimeout.current);
    };
  }, [featured, categories.length]);

  return (
    <Box position="relative" style={{ backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)' }}>
      <IconButton
        aria-label="Previous"
        icon={<ChevronLeftIcon fontSize="large" />}
        position="absolute"
        left={2}
        top="50%"
        transform="translateY(-50%)"
        zIndex={20}
        onClick={prev}
        color="hospitalityHubPremium"
        borderColor="hospitalityHubPremium"
        borderWidth="2px"
        bg="rgba(255,255,255,0.2)"
        backdropFilter="blur(10px)"
        fontWeight="bold"
        borderRadius="full"
        size="lg"
        w="4rem"
        h="4rem"
        transition="transform 0.3s"
        _hover={{
          bg: "hospitalityHubPremium",
          color: "black",
          borderColor: "hospitalityHubPremium",
        }}
        role="group"
      />
      <LayoutGroup>
        <HStack spacing={2}>
          <AnimatePresence mode="popLayout" custom={{ heroW, dir: outgoing.dir }}>
            <MotionBox
              key={`${rotated[0].id}-hero`}
              style={{ width: heroW, backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)' }}
              custom={{ heroW, dir: outgoing.dir }}
              variants={{
                ...heroFade,
                exit: heroExit,
              }}
              initial="hidden"
              animate="shown"
              zIndex={10}
              exit="exit"
              transition={{ type: "spring", stiffness: 500, damping: 40 }}
              flexShrink={0}
              flexGrow={0}
              onClick={() => onSelectCategory(rotated[0].id)}
            >
              <PerygonCard
                h={HERO_H}
                w="100%"
                p={0}
                zIndex={10}
                overflow="hidden"
                borderRadius="2xl"
                boxShadow="2xl"
                border={"none"}
                cursor="pointer"
                role="group"
                position="relative"
                _hover={{ boxShadow: "3xl" }}
              >
                <Image
                  src={rotated[0].coverImageUrl || (rotated[0] as any).image}
                  alt={rotated[0].name}
                  objectFit="cover"
                  w="100%"
                  h="100%"
                  position="absolute"
                  inset={0}
                  transition="transform 0.6s"
                  _groupHover={{ transform: "scale(1.08)" }}
                />
                <Box
                  position="absolute"
                  bottom={-36}
                  right={-20}
                  w="100%"
                  h="42%"
                  bg="rgba(0,0,0,0.7)"
                  transform="rotate(-14deg)"
                  style={{backdropFilter: 'blur(8px)'}}
                />
                <Text
                  position="absolute"
                  bottom={6}
                  right={10}
                  fontFamily="bonfire, metropolis, sans-serif"
                  fontSize="2.5rem"
                  fontWeight="bold"
                  color="#EEE458"
                  transform="rotate(-14deg)"
                >
                  {rotated[0].name}
                </Text>
              </PerygonCard>
            </MotionBox>
          </AnimatePresence>
          <MotionHStack
            layout
            spacing={2}
            flexShrink={0}
            zIndex={0}
            transition={{ type: "easeInOut", stiffness: 500, damping: 10 }}
          >
            {rotated
              .slice(1, visibleSkinnies ? visibleSkinnies + 1 : undefined)
              .map((cat, relIdx) => {
                const absoluteIdx =
                  (featured + relIdx + 1) % categories.length;
                const isOutgoing = cat.id === outgoing.id;
                return (
                  <MotionBox
                    key={`${cat.id}-skinny`}
                    layout="position"
                    initial={
                      isOutgoing
                        ? skinnyFromSide(heroW, outgoing.dir)
                        : false
                    }
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 500, damping: 32 }}
                    flexShrink={0}
                    flexGrow={0}
                    zIndex={0}
                    onClick={() => {
                      const dir: 1 | -1 =
                        (absoluteIdx - featured + categories.length) %
                          categories.length ===
                        1
                          ? 1
                          : -1;
                      goTo(absoluteIdx, dir);
                    }}
                  >
                    <PerygonCard
                      h={HERO_H}
                      w={SKINNY_W}
                      p={0}
                      overflow="hidden"
                      borderRadius="2xl"
                      boxShadow="lg"
                      cursor="pointer"
                      role="group"
                      position="relative"
                      zIndex={0}
                      border={"none"}
                      style={{ backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)' }}
                    >
                      <Image
                        src={cat.coverImageUrl || (cat as any).image}
                        alt={cat.name}
                        objectFit="cover"
                        w="100%"
                        h="100%"
                        position="absolute"
                        inset={0}
                        transition="transform 0.5s"
                        style={{ filter: "brightness(0.65)" }}
                        _groupHover={{ transform: "scale(1.04)" }}
                      />
                      <Box
                        position="absolute"
                        bottom={0}
                        left={0}
                        w="100%"
                        py={2}
                        px={2}
                        bg="rgba(0,0,0,0.25)"
                        bgGradient="linear(to-t, rgba(0,0,0,.25) 60%, rgba(0,0,0,.05) 100%)"
                        style={{ backdropFilter: 'blur(10px)' }}
                      >
                        <Text
                          fontFamily="bonfire, metropolis, sans-serif"
                          color="#EEE458"
                          fontSize="lg"
                          textShadow="0 2px 8px rgba(0,0,0,.6)"
                        >
                          {cat.name}
                        </Text>
                      </Box>
                    </PerygonCard>
                  </MotionBox>
                );
              })}
          </MotionHStack>
        </HStack>
      </LayoutGroup>
      <IconButton
        aria-label="Next"
        icon={<ChevronRightIcon fontSize="large" />}
        position="absolute"
        right={2}
        top="50%"
        transform="translateY(-50%)"
        zIndex={20}
        onClick={next}
        color="hospitalityHubPremium"
        borderColor="hospitalityHubPremium"
        borderWidth="2px"
        bg="rgba(255,255,255,0.2)"
        backdropFilter="blur(10px)"
        fontWeight="bold"
        borderRadius="full"
        size="lg"
        w="4rem"
        h="4rem"
        transition="transform 0.3s"
        _hover={{
          bg: "hospitalityHubPremium",
          color: "black",
          borderColor: "hospitalityHubPremium",
        }}
        role="group"
      />
    </Box>
  );
}

export default HospitalityHubCategoriesGridDesktop; 