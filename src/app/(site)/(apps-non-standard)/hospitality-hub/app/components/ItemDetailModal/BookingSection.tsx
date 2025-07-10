import { VStack, Text, Button, Tooltip } from "@chakra-ui/react";
import React from "react";
import { BookingSectionProps } from "./types";

const BookingSection: React.FC<BookingSectionProps> = ({ ctaText, isPreview, item, setBookingOpen }) => {
  if (!ctaText) return null;
  return (
    <VStack align="center" justify="center" w="100%" minH="240px" spacing={4}>
      <Text fontSize="2xl" color="hospitalityHubPremium" fontWeight="bold" textAlign="center">
        Ready to book?
      </Text>
      {isPreview ? (
        <Tooltip label="Disabled in preview mode">
          <span>
            <Button
              variant="hospitalityHub"
              size="lg"
              onClick={() => setBookingOpen(true)}
              isDisabled
              alignSelf="center"
            >
              {ctaText}
            </Button>
          </span>
        </Tooltip>
      ) : (
        <Button
          variant="hospitalityHub"
          size="lg"
          onClick={() => setBookingOpen(true)}
          isDisabled={!item?.isActive}
          title={!item?.isActive ? "This item is not currently available for booking." : undefined}
          alignSelf="center"
        >
          {ctaText}
        </Button>
      )}
    </VStack>
  );
};

export default BookingSection; 