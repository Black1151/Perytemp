"use client";

import React from "react";
import {
  Container,
  Heading,
  Text,
  Box,
  Button,
  Stack,
  Link,
  useTheme,
} from "@chakra-ui/react";
import PublicLayout from "@/components/public/PublicLayout";
import { LetterFlyIn } from "@/components/animations/text/LetterFlyIn";

const DeleteMyDataPage = () => {
  const theme = useTheme();
  return (
    <PublicLayout>
      <Container maxW="container.lg" py={8}>
        <Stack direction={["column", "row"]} spacing={8} align="flex-start">
          {/* Left Section */}
          <Box flex="1">
            <Heading as="h1" size="2xl" mb={4}>
              Request to Delete Your Data
            </Heading>

            <Text fontSize={["md", "lg"]} mb={4}>
              At{" "}
              <Text
                as={"span"}
                fontSize={["lg", "xl"]}
                fontFamily={"Bonfire"}
                fontWeight={"200"}
                color={theme.colors.primaryText}
              >
                Perygon
              </Text>
              , we respect your privacy and provide full control over your data.
              If you wish to permanently delete your account and all associated
              personal data, follow these steps.
            </Text>

            <Heading as="h2" size={["sm", "md"]} mt={6} mb={2}>
              How to Request Deletion:
            </Heading>
            <Text size={["sm", "md"]} mb={2}>
              <strong>1. Submit a Request:</strong> Click the button below to
              send an email to our support team.
            </Text>
            <Text size={["sm", "md"]} mb={2}>
              <strong>2. Data Included in Deletion:</strong> Your personal data,
              user history, and any other identifiable information will be
              permanently removed. Data required for analytics may be retained
              but will not be personally identifiable.
            </Text>
            <Text size={["sm", "md"]} mb={2}>
              <strong>3. Data Retention:</strong> Any legally required data
              (e.g., transactions or compliance records) will be stored securely
              and deleted after a set period.
            </Text>
            <Text size={["sm", "md"]} mb={4}>
              <strong>4. Confirmation:</strong> You will receive a confirmation
              email once your request has been processed. Please allow up to{" "}
              <strong>21 business days</strong> for the request to be completed.
            </Text>

            <Heading as="h2" size="md" mt={6} mb={2}>
              What to Include in Your Email:
            </Heading>
            <Text size={["sm", "md"]} mb={2}>
              • Subject:{" "}
              <strong>
                [Your First Name] [Your Last Name] - [Company Name] - Data
                Deletion Request
              </strong>
            </Text>
            <Text size={["sm", "md"]} mb={2}>
              • Brief reason for your request (optional)
            </Text>

            <Box mt={6}>
              <Link href="mailto:delete-my-data@perygon.co.uk">
                <Button
                  color="white"
                  bg="red.500"
                  fontSize={["md", "lg"]}
                  _hover={{ bg: "primary" }}
                  _active={{ bg: "white", color: "primary" }}
                >
                  Request Data Deletion
                </Button>
              </Link>
            </Box>
          </Box>

          {/* Right Section: Branding */}
          <Box
            flex="1"
            textAlign="center"
            position="sticky"
            top="1rem"
            display={["none", "none", "none", "block"]}
          >
            <LetterFlyIn
              as="span"
              fontSize="102px"
              fontWeight={200}
              color="primary"
            >
              Your Data
            </LetterFlyIn>
          </Box>
        </Stack>
      </Container>
    </PublicLayout>
  );
};

export default DeleteMyDataPage;
