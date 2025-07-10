/**
 * ToolDashboardLayout
 *
 * Layout wrapper for any “tool dashboard” route.  Handles:
 *  • Fetching dashboards & tool metadata for the current tool / workflow
 *  • Auto-opening the guide modal once per session if any guide is unread
 *  • Checking whether any quick-schedules are still un-viewed
 *  • Rendering side-, bottom- & header-nav plus the two modals laucnhed automatically or from contextual menu
 *
 */

"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import NavigationSidebar from "@/components/Sidebars/NavigationSidebar/NavigationSidebar";
import NavigationBottombar from "@/components/Bottombar/NavigationBottombar/NavigationBottombar";
import DashboardHeader from "@/app/(site)/(apps)/DashboardHeader";
import GuideModal from "@/components/modals/guideModal/guideModal";
import QuickScheduleSetupModal from "@/components/modals/scheduleModal.tsx/scheduleModal";

import { Icon } from "@chakra-ui/react";
import { Help, ScheduleSend } from "@mui/icons-material";
import { getMuiIconByName } from "@/utils/muiIconMapper";
import { useUser } from "@/providers/UserProvider";
import { Dashboard } from "@/lib/dashboardUtils";
import { QuickSchedule } from "@/types/schedules";

interface DashboardAPIResponse {
  filteredDashboards: Dashboard[];
  toolData?: { startInUi: boolean; altStartText?: string };
}

interface ToolDashboardLayoutProps {
  toolUrl: string;
}

