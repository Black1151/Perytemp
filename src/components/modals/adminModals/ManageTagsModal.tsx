"use client";

import { forwardRef, useImperativeHandle, useState } from "react";
import { PerygonModal } from "@/components/modals/PerygonModal";
import { ManageTagsModalBody } from "../modalBodies/ManageTagsModalBody";

interface ManageTagsModalProps {
  customerId: number;
}

export const ManageTagsModal = forwardRef(
  ({ customerId }: ManageTagsModalProps, ref) => {
    const [isOpen, setIsOpen] = useState(false);

    useImperativeHandle(ref, () => ({
      openModal: () => setIsOpen(true),
    }));

    //TODO: Dodgy fix. look at this again
    return (
      <PerygonModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Add / Remove Tags"
        body={
          <ManageTagsModalBody
            customerId={customerId}
            onClose={() => setIsOpen(false)}
          />
        }
      >
        <ManageTagsModalBody
          customerId={customerId}
          onClose={() => setIsOpen(false)}
        />
      </PerygonModal>
    );
  }
);

ManageTagsModal.displayName = "ManageTagsModal";
