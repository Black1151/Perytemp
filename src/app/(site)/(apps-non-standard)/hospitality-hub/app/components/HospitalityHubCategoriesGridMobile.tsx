import React from "react";
import { Box, Image, Text, IconButton, HStack } from "@chakra-ui/react";
import PerygonCard from "@/components/layout/PerygonCard";
import { HospitalityCategory } from "@/types/hospitalityHub";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

interface HospitalityHubCategoriesCarouselMobileProps {
  categories: HospitalityCategory[];
  onSelectCategory: (id: string) => void;
  featured: number;
  setFeatured: React.Dispatch<React.SetStateAction<number>>;
  HERO_W: number | string;
  SKINNY_W: number | string;
  HERO_H: number | string;
}

function HospitalityHubCategoriesCarouselMobile({
  categories,
  onSelectCategory,
  featured,
  setFeatured,
  HERO_W,
  SKINNY_W,
  HERO_H,
}: HospitalityHubCategoriesCarouselMobileProps) {
  const CARD_W = "70vw";
  const CARD_H = "80vw";
  const SHRINK = 0.8;
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const stopTimer = React.useRef<NodeJS.Timeout | null>(null);
  const centre = (idx: number) => {
    const c = scrollRef.current;
    if (!c) return;
    const card = c.children[idx] as HTMLElement;
    if (!card) return;
    const { width: cw } = c.getBoundingClientRect();
    const { width: iw } = card.getBoundingClientRect();
    c.scrollTo({
      left: card.offsetLeft - (cw / 2 - iw / 2),
      behavior: "smooth",
    });
  };
  const commitFeatured = () => {
    const c = scrollRef.current;
    if (!c) return;
    const { left: cl, width: cw } = c.getBoundingClientRect();
    let best = 1,
      min = Infinity;
    for (let i = 1; i < c.children.length - 1; i++) {
      const { left: il, width: iw } = (
        c.children[i] as HTMLElement
      ).getBoundingClientRect();
      const dist = Math.abs(il + iw / 2 - (cl + cw / 2));
      if (dist < min) {
        min = dist;
        best = i;
      }
    }
    const newFeatured = best - 1;
    if (newFeatured !== featured) setFeatured(newFeatured);
  };
  const onScroll = () => {
    if (stopTimer.current) clearTimeout(stopTimer.current);
    stopTimer.current = setTimeout(commitFeatured, 120);
  };
  React.useEffect(() => {
    return () => {
      if (stopTimer.current) {
        clearTimeout(stopTimer.current);
      }
    };
  }, []);
  React.useEffect(() => centre(featured + 1), [featured]);
  return (
    <Box>
      {/* Card Section */}
      <Box
        ref={scrollRef}
        display="flex"
        overflowX="auto"
        alignItems="center"
        px={0}
        py={4}
        h={CARD_H}
        sx={{
          scrollSnapType: "x mandatory",
          scrollPaddingInline: "0vw",
          WebkitOverflowScrolling: "touch",
          scrollbarWidth: "none",
          msOverflowStyle: "none",
          "::-webkit-scrollbar": { display: "none" },
          touchAction: "pan-x",
        }}
        onScroll={onScroll}
      >
        <Box
          flex="0 0 auto"
          w="15vw"
          h={CARD_H}
          scrollSnapAlign="center"
          pointerEvents="none"
          mx={2}
        />
        {categories.map((cat, idx) => {
          const isFeatured = idx === featured;
          return (
            <Box
              key={cat.id}
              flex="0 0 auto"
              w={CARD_W}
              h={CARD_H}
              mx={-8}
              pt={2}
              display="flex"
              alignItems="center"
              justifyContent="center"
              scrollSnapAlign="center"
              sx={{
                transform: `scale(${isFeatured ? 1 : SHRINK})`,
                transition: "transform .35s cubic-bezier(.4,0,.2,1)",
              }}
              zIndex={isFeatured ? 2 : 1}
              onClick={() => {
                setFeatured(idx);
                centre(idx + 1);
              }}
            >
              <PerygonCard
                h="100%"
                w="100%"
                p={0}
                overflow="hidden"
                borderRadius="2xl"
                boxShadow={isFeatured ? "2xl" : "lg"}
                border={isFeatured ? "1.5px solid rgba(238, 228, 88, 0.75)" : undefined}
                cursor="pointer"
                role="group"
                position="relative"
                bg={"black"}
                style={{
                  transition: "background 0.35s cubic-bezier(.4,0,.2,1)",
                }}
              >
                <Image
                  src={cat.coverImageUrl || (cat as any).image}
                  alt={cat.name}
                  objectFit="cover"
                  w="100%"
                  h="100%"
                  position="absolute"
                  inset={0}
                  transition="filter .25s"
                  style={{
                    opacity: isFeatured ? 1 : 0.6,
                    transition: "opacity 0.2s cubic-bezier(.4,0,.2,1)",
                  }}
                />
                <Box
                  position="absolute"
                  bottom={0}
                  left={0}
                  w="100%"
                  py={4}
                  px={4}
                  bgGradient="linear(to-t, rgba(0,0,0,.82) 60%, rgba(0,0,0,.05) 100%)"
                >
                  <Text
                    fontFamily="bonfire, metropolis, sans-serif"
                    fontWeight="extrabold"
                    color="#EEE458"
                    fontSize={isFeatured ? ["3xl", "2xl"] : ["lg", "2xl"]}
                    textAlign={isFeatured ? "center" : "left"}
                    style={{
                      transition:
                        "font-size 0.15s cubic-bezier(.4,0,.2,1), text-align 0.15s cubic-bezier(.4,0,.2,1)",
                    }}
                    textShadow="0 2px 8px rgba(0,0,0,.45)"
                  >
                    {cat.name}
                  </Text>
                </Box>
              </PerygonCard>
            </Box>
          );
        })}
        <Box
          flex="0 0 auto"
          w="15vw"
          h={CARD_H}
          scrollSnapAlign="center"
          pointerEvents="none"
          mx={2}
        />
      </Box>

      <HStack justify="center" align="center" spacing={1} mt={4}>
        {/* ▸ BACK ◂ */}
        <IconButton
          onClick={() => {
            const prevIdx =
              (featured - 1 + categories.length) % categories.length;
            setFeatured(prevIdx);
            centre(prevIdx + 1);
          }}
          aria-label="Back"
          icon={<ChevronLeftIcon fontSize="large" />}
          color="hospitalityHubPremium"
          border="1px solid rgba(238, 228, 88, 0.5)"
          backdropFilter="blur(10px)"
          bg="rgba(66, 66, 66, 0.6)"
          fontWeight="bold"
          borderLeftRadius="full"
          borderRightRadius={0}
          size="lg"
          w="6rem"
          h="40px"
          transition="transform 0.15s ease-out"
          _active={{
            transform: "scaleX(1.10)",
          }}
          _hover={{
            bg: "rgba(255,255,255,0.2)",
          }}
          role="group"
        />

        {/* ▸ NEXT ▸ */}
        <IconButton
          aria-label="Next"
          icon={<ChevronRightIcon fontSize="large" />}
          onClick={() => {
            const nextIdx = (featured + 1) % categories.length;
            setFeatured(nextIdx);
            centre(nextIdx + 1);
          }}
          color="hospitalityHubPremium"
          border="1px solid rgba(238, 228, 88, 0.5)"
          backdropFilter="blur(10px)"
          bg="rgba(66, 66, 66, 0.6)"
          fontWeight="bold"
          borderLeftRadius={0}
          borderRightRadius="full"
          size="lg"
          w="6rem"
          h="40px"
          transition="transform 0.15s ease-out"
          _active={{
            transform: "scaleX(1.10)",
          }}
          _hover={{
            bg: "rgba(255,255,255,0.2)",
          }}
          role="group"
        />
      </HStack>
    </Box>
  );
}

export default HospitalityHubCategoriesCarouselMobile;
