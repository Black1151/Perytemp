"use client";

import React from "react";
import { Box, IconButton } from "@chakra-ui/react";
import { Visibility } from "@mui/icons-material"; // MUI icons
import Link from "next/link";

interface ActivityButtonRendererProps {
  node: { data: { [key: string]: any; isActive: boolean } }; // Support dynamic keys for node data
}

const ActivityButtonRenderer: React.FC<ActivityButtonRendererProps> = ({
  node,
}) => {
  const appUrl = node.data.toolAppUrl;
  const wfInstId = node.data.wfInstId;

  return (
    <Box
      display="flex"
      justifyContent="flex-end"
      alignItems="center"
      gap={2}
      height="100%"
    >
      <Box height={"full"}>
        <Link href={`${appUrl}/workflow/${wfInstId}`}>
          <IconButton
            aria-label="View"
            aspectRatio={1}
            variant="agPrimary"
            icon={<Visibility style={{ fontSize: "inherit" }} />}
            sx={{
              height: "80%",
              alignSelf: "center",
            }}
          />
        </Link>
      </Box>
    </Box>
  );
};

export default ActivityButtonRenderer;
