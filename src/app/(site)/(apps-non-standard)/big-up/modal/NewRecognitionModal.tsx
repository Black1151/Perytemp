import { Modal, ModalOverlay, Box, Text, Button } from "@chakra-ui/react";
import { BigUpModalContent } from "./components/BigUpModalContent";
import { hideScrollbar } from "@/utils/style/style-utils";

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
  return (
    <Modal
      size="2xl"
      isOpen={isOpen}
      onClose={onClose}
      isCentered
      returnFocusOnClose={false}
    >
      <ModalOverlay />
      <BigUpModalContent mx={4} borderRadius="lg">
        <Box p={4}>
          <Text color="primary" fontSize="3xl" pb={4} fontWeight="bold">
            Your colleagues appreciate you!
          </Text>
          <Box
            maxH={[400, 610]}
            overflowY="auto"
            p={4}
            sx={{
              "@media (max-width: 400px)": {
                ...hideScrollbar,
              },
            }}
          >
            {unreadRecognitionModalData}
          </Box>
        </Box>
        <Button
          variant="primary"
          maxW="200px"
          mx="auto"
          onClick={onClose}
          mb={8}
        >
          Thanks Guys!
        </Button>
      </BigUpModalContent>
    </Modal>
  );
};
