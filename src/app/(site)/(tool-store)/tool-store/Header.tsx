import React, { useState } from "react";
import {
  Flex,
  HStack,
  Text,
  Tooltip,
  IconButton,
  useDisclosure,
  useTheme,
  Box,
  Heading,
  Link,
} from "@chakra-ui/react";
import { Info } from "@mui/icons-material";
import BackButton from "@/components/BackButton";
import BillingCycleToggle from "./BillingCyleToggle";
import LargeTextModal from "@/components/surveyjs/layout/default/LargeTextModal";
import { useUser } from "@/providers/UserProvider";
import { SALES_EMAIL } from "@/utils/emailAddresses";

interface HeaderProps {
  title: string;
  showBillingCycle?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ title, showBillingCycle = true }) => {
  const theme = useTheme();
  const { user } = useUser();

  // Modal state
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [modalData, setModalData] = useState<{
    title: string;
    body: React.ReactNode;
  }>({ title: "", body: null });

  const showHelp = () => {
    setModalData({
      title: "Monthly vs Annual Subscription Terms",
      body: (
        <Box
          textAlign="left"
          fontFamily="Arial, sans-serif"
          lineHeight={1.6}
          color={theme.colors.primaryTextColour}
        >
          <Heading as="h2" size="md" mb={2}>
            (a) Monthly Subscription Terms
          </Heading>
          <Heading as="h3" size="md" mb={4}>
            Monthly Subscription Terms and Conditions
          </Heading>

          <Heading as="h4" size="sm" mt={4} mb={2}>
            Subscription Model
          </Heading>
          <Text mb={4}>
            Your monthly subscription grants you access to our SaaS platform's
            features as selected at the time of checkout. The subscription
            begins on the date of your first payment, which is charged upfront.
          </Text>

          <Heading as="h4" size="sm" mt={4} mb={2}>
            Renewal and Upgrades
          </Heading>
          <Text mb={4}>
            Payments are collected monthly in advance on the renewal date. You
            may increase your subscription level at any time, adding additional
            users or tools. Any such increase will result in a pro-rata credit
            for the unused portion of the current monthly subscription, and a
            new subscription will be generated effective from the date of the
            change.
          </Text>

          <Heading as="h4" size="sm" mt={4} mb={2}>
            Downgrades
          </Heading>
          <Text mb={4}>
            Downgrading (reducing the number of users or tools) is not available
            via the self-service platform. To request a downgrade, please
            contact us directly at{" "}
            <Link color="blue.500" href={`mailto:${SALES_EMAIL}`}>
              {SALES_EMAIL}
            </Link>
            . Downgrades will take effect at the end of the current monthly
            billing period, and no refunds or credits will be issued for the
            remaining period.
          </Text>

          <Heading as="h4" size="sm" mt={4} mb={2}>
            Cancellations
          </Heading>
          <Text mb={4}>
            You may cancel your subscription at any time via the platform.
            Cancellation will be effective at the end of the current monthly
            billing period. No refunds or credits will be issued for partial
            months.
          </Text>

          <Heading as="h4" size="sm" mt={4} mb={2}>
            Statutory Rights
          </Heading>
          <Text mb={6}>
            These terms do not affect your statutory rights under UK law.
          </Text>

          <Heading as="h2" size="md" mt={6} mb={2}>
            (b) Annual Subscription Terms
          </Heading>
          <Heading as="h3" size="md" mb={4}>
            Annual Subscription Terms and Conditions
          </Heading>

          <Heading as="h4" size="sm" mt={4} mb={2}>
            Subscription Model
          </Heading>
          <Text mb={4}>
            Your annual subscription grants you access to our SaaS platform's
            features as selected at the time of checkout. The subscription
            begins on the date of your first payment, which is charged upfront
            for the full year.
          </Text>

          <Heading as="h4" size="sm" mt={4} mb={2}>
            Discounted Rate
          </Heading>
          <Text mb={4}>
            Annual subscriptions are offered at a discounted rate compared to
            monthly subscriptions, to reflect your annual commitment.
          </Text>

          <Heading as="h4" size="sm" mt={4} mb={2}>
            Renewal
          </Heading>
          <Text mb={4}>
            Annual subscriptions automatically renew at the end of each 12-month
            period unless you notify us of cancellation at least 30 days before
            the renewal date. Renewal payments will be taken upfront on the
            renewal date.
          </Text>

          <Heading as="h4" size="sm" mt={4} mb={2}>
            Changes to Subscription
          </Heading>
          <Text mb={4}>
            Subscriptions cannot be changed during the subscription year without
            contacting us directly via{" "}
            <Link color="blue.500" href={`mailto:${SALES_EMAIL}`}>
              {SALES_EMAIL}
            </Link>
            . Any changes, will be processed manually and may be subject to
            additional charges or terms as agreed at the time of change.
          </Text>

          <Heading as="h4" size="sm" mt={4} mb={2}>
            Cancellations
          </Heading>
          <Text mb={4}>
            Annual subscriptions cannot be cancelled via the platform at any
            time. Contact us directly via{" "}
            <Link color="blue.500" href={`mailto:${SALES_EMAIL}`}>
              {SALES_EMAIL}
            </Link>
            , but no refunds or credits will be issued for any unused portion of
            the subscription year.
          </Text>

          <Heading as="h4" size="sm" mt={4} mb={2}>
            Statutory Rights
          </Heading>
          <Text>
            These terms do not affect your statutory rights under UK law.
          </Text>
        </Box>
      ),
    });
    onOpen();
  };

  return (
    <>
      {/* Shared SurveyModal */}
      <LargeTextModal
        isOpen={isOpen}
        onClose={onClose}
        onConfirm={onClose}
        showButtons={{ close: true, confirm: false }}
        title={modalData.title}
        titleProps={{
          fontFamily: "Bonfire",
          fontSize: "2xl",
          fontWeight: "bold",
          color: "primary",
        }}
        bodyContent={modalData.body}
      />

      <Flex
        flexDirection={["column", "column", "row"]}
        gap={3}
        w="100%"
        justify="space-between"
        mb={4}
      >
        <HStack spacing={2} align={"center"}>
          <BackButton />

          <Text
            fontWeight="400"
            fontFamily="bonfire"
            fontSize={[34, 32, 42]}
            mb={[-2, -3, -4]}
            color={theme.fringeCases.dashboardHeader.textcolor}
          >
            {title}
          </Text>

          <Tooltip label="Click to view subscription terms" hasArrow>
            <IconButton
              aria-label="Subscription Terms"
              icon={<Info />}
              variant="ghost"
              onClick={showHelp}
              color="white"
              _hover={{ color: "primary", background: "white" }}
              ml={0}
              mb={1}
            />
          </Tooltip>
        </HStack>

        {(user?.role === "CL" || user?.role === "CA") && showBillingCycle && <BillingCycleToggle />}
      </Flex>
    </>
  );
};
