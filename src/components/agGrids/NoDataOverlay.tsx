import React from "react";
import { Flex, Icon, Text, VStack } from "@chakra-ui/react";
import { QueryStats } from "@mui/icons-material";
import { useRouter } from "next/navigation";

const NoDataOverlay: React.FC = () => {
  const router = useRouter();

  return (
    <Flex
      direction="column"
      align="center"
      justify="center"
      py={20}
      px={5}
      width="100%"
      height="100%"
      borderRadius="md"
    >
      <VStack spacing={4}>
        <Icon as={QueryStats} boxSize={20} color="white" />
        <Text
          fontSize="2xl"
          fontWeight="bold"
          color="white"
          fontFamily="heading"
        >
          No Data Available
        </Text>
        <Text fontSize="lg" color="white" textAlign="center" fontFamily="body">
          It looks like there is nothing to display at the moment.
        </Text>
      </VStack>
    </Flex>
  );
};

export default NoDataOverlay;
