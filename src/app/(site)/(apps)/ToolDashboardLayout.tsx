"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import DashboardHeader from "@/app/(site)/(apps)/DashboardHeader";
import { Dashboard } from "@/lib/dashboardUtils";
import NavigationSidebar from "@/components/Sidebars/NavigationSidebar/NavigationSidebar";
import NavigationBottombar from "@/components/Bottombar/NavigationBottombar/NavigationBottombar";
import { getMuiIconByName } from "@/utils/muiIconMapper";
import { Icon } from "@chakra-ui/react";
import { useUser } from "@/providers/UserProvider";
import GuideModal from "@/components/modals/guideModal/guideModal";
import { Help } from "@mui/icons-material";

interface DashboardAPIResponse {
  filteredDashboards: Dashboard[];
  toolData?: { startInUi: boolean };
}

interface ToolDashboardLayoutProps {
  toolUrl: string;
}

const ToolDashboardLayout: React.FC<ToolDashboardLayoutProps> = ({
  toolUrl,
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { user } = useUser();
  const isFree = user?.customerIsFree ?? false;

  const [dashboardList, setDashboardList] = useState<Dashboard[]>([]);
  const [activeDashboardName, setActiveDashboardName] = useState<string | null>(
    null
  );
  const [toolData, setToolData] = useState<{
    startInUi: boolean;
    altStartText: string;
  } | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const toolId = searchParams.get("toolId");
  const workflowId = searchParams.get("wfId");

  const [toolGuideModalOpen, setToolGuideModalOpen] = useState(false);

  // Auto-open guide modal if any guide is unread (once per session)
  useEffect(() => {
    if (!toolId) return;
    const sessionKey = `toolGuideOpened_${toolId}`;
    if (sessionStorage.getItem(sessionKey)) return;

    async function checkAutoOpen() {
      try {
        const guidesRes = await fetch(
          `/api/guide/findBy?type=tool&toolId=${toolId}`
        );
        if (!guidesRes.ok) throw new Error("Failed to fetch guides");
        const { resource: guides } = (await guidesRes.json()) as {
          resource: Array<{ guideId?: number; id?: number }>;
        };
        const allGuideIds = (guides || []).map((g) =>
          String(g.guideId ?? g.id)
        );

        const readRes = await fetch(`/api/guideRead/?userId=${user?.userId}`);
        if (!readRes.ok) throw new Error("Failed to fetch read records");
        const { resource: readRecords } = (await readRes.json()) as {
          resource: Array<{ guideId: number }>;
        };
        const readSet = new Set(readRecords.map((r) => String(r.guideId)));

        const hasUnread = allGuideIds.some((id) => !readSet.has(id));
        if (hasUnread) {
          setToolGuideModalOpen(true);
          sessionStorage.setItem(sessionKey, "1");
        }
      } catch (err) {
        console.error("Error checking guide auto-open:", err);
      }
    }

    checkAutoOpen();
  }, [toolId]);

  useEffect(() => {
    if (!toolId || !workflowId) return;

    const fetchDashboards = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `/api/dashboards?toolId=${toolId}&workflowId=${workflowId}`
        );
        if (!response.ok) throw new Error("Failed to fetch dashboards");

        const data: DashboardAPIResponse = await response.json();

        setDashboardList(data.filteredDashboards);
        setToolData(
          data.toolData
            ? {
                startInUi: data.toolData.startInUi,
                altStartText: (data.toolData as any).altStartText ?? "start",
              }
            : null
        );
      } catch (error) {
        console.error("Error fetching dashboards:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboards();
  }, [toolId, workflowId]);

  useEffect(() => {
    const active = dashboardList.find((d) => pathname.includes(d.dashboardUrl));
    setActiveDashboardName(active ? active.dashboardName : "Dashboard");
  }, [pathname, dashboardList]);

  const menuItems = dashboardList.map((d) => ({
    label: d.dashboardName,
    icon: <Icon as={getMuiIconByName(d.smallIconImageUrl || "BarChart")} />,
    onClick: () =>
      router.push(`${d.dashboardUrl}?toolId=${toolId}&wfId=${workflowId}`),
    category: "Dashboards",
    active: pathname.includes(d.dashboardUrl),
    locked: isFree ? d.disableIfFree : false,
  }));

  const contextualMenuItems = {
    label: "Tool Guides",
    icon: <Help />,
    onClick: () => setToolGuideModalOpen(true),
    active: false,
    locked: false,
  };

  return (
    <>
      <NavigationSidebar
        menuItems={menuItems}
        drawerState="half-open"
        side="left"
        loading={loading}
      />
      <NavigationBottombar menuItems={menuItems} />
      <DashboardHeader
        headingText={activeDashboardName || ""}
        canStartWorkflow={toolData?.startInUi || false}
        startBtnText={toolData?.altStartText || "Start"}
        toolUrl={toolUrl}
        contextualMenuItems={[contextualMenuItems]}
      />
      <GuideModal
        isOpen={toolGuideModalOpen}
        onClose={() => setToolGuideModalOpen(false)}
        guideType="tool"
        toolId={toolId}
      />
    </>
  );
};

export default ToolDashboardLayout;
