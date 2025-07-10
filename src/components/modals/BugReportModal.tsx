import { useState } from "react";
import {
    VStack,
    Text,
    Textarea,
    useToast,
    FormControl,
    FormLabel,
    Input,
    useTheme
} from "@chakra-ui/react";
import { SpringModal } from "./springModal/SpringModal";
import { BugReport, BugReport as BugReportIcon } from "@mui/icons-material";
import { useUser } from "@/providers/UserProvider";
import { SUPPORT_EMAIL } from "@/utils/emailAddresses";

interface BugReportModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const BugReportModal: React.FC<BugReportModalProps> = ({
    isOpen,
    onClose,
}) => {
    const [description, setDescription] = useState("");
    const [steps, setSteps] = useState("");
    const [email, setEmail] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const toast = useToast();
    const theme = useTheme();
    const { user } = useUser();

    const handleSubmit = async () => {
        setIsSubmitting(true);
        try {
            // Create email body with user information and bug report details
            const emailBody = `
Hi,

I have found a bug with Perygon:

Description: ${description}

Steps to Reproduce: ${steps}

Submitted by:
Name: ${user?.fullName || 'Not provided'}
Email: ${user?.email || 'Not provided'}
Customer Name: ${user?.customerName || 'Not provided'}
Customer ID: ${user?.customerId || 'Not provided'}

Many thanks
`.trim();

            // Create mailto link
            const mailtoLink = `mailto:${SUPPORT_EMAIL}?subject=Perygon Bug Report&body=${encodeURIComponent(emailBody)}`;

            // Open email client
            window.location.href = mailtoLink;

            toast({
                title: "Bug Report Prepared",
                description: "Your email client should open with the bug report details.",
                status: "success",
                duration: 5000,
                isClosable: true,
            });

            onClose();
            setDescription("");
            setSteps("");
            setEmail("");
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to prepare bug report. Please try again.",
                status: "error",
                duration: 5000,
                isClosable: true,
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <SpringModal
            isOpen={isOpen}
            onClose={onClose}
            showClose={true}
            frontIcon={<BugReport fontSize="inherit" />}
            bgIcon={<BugReport fontSize="inherit" />}
            header="Report a Bug"
            bg={theme.colors.primary}
            color={theme.colors.elementBG}
            body={
                <VStack spacing={4} align="stretch" w="100%">
                    <Text >Reporing issues you find helps our development team iron out pesky bugs and keep Perygon running smoothly.</Text>
                    <FormControl>
                        <FormLabel fontWeight={"semibold"} color={theme.colors.elementBG}>Bug Description</FormLabel>
                        <Textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Please describe the bug you encountered..."
                            rows={4}
                            bg={theme.colors.elementBG}
                            color={theme.colors.primaryTextColor}
                        />
                    </FormControl>

                    <FormControl>
                        <FormLabel fontWeight={"semibold"} color={theme.colors.elementBG}>Steps to Reproduce</FormLabel>
                        <Textarea
                            value={steps}
                            onChange={(e) => setSteps(e.target.value)}
                            placeholder="1. First step&#10;2. Second step&#10;3. ..."
                            rows={4}
                            bg={theme.colors.elementBG}
                            color={theme.colors.primaryTextColor}
                        />
                    </FormControl>
                </VStack>
            }
            primaryLabel="Submit Report"
            onPrimaryClick={handleSubmit}
            isPrimaryLoading={isSubmitting}
            secondaryLabel="Close"
            onSecondaryClick={onClose}
        />
    );
}; 