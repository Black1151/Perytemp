"use client";

import React, { useState } from "react";
import {
  VStack,
  Box,
  Text,
  Button,
  useToast,
  useTheme,
  Textarea,
  Input,
  FormControl,
  FormLabel,
  Select,
} from "@chakra-ui/react";
import { Header } from "../Header";
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import { useUser } from "@/providers/UserProvider";
import { SALES_EMAIL } from "@/utils/emailAddresses";

const FeatureSuggestionsPage: React.FC = () => {
  const toast = useToast();
  const theme = useTheme();
  const user = useUser();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    featureName: "",
    description: "",
    type: "platform", // platform, tool, or other
    priority: "medium",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = () => {
    if (!formData.featureName || !formData.description) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    const subject = encodeURIComponent(`Perygon ${formData.type.charAt(0).toUpperCase() + formData.type.slice(1)} Suggestion: ${formData.featureName}`);
    const body = encodeURIComponent(
      `Hi,\n\nI have a ${formData.type === 'other' ? '' : formData.type} suggestion for Perygon:\n\n` +
      `${formData.description}\n\n` +
      `Submitted by:\n` +
      `Name: ${user.user?.fullName || "Not provided"}\n` +
      `Email: ${user.user?.email || "Not provided"}\n` +
      `Customer Name: ${user.user?.customerName || "Not provided"}\n` +
      `Customer ID: ${user.user?.customerId || "Not provided"}\n\n` +
      `Many thanks`
    );

    window.location.href = `mailto:${SALES_EMAIL}?subject=${subject}&body=${body}`;
  };

  return (
    <VStack spacing={6} align="center" justify="center" w="100%">
      <Header title="Feature Suggestions" showBillingCycle={false}/>

      <Box
        bg={theme.colors.elementBG}
        borderRadius="md"
        boxShadow="md"
        p={6}
        color={theme.colors.primaryTextColor}
        w="100%"
      >
        <Text mb={6} fontSize={["sm", "md", "lg"]} textAlign="left">
          Have an idea for a new feature, tool or just general suggestion? We'd love to hear about it! Fill out the form below to submit.
        </Text>

        <VStack spacing={6} align="stretch">
          <FormControl isRequired>
            <FormLabel fontSize={["sm", "md", "lg"]}>Suggestion/Feature Name</FormLabel>
            <Input
              name="featureName"
              value={formData.featureName}
              onChange={handleInputChange}
              placeholder="Enter the name of your feature, tool or general feedback/idea."
              fontSize={["sm", "md", "lg"]}
              p={[3, 4, 5]}
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel fontSize={["sm", "md", "lg"]}>Type</FormLabel>
            <Select
              name="type"
              value={formData.type}
              onChange={handleInputChange}
              fontSize={["sm", "md", "lg"]}
            >
              <option value="platform">Platform Feature</option>
              <option value="tool">Tool</option>
              <option value="other">Other</option>
            </Select>
          </FormControl>

          <FormControl isRequired>
            <FormLabel fontSize={["sm", "md", "lg"]}>Description</FormLabel>
            <Textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Please describe your feature or tool suggestion in detail. Include any specific requirements, use cases, or benefits it would provide."
              minH="200px"
              fontSize={["sm", "md", "lg"]}
              p={[3, 4, 5]}
            />
          </FormControl>
        </VStack>

        <Button
          mt={8}
          colorScheme="teal"
          onClick={handleSubmit}
          w="100%"
          isDisabled={isSubmitting}
          isLoading={isSubmitting}
          leftIcon={<LightbulbIcon style={{ fontSize: 28 }} />}
          fontSize={["sm", "md", "lg"]}
          p={[4, 6]}
        >
          Submit Suggestion
        </Button>
      </Box>
    </VStack>
  );
};

export default function Page() {
  return <FeatureSuggestionsPage />;
}