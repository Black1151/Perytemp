"use client";

import {
  Tabs,
  TabList,
  Tab,
  useTheme,
  VStack,
  Card,
  Text,
  HStack,
  Badge,
  Spacer,
  useDisclosure,
  IconButton,
} from "@chakra-ui/react";
import BusinessIcon from "@mui/icons-material/Business";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import { subscriptionLimits } from "@/utils/constants/subscriptionLimits";
import { SpringModal } from "@/components/modals/springModal/SpringModal";
import { InfoOutlined } from "@mui/icons-material";

interface SignUpTypeSelectorProps {
  signUpType: "individual" | "company" | null;
  setSignUpType: (type: "individual" | "company") => void;
}

export const SignUpTypeSelector = ({
  signUpType,
  setSignUpType,
}: SignUpTypeSelectorProps) => {
  // Map your signUpType to a 0|1 index
  const theme = useTheme();
  const { isOpen: isCompanyModalOpen, onOpen: onCompanyModalOpen, onClose: onCompanyModalClose } = useDisclosure();
  const { isOpen: isIndividualModalOpen, onOpen: onIndividualModalOpen, onClose: onIndividualModalClose } = useDisclosure();

  return (
    <VStack w="100%" spacing={4}>
      <Card
        width="100%"
        padding={4}
        backgroundColor={theme.colors.elementBG}
        borderRadius="lg"
        boxShadow="md"
        display="flex"
        flexDirection="column"
        alignItems="left"
        justifyContent="center"
        gap={4}
        onClick={() => setSignUpType("company")}
        cursor="pointer"
        role="group"
        transition="background-color 0.3s ease"
        _hover={{ backgroundColor: theme.colors.primary }}
        _focus={{ boxShadow: "none" }}
      >
        <HStack w="full" alignItems="center" justifyContent="space-between">
          <Badge colorScheme="green" w="min">{subscriptionLimits.free.trialDays} Day Free Trial</Badge>
          <IconButton
            aria-label="About Free Trial"
            icon={<InfoOutlined />}
            variant="ghost"
            color={theme.colors.secondaryTextColor}
            _groupHover={{ color: "white" }}
            _hover={{ bg: "rgb(0,0,0,0.2)" }}
            transition="color 0.2s ease"
            cursor="pointer"
            onClick={(e: React.MouseEvent) => {
              e.stopPropagation();
              onCompanyModalOpen();
            }}
          />
        </HStack>

        <HStack w="full">
          <HStack
            color={theme.colors.primaryTextColor}
            _groupHover={{ color: "white" }}
            transition="color 0.2s ease"
          >
            <BusinessIcon style={{ marginRight: "4px" }} />
          </HStack>
          <Text
            fontWeight={600}
            fontSize={20}
            color={theme.colors.primaryTextColor}
            _groupHover={{ color: "white" }}
            transition="color 0.2s ease"
          >
            Create a new company
          </Text>
        </HStack>

        <Text
          fontSize={14}
          color={theme.colors.secondaryTextColor}
          _groupHover={{ color: "white" }}
          transition="color 0.2s ease"
        >
          Join Perygon and create a new company on a free trial. Invite your team members and get set up now.
        </Text>
      </Card>

      <Card
        width="100%"
        padding={4}
        backgroundColor={theme.colors.elementBG}
        borderRadius="lg"
        boxShadow="md"
        display="flex"
        flexDirection="column"
        alignItems="left"
        justifyContent="center"
        gap={4}
        onClick={() => setSignUpType("individual")}
        cursor="pointer"
        role="group"
        transition="background-color 0.3s ease"
        _hover={{ backgroundColor: theme.colors.primary }}
        _focus={{ boxShadow: "none" }}
      >
        <HStack w="full" alignItems="center" justifyContent="space-between">
          <HStack
            color={theme.colors.primaryTextColor}
            _groupHover={{ color: "white" }}
            transition="color 0.2s ease"
          >
            <PersonAddIcon style={{ marginRight: "4px" }} />
          </HStack>
          <Spacer />
          <IconButton
            aria-label="Joining Existing Company Info"
            icon={<InfoOutlined />}
            variant="ghost"
            color={theme.colors.secondaryTextColor}
            _groupHover={{ color: "white" }}
            _hover={{ bg: "rgb(0,0,0,0.2)" }}
            transition="color 0.2s ease"
            cursor="pointer"
            onClick={(e: React.MouseEvent) => {
              e.stopPropagation();
              onIndividualModalOpen();
            }}
          />
        </HStack>

        <HStack w="full">
          <Text
            fontWeight={600}
            fontSize={20}
            color={theme.colors.primaryTextColor}
            _groupHover={{ color: "white" }}
            transition="color 0.2s ease"
          >
            Join existing company
          </Text>
        </HStack>

        <Text
          fontSize={14}
          color={theme.colors.secondaryTextColor}
          _groupHover={{ color: "white" }}
          transition="color 0.2s ease"
        >
          Is your company already using Perygon with auto-signup? Join your collegues by signing up with your work email.
        </Text>
      </Card>

      <SpringModal
        isOpen={isCompanyModalOpen}
        onClose={onCompanyModalClose}
        header="About Your Free Trial"
        body={(
          <VStack spacing={4} align="start">
            <Text>When you create a new company account, you'll receive a {subscriptionLimits.free.trialDays} day free trial of Perygon.</Text>
            <Text>During this trial, you can explore a number of tools and features and invite your team members. No credit card is required to start your trial.</Text>
            <Text>After the trial period, you'll have the option to upgrade to a paid plan to continue using Perygon and unlock features.</Text>
          </VStack>
        )}
        showClose={true}
        bg={theme.colors.primary}
      />

      <SpringModal
        isOpen={isIndividualModalOpen}
        onClose={onIndividualModalClose}
        header="Joining an Existing Company"
        body={(
          <VStack spacing={4} align="start">
            <Text>If your company is already using Perygon, you may be able join them here.</Text>
            <Text>To do this, please sign up using your work email address. Perygon uses your company's email domain to automatically connect you with your team.</Text>
            <Text>If you're unsure whether your company is using Perygon and you can use this sign up method, please contact your administrator or IT department.</Text>
          </VStack>
        )}
        showClose={true}
        bg={theme.colors.primary}
      />
    </VStack>
  );
};
