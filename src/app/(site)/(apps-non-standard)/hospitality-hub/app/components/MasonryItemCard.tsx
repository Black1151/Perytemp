"use client";
import { Box, Text, Image } from "@chakra-ui/react";
import { keyframes } from "@emotion/react";
import { HospitalityItem } from "@/types/hospitalityHub";
import PerygonCard from "@/components/layout/PerygonCard";

const shimmer = keyframes`
  0% {
    transform: translateX(-100%) skewX(-20deg);
    opacity: 0;
  }
  10% {
    opacity: 1;
  }
  90% {
    opacity: 1;
  }
  100% {
    transform: translateX(100%) skewX(-20deg);
    opacity: 0;
  }
`;

export interface MasonryItemCardProps {
  item: HospitalityItem;
  onClick?: () => void;
  disabled?: boolean;
}

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
      transition="transform 0.3s, box-shadow 0.3s"
      _hover={{ transform: "scale(1.05)", boxShadow: "4xl" }}
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
      {item.logoImageUrl && (
        <Box
          position="absolute"
          top={2}
          right={2}
          zIndex={1}
          pointerEvents="none"
        >
          <Image
            src={item.logoImageUrl}
            alt={`${item.name} logo`}
            boxSize="50px"
            objectFit="contain"
          />
        </Box>
      )}
      {/* Shimmer overlay */}
      <Box
        position="absolute"
        top={0}
        left={0}
        w="150%"
        h="100%"
        pointerEvents="none"
        bgGradient="linear(120deg, transparent 0%, rgba(255,215,0,0.3) 45%, rgba(255,255,224,0.9) 50%, rgba(255,215,0,0.3) 55%, transparent 100%)"
        transform="translateX(-100%) skewX(-20deg)"
        opacity={0}
        _groupHover={{ animation: `${shimmer} 0.8s` }}
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
        pointerEvents="none"
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
            opacity={0}
            transform="translateY(10px)"
            transition="opacity 0.3s, transform 0.3s"
            _groupHover={{ opacity: 1, transform: "translateY(0)" }}
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
