import { Box, VStack, Text, useTheme, Button } from "@chakra-ui/react";
import { SpringModal } from "@/components/modals/springModal/SpringModal";
import { hideScrollbar } from "@/utils/style/style-utils";
import { Favorite } from "@mui/icons-material";
import React, { useState } from "react";

export interface UserStatsModalProps {
  isOpen: boolean;
  onClose: () => void;
  unreadRecognitionModalData: React.ReactNode;
}

export const NewRecognitionModal: React.FC<UserStatsModalProps> = ({
  isOpen,
  onClose,
  unreadRecognitionModalData,
}) => {
  const theme = useTheme();

  return (
    <SpringModal
      isOpen={isOpen}
      onClose={onClose}
      showClose={true}
      bg={theme.colors.primary}
      color="white"
      frontIcon={<Favorite />}
      bgIcon={<Favorite />}
      header="Your colleagues appreciate you!"
      body={
        <VStack w="full">
          <Box
            maxH={[400, 610]}
            overflowY="auto"
            w="full"
            sx={{
              "@media (max-width: 400px)": {
                ...hideScrollbar,
              },
            }}
          >
            {unreadRecognitionModalData}
          </Box>
          <Button
            leftIcon={<Favorite />}
            onClick={() => onClose()}
            w="full"
            bg={theme.colors.primaryTextColor}
            color={theme.colors.elementBG}
            px="8"
          >
            Thanks Guys!
          </Button>
        </VStack>
      }
    />
  );
};
