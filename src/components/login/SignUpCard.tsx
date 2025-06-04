"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import {
  Box,
  Flex,
  Heading,
  Text,
  VStack,
  HStack,
  Image,
} from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { useTheme } from "@chakra-ui/react";

export interface Action {
  label: string;
  href: string;
  icon?: React.ReactNode;
}

interface SignUpCardProps {
  children: ReactNode;
}

interface PanelContextType {
  setTitle: (title: string) => void;
  setDescription: (desc: string) => void;
  setActions: (actions: Action[]) => void;
}

const PanelContext = createContext<PanelContextType | undefined>(undefined);

/**
 * Hook for child components to update the left-panel content
 */
export const usePanel = (): PanelContextType => {
  const ctx = useContext(PanelContext);
  if (!ctx) {
    throw new Error("usePanel must be used within a SignUpCard");
  }
  return ctx;
};

/**
 * SignUpCard wraps two panels and exposes setters via context
 */
const SignUpCard: React.FC<SignUpCardProps> = ({
  children,
}) => {
  // maintain dynamic state for panel
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [actions, setActions] = useState<Action[]>([]);
  const router = useRouter();
  const theme = useTheme();
  const bgtest = "#000";

  const handleActionClick = (action: Action) => {
    router.push(action.href); // Example: navigate to the action's href
  };

  return (
    <PanelContext.Provider value={{ setTitle, setDescription, setActions }}>
      <VStack gap={0} w="full" mb={[0, 0, 20]}>
        <Text
          fontSize={[60, 70, 100]}
          fontWeight="400"
          color="white"
          fontFamily={"bonfire"}
        >
          Perygon
        </Text>
        <Flex
          maxW="4xl"
          w="100%"
          bg="white"
          boxShadow="lg"
          rounded="lg"
          overflow="hidden"
          direction={{ base: "column", md: "row" }}
        >
          <Box
            w={{ base: "full", md: "40%" }}
            bg={theme.components.companySignUpCard.baseStyle.cardPanel}
            color="white"
            p={8}
            display="flex"
            flexDirection="column"
            justifyContent="space-between"
          >
            <VStack spacing={4} align="start" w={"full"}>
              <Heading
                as="h2"
                fontSize={[30, 32, 38]}
                fontFamily={"bonfire"}
                fontWeight="400"
              >
                {title}
              </Heading>
              <Text fontSize="sm" lineHeight="tall">
                {description}
              </Text>
            </VStack>
            <VStack spacing={4} mt={8} align={"start"} w={"full"}>
              {actions.map(({ label, href, icon }) => (
                <HStack gap={1} key={label}>
                  {icon}
                  <Text
                    as="span"
                    fontSize={13}
                    color="white"
                    onClick={() => handleActionClick({ label, href })}
                    _hover={{ color: "gray.200" }}
                    cursor="pointer"
                  >
                    {label}
                  </Text>
                </HStack>
              ))}
            </VStack>
          </Box>

          <Box w={{ base: "full", md: "60%" }} p={8}>
            {children}
          </Box>
        </Flex>
      </VStack>
    </PanelContext.Provider>
  );
};

export default SignUpCard;
