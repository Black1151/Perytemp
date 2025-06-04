"use client";

import React from "react";
import { Box, useTheme } from "@chakra-ui/react";

export interface BottombarProps {
  loading?: boolean;
  content?: React.ReactNode;
}

const Bottombar: React.FC<BottombarProps> = ({ loading = false, content }) => {
  const theme = useTheme();

  return (
    <Box
      position="fixed"
      bottom={0}
      left={0}
      right={0}
      bg="elementBG"
      maxH={"100px"}
      boxShadow="xl"
      zIndex={99}
      px={2}
      display={["block", "block", "none"]}
      overflowX="scroll"
      overflowY={"hidden"}
      borderBottom={`1px solid ${theme.colors.primary}`}
      borderTop={`1px solid ${theme.colors.primary}`}
      css={{
        WebkitOverflowScrolling: "touch",
        scrollbarHeight: "none",
        msOverflowStyle: "none",
        "&::-webkit-scrollbar": {
          display: "none",
        },
      }}
    >
      {content}
    </Box>
  );
};
export default Bottombar;
