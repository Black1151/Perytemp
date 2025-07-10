// ─────────────────────────────────────────────────────────────
// app/(dashboard)/AnalyticsDashboard.tsx
// ─────────────────────────────────────────────────────────────
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import DataGridComponentLight from "@/components/agGrids/DataGrid/DataGridComponentLight";
import AgChartComponent from "@/components/agCharts/AgChartComponent";
import { ColDef, GridOptions } from "ag-grid-community";
import {
  Flex,
  Box,
  Text,
  VStack,
  Skeleton,
  useToast,
  useTheme,
  SimpleGrid,
  HStack,
} from "@chakra-ui/react";
import DateRangeFilter from "./DateRangeFilter";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import { HospitalityAnalyticsData } from "./analyticsDashboard/types";
import { SpringScale } from "@/components/animations/SpringScale";
import { GenericTooltipRenderer } from "./GenericTooltipRenderer";
import { AgLineSeriesTooltipRendererParams } from "ag-charts-enterprise";
import StatCard from "./StatCard";

/*──────────────────────────────────────────────────────────────
 * 1.  Column definitions – group controls now live in Category
 *     Updated: ensure Category column remains readable on
 *     smaller screens by increasing its flex and setting
 *     a sensible minWidth. Numeric columns are also capped
 *     with maxWidth to stop them encroaching on text columns.
 *──────────────────────────────────────────────────────────────*/
const analyticsTableColumns: ColDef[] = [
  {
    headerName: "Category",
    field: "categoryName",
    rowGroup: true,
    hide: true,
  },
  {
    headerName: "Category",
    showRowGroup: "categoryName",
    cellRenderer: "agGroupCellRenderer",
    sortable: true,
    filter: true,
    resizable: true,
    flex: 2,
    minWidth: 160,
  },
  {
    headerName: "Item Name",
    field: "itemName",
    sortable: true,
    filter: true,
    resizable: true,
    flex: 1,
    minWidth: 140,
  },
  {
    headerName: "Offers Opened",
    field: "offersOpened",
    sortable: true,
    filter: true,
    resizable: true,
    type: "numericColumn",
    minWidth: 190,
  },
  {
    headerName: "Offers Taken",
    field: "offersTaken",
    sortable: true,
    filter: true,
    resizable: true,
    type: "numericColumn",
    minWidth: 190,
  },
];

/* Helper: yyyy-mm-dd from Date */
const isoDate = (d: Date) => d.toISOString().substring(0, 10);

