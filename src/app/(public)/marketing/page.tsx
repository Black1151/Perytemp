import {
  Container,
  Heading,
  Text,
  Box,
  Image,
  Stack,
  SimpleGrid,
} from "@chakra-ui/react";
import React from "react";
import PublicLayout from "@/components/public/PublicLayout";
import { LetterFlyIn } from "@/components/animations/text/LetterFlyIn";

export default function MarketingPage() {
  return (
    <PublicLayout>
      <Container maxW="container.lg" py={[4, 8]} px={[2, 4]}>
        <Stack
          direction={["column", "row"]}
          spacing={[4, 8]}
          align="flex-start"
        >
          <Box flex="1">
            <Heading as="h1" size={["lg", "2xl"]} mb={[2, 4]}>
              Introducing{" "}
            </Heading>

            <Box display={["block", "block", "block", "none"]}>
              <LetterFlyIn
                as="span"
                fontSize="64px"
                fontWeight={200}
                color="primary"
              >
                Perygon
              </LetterFlyIn>
            </Box>

            <Text fontSize={["md", "lg"]} mb={4}>
              Perygon is your all-in-one, 360° business growth toolkit—merging
              easily accessible data capture, business workflows, and intuitive
              data analytics with engaging, modern design.
            </Text>
            <Text fontSize={["md", "lg"]} mb={4}>
              Many problems, unlimited solutions—Perygon provides valuable
              insights, letting teams easily explore metrics, reveal patterns,
              and foster improvement.
            </Text>
            <Text fontSize={["md", "lg"]} mb={4}>
              This solution provides an ecosystem of varied business tools both
              simple and complex, including staff happiness pulse, employee net
              promoter score, client satisfaction levels, business maturity
              analysis, and many more.
            </Text>
            <Text fontSize={["md", "lg"]} mb={4}>
              Perygon’s flexible framework clarifies direction and sparks
              meaningful business progress and growth.
            </Text>
            <Text fontSize={["md", "lg"]} mb={6}>
              This initial release introduces our first tool, the{" "}
              <strong>“Happiness Score”</strong>, allowing you to manage company
              staff, services, teams, and patterns of engagement. It works as a
              smart pocket companion to our Perygon Platform.
            </Text>
          </Box>

          {/* Right Section: Sticky */}
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
              Perygon
            </LetterFlyIn>
          </Box>
        </Stack>

        {/* GALLERY SECTION */}
        <Box mt={10}>
          <Heading as="h2" size="lg" mb={4}>
            A Look at Perygon in Action
          </Heading>

          <SimpleGrid columns={[1, 2, 3]} spacing={4}>
            <Image
              borderRadius={"xl"}
              shadow={"lg"}
              src="/images/marketing/HappinessMarketing_3.jpg"
              alt="Perygon Happiness Score Submission Picture"
            />
            <Image
              borderRadius={"xl"}
              shadow={"lg"}
              src="/images/marketing/HappinessMarketing_1.jpg"
              alt="Perygon Happiness Score Average Picture"
            />
            <Image
              borderRadius={"xl"}
              shadow={"lg"}
              src="/images/marketing/HappinessMarketing_2.jpg"
              alt="Perygon Happiness Score Trend Picture"
            />
          </SimpleGrid>
        </Box>
      </Container>
    </PublicLayout>
  );
}
