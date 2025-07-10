"use client";

import React, { useState } from "react";
import {
  VStack,
  Box,
  Text,
  Button,
  useToast,
  useTheme,
  CheckboxGroup,
  Checkbox,
  Stack,
  HStack,
  Badge,
} from "@chakra-ui/react";
import { Header } from "../Header";
import PaletteIcon from '@mui/icons-material/Palette';
import CodeIcon from '@mui/icons-material/Code';
import SecurityIcon from '@mui/icons-material/Security';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import ImportExportIcon from '@mui/icons-material/ImportExport';
import { useSession } from "next-auth/react";
import { useUser } from "@/providers/UserProvider";
import { SALES_EMAIL } from "@/utils/emailAddresses";

interface Service {
  id: string;
  name: string;
  price: string;
  description?: string;
  icon: React.ReactNode;
}

const AdditionalServicesPage: React.FC = () => {
  const toast = useToast();
  const theme = useTheme();
  const user = useUser()
  const { data: session } = useSession();
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleServiceChange = (value: string[]) => {
    setSelectedServices(value);
  };

  const handleSubmit = () => {
    if (selectedServices.length === 0) {
      toast({
        title: "No services selected.",
        description: "Please select at least one service.",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    const servicesList = selectedServices.map((serviceId) => {
      return {
        'custom-theme': 'Custom Theme Creation (£200 one off)',
        'bespoke-development': 'Bespoke Tool, Dashboard or Report Development (£850 per day)',
        'enabling-sso': 'Enabling SSO (£200 one off)',
        'auto-user-signup': 'Enabling Auto Company User Signup (Free!)',
        'data-import-migration': 'Data Import and Migration (from £850 one off)',
      }[serviceId];
    });

    const subject = encodeURIComponent(`Perygon Additional Services Request`);
    const body = encodeURIComponent(
      `Hi,\n\nI would like to request more information about the following Perygon services:\n\n` +
      servicesList.map(service => `- ${service}`).join("\n") +
      `\n\nSubmitted by:\n` +
      `Name: ${user.user?.fullName || "Not provided"}\n` +
      `Email: ${user.user?.email || "Not provided"}\n` +
      `Customer Name: ${user.user?.customerName || "Not provided"}\n` +
      `Customer ID: ${user.user?.customerId || "Not provided"}\n\n` +
      `Many thanks`
    );

    window.location.href = `mailto:${SALES_EMAIL}?subject=${subject}&body=${body}`;
  };


  const services: Service[] = [
    {
      id: "custom-theme",
      name: "Custom Theme Creation",
      price: "£200 one off payment",
      description: "Get a custom platform theme including brand colours and logo to match your company's identity.",
      icon: <PaletteIcon sx={{ color: theme.colors.primary }} />
    },
    {
      id: "enabling-sso",
      name: "Enabling SSO",
      price: "£200 one off payment",
      description: "Set up Single Sign-On integration with your existing identity provider (e.g., Azure AD, Google Workspace, Apple) for seamless user authentication.",
      icon: <SecurityIcon sx={{ color: theme.colors.primary }} />
    },
    {
      id: "auto-user-signup",
      name: "Enabling Auto Company User Signup",
      price: "Free!",
      description: "Automatically create and assign user accounts for your company, streamlining the onboarding process for new team members based on your company email address domain.",
      icon: <GroupAddIcon sx={{ color: theme.colors.primary }} />
    },
    {
      id: "bespoke-development",
      name: "Bespoke Tool, Dashboard or Report Development",
      price: "£850 per day",
      description: "Work with our development team to build bespoke tools, dashboards, or reports tailored to your specific business needs and requirements.",
      icon: <CodeIcon sx={{ color: theme.colors.primary }} />
    },
    {
      id: "data-import-migration",
      name: "Data Import and Migration",
      price: "from £850 (one off)",
      description: "Seamlessly import your existing data or migrate from another platform. Our team will handle the process to ensure your data is safely and accurately transferred into Perygon.",
      icon: <ImportExportIcon sx={{ color: theme.colors.primary }} />
    }
  ];

  return (
    <VStack spacing={6} align="center" justify="center" w="100%">
      <Header title="Additional Services" showBillingCycle={false} />

      <Box
        bg={theme.colors.elementBG}
        borderRadius="md"
        boxShadow="md"
        p={6}
        color={theme.colors.primaryTextColor}
        w="100%"
      >
        <Text mb={6} fontSize={["sm", "md", "lg"]} textAlign="left">
          Explore our additional services to enhance your Perygon capabilities. Select the services you are interested in for a callback.
        </Text>

        <CheckboxGroup value={selectedServices} onChange={handleServiceChange}>
          <VStack align="stretch" spacing={6} w="100%">
            {services.map((service) => (
              <Box
                key={service.id}
                w="100%"
                p={6}
                borderWidth="1px"
                borderRadius="md"
                borderColor={theme.colors.borderColor}
                _hover={{ borderColor: theme.colors.primary }}
                cursor="pointer"
                transition="all 0.2s"
                onClick={() => {
                  const newSelection = selectedServices.includes(service.id)
                    ? selectedServices.filter(id => id !== service.id)
                    : [...selectedServices, service.id];
                  handleServiceChange(newSelection);
                }}
              >
                <Stack
                  direction={["column", "column", "row"]}
                  justify="space-between"
                  align={["flex-start", "center"]}
                  w="100%"
                  onClick={e => e.stopPropagation()}
                  spacing={6}
                >
                  <HStack spacing={6} flex="1">
                    <Checkbox
                      value={service.id}
                      isChecked={selectedServices.includes(service.id)}
                    >
                      <Text fontWeight="bold" fontSize={["sm", "md", "lg"]}>
                        {service.name}
                      </Text>
                    </Checkbox>
                    <Box as="span" display="flex" alignItems="center">
                      {React.cloneElement(service.icon as React.ReactElement, { style: { fontSize: 28 } })}
                    </Box>
                  </HStack>
                  <Badge colorScheme="green" fontSize={"0.8em"}>
                    {service.price}
                  </Badge>
                </Stack>
                {service.description && (
                  <Text fontSize={["xs", "sm", "md"]} mt={2}>
                    {service.description}
                  </Text>
                )}
              </Box>
            ))}
          </VStack>
        </CheckboxGroup>

        <Button
          mt={8}
          colorScheme="teal"
          onClick={handleSubmit}
          w="100%"
          isDisabled={selectedServices.length === 0 || isSubmitting}
          isLoading={isSubmitting}
          fontSize={["sm", "md", "lg"]}
          p={[4, 6]}
        >
          Request Callback
        </Button>
      </Box>
    </VStack>
  );
};

export default function Page() {
  return <AdditionalServicesPage />;
}
