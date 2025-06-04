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
} from "@chakra-ui/react";
import BusinessIcon from "@mui/icons-material/Business";
import PersonAddIcon from "@mui/icons-material/PersonAdd";

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
        <HStack w="full">
          <HStack
            color={theme.colors.primaryTextColor}
            _groupHover={{ color: "white" }}
            transition="color 0.2s ease"
          >
            <PersonAddIcon style={{ marginRight: "4px" }} />
          </HStack>
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
    </VStack>
  );
};