const AnalyticsDashboard = () => {
  /*───────────────────────────────
   * Date-range state
   *──────────────────────────────*/
  const today = new Date();
  const defaultStart = new Date();
  defaultStart.setDate(today.getDate() - 29); // last 30 days

  const [startDate, setStartDate] = useState<string>(isoDate(defaultStart));
  const [endDate, setEndDate] = useState<string>(isoDate(today));

  /*───────────────────────────────
   * Data + error state
   *──────────────────────────────*/
  const [data, setData] = useState<HospitalityAnalyticsData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const toast = useToast();

  const theme = useTheme();

  /*───────────────────────────────
   * Fetch analytics (memoised)
   *──────────────────────────────*/
  const fetchData = useCallback(async () => {
    try {
      setError(null);
      setData(null); // show loading skeleton

      const qs = new URLSearchParams({ startDate, endDate }).toString();
      const res = await fetch(
        `/api/hospitality-hub/getHospitalityHubAnalyticsData?${qs}`
      );
      if (!res.ok) throw new Error(`Request failed: ${res.status}`);
      const json: HospitalityAnalyticsData = await res.json();

      console.log("json", json);

      setData(json);
    } catch (e: any) {
      setError(e.message);
      toast({
        status: "error",
        title: "Failed to load analytics",
        description: e.message,
      });
    }
  }, [startDate, endDate, toast]);

  /*───────────────────────────────
   * Initial fetch (last 30 days)
   *──────────────────────────────*/
  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /*───────────────────────────────
   * Derived memoised helpers
   *──────────────────────────────*/
  const userStats = useMemo(
    () =>
      data?.userEngagement ?? {
        highCount: 0,
        midCount: 0,
        lowCount: 0,
        nonCount: 0,
      },
    [data]
  );

  /*───────────────────────────────
   * Chart options (memoised)
   *──────────────────────────────*/
  const siteBarChartOptions = useMemo(() => {
    const siteStats = data?.siteStats ?? [];

    return {
      type: "bar",
      data: siteStats.map((s) => ({
        site: s.siteName,
        offersOpened: s.offersOpened,
        offersTaken: s.offersTaken,
      })),
      series: [
        {
          type: "bar",
          xKey: "site",
          yKey: "offersOpened",
          yName: "Offers Opened",
          fill: theme.colors.orange[500],
          cornerRadius: 10,
          shadow: {
            enabled: true,
            color: "#191919",
            xOffset: 1,
            yOffset: 1,
            blur: 4,
          },
          tooltip: {
            renderer: GenericTooltipRenderer(theme.colors, {
              title: "Offers Opened", // constant
              // @ts-ignore
              body: ({ datum, xKey, yKey }) => {
                const site = datum[xKey] ?? "N/A";
                const val =
                  typeof datum[yKey] === "number"
                    ? datum[yKey].toFixed(1)
                    : "N/A";
                return `${site}: ${val}`;
              },
            }),
          },
        },
        {
          type: "bar",
          xKey: "site",
          yKey: "offersTaken",
          yName: "Offers Taken",
          fill: theme.colors.green[500],
          cornerRadius: 10,
          tooltip: {
            renderer: GenericTooltipRenderer(theme.colors, {
              title: "Offers Taken",
              // @ts-ignore
              body: ({ datum, xKey, yKey }) => {
                const site = datum[xKey] ?? "N/A";
                const val =
                  typeof datum[yKey] === "number"
                    ? datum[yKey].toFixed(1)
                    : "N/A";
                return `${site}: ${val}`;
              },
            }),
          },
        },
      ],

      axes: [
        {
          type: "category",
          position: "bottom",
          label: {
            fontSize: 12,
            color: theme.colors.primaryTextColor,
            rotation: 345,
          },
        },
        {
          type: "number",
          position: "left",
          label: { fontSize: 12, color: theme.colors.primaryTextColor },
        },
      ],
      legend: {
        item: {
          label: { color: theme.colors.primaryTextColor },
          enabled: true,
        },
      },
      background: { fill: theme.colors.elementBG },
      padding: { top: 40, left: 10, right: 20, bottom: 20 },
    } as const;
  }, [data, theme.colors]);

  const weeklyTrendOptions = useMemo(() => {
    const trends = data?.weeklyTrends ?? [];

    return {
      type: "line",
      data: trends.map((t) => ({
        week: t.weekStart,
        offersOpened: t.offersOpened,
        offersTaken: t.offersTaken,
      })),
      series: [
        {
          type: "line",
          xKey: "week",
          yKey: "offersOpened",
          yName: "Offers Opened",
          stroke: theme.colors.green[500],
          marker: { enabled: true },

          // 👇 Tooltip for “Offers Opened”
          tooltip: {
            renderer: GenericTooltipRenderer<
              AgLineSeriesTooltipRendererParams<any>
            >(theme.colors, {
              title: "Offers Opened",
              body: ({ datum, xKey, yKey }) => {
                const week = datum[xKey] ?? "N/A";
                const val =
                  typeof datum[yKey] === "number"
                    ? datum[yKey].toFixed(0)
                    : "N/A";
                return `${week}: ${val}`;
              },
            }),
          },
        },
        {
          type: "line",
          xKey: "week",
          yKey: "offersTaken",
          yName: "Offers Taken",
          stroke: theme.colors.yellow[500],
          marker: { enabled: true },

          // 👇 Tooltip for “Offers Taken”
          tooltip: {
            renderer: GenericTooltipRenderer<
              AgLineSeriesTooltipRendererParams<any>
            >(theme.colors, {
              title: "Offers Taken",
              body: ({ datum, xKey, yKey }) => {
                const week = datum[xKey] ?? "N/A";
                const val =
                  typeof datum[yKey] === "number"
                    ? datum[yKey].toFixed(0)
                    : "N/A";
                return `${week}: ${val}`;
              },
            }),
          },
        },
      ],
      axes: [
        {
          type: "category",
          position: "bottom",
          label: {
            fontSize: 12,
            color: theme.colors.primaryTextColor,
            rotation: 345,
          },
          title: { text: "Week", color: theme.colors.primaryTextColor },
        },
        {
          type: "number",
          position: "left",
          label: {
            fontSize: 12,
            color: theme.colors.primaryTextColor,
          },
          title: { text: "Count", color: theme.colors.primaryTextColor },
        },
      ],
      legend: {
        item: {
          label: { color: theme.colors.primaryTextColor },
          enabled: true,
        },
      },
      background: { fill: theme.colors.elementBG },
      padding: { top: 40, left: 10, right: 20, bottom: 20 },
    } as const;
  }, [data, theme.colors]);

  /*───────────────────────────────
   * Validation helpers
   *──────────────────────────────*/
  const isRangeValid = startDate <= endDate;

  /*───────────────────────────────
   * Render
   *──────────────────────────────*/
  if (error) return <Text color="red.500">{error}</Text>;
  if (!data) {
    // Loading skeletons
    return (
      <VStack w="100%" spacing={6} mt={4}>
        <Skeleton height="80px" w="100%" />
        <Skeleton height="500px" w="100%" />
        <Flex w="100%" gap={6} direction={{ base: "column", md: "row" }}>
          <Skeleton flex="1" height="140px" />
          <Skeleton flex="1" height="140px" />
          <Skeleton flex="1" height="140px" />
          <Skeleton flex="1" height="140px" />
        </Flex>
        <Skeleton height="400px" w="100%" />
        <Skeleton height="400px" w="100%" />
      </VStack>
    );
  }

  const { highCount, midCount, lowCount, nonCount } = userStats;

  return (
    <VStack w="100%" spacing={8} align="stretch" mt={4}>
      {/* Date filters */}
      <SpringScale delay={0}>
        <DateRangeFilter
          startDate={startDate}
          endDate={endDate}
          onStartDateChange={setStartDate}
          onEndDateChange={setEndDate}
          onApply={fetchData}
        />
      </SpringScale>
      <SpringScale delay={0.1}>
        <Box w="100%" overflowX="auto">
          <DataGridComponentLight
            data={data.tableItems}
            initialFields={analyticsTableColumns}
            title="Item Performance"
            height="500px"
            showTopBar
            groupDisplayType="custom"
          />
        </Box>
      </SpringScale>
      <SimpleGrid w="100%" spacing={6} columns={[1, 2, 3]}>
        <SpringScale delay={0.1}>
          <StatCard
            icon={<CheckCircleIcon fontSize="inherit" />}
            title="High Engagement"
            color={theme.colors.green[500] ?? "#38A169"}
          >
            <HStack>
              <Text
                fontSize="3xl"
                fontWeight="bold"
                color={theme.colors.green[500]}
              >
                {highCount}
              </Text>
              <Text mt={1} fontSize="md" color="gray.400">
                users
              </Text>
            </HStack>
            <Text mt={1} fontSize="xs" color="gray.400">
              15+ opens
            </Text>
          </StatCard>
        </SpringScale>

        <SpringScale delay={0.2}>
          <StatCard
            icon={<TrendingUpIcon fontSize="inherit" />}
            title="Mid Engagement"
            color={theme.colors.blue[500] ?? "#3182CE"}
          >
            <HStack>
              <Text
                fontSize="3xl"
                fontWeight="bold"
                color={theme.colors.blue[500]}
              >
                {midCount}
              </Text>
              <Text mt={1} fontSize="md" color="gray.400">
                users
              </Text>
            </HStack>
            <Text mt={1} fontSize="xs" color="gray.400">
              8-14 opens
            </Text>
          </StatCard>
        </SpringScale>

        <SpringScale delay={0.3}>
          <StatCard
            icon={<TrendingDownIcon fontSize="inherit" />}
            title="Low Engagement"
            color={theme.colors.orange[500] ?? "#DD6B20"}
          >
            <HStack>
              <Text
                fontSize="3xl"
                fontWeight="bold"
                color={theme.colors.orange[500]}
              >
                {lowCount}
              </Text>
              <Text mt={1} fontSize="md" color="gray.400">
                users
              </Text>
            </HStack>
            <Text mt={1} fontSize="xs" color="gray.400">
              1-7 opens
            </Text>
          </StatCard>
        </SpringScale>
      </SimpleGrid>

      {/* Site bar chart */}
      <SpringScale delay={0.3}>
        <Box w="100%" minH="400px">
          <AgChartComponent
            flex="1"
            title="Site Comparison"
            chartOptions={siteBarChartOptions}
            noData={data.siteStats.length === 0}
          />
        </Box>
      </SpringScale>

      {/* Weekly trend */}
      <SpringScale delay={0.4}>
        <Box w="100%" minH="400px">
          <AgChartComponent
            flex="1"
            title="Weekly Trend"
            chartOptions={weeklyTrendOptions}
            noData={data.weeklyTrends.length === 0}
          />
        </Box>
      </SpringScale>
    </VStack>
  );
};

export default AnalyticsDashboard;
