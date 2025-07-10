"use client";
import { Box, Text, Image, Spinner, Badge } from "@chakra-ui/react";
import { keyframes } from "@emotion/react";
import { HospitalityItem } from "@/types/hospitalityHub";
import PerygonCard from "@/components/layout/PerygonCard";
import RoomIcon from "@mui/icons-material/Room";

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
  loading?: boolean;
}

export default function MasonryItemCard({
  item,
  onClick,
  disabled = false,
  loading = false,
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
      bg="transparent"
      border="1px solid rgba(238, 228, 88, 0.5)"
      _hover={{ transform: "scale(1.025)", boxShadow: "4xl" }}
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
            boxSize={["90px","110px","115px","120px"]}
            objectFit="contain"
            rounded={"xl"}
          />
        </Box>
      )}
      {typeof item.distance_from_m === 'number' && (
        <Badge
          position="absolute"
          top={2}
          left={2}
          zIndex={2}
          colorScheme="yellow"
          bg="hospitalityHubPremium"
          color="black"
          px={2}
          py={1}
          borderRadius="md"
          fontWeight="semibold"
          fontSize="0.85em"
          display="flex"
          alignItems="center"
          boxShadow="md"
        >
          <RoomIcon style={{ fontSize: 16, marginRight: 4, color: 'black' }} />
          {(item.distance_from_m / 1000).toFixed(1)} km away
        </Badge>
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
        <Box
          display="flex"
          flexDirection="column"
          alignItems="flex-start"
          width="100%"
          transition={{ base: "none", md: "transform 0.45s cubic-bezier(0.4, 0, 0.2, 1)" }}
          willChange={{ base: undefined, md: "transform" }}
          transform={{ base: "none", md: item.description ? "none" : undefined }}
          _groupHover={{ md: { transform: item.description ? "translateY(-1.5em)" : "none" } }}
        >
          <Text
            color="rgb(238, 228, 88)"
            fontWeight="bold"
            fontSize={["xl", "2xl", null, null, null, "2xl"]}
            fontFamily="metropolis"
          >
            {item.name}
          </Text>
          {item.description && (
            <Text
              color="white"
              fontSize="sm"
              opacity={{ base: 1, md: 0 }}
              maxHeight={{ base: "200px", md: 0 }}
              overflow="hidden"
              transition={{ base: "none", md: "opacity 0.45s cubic-bezier(0.4, 0, 0.2, 1), max-height 0.45s cubic-bezier(0.4, 0, 0.2, 1), margin-top 0.45s cubic-bezier(0.4, 0, 0.2, 1)" }}
              willChange={{ base: undefined, md: "opacity, max-height, margin-top" }}
              marginTop={{ base: "0.5em", md: 0 }}
              _groupHover={{ md: { opacity: 1, maxHeight: "200px", marginTop: "0.5em" } }}
              mt={0}
            >
              {item.description}
            </Text>
          )}
        </Box>
      </Box>
      {(disabled || loading) && (
        <Box
          position="absolute"
          top={0}
          left={0}
          w="100%"
          h="100%"
          bg="rgba(128,128,128,0.5)"
          display="flex"
          alignItems="center"
          justifyContent="center"
          pointerEvents="none"
        >
          {loading && <Spinner />}
        </Box>
      )}
    </PerygonCard>
  );
}