const ToolDashboardLayout: React.FC<ToolDashboardLayoutProps> = ({
  toolUrl,
}) => {
  const { user } = useUser();
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const toolId = searchParams.get("toolId");
  const workflowId = searchParams.get("wfId");
  const isFreeCustomer = user?.customerIsFree ?? false;

  const [dashboardList, setDashboardList] = useState<Dashboard[]>([]);
  const [activeDashboardName, setActiveDashboardName] = useState("Dashboard");
  const [toolData, setToolData] = useState<{
    startInUi: boolean;
    altStartText: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  const [guideModalOpen, setGuideModalOpen] = useState(false);
  const [scheduleModalOpen, setScheduleModalOpen] = useState(false);
  const [scheduleActionNeeded, setScheduleActionNeeded] = useState(false);

  /* ───────────────────────── dashboards & tool data ───────────────────────── */

  useEffect(() => {
    if (!toolId || !workflowId) return;

    (async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `/api/dashboards?toolId=${toolId}&workflowId=${workflowId}`
        );
        if (!res.ok) throw new Error("Failed to fetch dashboards");

        const { filteredDashboards, toolData: td }: DashboardAPIResponse =
          await res.json();

        setDashboardList(filteredDashboards);
        setToolData(
          td
            ? {
                startInUi: td.startInUi,
                altStartText: td.altStartText ?? "Start",
              }
            : null
        );
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, [toolId, workflowId]);

  /* update active dashboard label whenever path changes */
  useEffect(() => {
    const active = dashboardList.find((d) => pathname.includes(d.dashboardUrl));
    setActiveDashboardName(active ? active.dashboardName : "Dashboard");
  }, [pathname, dashboardList]);

  /* ──────────────────────────── guide auto-open ──────────────────────────── */

  useEffect(() => {
    if (!toolId) return;

    const sessionKey = `toolGuideOpened_${toolId}`;
    if (sessionStorage.getItem(sessionKey)) return;

    (async () => {
      try {
        const guidesRes = await fetch(
          `/api/guide/findBy?type=tool&toolId=${toolId}`
        );
        if (!guidesRes.ok) throw new Error("Failed to fetch guides");

        const { resource: guides } = (await guidesRes.json()) as {
          resource: Array<{ guideId?: number; id?: number }>;
        };
        const allIds = guides.map((g) => String(g.guideId ?? g.id));

        const readRes = await fetch(`/api/guideRead/?userId=${user?.userId}`);
        if (!readRes.ok) throw new Error("Failed to fetch read records");

        const { resource: readRecords } = (await readRes.json()) as {
          resource: Array<{ guideId: number }>;
        };
        const readSet = new Set(readRecords.map((r) => String(r.guideId)));

        if (allIds.some((id) => !readSet.has(id))) {
          setGuideModalOpen(true);
          sessionStorage.setItem(sessionKey, "1");
        }
      } catch (err) {
        console.error("Guide auto-open check failed:", err);
      }
    })();
  }, [toolId, user?.userId]);

  /* ───────────────────── quick-schedule “unviewed” badge ──────────────────── */

  /**
   * Same algorithm the modal uses:
   *   1. POST /quickSchedules  → list of custSchedIds
   *   2. For each ID: GET /emailScheduleCustomerOpt?isViewed=false
   *      → if any come back, show the badge.
   */
  const checkUnviewedSchedules = useCallback(async () => {
    if (!toolId || !user?.customerId) return;

    try {
      const res = await fetch("/api/quickSchedules", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerId: user.customerId,
          toolId: Number(toolId),
          subscriptionType: "view",
          singleToolSched: toolId,
        }),
      });
      if (!res.ok) throw new Error("quickSchedules request failed");
      const json = await res.json();

      const resourceArr = Array.isArray(json?.schedules?.resource)
        ? json.schedules.resource
        : [];
      if (!resourceArr.length) {
        setScheduleActionNeeded(false);
        return;
      }

      let schedules: QuickSchedule[] = [];
      try {
        schedules = JSON.parse(resourceArr[0].schedule_status);
      } catch (err) {
        console.error("schedule_status parse error:", err);
        return;
      }

      const results = await Promise.all(
        schedules.map(async (s) => {
          const url = `/api/emailScheduleCustomerOpt/?customerId=${user.customerId}&custSchedId=${s.custSchedId}&isViewed=false`;
          const r = await fetch(url, {
            headers: { "Content-Type": "application/json" },
          });
          if (!r.ok)
            throw new Error(`isViewed check failed for ${s.custSchedId}`);
          return r.json();
        })
      );

      const hasAnyUnviewed = results.some(
        (p) =>
          Array.isArray(p?.resource) &&
          p.resource.some((row: any) => row.isViewed === false)
      );
      setScheduleActionNeeded(hasAnyUnviewed);
    } catch (err) {
      console.error("Unable to check unviewed schedules:", err);
    }
  }, [toolId, user?.customerId]);

  /* run once when tool/customer changes or modal open state changes*/
  useEffect(() => {
    checkUnviewedSchedules();
  }, [checkUnviewedSchedules, scheduleModalOpen]);

  /* called by the modal after it marks schedules viewed */
  const handleUnviewedSchedChange = (ids: number[]) =>
    setScheduleActionNeeded(ids.length > 0);

  /* ────────────────────────────── menus ──────────────────────────────────── */

  const menuItems = dashboardList.map((d) => ({
    label: d.dashboardName,
    icon: <Icon as={getMuiIconByName(d.smallIconImageUrl || "BarChart")} />,
    onClick: () =>
      router.push(`${d.dashboardUrl}?toolId=${toolId}&wfId=${workflowId}`),
    category: "Dashboards",
    active: pathname.includes(d.dashboardUrl),
    locked: isFreeCustomer ? d.disableIfFree : false,
  }));

  const contextualMenuItems = [
  {
    label: "Tool Guides",
    icon: <Help />,
    onClick: () => setGuideModalOpen(true),
    active: false,
    locked: false,
  },
  ...(user?.role === "CA"
    ? [
        {
          label: "Quick Schedule Setup",
          icon: <ScheduleSend />,
          onClick: () => setScheduleModalOpen(true),
          active: false,
          locked: false,
          actionNeeded: scheduleActionNeeded,
          actionNeededText: "New!",
        },
      ]
    : []),
];

  /* ───────────────────────────── render ──────────────────────────────────── */

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
        headingText={activeDashboardName}
        canStartWorkflow={toolData?.startInUi ?? false}
        startBtnText={toolData?.altStartText ?? "Start"}
        toolUrl={toolUrl}
        contextualMenuItems={contextualMenuItems}
      />

      <GuideModal
        isOpen={guideModalOpen}
        onClose={() => setGuideModalOpen(false)}
        guideType="tool"
        toolId={toolId}
      />

      {toolId && !isNaN(Number(toolId)) && user?.customerId && (
        <QuickScheduleSetupModal
          isOpen={scheduleModalOpen}
          onClose={() => setScheduleModalOpen(false)}
          customerId={user.customerId}
          toolId={Number(toolId)}
          isFree={isFreeCustomer}
        />
      )}
    </>
  );
};

export default ToolDashboardLayout;
