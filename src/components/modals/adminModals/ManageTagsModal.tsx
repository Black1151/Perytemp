"use client";

import { forwardRef, useImperativeHandle, useState } from "react";
import { SpringModal } from "@/components/modals/springModal/SpringModal";
import { ManageTagsModalBody } from "../modalBodies/ManageTagsModalBody";
import SellIcon from '@mui/icons-material/Sell';
import { useTheme } from "@chakra-ui/react";

interface ManageTagsModalProps {
  customerId: number;
}

export const ManageTagsModal = forwardRef(
  ({ customerId }: ManageTagsModalProps, ref) => {
    const [isOpen, setIsOpen] = useState(false);

    useImperativeHandle(ref, () => ({
      openModal: () => setIsOpen(true),
    }));

    const theme = useTheme()

    return (
      <SpringModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        showClose={true}
        bg={theme.colors.darkElementBG}
        color="white"
        frontIcon={<SellIcon />}
        bgIcon={<SellIcon/>}
        header="Add / Remove Tags"
        body={
          <ManageTagsModalBody
            customerId={customerId}
            onClose={() => setIsOpen(false)}
          />
        }
      />
    );
  }
);

ManageTagsModal.displayName = "ManageTagsModal";
