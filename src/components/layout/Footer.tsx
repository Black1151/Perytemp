"use client";

import { Box, HStack, Text, useTheme } from "@chakra-ui/react";

export const Footer = () => {
  const theme = useTheme();
  return (
    <Box
      position="fixed"
      bottom={0}
      left={0}
      right={0}
      width="100%"
      justifyContent="center"
      alignItems="center"
      borderTop="1px solid"
      borderColor={"rgb(255,255,255,0.5)"}
      display={["none", "flex"]}
      bgGradient={theme.components.footer.baseStyle.bgGradient}
      zIndex={3}
    >
      <HStack color="white" px={5} fontSize={16}>
        <Text>Powered by</Text>
        <Text fontFamily="Bonfire" pt={2}>
          Perygon
        </Text>
        <Text display={["none", "flex"]}>Copyright © 2024 - 2025</Text>
      </HStack>
    </Box>
  );
};
