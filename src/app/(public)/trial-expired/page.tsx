"use client";

import {
  Center,
  useTheme,
} from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { SpringModal } from "@/components/modals/springModal/SpringModal";
import { useState } from "react";
import { History } from "@mui/icons-material";
import ScheduleTwoToneIcon from '@mui/icons-material/ScheduleTwoTone';
import { Logout } from "@mui/icons-material";

export default function TrialExpiredPage() {
  const theme = useTheme();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(true)

  const logout = async () => {
    try {
      await fetch("/api/auth/sign-out", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      router.push("/login");
    } catch (error) {
      console.error("Logout failed:", error);
      router.push("/error");
    }
  };

  return (
    <Center
      flex={1}
      h="100vh"
      position="relative"
      overflow="hidden"
      bg={theme.colors.seduloRed}
    >
      <SpringModal
        onClose={() => setIsOpen(true)}
        isOpen={isOpen}
        bgIcon={<History fontSize="inherit" />}
        frontIcon={<ScheduleTwoToneIcon fontSize="inherit" />}
        header="Your Trial Has Expired"
        body={
          "Your trial period has expired. Please contact your admin team for further assistance or to renew your access."
        }
        primaryLabel="Logout"
        primaryIcon={<Logout/>}
        onPrimaryClick={logout}
        bg={theme.colors.primary}
        showClose={false}
      />
    </Center>
  );
}
