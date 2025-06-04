"use client";
import React, { useState } from "react";
import {
  Box,
  Heading,
  Text,
  Link,
  Stack,
  HStack,
  Code,
} from "@chakra-ui/react";
import { useBasket } from "../useBasket";
import { useUser } from "@/providers/UserProvider";

interface ContactSalesProps {
  subscriptionId: string;
}

const SUPPORT_EMAIL = "sales@perygon.co.uk";
const SUPPORT_TEL = "0333 222 4445";

const ContactSales: React.FC<ContactSalesProps> = ({ subscriptionId }) => {
  const basket = useBasket();
  const user = useUser()

  return (
    <Box
      maxW="500px"
      mx="auto"
      my="8"
      p="8"
      bg={"white"}
      borderRadius="lg"
      boxShadow="md"
    >
      <Heading as="h1" size="lg" mb="4">
        Contact Sales
      </Heading>
      <Text mb="4">
        To change your billing cycle, adjust an annual subscription or any other
        sales inquiries, please contact us using the information below.
      </Text>
      <Stack spacing={2} mb={6}>
        <Text>
          <strong>Phone:</strong>{" "}
          <Link href={`tel:${SUPPORT_TEL}`} color="teal.500">
            {SUPPORT_TEL}
          </Link>
        </Text>
        <Text>
          <strong>Email:</strong>{" "}
          <Link href={`mailto:${SUPPORT_EMAIL}`} color="teal.500">
            {SUPPORT_EMAIL}
          </Link>
        </Text>
      </Stack>
      <>
        <HStack>
          <Text fontWeight="bold">Your Subscription ID:</Text>
          <Code mt={1} fontSize="md">
            {basket.basket?.id}
          </Code>
        </HStack>
        <HStack>
          <Text fontWeight="bold">Your Organisation ID:</Text>
          <Code mt={1} fontSize="md">
            {user.user?.customerId}
          </Code>
        </HStack>
      </>
    </Box>
  );
};

export default function Page() {
  const subscriptionId = "SUBSCRIPTION-123456";

  return <ContactSales subscriptionId={subscriptionId} />;
}
