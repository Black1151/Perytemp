"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { MenuItem } from "@/components/Sidebars/NavigationSidebar/NavigationSidebar";

import {
  AccountTree,
  AddReaction,
  Checklist,
  Construction,
  Domain,
  Email,
  FormatAlignCenter,
  FormatListNumbered,
  Grid4x4,
  Groups,
  LocationOn,
  MailLock,
  People,
  Person,
  ScheduleSend,
  Schema,
  Sell,
  ShoppingCartCheckout,
  Dashboard,
  DashboardCustomize,
  BlurOn,
  Help,
  ContentCopy,
  Celebration,
} from "@mui/icons-material";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useUser } from "@/providers/UserProvider";
import { ManageTagsModal } from "@/components/modals/adminModals/ManageTagsModal";
import { useTags } from "@/providers/TagsProvider";
import { useBreakpointValue, Flex, Text } from "@chakra-ui/react";
import NavigationSidebar from "@/components/Sidebars/NavigationSidebar/NavigationSidebar";
import NavigationBottombar from "@/components/Bottombar/NavigationBottombar/NavigationBottombar";
import GuideModal from "@/components/modals/guideModal/guideModal";
import ContextualMenu from "@/components/Sidebars/ContextualMenu";
import AssignGroupModal from "./user-groups/AssignGroupModal";
import { getMuiIconByName } from "@/utils/muiIconMapper";

