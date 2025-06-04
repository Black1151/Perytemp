import React from "react";
import {
  Button,
  Flex,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalHeaderProps,
  ModalOverlay,
} from "@chakra-ui/react";
import DoneIcon from "@mui/icons-material/Done";
import CloseIcon from "@mui/icons-material/Close";
import PerygonCard from "@/components/layout/PerygonCard";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  showButtons?: {
    close: boolean;
    confirm: boolean;
  };
  title?: string | React.ReactNode;
  titleProps?: ModalHeaderProps;
  bodyContent?: string | React.ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  icon?: React.ReactNode;
}

const SurveyModal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  showButtons = {
    close: true,
    confirm: true,
  },
  title = "Confirm Action",
  titleProps = {},
  bodyContent = "Are you sure you want to perform this action?",
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  icon,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} returnFocusOnClose={false}>
      {" "}
      <ModalOverlay />
      <ModalContent bgColor="elementBG">
        <PerygonCard>
          {icon && (
            <Flex
              justifyContent={"center"}
              alignItems={"center"}
              width={"100%"}
              color="primaryTextColor"
              mb={0}
            >
              {icon}
            </Flex>
          )}
          <ModalHeader {...titleProps}>
            <Flex
              justifyContent={"center"}
              alignItems={"center"}
              width={"100%"}
              color="primaryTextColor"
            >
              {title}
            </Flex>
          </ModalHeader>

          <ModalBody color="primaryTextColor" textAlign={"center"}>{bodyContent}</ModalBody>

          <ModalFooter alignContent={"center"} justifyContent={"center"}>
            {showButtons.close && (
              <Button
                mr={3}
                onClick={onClose}
                bgColor="darkGray"
                border="1px solid darkGray"
                color="white"
                _hover={{ color: "white", backgroundColor: "red.600" }}
                display="flex"
                alignItems="center"
                gap={[0, 0, 2]}
                lineHeight={0}
              >
                <CloseIcon />
                {cancelLabel}
              </Button>
            )}
            {showButtons.confirm && (
              <Button
                bgColor="darkGray"
                border="1px solid lightGray"
                color="white"
                _hover={{ color: "white", backgroundColor: "green.600" }}
                onClick={onConfirm}
                display="flex"
                alignItems="center"
                gap={[0, 0, 2]}
                lineHeight={0}
              >
                <DoneIcon />
                {confirmLabel}
              </Button>
            )}
          </ModalFooter>
        </PerygonCard>
      </ModalContent>
    </Modal>
  );
};

export default SurveyModal;
