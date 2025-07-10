import React, { useState } from "react";
import {
  HStack,
  Switch,
  IconButton,
  Box,
  Text,
  useToast,
  Spinner,
} from "@chakra-ui/react";
import MessageIcon from "@mui/icons-material/Message";
import SendIcon from '@mui/icons-material/Send';
import { SpringModal } from "@/components/modals/springModal/SpringModal";
import SurveyModal from "@/components/surveyjs/layout/default/SurveyModal";
import { ICellRendererParams, IRowNode } from "ag-grid-community";

interface BookingConfirmationRendererProps extends ICellRendererParams {
  data: {
    id: string | number;
    isConfirmed: boolean;
    confirmationDate: string;
    confirmationComment?: string;
  };
}

const BookingConfirmationRenderer: React.FC<BookingConfirmationRendererProps> = ({ data, api }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [comment, setComment] = useState(data.confirmationComment || "");
  const [commentDraft, setCommentDraft] = useState(comment);
  const [switchLoading, setSwitchLoading] = useState(false);
  const [commentLoading, setCommentLoading] = useState(false);
  const [isConfirmedLocal, setIsConfirmedLocal] = useState(data.isConfirmed);
  const [showUnconfirmModal, setShowUnconfirmModal] = useState(false);
  const [pendingSwitchEvent, setPendingSwitchEvent] = useState<React.ChangeEvent<HTMLInputElement> | null>(null);
  const toast = useToast();

  // When opening the modal, set commentDraft to the current comment
  React.useEffect(() => {
    if (modalOpen) {
      setCommentDraft(comment);
    }
  }, [modalOpen, comment]);

  if (!data) return null;
  const { isConfirmed, confirmationDate, id } = data;

  const handleSwitch = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    if (!checked) {
      setPendingSwitchEvent(e);
      setShowUnconfirmModal(true);
      return;
    }
    setIsConfirmedLocal(checked); // Optimistically update local state
    setSwitchLoading(true);
    try {
      const res = await fetch(`/api/hospitality-hub/userHospitalityBooking`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, isConfirmed: checked }),
      });
      if (!res.ok) throw new Error("Failed to update confirmation");
      toast({
        title: checked ? "Booking confirmed" : "Booking unconfirmed",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
      const rowNode: IRowNode<any> | undefined = api.getRowNode(String(id));
      if (rowNode !== undefined) {
        rowNode.setDataValue('isConfirmed', checked);
        rowNode.setDataValue('confirmationDate', new Date().toISOString());
        api.refreshCells({ rowNodes: [rowNode], force: true, columns: ['isConfirmed', 'confirmationDate'] });
      }
    } catch (err) {
      setIsConfirmedLocal(!checked); // Revert local state on error
      toast({
        title: "Error updating confirmation",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setSwitchLoading(false);
    }
  };

  const handleUnconfirm = async () => {
    if (!pendingSwitchEvent) return;
    const checked = false;
    setIsConfirmedLocal(checked);
    setSwitchLoading(true);
    setShowUnconfirmModal(false);
    try {
      const payload: any = { id, isConfirmed: checked, confirmationComment: null };
      const res = await fetch(`/api/hospitality-hub/userHospitalityBooking`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Failed to update confirmation");
      toast({
        title: "Booking unconfirmed",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
      const rowNode: IRowNode<any> | undefined = api.getRowNode(String(id));
      if (rowNode !== undefined) {
        rowNode.setDataValue('isConfirmed', checked);
        rowNode.setDataValue('confirmationDate', new Date().toISOString());
        rowNode.setDataValue('confirmationComment', null);
        api.refreshCells({ rowNodes: [rowNode], force: true, columns: ['isConfirmed', 'confirmationDate', 'confirmationComment'] });
      }
    } catch (err) {
      setIsConfirmedLocal(true); // Revert local state on error
      toast({
        title: "Error updating confirmation",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setSwitchLoading(false);
      setPendingSwitchEvent(null);
    }
  };

  const handleSaveComment = async (newComment: string): Promise<void> => {
    setCommentLoading(true);
    try {
      const res = await fetch(`/api/hospitality-hub/userHospitalityBooking`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, confirmationComment: newComment }),
      });
      if (!res.ok) throw new Error("Failed to send comment");
      setComment(newComment);
      toast({ title: "Comment sent", status: "success", duration: 2000, isClosable: true });
      setModalOpen(false);
      // Optionally refresh the row
      const rowNode: IRowNode<any> | undefined = api.getRowNode(String(id));
      if (rowNode !== undefined) {
        api.refreshCells({ rowNodes: [rowNode], force: true });
      }
    } catch (err) {
      toast({ title: "Error sending comment", status: "error", duration: 3000, isClosable: true });
    } finally {
      setCommentLoading(false);
    }
  };

  return (
    <HStack spacing={2}>
      <Switch
        isChecked={isConfirmedLocal}
        onChange={handleSwitch}
        isDisabled={switchLoading}
        colorScheme="green"
      />
      {isConfirmedLocal && (
        <IconButton
          aria-label="View or add confirmation comment"
          size="sm"
          onClick={e => { e.stopPropagation(); setModalOpen(true); }}
          padding={2}
          border={"none"}
          bg="gray.200"
          _hover={{ bg: "gray.100" }}
          borderRadius="md"
          minW="32px"
          minH="32px"
          width="32px"
          height="32px"
          icon={
            <Box position="relative" display="inline-block">
              <MessageIcon style={{ color: "rgb(0,0,0,0.65)", fontSize: 22, border: "none" }} />
              {comment && (
                <Box
                  position="absolute"
                  top={-2}
                  right={-2}
                  width="14px"
                  height="14px"
                  borderRadius="full"
                  bg="red.400"
                  border="1px solid white"
                />
              )}
            </Box>
          }
        />
      )}
      <SpringModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        showClose={true}
        header={"Booking Confirmation Message"}
        body={
          <Box>
            <Text mb={8}>Optionally leave a comment about this booking if the booker needs some extra information. They will recive an email with your message.</Text>
            <textarea
              style={{ width: "100%", minHeight: 80, borderRadius: 6, padding: 8, background: "rgb(0,0,0,0.8)", border: "2px solid rgb(255,255,255,0.3)"}}
              value={commentDraft}
              onChange={e => setCommentDraft(e.target.value)}
              disabled={commentLoading}
            />
          </Box>
        }
        primaryLabel={commentLoading ? <Spinner size="sm" /> : "Send"}
        primaryIcon={<SendIcon />}
        onPrimaryClick={async () => {
          await handleSaveComment(commentDraft);
        }}
        primaryDisabled={commentLoading}
        secondaryLabel="Cancel"
        onSecondaryClick={() => setModalOpen(false)}
        bg="rgb(0,0,0,0.7)"
        frontIcon={<MessageIcon />}
        bgIcon={<MessageIcon />}
      />
      <SurveyModal
        isOpen={showUnconfirmModal}
        onClose={() => { setShowUnconfirmModal(false); setPendingSwitchEvent(null); }}
        onConfirm={handleUnconfirm}
        type="warning"
        title="Unconfirm Booking?"
        bodyContent="This will alert the user of the unconfirmation. Are you sure you want to proceed?"
        confirmLabel="Yes, unconfirm"
        cancelLabel="Cancel"
      />
    </HStack>
  );
};

export default BookingConfirmationRenderer; 