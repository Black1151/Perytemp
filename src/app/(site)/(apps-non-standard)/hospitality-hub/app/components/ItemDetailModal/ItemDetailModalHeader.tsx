import { Box, Image, VStack, HStack, Text } from "@chakra-ui/react";
import React from "react";
import { ItemDetailModalHeaderProps } from "./types";

const ItemDetailModalHeader: React.FC<ItemDetailModalHeaderProps> = ({ item, isMobile, siteNames, getMuiIconByName }) => {
  return (
    <>
      {/* Image with icon overlay */}
      <Box
        flex={isMobile ? "none" : 1}
        minW={isMobile ? "100%" : "320px"}
        maxW={isMobile ? "100%" : "340px"}
        h={isMobile ? "180px" : "220px"}
        borderRadius="lg"
        overflow="hidden"
        position="relative"
        mb={isMobile ? 4 : 0}
      >
        <Image
          src={item?.coverImageUrl}
          alt={item?.name}
          objectFit="cover"
          w="100%"
          h="100%"
          borderRadius="lg"
        />
        {/* Item icon overlay */}
        {(item?.logoImageUrl || item?.itemType) && (
          <Box
            position="absolute"
            top={2}
            left={2}
            bg="whiteAlpha.800"
            borderRadius="full"
            p={1}
            boxShadow="md"
          >
            {item?.logoImageUrl ? (
              <Image
                src={item.logoImageUrl}
                alt="Item Icon"
                boxSize="64px"
                borderRadius="full"
              />
            ) : (
              (() => {
                const Icon = getMuiIconByName(item?.itemType || "Widgets");
                return Icon ? (
                  <Icon style={{ fontSize: 28, color: "#F6C90E" }} />
                ) : null;
              })()
            )}
          </Box>
        )}
      </Box>
      {/* Info */}
      <VStack
        align="start"
        spacing={4}
        flex={2}
        justify="center"
        w="100%"
      >
        <HStack spacing={3} align="center">
          <Text
            fontSize={["xl", "2xl", "3xl"]}
            fontWeight="bold"
            color="hospitalityHubPremium"
            lineHeight={1.1}
          >
            {item?.name || "Details"}
          </Text>
        </HStack>
        <Text fontSize={["md", "lg", "lg"]}>{item?.description}</Text>
        {siteNames.length > 0 && (
          <Text fontSize="md" color="gray.300">
            <b>Available at:</b> {siteNames.join(", ")}
          </Text>
        )}
      </VStack>
    </>
  );
};

export default ItemDetailModalHeader; 