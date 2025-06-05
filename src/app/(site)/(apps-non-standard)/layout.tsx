import { ReactNode } from "react";
import { Box, Flex } from "@chakra-ui/react";

interface LayoutProps {
  children: ReactNode;
}

export default async function Layout({ children }: LayoutProps) {
  return (
    <>
      <Flex flex={1} width="100%">
        <Box flex={1} overflowY="auto">
          {children}
        </Box>
      </Flex>
    </>
  );
}
