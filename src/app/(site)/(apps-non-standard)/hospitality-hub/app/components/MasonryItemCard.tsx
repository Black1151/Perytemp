"use client";
import { Box, Text, Image } from "@chakra-ui/react";
import { keyframes } from "@emotion/react";
import { HospitalityItem } from "@/types/hospitalityHub";
import PerygonCard from "@/components/layout/PerygonCard";

export interface MasonryItemCardProps {
  item: HospitalityItem;
  onClick?: () => void;
  disabled?: boolean;
}

const shimmer = keyframes`
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
`;

export default function MasonryItemCard({
  item,
  onClick,
  disabled = false,
}: MasonryItemCardProps) {
  return (
    <PerygonCard
      role="group"
      position="relative"
      borderRadius="lg"
      h="100%"
      cursor={onClick ? "pointer" : undefined}
      onClick={onClick}
      overflow="hidden"
      boxShadow="md"
      transition="transform 0.3s, box-shadow 0.3s"
      _hover={{ transform: "scale(1.05)", boxShadow: "dark-lg" }}
      p={0}
    >
      {(item.coverImageUrl || item.logoImageUrl) && (
        <Image
          src={item.coverImageUrl || item.logoImageUrl}
          alt={item.name}
          objectFit="cover"
          w="100%"
          h="100%"
        />
      )}
      <Box
        pointerEvents="none"
        position="absolute"
        top={0}
        left={0}
        w="100%"
        h="100%"
        bg="linear-gradient(120deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.4) 50%, rgba(255,255,255,0) 100%)"
        opacity={0}
        transform="translateX(-100%)"
        _groupHover={{ opacity: 1, sx: { animation: `${shimmer} 0.8s` } }}
        onAnimationEnd={(e) => {
          const target = e.target as HTMLElement;
          target.style.animation = "none";
          target.style.opacity = "0";
        }}
      />
      <Box
        position="absolute"
        display="flex"
        flexDirection="column"
        justifyContent="flex-end"
        bottom={0}
        left={0}
        w="100%"
        p={8}
        h="50%"
        bgGradient="linear(to-t, rgba(0,0,0,0.9), rgba(0,0,0,0))"
      >
        <Text
          color="white"
          fontWeight="bold"
          fontSize={["lg", "2xl", null, null, null, "4xl"]}
          fontFamily="metropolis"
          transition="transform 0.3s"
          _groupHover={{ transform: "translateY(-10px)" }}
        >
          {item.name}
        </Text>
        {item.description && (
          <Text
            color="white"
            fontSize="sm"
            mt={2}
            opacity={0}
            transition="opacity 0.3s"
            _groupHover={{ opacity: 1 }}
          >
            {item.description}
          </Text>
        )}
      </Box>
      {disabled && (
        <Box
          position="absolute"
          top={0}
          left={0}
          w="100%"
          h="100%"
          bg="rgba(128,128,128,0.5)"
          pointerEvents="none"
        />
      )}
    </PerygonCard>
  );
}
