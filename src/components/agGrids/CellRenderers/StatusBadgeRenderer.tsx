"use client";

import React from "react";
import { Box } from "@chakra-ui/react";
import { ICellRendererParams } from "ag-grid-community";

// Define the interface for the specific parameters used in this cell renderer
interface StatusBadgeRendererParams extends ICellRendererParams {
  data: {
    wfInstStatusName: string;
    wfInstStatusBgColour?: string;
    wfInstStatusFgColour?: string;
  };
}

// Define the component with correct typing for Ag-Grid
const StatusBadgeRenderer: React.FC<StatusBadgeRendererParams> = ({ data }) => {
  return (
    <Box display="flex" alignItems="center" h="100%" px={3} py={1}>
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        h="80%"
        backgroundColor={
          data.wfInstStatusBgColour ? data.wfInstStatusBgColour : "gray.500"
        }
        color={data.wfInstStatusFgColour ? data.wfInstStatusFgColour : "white"}
        px={3}
        py={1}
        borderRadius="lg"
        whiteSpace="nowrap"
        sx={{
          alignSelf: "center",
        }}
      >
        {data.wfInstStatusName}
      </Box>
    </Box>
  );
};

// Export the component as default
export default StatusBadgeRenderer;
