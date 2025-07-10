"use client";

import * as React from "react";
import { SpringModal } from "@/components/modals/springModal/SpringModal";
import InfoIcon from "@mui/icons-material/InfoOutlined";
import HomeIcon from "@mui/icons-material/Home";
import SettingsIcon from "@mui/icons-material/Settings";
import { useTheme } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { useUser } from "@/providers/UserProvider";

interface SetupNeededProps {
  open: boolean;
  onClose?: () => void;
}

export default function SetupNeeded({ open }: SetupNeededProps) {
  const theme = useTheme();
  const router = useRouter();
  const { user } = useUser();
  const isAdmin = user?.role === "CA" || user?.role === "PA";

  // TODO: DO PROPER ADMIN CHECK

  return (
    <SpringModal
      isOpen={open}
      onClose={() => isAdmin ? router.push("/hospitality-hub/admin") : router.push("/")}
      showClose={true}
      frontIcon={<InfoIcon fontSize="inherit" />}
      bgIcon={<InfoIcon fontSize="inherit" />}
      header="Hospitality Hub Not Set Up"
      body={
        isAdmin ? (
          <>As an admin, you can set up items and categories to get started.</>
        ) : (
          <>An admin should add some items and categories to get started.</>
        )
      }
      bg={theme.colors.primary}
      primaryLabel={isAdmin ? "Go to Setup" : "Go Home"}
      onPrimaryClick={() => isAdmin ? router.push("/hospitality-hub/admin") : router.push("/")}
      primaryIcon={isAdmin ? <SettingsIcon /> : <HomeIcon />}
    />
  );
}
