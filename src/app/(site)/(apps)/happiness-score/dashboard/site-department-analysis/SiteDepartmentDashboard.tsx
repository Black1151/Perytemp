"use client";

import React, { useEffect, useState } from "react";
import { Box, Flex, VStack, useTheme } from "@chakra-ui/react";
import { useUser } from "@/providers/UserProvider";
import { useFetchClient } from "@/hooks/useFetchClient";
import { SectionHeader } from "@/components/sectionHeader/SectionHeader";
import { useWorkflow } from "@/providers/WorkflowProvider";
import HappinessScoreRenderer from "@/components/agGrids/CellRenderers/HappinessScoreRenderer";
import CommentsCellRenderer from "@/components/agGrids/CellRenderers/CommentsCellRenderer";
import { AgCartesianChartOptions } from "ag-charts-enterprise";
import DataGridComponentLight from "@/components/agGrids/DataGrid/DataGridComponentLight";

import SpeechBubble from "../../SpeechBubble";
import StaffHappinessDetailsRenderer from "@/components/agGrids/CellRenderers/HappinessScore/StaffHappinessDetailsRenderer";

import FilterSidebar from "@/components/Sidebars/Dashboards Filter/FilterSidebar";
import AgChartComponent from "@/components/agCharts/AgChartComponent";
import { dateRangeOptions } from "@/components/Sidebars/Dashboards Filter/dateRangeUtils";
import { ScoreTooltipRenderer } from "@/components/agCharts/tooltips/ScoreTooltipRenderer";

interface ManagingPartnersResponse {
  resource: {
    totalAvg: number;
    gridData: any;
    weeklyLineChartComparisonData: any[];
    monthlyLineChartComparisonData: any[];
    officeLeaderboardData: any[];
    departmentLeaderboardData: any[];
  };
}

function GenerateSiteSeries(siteNames: string[], xKey: string) {
  const theme = useTheme();
  return siteNames.map((siteName) => ({
    type: "line",
    xKey: xKey,
    yKey: siteName,
    yName: siteName,
    marker: { enabled: true },
    interpolation: { type: "smooth" },
    tooltip: { renderer: ScoreTooltipRenderer(theme.colors) },
  }));
}

