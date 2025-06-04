"use client";

import React from "react";
import { Box } from "@chakra-ui/react";
import { ICellRendererParams } from "ag-grid-community";

const ColourCellRenderer: React.FC<ICellRendererParams> = (params) => {
  const { value } = params; // This is the hex code from the colour field

  // Fallback for invalid or missing color values
  const isValidHex = /^#[0-9A-F]{6}$/i.test(value);

  return (
    <Box display="flex" alignItems="center" h="100%" px={3} py={1}>
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        h="80%"
        backgroundColor={isValidHex ? value : "gray.400"} // Use the color if valid, otherwise fallback to gray
        color="white" // White text to contrast the background color
        px={3}
        py={1}
        borderRadius="lg" // Optional: Gives the box a rounded appearance like a badge
        whiteSpace="nowrap" // Prevent text from wrapping
        sx={{
          alignSelf: "center",
        }}
      >
        {isValidHex ? value : "Invalid Color"}
      </Box>
    </Box>
  );
};

export default ColourCellRenderer;
