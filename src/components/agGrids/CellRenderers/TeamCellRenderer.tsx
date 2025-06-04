"use client";

import React from "react";
import { Box } from "@chakra-ui/react";
import { ICellRendererParams } from "ag-grid-community";

// Define the interface for the specific parameters used in this cell renderer
interface TeamCellRendererParams extends ICellRendererParams {
  data: {
    parentTeamId: number | null;
  };
}

// Define the component with correct typing for Ag-Grid
const TeamCellRenderer: React.FC<TeamCellRendererParams> = ({ data }) => {
  // Check if the data is present and determine if it's a department
  const isDepartment = data?.parentTeamId === null;

  return (
    <Box display="flex" alignItems="center" h="100%" px={3} py={1}>
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        h="80%"
        backgroundColor={isDepartment ? "purple.500" : "blue.500"}
        color="white"
        px={3}
        py={1}
        borderRadius="lg"
        whiteSpace="nowrap"
        sx={{
          alignSelf: "center",
        }}
      >
        {isDepartment ? "Department" : "Team"}
      </Box>
    </Box>
  );
};

// Export the component as default
export default TeamCellRenderer;
