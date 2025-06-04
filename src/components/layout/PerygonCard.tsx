import React from "react";
import { Box, BoxProps, useTheme } from "@chakra-ui/react";

interface CardProps extends BoxProps {
  children: React.ReactNode;
}

const Card: React.FC<CardProps> = ({ children, ...rest }) => {
  const theme = useTheme();

  return (
    <Box
      borderRadius="lg"
      bg="elementBG"
      p={4}
      boxShadow={theme.shadows.primaryShadow || ""}
      border={theme.borders.primaryBorder}
      {...rest}
    >
      {children}
    </Box>
  );
};

export default Card;
