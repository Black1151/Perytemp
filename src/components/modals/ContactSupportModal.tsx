import { useState } from "react";
import { Textarea, useTheme, Select } from "@chakra-ui/react";
import { Chat } from "@mui/icons-material";
import { SpringModal } from "./springModal/SpringModal";
import { useUser } from "@/providers/UserProvider";
import { SUPPORT_EMAIL } from "@/utils/emailAddresses";

interface ContactSupportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ContactSupportModal = ({ isOpen, onClose }: ContactSupportModalProps) => {
  const [contactMessage, setContactMessage] = useState("");
  const [priority, setPriority] = useState("medium");
  const theme = useTheme();
  const { user } = useUser();

  const handleContactSubmit = () => {
    const emailBody = `
Hi,

I need your support with Perygon:

Priority: ${priority.toUpperCase()}

${contactMessage}

Submitted by:
Name: ${user?.fullName || 'Not provided'}
Email: ${user?.email || 'Not provided'}
Customer Name: ${user?.customerName || 'Not provided'}
Customer ID: ${user?.customerId || 'Not provided'}

Many thanks
`.trim();
    
    const subject = encodeURIComponent(`Perygon Support Request [${priority.toUpperCase()}]`);
    const body = encodeURIComponent(emailBody);
    window.location.href = `mailto:${SUPPORT_EMAIL}?subject=${subject}&body=${body}`;
    onClose();
    setContactMessage("");
    setPriority("medium");
  };

  return (
    <SpringModal
      isOpen={isOpen}
      onClose={onClose}
      showClose={true}
      bg={theme.colors.primary}
      color="white"
      frontIcon={<Chat />}
      bgIcon={<Chat />}
      header="Contact Support"
      body={
        <>
          <Select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            mb={4}
            bg="white"
            color="gray.800"
          >
            <option value="low">Low Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="high">High Priority</option>
            <option value="urgent">Urgent</option>
          </Select>
          <Textarea
            placeholder="Please describe what you need help with..."
            value={contactMessage}
            onChange={(e) => setContactMessage(e.target.value)}
            size="md"
            rows={6}
            bg="white"
            color="gray.800"
          />
        </>
      }
      primaryLabel="Send Email"
      onPrimaryClick={handleContactSubmit}
      secondaryLabel="Cancel"
      onSecondaryClick={onClose}
    />
  );
}; 