import { VStack, Badge, Text } from "@chakra-ui/react";
import InfoRow from "./InfoRow";
import React from "react";
import { DetailsSectionProps } from "./types";

const DetailsSection: React.FC<DetailsSectionProps> = ({ item, isPreview, handleCopy }) => {
  if (!item) return null;
  return (
    <VStack align="start" spacing={6} w="100%" minW={0} overflow="hidden">
      {item.itemType === "info(tel)" && item.infoContent && (
        <InfoRow type="tel" value={item.infoContent} isPreview={isPreview} onCopy={handleCopy} />
      )}
      {item.itemType === "info(code)" && item.infoContent && (
        <InfoRow type="code" value={item.infoContent} isPreview={isPreview} onCopy={handleCopy} />
      )}
      {item.itemType === "info(email)" && item.infoContent && (
        <InfoRow type="email" value={item.infoContent} isPreview={isPreview} onCopy={handleCopy} />
      )}
      {item.itemType === "info(link)" && item.infoContent && (
        <InfoRow type="link" value={item.infoContent} isPreview={isPreview} onCopy={handleCopy} />
      )}
      {item.howToDetails && (
        <VStack alignItems="flex-start" w="100%">
          <Badge bg="hospitalityHubPremium" color="black" variant="subtle" fontSize="md">
            How To:
          </Badge>
          <Text flex="1">{item.howToDetails}</Text>
        </VStack>
      )}
      {item.extraDetails && (
        <VStack alignItems="flex-start" w="100%">
          <Badge bg="hospitalityHubPremium" color="black" variant="subtle" fontSize="md">
            Info:
          </Badge>
          <Text flex="1">{item.extraDetails}</Text>
        </VStack>
      )}
      {item.startDate && (
        <VStack alignItems="flex-start" w="100%">
          <Badge bg="hospitalityHubPremium" color="black" variant="subtle" fontSize="md">
            Start:
          </Badge>
          <Text flex="1">{item.startDate}</Text>
        </VStack>
      )}
      {item.endDate && (
        <VStack alignItems="flex-start" w="100%">
          <Badge bg="hospitalityHubPremium" color="black" variant="subtle" fontSize="md">
            End:
          </Badge>
          <Text flex="1">{item.endDate}</Text>
        </VStack>
      )}
      {item.location && (
        <VStack alignItems="flex-start" w="100%">
          <Badge bg="hospitalityHubPremium" color="black" variant="subtle" fontSize="md">
            Location:
          </Badge>
          <Text flex="1">{item.location}</Text>
        </VStack>
      )}
    </VStack>
  );
};

export default DetailsSection; 