export default function SideBars() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { user } = useUser();
  const modalRef = useRef(null);
  const { recordIds } = useTags();
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [leftMenuItems, setLeftMenuItems] = useState<MenuItem[]>([]);
  const [adminGuideModalOpen, setAdminGuideModalOpen] =
    useState<boolean>(false);
  const [shouldShowAdminGuides, setShouldShowAdminGuides] = useState(true);
  const [shouldPopupAdminGuides, setShouldPopupAdminGuides] = useState(true);

  const { recordId, recordParentId, recordCustomerId } = recordIds || {};
  const isMobile = useBreakpointValue({ base: true, md: false }) ?? false;

  useEffect(() => {
    const fetchSidebarItems = async () => {
      if (!user) return;
      const userMetadata = {
        role: user.role,
        customerId: user.customerId,
        teamManagerCount: user.teamManagerCount,
        groupNames: user.groupNames,
        customerIsFree: user.customerIsFree,
        customerIsFreeUntilDate: user.customerIsFreeUntilDate,
        subscribedTools: user.subscribedTools,
      };
      try {
        const res = await fetch("/api/allowedNavigation/admin", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userMetadata }),
        });
        const data = await res.json();
        const items = (data.resource?.fnGetAllowedAdminNavigationUser || []).map((item: any) => {
          const IconComponent = getMuiIconByName(item.largeIconImageUrl);
          return {
            label: item.name,
            icon: IconComponent ? <IconComponent sx={{ height: "100%", width: "100%" }} /> : <Help sx={{ height: "100%", width: "100%" }} />,
            onClick: () => router.push(item.adminUrl),
            category: item.category,
            locked: item.isLocked || false,
            active:
              item.adminUrl ===
              pathname + (searchParams.toString() ? `?${searchParams.toString()}` : ""),
          };
        });
        setLeftMenuItems(items);
      } catch (err) {
        setLeftMenuItems([]);
      }
    };
    fetchSidebarItems();
  }, [user, pathname]);

  const generateRightSidebarItemsDrawer = useMemo(() => {
    let entityType = null;

    // Basic entity match
    const match = pathname.match(/^\/(customers|users|sites)\/([^\/]+)$/);
    if (match) {
      entityType = match[1];
    }

    let shouldShowManageTags = false;
    let shouldShowAssignToCustomer = false;

    const hideGuidePaths = ["/help-centre", "/activity", "/client-activity"];

    if (hideGuidePaths.includes(pathname)) {
      setShouldShowAdminGuides(false);
      setShouldPopupAdminGuides(false);
    }

    if (user?.role === "PA") {
      setShouldShowAdminGuides(false);
      setShouldPopupAdminGuides(false);
    }

    if (pathname === "/user-groups" && user?.role === "PA") {
      shouldShowAssignToCustomer = true;
    }

    // Skip all logic if user role is PA
    if (user?.role !== "PA") {
      if (pathname === "/my-profile") {
        // All users except PA can manage tags on their own User record
        shouldShowManageTags = true;
      } else if (user?.role === "CA" && pathname === `/my-company`) {
        // CA users can manage tags on their own Company record
        shouldShowManageTags = true;
      } else if (entityType && recordId) {
        if (entityType === "users" && recordId === String(user?.userId)) {
          // User is viewing their own User record in admin
          shouldShowManageTags = true;
        } else if (
          (user?.role === "CA" &&
            recordCustomerId == String(user?.customerId)) ||
          (user?.role === "CA" && recordParentId == String(user.customerId))
        ) {
          // CA can edit their own customer's sites
          shouldShowManageTags = true;
        }
      }
    }

    const items = [];

    if (shouldShowManageTags) {
      items.push({
        label: "Add / Remove Tags",
        icon: <Sell />,
        onClick: () =>
          // @ts-ignore
          modalRef.current?.openModal(),
        locked: user?.customerIsFree ? true : false,
      });
    }

    if (shouldShowAssignToCustomer) {
      items.push({
        label: "Assign to Customer",
        icon: <ContentCopy />,
        onClick: () => setIsAssignModalOpen(true),
        category: "External",
      });
    }

    if (shouldShowAdminGuides) {
      items.push({
        label: "Admin Guides",
        icon: <Help  />,
        onClick: () => {
          setAdminGuideModalOpen(true);
        },
      });
    }

    return items;
  }, [
    pathname,
    user?.role,
    user?.userId,
    user?.customerId,
    recordId,
    recordCustomerId,
    recordParentId,
  ]);

  const rightMenuItems = generateRightSidebarItemsDrawer;

  // Auto-open Admin Guide Modal once per session if any admin guide is unread
  useEffect(() => {
    const sessionKey = "adminGuideOpened";
    if (sessionStorage.getItem(sessionKey)) return;

    async function checkAdminGuides() {
      try {
        // 1) Fetch all admin guides
        const guidesRes = await fetch("/api/guide/findBy?type=admin");
        if (!guidesRes.ok) throw new Error("Failed to fetch admin guides");
        const guidesJson = await guidesRes.json();
        const rawGuides = guidesJson.resource;
        const allGuideIds = Array.isArray(rawGuides)
          ? rawGuides.map((g) => String(g.guideId ?? g.id))
          : [];

        // 2) Fetch read records
        if (!user) throw new Error("User is not defined");
        const readRes = await fetch(`/api/guideRead/?userId=${user.userId}`);
        if (!readRes.ok) throw new Error("Failed to fetch read records");
        const readJson = await readRes.json();

        // Normalize into an array
        const raw = readJson.resource;
        let readRecordsArray: Array<{ guideId: number | string }>;
        if (Array.isArray(raw)) {
          readRecordsArray = raw;
        } else if (raw == null) {
          readRecordsArray = [];
        } else {
          readRecordsArray = [raw];
        }

        const readSet = new Set(readRecordsArray.map((r) => String(r.guideId)));
        // 3) Open if there’s any unread guide
        const hasUnread = allGuideIds.some((id) => !readSet.has(id));
        if (hasUnread && shouldPopupAdminGuides) {
          setAdminGuideModalOpen(true);
          sessionStorage.setItem(sessionKey, "1");
        }
      } catch (err) {
        console.error("Error checking admin guide auto-open:", err);
      }
    }

    checkAdminGuides();
  }, []);

  let modalCustomerId = user?.customerId || 0;

  return (
    <>
      {!["/my-profile", "/activity", "/client-activity"].includes(pathname) && (
        <NavigationSidebar
          menuItems={leftMenuItems}
          drawerState={"half-open"}
          side={"left"}
        />
      )}
      <NavigationBottombar menuItems={leftMenuItems} />
      <Flex w={61} position={"fixed"} right={0} mt={3} zIndex={120}>
        {rightMenuItems.length > 0 && (
          <ContextualMenu menuItems={rightMenuItems} />
        )}
      </Flex>
      <AssignGroupModal
        isOpen={isAssignModalOpen}
        onClose={() => setIsAssignModalOpen(false)}
      />
      <ManageTagsModal ref={modalRef} customerId={modalCustomerId} />
      <GuideModal
        isOpen={adminGuideModalOpen}
        onClose={() => setAdminGuideModalOpen(false)}
        guideType="admin"
      />
    </>
  );
}
