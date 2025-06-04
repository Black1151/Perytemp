"use client";

import {
  Flex,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
} from "@chakra-ui/react";

import React from "react";
import { Warning } from "@mui/icons-material";

interface InviteNewUserLimitReachedProps {
  isOpen: boolean; // Controlled by the parent
  onClose: () => void; // Close handler passed by parent
}

const SiteLimitReached = ({
  isOpen,
  onClose,
}: InviteNewUserLimitReachedProps) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader paddingBottom={0} justifyItems={"center"}>
          <Flex justifyContent={"center"} alignItems={"center"} width={"100%"} gap={2}>
            <Warning/>
            Team Limit Reached
          </Flex>
        </ModalHeader>
        <ModalBody>
          <Text textAlign={"center"} fontSize={"base"} paddingBottom={4}>
            You have reached the maximum number of teams allowed for your account. Please contact support to increase your user limit.
          </Text>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default SiteLimitReached;
