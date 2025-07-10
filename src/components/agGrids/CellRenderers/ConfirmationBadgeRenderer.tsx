import React, { useState } from "react";
import {
  Badge as ChakraBadge,
  HStack,
  Text,
  IconButton,
  Box,
} from "@chakra-ui/react";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import MessageIcon from "@mui/icons-material/Message";
import MuiBadge from "@mui/material/Badge";
import { format } from "date-fns";
import { ICellRendererParams } from "ag-grid-community";
import { SpringModal } from "@/components/modals/springModal/SpringModal";
import { useTheme } from "@chakra-ui/react";

const ConfirmationBadgeRenderer: React.FC<ICellRendererParams> = ({ data }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const theme = useTheme();
  if (!data) return null;
  const { isConfirmed, confirmationDate, confirmationComment } = data;
  const confirmationDateStr = confirmationDate
    ? format(new Date(confirmationDate), "dd-MM-yyyy")
    : null;

  return (
    <>
      <HStack spacing={2}>
        <ChakraBadge
          colorScheme={confirmationDateStr && isConfirmed ? "green" : "orange"}
          px={2}
          display="flex"
          alignItems="center"
          justifyContent="center"
          h={"30px"}
          w={"min"}
          mt={1}
          borderRadius={"full"}
        >
          <HStack spacing={2}>
            {confirmationDateStr && isConfirmed ? (
              <>
                <CheckCircleIcon
                  style={{ color: "#38A169", fontSize: "16px" }}
                />
                <Text>{confirmationDateStr}</Text>
              </>
            ) : (
              <>
                <HourglassEmptyIcon
                  style={{ color: "#D69E2E", fontSize: "16px" }}
                />
                <Text>Unconfirmed</Text>
              </>
            )}
          </HStack>
        </ChakraBadge>
        {confirmationComment && (
          <IconButton
            aria-label="View confirmation comment"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              setModalOpen(true);
            }}
            style={{ padding: 2, background: "transparent" }}
            border={"none"}
          >
            <Box position="relative" display="inline-block">
              <MessageIcon style={{ color: "white", fontSize: 22, border: "none" }} />
              <Box
                position="absolute"
                top={0}
                right={0}
                width="8px"
                height="8px"
                borderRadius="full"
                bg="red.400"
                border="2px solid white"
              />
            </Box>
          </IconButton>
        )}
      </HStack>
      {confirmationComment && (
        <SpringModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          showClose={true}
          header={"Confirmation Comment"}
          body={<Text>{confirmationComment}</Text>}
          bg={"#000000"}
          frontIcon={<MessageIcon/>}
          bgIcon={<MessageIcon/>}
          primaryLabel={"Close"}
          onPrimaryClick={() => setModalOpen(false)}
        />
      )}
    </>
  );
};

export default ConfirmationBadgeRenderer;
