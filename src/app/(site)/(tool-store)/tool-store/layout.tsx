import React from "react";
import { Flex, Container } from "@chakra-ui/react";
import Sidebars from "./Sidebars";
import { BasketProvider } from "./useBasket";

export default function ToolStoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <BasketProvider>
      <Flex w="100%">
        <Sidebars />
        <Container
          as={Flex}
          flex={1}
          maxW="container.xl"
          centerContent
          mt="60px"
          mb={["60px", "60px", "35px"]}
          px={[3, 3, 78]}
          py={3}
          overflowY="auto"
          pb={"60px"}
        >
          {children}
        </Container>
      </Flex>
    </BasketProvider>
  );
}
