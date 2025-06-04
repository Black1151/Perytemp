import { UserAccessControlContextProps, UserContextProps, useUser } from "@/providers/UserProvider";
import {
  Box,
  Flex,
  IconButton,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
} from "@chakra-ui/react";
import { Person } from "@mui/icons-material";
import { useState } from "react";

// UserModal component with Person icon and modal for displaying user data
export const UserModal = ({
  userMetadata,
  userAccessControl
}: {
  userMetadata: UserContextProps;
  userAccessControl: UserAccessControlContextProps;
}) => {
  const { user } = useUser();
  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = () => setIsOpen(true);
  const handleClose = () => setIsOpen(false);

  return (
    <>
      {/* Icon button to open the modal */}
      <IconButton
        aria-label="Open user details"
        icon={<Person />}
        onClick={handleOpen}
        colorScheme="teal"
        size="lg"
        borderRadius="full"
      />

      {/* Modal to display user data side by side */}
      <Modal isOpen={isOpen} onClose={handleClose} size="3xl">
        <ModalOverlay />
        <ModalContent maxH={"80%"} overflow={"auto"}>
          <ModalHeader>User Information</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Flex gap={6}>
              {/* User Context Data */}
              <Box flex="1" p={4} bg="gray.50" borderRadius="md">
                <Text fontWeight="bold" mb={2}>
                  User Metadata
                </Text>
                <Box
                  as="pre"
                  fontSize="sm"
                  whiteSpace="pre-wrap"
                  wordBreak="break-word"
                >
                  {JSON.stringify(userMetadata, null, 2)}
                </Box>
              </Box>

              {/* User Metadata Data */}
              <Box flex="1" p={4} bg="gray.50" borderRadius="md">
                <Text fontWeight="bold" mb={2}>
                  User Access Control
                </Text>
                <Box
                  as="pre"
                  fontSize="sm"
                  whiteSpace="pre-wrap"
                  wordBreak="break-word"
                >
                  {JSON.stringify(userAccessControl, null, 2)}
                </Box>
              </Box>
            </Flex>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};
