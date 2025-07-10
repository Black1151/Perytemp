"use client";

import React, { useState } from "react";
import { Avatar, Box, Tooltip } from "@chakra-ui/react";
import SurveyModal from "@/components/surveyjs/layout/default/SurveyModal";
import { Comment as CommentIcon } from "@mui/icons-material";

interface CommentsCellRendererProps {
  node: {
    data: {
      [key: string]: any;
      comments?: string;
      fullName?: string;
      userImageUrl?: string;
    };
  };
}

const CommentsCellRenderer: React.FC<CommentsCellRendererProps> = ({
  node,
}) => {
  const [isModalOpen, setModalOpen] = useState(false);

  const comment = node.data.comments;

  // Handlers for modal
  const openModal = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);

  return (
    <Box
      display="flex"
      justifyContent="flex-start"
      alignItems="center"
      gap={2}
      height="100%"
    >
      <Tooltip
        label={comment ? "Click to view!" : ""}
        placement="bottom-start"
        hasArrow
      >
        <Box
          as="button"
          onClick={openModal}
          p={2}
          borderRadius="md"
          cursor="pointer"
        >
          {comment? comment : <i>No comment left</i>}
          
        </Box>
      </Tooltip>

      {/* Modal */}

      <SurveyModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onConfirm={closeModal}
        showButtons={{
          close: false,
          confirm: true,
        }}
        title="Comment Details"
        bodyContent={
          <Box display="flex" alignItems="flex-start" gap={4}>
            <Avatar
              name={node.data.fullName}
              size="md"
              src={node.data.userImageUrl}
            />
            <Box>
              <Box fontWeight="bold">{node.data.fullName}</Box>
              <Box>{comment}</Box>
            </Box>
          </Box>
        }
        confirmLabel="Close"
        type="info"
        icon={<CommentIcon fontSize="inherit"/>}
      />
    </Box>
  );
};

export default CommentsCellRenderer;
