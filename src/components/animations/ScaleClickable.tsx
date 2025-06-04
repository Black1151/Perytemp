import React from "react";
import { Box, BoxProps } from "@chakra-ui/react";

interface ScaleClickableProps extends BoxProps {
  onClick: () => void;
}

export const ScaleClickable: React.FC<ScaleClickableProps> = ({
  children,
  onClick,
  ...rest
}) => {
  return (
    <Box
      onClick={onClick}
      _hover={{
        transform: "scale(1.02)",
        boxShadow: "0px 20px 25px -5px rgba(0, 0, 0, 0.2)",
        cursor: "pointer",
      }}
      transition="transform 0.2s, box-shadow 0.2s"
      {...rest}
    >
      {children}
    </Box>
  );
};