const SiteDepartmentDashboard: React.FC = () => {
  const { fetchClient } = useFetchClient();
  const { user } = useUser();
  const theme = useTheme();
  const { toolId, workflowId } = useWorkflow();

  const [isLoading, setIsLoading] = useState(false);

  const [filterOptions, setFilterOptions] = useState<Record<string, any>>({});

  const [totalAvg, setTotalAvg] = useState<number>(0);
  const [gridData, setGridData] = useState<any[]>([]);
  const [weeklyLineChartComparisonData, setWeeklyLineChartComparisonData] =
    useState<any[]>([]);
  const [monthlyLineChartComparisonData, setMonthlyLineChartComparisonData] =
    useState<any[]>([]);
  const [officeLeaderboardData, setOfficeLeaderboardData] = useState<any[]>([]);
  const [departmentLeaderboardData, setDepartmentLeaderboardData] = useState<
    any[]
  >([]);

  const columnDefs = [
    {
      headerName: "Name",
      field: "fullName",
      sortable: true,
      filter: true,
      resizable: true,
      cellRenderer: StaffHappinessDetailsRenderer,
      cellStyle: { color: "black" },
    },
    {
      field: "siteName",
      headerName: "Site",
      sortable: true,
      filter: "agSetColumnFilter",
    },
    {
      field: "deptName",
      headerName: "Department",
      sortable: true,
      filter: "agSetColumnFilter",
    },
    {
      field: "happinessScore",
      headerName: "Score",
      sortable: true,
      cellRenderer: HappinessScoreRenderer,
      filter: "agNumberColumnFilter",
      cellDataType: "number",
    },
    {
      field: "comments",
      headerName: "Comments",
      //cellRenderer: CommentsCellRenderer,
    },
  ];

  const defaultColDef = {
    resizable: true,
    filter: true,
  };

  const getData = async (postBody: Record<string, any> = filterOptions) => {
    setIsLoading(true);
    try {
      const response = await fetchClient<ManagingPartnersResponse>(
        "/api/happiness-score/dashboards/site-department",
        {
          method: "POST",
          body: {
            toolId,
            workflowId,
            ...postBody,
          },
          redirectOnError: false,
        }
      );

      if (response && response.resource) {
        const {
          totalAvg: resTotalAvg,
          gridData: resGridData,
          weeklyLineChartComparisonData: resWeeklyData,
          monthlyLineChartComparisonData: resMonthlyData,
          officeLeaderboardData: resOfficeLeaderboardData,
          departmentLeaderboardData: resDepartmentLeaderboardData,
        } = response.resource;

        setTotalAvg(resTotalAvg ?? 0);
        setGridData(resGridData ?? []);
        setWeeklyLineChartComparisonData(resWeeklyData ?? []);
        setMonthlyLineChartComparisonData(resMonthlyData ?? []);
        setOfficeLeaderboardData(resOfficeLeaderboardData ?? []);
        setDepartmentLeaderboardData(resDepartmentLeaderboardData ?? []);
      } else {
      }
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  const dateRangeOption = "weekly";
  const defaultDateFilterOption = "currentWeek";

  useEffect(() => {
    if (!user || !workflowId || !toolId) {
      return;
    }

    const weeklyOption = dateRangeOptions[dateRangeOption].find(
      (opt) => opt.value === defaultDateFilterOption
    );

    if (weeklyOption) {
      const [startDate, endDate] = weeklyOption.getRange();
      getData({ startDate, endDate });
    } else {
      getData();
    }
  }, [user, workflowId, toolId]);

  const weeklySiteNames =
    weeklyLineChartComparisonData.length > 0
      ? Object.keys(weeklyLineChartComparisonData[0]).filter(
          (key) => key !== "week"
        )
      : [];

  const weeklySeries = GenerateSiteSeries(weeklySiteNames, "week");

  const weeklyLineChartOptions = {
    data: weeklyLineChartComparisonData,
    series: weeklySeries,
    background: {
      fill: theme.colors.elementBG,
    },
    axes: [
      {
        type: "category",
        position: "bottom",
        label: {
          rotation: 300,
          fontSize: 12,
          fontFamily: "Metropolis",
          color: theme.colors.primaryTextColor,
        },
        title: {
          text: "Week",
          fontSize: 12,
          fontFamily: "Metropolis",
          color: theme.colors.primaryTextColor,
        },
      },
      {
        type: "number",
        position: "left",
        title: {
          text: "Happiness Score",
          fontSize: 12,
          fontFamily: "Metropolis",
          color: theme.colors.primaryTextColor,
        },
        label: {
          fontSize: 12,
          fontFamily: "Metropolis",
          color: theme.colors.primaryTextColor,
        },
      },
    ],
    zoom: { enabled: false },
    navigator: { enabled: false },
    legend: {
      position: "bottom" as const,
      item: { label: { color: theme.colors.primaryTextColor } },
    },
    padding: { top: 20, left: 20, right: 20, bottom: 50 },
  };

  const monthlySiteNames =
    monthlyLineChartComparisonData.length > 0
      ? Object.keys(monthlyLineChartComparisonData[0]).filter(
          (key) => key !== "month"
        )
      : [];

  const monthlySeries = GenerateSiteSeries(monthlySiteNames, "month");

  const monthlyLineChartOptions = {
    data: monthlyLineChartComparisonData,
    series: monthlySeries,
    background: {
      fill: theme.colors.elementBG,
    },
    axes: [
      {
        type: "category",
        position: "bottom",
        label: {
          rotation: 300,
          fontSize: 12,
          fontFamily: "Metropolis",
          color: theme.colors.primaryTextColor,
        },
        title: {
          text: "Month",
          fontSize: 12,
          fontFamily: "Metropolis",
          color: theme.colors.primaryTextColor,
        },
      },
      {
        type: "number",
        position: "left",
        title: {
          text: "Happiness Score",
          fontSize: 12,
          fontFamily: "Metropolis",
          color: theme.colors.primaryTextColor,
        },
        label: {
          fontSize: 12,
          fontFamily: "Metropolis",
          color: theme.colors.primaryTextColor,
        },
      },
    ],
    zoom: { enabled: false },
    navigator: { enabled: false },
    legend: {
      position: "bottom" as const,
      item: { label: { color: theme.colors.primaryTextColor } },
    },
    padding: { top: 20, left: 20, right: 20, bottom: 50 },
  };

  const sortedOfficeLeaderboard = [...officeLeaderboardData].sort(
    (a, b) => b.currentWeekScore - a.currentWeekScore
  );

  const officeLeaderboardBarOptions: AgCartesianChartOptions = {
    data: sortedOfficeLeaderboard,
    padding: { top: 20, left: 20, right: 20, bottom: 50 },
    background: {
      fill: theme.colors.elementBG,
    },
    series: [
      {
        type: "bar",
        xKey: "siteName",
        yKey: "currentWeekScore",
        yName: "Current Week (Avg)",
        cornerRadius: 10,
        fill: theme.colors.seduloGreen,
        tooltip: { renderer: ScoreTooltipRenderer(theme.colors) },
        shadow: {
          enabled: true,
          color: "#191919",
          xOffset: 1,
          yOffset: 1,
          blur: 4,
        },
      },
      {
        type: "bar",
        xKey: "siteName",
        yKey: "periodScore",
        yName: "Period (Avg)",
        cornerRadius: 10,
        fill: theme.colors.yellow,
        tooltip: { renderer: ScoreTooltipRenderer(theme.colors) },
        shadow: {
          enabled: true,
          color: "#191919",
          xOffset: 1,
          yOffset: 1,
          blur: 4,
        },
      },
    ],
    axes: [
      {
        type: "category",
        position: "bottom",
        label: {
          rotation: 300,
          fontSize: 10,
          fontFamily: "Metropolis",
          color: theme.colors.primaryTextColor,
        },
      },
      {
        type: "number",
        position: "left",
        label: {
          fontSize: 10,
          fontFamily: "Metropolis",
          color: theme.colors.primaryTextColor,
        },
      },
    ],
    legend: {
      position: "bottom" as const,
      item: { label: { color: theme.colors.primaryTextColor } },
    },
  };

  const sortedDepartmentLeaderboard = [...departmentLeaderboardData].sort(
    (a, b) => b.currentWeekScore - a.currentWeekScore
  );

  const departmentLeaderboardBarOptions: AgCartesianChartOptions = {
    data: sortedDepartmentLeaderboard,
    padding: { top: 20, left: 20, right: 20, bottom: 50 },
    background: {
      fill: theme.colors.elementBG,
    },
    series: [
      {
        type: "bar",
        xKey: "name",
        yKey: "currentWeekScore",
        yName: "Current Week (Avg)",
        cornerRadius: 10,
        fill: theme.colors.seduloGreen,
        tooltip: { renderer: ScoreTooltipRenderer(theme.colors) },
        shadow: {
          enabled: true,
          color: "#191919",
          xOffset: 1,
          yOffset: 1,
          blur: 4,
        },
      },
      {
        type: "bar",
        xKey: "name",
        yKey: "periodScore",
        yName: "Period (Avg)",
        cornerRadius: 10,
        fill: theme.colors.yellow,
        tooltip: { renderer: ScoreTooltipRenderer(theme.colors) },
        shadow: {
          enabled: true,
          color: "#191919",
          xOffset: 1,
          yOffset: 1,
          blur: 4,
        },
      },
    ],
    axes: [
      {
        type: "category",
        position: "bottom",
        label: {
          rotation: 300,
          fontSize: 10,
          fontFamily: "Metropolis",
          color: theme.colors.primaryTextColor,
        },
      },
      {
        type: "number",
        position: "left",
        label: {
          fontSize: 10,
          fontFamily: "Metropolis",
          color: theme.colors.primaryTextColor,
        },
      },
    ],
    legend: {
      position: "bottom" as const,
      item: { label: { color: theme.colors.primaryTextColor } },
    },
  };

  const onFilterChange = (postBody: Record<string, any>) => {
    setFilterOptions(postBody);
    getData(postBody);
  };

  return (
    <>
      <FilterSidebar
        onApplyFilters={onFilterChange}
        dateFilterMode={dateRangeOption}
        defaultDateFilter={defaultDateFilterOption}
      />
      <VStack align="stretch" spacing={6} w="full" py={2}>
        {/* Dashboard Layout */}
        <Flex w={"100%"} gap={6} flexWrap={"wrap"}>
          <Box flex={"1 1 250px"} borderRadius="lg">
            {/* Average Score */}
            <Flex width="100%" justifyContent="center" align="center" mb={4}>
              <SectionHeader>Average</SectionHeader>
            </Flex>
            <Box p={6}>
              <SpeechBubble score={totalAvg} change={0} />
            </Box>
          </Box>

          {/* Scores and Comments */}
          <DataGridComponentLight
            data={gridData}
            loading={isLoading}
            initialFields={columnDefs}
            showTopBar={false}
            defaultColDef={defaultColDef}
            refreshData={getData}
            enableAutoRefresh={true}
            title={"Scores and Comments"}
            flex={"1 1 50%"}
          />

          {gridData && gridData.length > 0 && (
            <>
              {/* Office Leaderboard */}
              <AgChartComponent
                flex={"1 1 50%"}
                title={"Office Leaderboard"}
                chartOptions={officeLeaderboardBarOptions}
                noData={officeLeaderboardData.length === 0}
              />

              {/* Department Leaderboard */}
              <AgChartComponent
                flex={"1 1 50%"}
                title={"Department Leaderboard"}
                chartOptions={departmentLeaderboardBarOptions}
                noData={departmentLeaderboardData.length === 0}
              />

              {/*Weekly Chart*/}
              <AgChartComponent
                flex={"1 1 100%"}
                title={"Weekly Trend"}
                chartOptions={weeklyLineChartOptions}
                noData={weeklyLineChartComparisonData.length === 0}
              />

              {/* Monthly Chart */}
              <AgChartComponent
                flex={"1 1 100%"}
                title={"Monthly Trend"}
                chartOptions={monthlyLineChartOptions}
                noData={monthlyLineChartComparisonData.length === 0}
              />
            </>
          )}
        </Flex>
      </VStack>
    </>
  );
};

export default SiteDepartmentDashboard;
