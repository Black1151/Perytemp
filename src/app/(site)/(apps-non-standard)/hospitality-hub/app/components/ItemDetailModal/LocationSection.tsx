import { VStack, Text, Box, Flex, Spinner } from "@chakra-ui/react";
import React from "react";
import { LocationSectionProps } from "./types";

const LocationSection: React.FC<LocationSectionProps> = ({ item, mapLoading, setMapLoading }) => {
  if (!item || !item.latitude || !item.longitude || !item.fullAddress) return null;
  return (
    <VStack align="start" spacing={4} w="100%">
      <Text>{item.fullAddress}</Text>
      <Text color="hospitalityHubPremium" textDecoration={"underline"}>
        <a
          href={`https://maps.google.com/?q=${encodeURIComponent(item.fullAddress || "")}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          Get Directions
        </a>
      </Text>
      <Box
        w="100%"
        h="240px"
        borderRadius="md"
        overflow="hidden"
        mt={1}
        position="relative"
      >
        {mapLoading && (
          <Flex
            position="absolute"
            top={0}
            left={0}
            w="100%"
            h="100%"
            align="center"
            justify="center"
            zIndex={1}
            bg="rgba(0,0,0,0.1)"
          >
            <Spinner color="hospitalityHubPremium" size="lg" thickness="4px" />
          </Flex>
        )}
        <iframe
          title="Google Map"
          width="100%"
          height="240"
          style={{ border: 0, borderRadius: 8 }}
          loading="lazy"
          allowFullScreen
          referrerPolicy="no-referrer-when-downgrade"
          src={`https://www.google.com/maps?q=${item.latitude},${item.longitude}&z=16&output=embed`}
          onLoad={() => setMapLoading(false)}
        />
      </Box>
    </VStack>
  );
};

export default LocationSection; 