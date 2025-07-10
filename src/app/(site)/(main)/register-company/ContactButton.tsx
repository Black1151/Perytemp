"use client";

import React, { useState } from "react";
import { Box, IconButton, VStack, Text, Link, Button, useTheme, Badge, HStack, Divider, Flex } from "@chakra-ui/react";
import { Call, ContactSupport } from "@mui/icons-material";
import { SpringModal } from "@/components/modals/springModal/SpringModal";

const ContactButton = () => {
    const [isOpen, setIsOpen] = useState(false);
    const theme = useTheme()

    return (
        <>
            <Box
                position="fixed"
                bottom="12"
                right={{ base: "50%", lg: "24" }}
                transform={{ base: "translateX(50%)", lg: "none" }}
                zIndex="1000"
            >
                <Button
                    aria-label="Contact Support"
                    leftIcon={<Call fontSize="medium" />}
                    size="md"
                    borderRadius="full"
                    boxShadow="lg"
                    onClick={() => setIsOpen(true)}
                    display={"flex"}
                    px={6}
                    bg="white"
                    color="grey.500"
                    _hover={{ bg: "gray.50" }}
                >
                    Need Support?
                </Button>
            </Box>
            <SpringModal
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
                showClose={true}
                header="Contact Support"
                frontIcon={<Call />}
                bg={theme.colors.primary}
                body={
                    <VStack spacing={6} textAlign={"center"} w="full">
                        <Text fontSize="xl" fontWeight="bold" color="white">
                            Need help? We're here to assist you!
                        </Text>

                        <VStack spacing={4} w="full">
                            <Flex
                                p={4}
                                bg="white"
                                borderRadius="lg"
                                w="full"
                                flexDirection={"column"}
                                align={"center"}
                            >
                                <Badge bg={theme.colors.primary} color="white" mb={2} w={"min"}>Email Support</Badge>
                                <Link
                                    href="mailto:support-team@perygon.co.uk"
                                    textDecoration="none"
                                    fontSize="lg"
                                    fontWeight="medium"
                                    color="gray.600"
                                >
                                    support-team@perygon.co.uk
                                </Link>
                            </Flex>

                            <Flex
                                p={4}
                                bg="white"
                                borderRadius="lg"
                                w="full"
                                flexDirection={"column"}
                                align={"center"}
                            >
                                <Badge bg={theme.colors.primary} color="white" mb={2} w={"min"}>Phone Support</Badge>
                                <Link
                                    href="tel:03332224445"
                                    textDecoration="none"
                                    fontSize="lg"
                                    fontWeight="medium"
                                    color="gray.600"
                                >
                                    0333 222 4445
                                </Link>
                            </Flex>

                            <Flex
                                p={4}
                                bg="white"
                                borderRadius="lg"
                                w="full"
                                flexDirection={"column"}
                                align={"center"}
                            >
                                <Badge bg={theme.colors.primary} color="white" mb={2} w={"min"}>Visit Us</Badge>
                                <VStack spacing={1} align="center">
                                    <Text fontWeight="medium" color="gray.600">St Paul's House</Text>
                                    <Text color="gray.600">23 Park Square South</Text>
                                    <Text color="gray.600">Leeds</Text>
                                    <Text color="gray.600">LS1 2ND</Text>
                                    <Text color="gray.600">United Kingdom</Text>
                                </VStack>
                            </Flex>
                        </VStack>

                        <Text fontSize="sm" color="white">
                            Our support team is available Monday to Friday, 9am - 5pm GMT
                        </Text>
                    </VStack>
                }
            />
        </>
    );
};

export default ContactButton; 