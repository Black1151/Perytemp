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
import { useRouter } from "next/navigation";
import { SpringModal } from "@/components/modals/springModal/SpringModal";
import { Message, Phone, Send, Sms } from "@mui/icons-material";
import { RaisedButton } from "./RaisedButton";

interface LicensePickerProps {
  showAlreadySubscribedText?: boolean;
}

export default function LicensePicker({
  showAlreadySubscribedText = true,
}: LicensePickerProps) {
  const { basket, changeLicenseCount } = useBasket();
  const theme = useTheme();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [increaseLoading, setIncreaseLoading] = useState(false);
  const [decreaseLoading, setDecreaseLoading] = useState(false);
  const isMobile = useBreakpointValue({ base: true, sm: true, md: false });
  const router = useRouter();

  if (!basket || basket.licensedUsers === undefined) {
    return null;
  }

  const quantity = basket.quantity ?? basket.licensedUsers;
  const diff = quantity - basket.licensedUsers;
  const cardBgLighter = theme.colors.elementBG;

  const handleDecrease = async () => {
    if (quantity === 0 || basket.licensedUsers === quantity) {
      setIsModalOpen(true);
    } else {
      setDecreaseLoading(true);
      try {
        await changeLicenseCount(10, true);
      } finally {
        setDecreaseLoading(false);
      }
    }
  };

  const handleIncrease = async () => {
    setIncreaseLoading(true);
    try {
      await changeLicenseCount(10, false);
    } finally {
      setIncreaseLoading(false);
    }
  };

  return (
    <>
      <SpringModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        bgIcon={<Message fontSize="inherit" />}
        frontIcon={<Phone fontSize="inherit" />}
        header="Please Contact Sales"
        body={"To reduce your Licences, please contact our sales team."}
        primaryLabel="Contact Sales Team"
        onPrimaryClick={() => router.push("/tool-store/contact-sales")}
        bg={theme.colors.primary}
        showClose={true}
      />
      <VStack bg={cardBgLighter} borderRadius="md" p={4} gap={2}>
        <Flex
          align="stretch"
          justify="space-between"
          w="full"
          h="auto"
          textAlign={"center"}
        >
          <RaisedButton
            text="-10"
            handleIncrease={handleDecrease}
            increaseLoading={increaseLoading}
            decreaseLoading={decreaseLoading}
            color="red"
          />

          <VStack spacing={2} justify="center" flex="1" px={4} color={theme.colors.primaryTextColor}>
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
                    Total User Licences
                  </Text>
                  {diff !== 0 && (
                    <Badge colorScheme="blue" fontSize="0.8em">
                      + {diff}
                    </Badge>
                  )}
                </Flex>
                {!isMobile && (
                  <Text fontSize={15} color="gray.500" textAlign={"center"}>
                    {basket.licensedUsers} Licences Already Subscribed
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
                  Total User Licences
                </Text>
              </VStack>
            )}
          </VStack>

          <RaisedButton
            text="+10"
            handleIncrease={handleIncrease}
            increaseLoading={increaseLoading}
            decreaseLoading={decreaseLoading}
            color="green"
          />
        </Flex>
        {isMobile && showAlreadySubscribedText && (
          <Text fontSize={15} color="gray.500" textAlign={"center"}>
            {basket.licensedUsers} Licences Already Subscribed
          </Text>
        )}
      </VStack>
    </>
  );
}
