"use client";

import React from "react";
import { Box, Flex } from "@chakra-ui/react";
import { CustomCellRendererProps } from "ag-grid-react";
import { LockClock, Verified } from "@mui/icons-material";

interface UserVerifiedRendererProps extends CustomCellRendererProps {
  isVerified: boolean;
}

const UserVerifiedRenderer: React.FC<UserVerifiedRendererProps> = ({
  data,
}) => {
  const content = (
    <Flex
      alignItems="center"
      justifyContent="flex-start"
      w="full"
      h="full"
      maxW="full"
      gap={2}
    >
      <Box
        flexShrink={0}
        height="80%"
        aspectRatio={1}
        display="flex"
        alignItems="center"
        borderRadius={"full"}
        bg={"gray.100"}
        justifyContent="center"
      >
        {data.isVerified ? (
          <Verified sx={{ color: "var(--chakra-colors-primary)" }} />
        ) : (
          <LockClock sx={{ color: "var(--chakra-colors-primary)" }} />
        )}
      </Box>
    </Flex>
  );

  return content;
};

export default UserVerifiedRenderer;
