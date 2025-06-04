import { ReactNode } from "react";
import { Box, Flex } from "@chakra-ui/react";
import PerygonPageContainer from "@/components/layout/PerygonPageContainer";

interface LayoutProps {
  children: ReactNode;
}

export default async function Layout({ children }: LayoutProps) {
  return (
    <>
      <Flex flex={1} width="100%" mt={"60px"} mb={["60px", "60px", "35px"]}>
        <Box flex={1} overflowY="clip" px={[3, 3, 78]} pb={3} pt={2}>
          {children}
        </Box>
      </Flex>
    </>
  );
}
