"use client";

import React, { useState, useMemo } from "react";
import { GridApi, FirstDataRenderedEvent } from "ag-grid-community";
import { Flex } from "@chakra-ui/react";
import DataGridComponentLight from "@/components/agGrids/DataGrid/DataGridComponentLight";
import AgChartComponent from "@/components/agCharts/AgChartComponent";
import FilterSidebar from "@/components/Sidebars/Dashboards Filter/FilterSidebar";
import { staffCommentsColumnDefs } from "./colDefs";
import { StaffDashboardProps, histogramData, staffStats } from "./types";
import mockStaffDashboardData from "./mockData";

const StaffDashboard = () => {
  const [gridApi, setGridApi] = useState<GridApi | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [gridData, setGridData] = useState<StaffDashboardProps | null>(null);

  const handleGridReady = (params: FirstDataRenderedEvent) => {
    setGridApi(params.api);
  };

  // const onApplyFilters = async (postBody: { startDate?: Date; endDate?: Date; siteId?: string }) => {
  //     if (!postBody.startDate || !postBody.endDate) return;

  //     setIsLoading(true);

  //     try {
  //         const res = await fetch("/api/client-satisfaction/staff", {
  //             method: "POST",
  //             headers: { "Content-Type": "application/json" },
  //             body: JSON.stringify({
  //                 startDate: postBody.startDate,
  //                 endDate: postBody.endDate,
  //                 siteId: postBody.siteId,
  //             }),
  //         });

  //         if (!res.ok) throw new Error("Failed to fetch staff dashboard data");

  //         const data: StaffDashboardProps = await res.json();
  //         setGridData(data);
  //     } catch (err) {
  //         console.error("Error loading staff dashboard:", err);
  //     } finally {
  //         setIsLoading(false);
  //     }
  // };

  const onApplyFilters = async (postBody: {
    startDate?: Date;
    endDate?: Date;
    siteId?: string;
  }) => {
    if (!postBody.startDate || !postBody.endDate) return;

    setIsLoading(true);

    try {
      // Here we replace the API call with the local mock data.
      // If needed, you could apply any filtering logic to mockStaffDashboardData
      // based on postBody's values (startDate, endDate, siteId, etc.).
      const data: StaffDashboardProps = mockStaffDashboardData;
      setGridData(data);
    } catch (err) {
      console.error("Error loading staff dashboard:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const staffStats = useMemo(
    () => gridData?.resource.staffStats || [],
    [gridData]
  );

  const top5ResponseCounts = useMemo(() => {
    return [...staffStats]
      .sort((a, b) => b.totalResponses - a.totalResponses)
      .slice(0, 5);
  }, [staffStats]);

  const top5Averages = useMemo(() => {
    return [...staffStats]
      .sort((a, b) => b.avgRating - a.avgRating)
      .slice(0, 5);
  }, [staffStats]);

  const scatterChartOptions = {
    autoSize: true,
    data: staffStats,
    series: [
      {
        type: "scatter",
        xKey: "totalResponses",
        yKey: "avgRating",
        marker: {
          size: 10,
          fill: "#4CAF50",
        },
        tooltip: {
          renderer: ({
            datum,
          }: {
            datum: {
              staffName: string;
              totalResponses: number;
              avgRating: number;
            };
          }) => ({
            content: `${datum.staffName}\nResponses: ${datum.totalResponses}\nAvg Rating: ${datum.avgRating.toFixed(2)}`,
          }),
        },
      },
    ],
    axes: [
      {
        type: "number",
        position: "bottom",
        title: { text: "Total Responses" },
        min: 0,
      },
      {
        type: "number",
        position: "left",
        title: { text: "Average Rating" },
        min: 0,
        max: 10,
      },
    ],
  };

  const top5AveragesChartOptions = {
    autoSize: true,
    data: top5Averages,
    series: [
      {
        type: "bar",
        xKey: "staffName",
        yKey: "avgRating",
        yName: "Average Rating",
        fill: "#4caf50",
        tooltip: {
          renderer: ({
            datum,
          }: {
            datum: { staffName: string; avgRating: number };
          }) => ({
            content: `${datum.staffName}: ${datum.avgRating.toFixed(2)} average rating`,
          }),
        },
      },
    ],
    axes: [
      {
        type: "category",
        position: "bottom",
        title: { text: "Staff Member" },
        label: { rotation: -30 },
      },
      {
        type: "number",
        position: "left",
        title: { text: "Average Rating" },
        min: 0,
        max: 10,
      },
    ],
  };

  const top5ResponseCountsChartOptions = {
    autoSize: true,
    data: top5ResponseCounts,
    series: [
      {
        type: "bar",
        xKey: "staffName",
        yKey: "totalResponses",
        yName: "Total Responses",
        fill: "#3f51b5",
        tooltip: {
          renderer: ({
            datum,
          }: {
            datum: { staffName: string; totalResponses: number };
          }) => ({
            content: `${datum.staffName}: ${datum.totalResponses} responses`,
          }),
        },
      },
    ],
    axes: [
      {
        type: "category",
        position: "bottom",
        title: { text: "Staff Member" },
        label: { rotation: -30 },
      },
      {
        type: "number",
        position: "left",
        title: { text: "Total Responses" },
        min: 0,
      },
    ],
  };

  const generateHistogramData = (rawData: histogramData[]): histogramData[] => {
    // Create 11 bins from 0 to 10, defaulting to 0 count
    const bins: histogramData[] = Array.from({ length: 11 }, (_, i) => ({
      value: i,
      count: 0,
    }));

    for (const entry of rawData) {
      const binIndex = Math.floor(entry.value);
      if (binIndex >= 0 && binIndex <= 10) {
        bins[binIndex].count += entry.count;
      }
    }

    return bins;
  };

  const getRatingColor = (rating: number): string => {
    // Clamp rating between 0–10
    const clamped = Math.max(0, Math.min(10, rating));

    // Create a smoother red → orange → green scale
    const red = clamped < 5 ? 255 : Math.round(255 - ((clamped - 5) / 5) * 255); // fades out from 5→10

    const green =
      clamped > 5
        ? 180 + Math.round(((clamped - 5) / 5) * 75) // from 180→255
        : Math.round((clamped / 5) * 140); // from 0→140 for more orangey tone

    return `rgb(${red}, ${green}, 0)`;
  };

  const histogramChartOptions = {
    autoSize: true,
    data: generateHistogramData(
      mockStaffDashboardData.resource.histogramDataSet
    ),
    series: [
      {
        type: "bar",
        xKey: "value",
        yKey: "count",
        itemStyler: ({ datum }: { datum: histogramData }) => ({
          fill: getRatingColor(datum.value),
        }),
        tooltip: {
          renderer: (params: any) => {
            const { datum } = params;
            return {
              content: `
                <div style="padding: 8px;">
                  <strong>Rating:</strong> ${datum.value}<br/>
                  <strong>Count:</strong> ${datum.count}
                </div>
              `,
            };
          },
        },
      },
    ],
    axes: [
      {
        type: "category",
        position: "bottom",
        title: { text: "Rating" },
      },
      {
        type: "number",
        position: "left",
        title: { text: "Count" },
        nice: true,
      },
    ],
  };

  return (
    <>
      <FilterSidebar
        onApplyFilters={onApplyFilters}
        filterOptions={{
          showDateFilter: true,
          showSitesFilter: true,
          showDepartmentsFilter: true,
        }}
        dateFilterMode="monthly"
        defaultDateFilter="currentMonth"
      />

      <Flex w="100%" gap={6} direction={"column"}>
        {/* DataGrid for Staff Comments */}
        <DataGridComponentLight
          data={gridData?.resource.staffComments || []}
          loading={isLoading}
          initialFields={staffCommentsColumnDefs}
          showTopBar={false}
          onGridReady={handleGridReady}
          enableAutoRefresh={true}
          title="Staff Score and Comments"
          groupDisplayType="groupRows"
        />

        {/* Historgram for rating and counts */}
        <AgChartComponent
          flex="1 1 100%"
          title="Staff Rating Distribution"
          noData={!staffStats.length}
          chartOptions={histogramChartOptions}
        />

      {/* Charts for Top 5 performers */}
      <Flex w="100%" gap={6} direction={{ base: "column", lg: "row" }}>
        <AgChartComponent
          flex="1"
          title="Top 5 Staff by Average Rating"
          chartOptions={top5AveragesChartOptions}
          noData={!top5Averages.length}
        />

        <AgChartComponent
          flex="1"
          title="Top 5 Staff by Total Responses"
          chartOptions={top5ResponseCountsChartOptions}
          noData={!top5ResponseCounts.length}
        />
      </Flex>

      {/* Scatter chart for Staff Score vs feedback count*/}
      <AgChartComponent
        flex="1 1 100%"
        title="Avg Score vs Feedback Count"
        chartOptions={scatterChartOptions}
        noData={!staffStats.length}
      />
      </Flex>
    </>
  );
};

export default StaffDashboard;
