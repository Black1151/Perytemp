import { useRouter } from "next/navigation";
import { MenuItemProps } from "@/components/NavBar/components/types";
import {
  Home as HomeIcon,
  Person as PersonIcon,
  Business as BusinessIcon,
  Timeline,
  ViewTimeline,
  Celebration,
  Lock as LockIcon,
  ExitToApp as ExitToAppIcon,
  Settings as SettingsIcon,
  Storefront as StorefrontIcon,
  HelpCenter,
  Help,
  BugReport,
  Chat
} from "@mui/icons-material";
import { useUser } from "@/providers/UserProvider";

/**
 * Builds the navigation menu based on the user role and subscription state.
 * ──────────────────────────────────────────────────────────────────────────────
 * @param userRole        Current user role (EU, PA, CA, CL, CS, etc.)
 * @param handleLogout    Callback to sign the user out.
 * @param openResetModal  Opens the reset‑password dialog.
 * @param openBugReportModal  Opens the bug report modal.
 * @param openContactModal  Opens the contact support modal.
 * @returns MenuItemProps[]  Array fed directly to the NavBar component.
 */
const useNavMenuItems = (
  userRole: string,
  handleLogout: () => void,
  openResetModal: () => void,
  openBugReportModal: () => void,
  openContactModal: () => void
): MenuItemProps[] => {
  const router = useRouter();
  const { user } = useUser();

  /* ------------------------------------------------------------------------- */
  /* Role‑specific single‑item menus                                           */
  /* ------------------------------------------------------------------------- */

  if (userRole === "EU") {
    return [];
  }

  if (userRole === "PA") {
    return [
      {
        label: "Admin",
        icon: <SettingsIcon />,
        onClick: () => router.push("/customers"),
        orderGroup: 1
      },
    ];
  }

  /* ------------------------------------------------------------------------- */
  /* Common menu construction                                                  */
  /* ------------------------------------------------------------------------- */
  const commonMenuItems: MenuItemProps[] = [];

  // Company Admin extras
  if (userRole === "CA") {
    commonMenuItems.push(
      {
        label: "Admin Tools",
        icon: <SettingsIcon />,
        onClick: () => router.push("/users?userType=internal"),
        orderGroup: 1
      }
    );
  }

  // CL extras
  if (userRole === "CL") {
    commonMenuItems.push(
      {
        label: "Tool Store",
        icon: <StorefrontIcon />,
        onClick: () => router.push("/tool-store"),
        orderGroup: 3
      }
    );
  }

  // Always‑present entries
  commonMenuItems.push(
    {
      label: "My Tools",
      icon: <HomeIcon />,
      onClick: () => router.push("/"),
      orderGroup: 1
    },
    {
      label: "Tool Store",
      icon: <StorefrontIcon />,
      onClick: () => router.push("/tool-store"),
      orderGroup: 3
    },
    {
      label: "My Profile",
      icon: <PersonIcon />,
      onClick: () => router.push("/my-profile"),
      orderGroup: 1
    },
    {
      label: "My Company",
      icon: <BusinessIcon />,
      onClick: () => router.push("/my-company"),
      orderGroup: 1
    }
  );

  // Activity (paid customers only)
  if (!user?.customerIsFree) {
    commonMenuItems.push({
      label: "Activity",
      icon: <Timeline />,
      onClick: () => router.push("/activity"),
      orderGroup: 1
    });
  }

  // Client Activity for CS / CL / CA roles (paid customers only)
  if (["CS", "CL", "CA"].includes(userRole) && !user?.customerIsFree) {
    commonMenuItems.push({
      label: "Client Activity",
      icon: <ViewTimeline />,
      onClick: () => router.push("/client-activity"),
      orderGroup: 1
    });
  }

  // Recognition Hub (only when tool ID "100" is subscribed)
  if (user?.subscribedTools?.includes("100")) {
    commonMenuItems.push({
      label: "Recognition Hub",
      icon: <Celebration />,
      onClick: () => router.push("/big-up"),
      orderGroup: 1
    });
  }

  //Help Centre (always available)
  commonMenuItems.push({
    label: "Help Centre",
    icon: <Help />,
    onClick: () => router.push("/help-centre"),
    orderGroup: 4
  });

  commonMenuItems.push({
    label: "Contact Support",
    icon: <Chat />,
    onClick: openContactModal,
    orderGroup: 4
  });

  commonMenuItems.push({
    label: "Report a Bug",
    icon: <BugReport />,
    onClick: openBugReportModal,
    orderGroup: 4
  });

  // Reset Password (always available)
  commonMenuItems.push({
    label: "Reset Password",
    icon: <LockIcon />,
    onClick: openResetModal,
    orderGroup: 4
  });

  return commonMenuItems;
};

export default useNavMenuItems;
