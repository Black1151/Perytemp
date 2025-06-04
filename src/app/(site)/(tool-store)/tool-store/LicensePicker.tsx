import React, { useState } from "react";
import { useBasket } from "./useBasket";
import {
  Flex,
  HStack,
  Box,
  Text,
  Badge,
  Button,
  useTheme,
  VStack,
  Spinner,
  useBreakpointValue,
} from "@chakra-ui/react";
import { transparentize } from "@chakra-ui/theme-tools";
import AnimatedTillNumber from "@/components/animations/AnimatedTillNumber";
import { PerygonModal } from "@/components/modals/PerygonModal";

interface LicensePickerProps {
  showAlreadySubscribedText?: boolean;
}

export default function LicensePicker({
  showAlreadySubscribedText = true,
}: LicensePickerProps) {
  const { basket, changeLicenseCount } = useBasket();
  const theme = useTheme();
  const [isModalOpen, setModalOpen] = useState(false);
  const [increaseLoading, setIncreaseLoading] = useState(false);
  const [decreaseLoading, setDecreaseLoading] = useState(false);
  const isMobile = useBreakpointValue({ base: true, sm: true, md: false });

  if (!basket || basket.licensedUsers === undefined) {
    return null;
  }

  const quantity = basket.quantity ?? basket.licensedUsers;
  const diff = quantity - basket.licensedUsers;
  const cardBgLighter = theme.colors.elementBG;

  const handleDecrease = async () => {
    if (quantity === 0 || basket.licensedUsers === quantity) {
      setModalOpen(true);
    } else {
      setDecreaseLoading(true);
      try {
        await changeLicenseCount(20, true);
      } finally {
        setDecreaseLoading(false);
      }
    }
  };

  const handleIncrease = async () => {
    setIncreaseLoading(true);
    try {
      await changeLicenseCount(20, false);
    } finally {
      setIncreaseLoading(false);
    }
  };

  return (
    <>
      <PerygonModal
        title="Please Contact Sales"
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        body={
          <Box p={4} textAlign="center">
            <Text mb={4} color={theme.colors.primaryTextColor}>
              To reduce your license count, please contact our sales team.
            </Text>
            <HStack spacing={2} mb={4} justify="center">
              <Button as="a" href="/contact-sales">
                Contact Sales
              </Button>
              <Button onClick={() => setModalOpen(false)}>Close</Button>
            </HStack>
          </Box>
        }
      >
        <></>
      </PerygonModal>
      <VStack bg={cardBgLighter} borderRadius="md" p={4} gap={2}>
        <Flex
          align="stretch"
          justify="space-between"
          w="full"
          h="auto"
          textAlign={"center"}
        >
          <Button
            variant="outline"
            size="lg"
            bg="red.100"
            h="auto"
            maxH={"80px"}
            _hover={{ bg: "red.200" }}
            onClick={handleDecrease}
            isLoading={decreaseLoading}
            spinner={<Spinner thickness="2px" speed="0.65s" size="sm" />}
            disabled={increaseLoading || decreaseLoading}
          >
            <Box
              w="100%"
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              -20
            </Box>
          </Button>

          <VStack spacing={2} justify="center" flex="1" px={4}>
            {showAlreadySubscribedText ? (
              <>
                <Flex
                  direction={["column", "column", "row"]}
                  gap={2}
                  align="center"
                  fontSize={[16, 18, 20]}
                >
                  <AnimatedTillNumber
                    value={quantity}
                    fontSize="24"
                    duration={0.65}
                    isCurrency={false}
                  />
                  <Text fontWeight="semibold" fontSize={[16, 18, 20]}>
                    Total User Licenses
                  </Text>
                  {diff !== 0 && (
                    <Badge colorScheme="blue" fontSize="0.8em">
                      + {diff}
                    </Badge>
                  )}
                </Flex>
                {!isMobile && (
                  <Text fontSize={15} color="gray.500" textAlign={"center"}>
                    {basket.licensedUsers} Licenses Already Subscribed
                  </Text>
                )}
              </>
            ) : (
              <VStack spacing={1} fontSize={[16, 18, 20]} align="center">
                <AnimatedTillNumber
                  value={quantity}
                  fontSize="24"
                  duration={0.65}
                  isCurrency={false}
                />
                <Text fontSize={[14, 16]} align={"center"} textAlign={"center"}>
                  Total User Licenses
                </Text>
              </VStack>
            )}
          </VStack>

          <Button
            variant="outline"
            size="lg"
            bg="green.100"
            h="auto"
            maxH={"80px"}
            _hover={{ bg: "green.200" }}
            onClick={handleIncrease}
            isLoading={increaseLoading}
            disabled={increaseLoading || decreaseLoading}
            spinner={<Spinner thickness="2px" speed="0.65s" size="sm" />}
          >
            +20
          </Button>
        </Flex>
        {(isMobile && showAlreadySubscribedText) && (
          <Text fontSize={15} color="gray.500" textAlign={"center"}>
            {basket.licensedUsers} Licenses Already Subscribed
          </Text>
        )}
      </VStack>
    </>
  );
}
