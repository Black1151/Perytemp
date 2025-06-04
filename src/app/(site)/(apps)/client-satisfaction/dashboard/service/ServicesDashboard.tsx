"use client";

import React, { useEffect, useState, useMemo } from "react";
import { AgNodeClickEvent } from "ag-charts-community";
import { GridApi, FirstDataRenderedEvent } from "ag-grid-community";
import { dateRangeOptions } from "@/components/Sidebars/Dashboards Filter/dateRangeUtils";
import {
  Flex,
  Modal,
  ModalBody,
  ModalContent,
  VStack,
  ModalOverlay,
  ModalHeader,
  ModalCloseButton,
  Box,
} from "@chakra-ui/react";
import { format } from "date-fns";
import DataGridComponentLight from "@/components/agGrids/DataGrid/DataGridComponentLight";
import AgChartComponent from "@/components/agCharts/AgChartComponent";
import {
  servicesCommentsColumnDefs,
  singleServiceCommentsColumnDefs,
} from "./colDefs";
import FilterSidebar from "@/components/Sidebars/Dashboards Filter/FilterSidebar";
import { ServiceDashboardProps, ServiceResponse } from "./types";
import { useWorkflow } from "@/providers/WorkflowProvider";
import { useTheme } from "@chakra-ui/react";

const ServicesDashboard = () => {
  const [gridApi, setGridApi] = useState<GridApi | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [gridData, setGridData] = useState<ServiceDashboardProps | null>(null);
  const { toolId, workflowId } = useWorkflow();
  const [isCommentsModalOpen, setIsCommentsModalOpen] = useState(false);
  const [commentsGridData, setCommentsGridData] = useState<
    ServiceResponse[] | null
  >(null);
  const [commentsModalTitle, setCommentsModalTitle] = useState("");
  const [commentsModalFilterModel, setCommentsModalFilterModel] =
    useState<commentsfilterModel>({
      serviceName: "",
    });
  const theme = useTheme();
  const [filterOptions, setFilterOptions] = useState<Record<string, any>>({});

  interface commentsfilterModel {
    serviceName: string;
  }

  const handleGridReady = (params: FirstDataRenderedEvent) => {
    setGridApi(params.api);
  };

  const onFilterChange = (postBody: Record<string, any>) => {
    setFilterOptions(postBody);
    getData(postBody);
  };

  const getData = async (postBody: {
    startDate?: Date;
    endDate?: Date;
    departmentIds?: string[];
  }) => {
    if (!postBody.startDate || !postBody.endDate) return;

    setIsLoading(true);

    const formattedBody = {
      ...postBody,
      startDate: postBody.startDate
        ? format(new Date(postBody.startDate), "yyyy-MM-dd")
        : undefined,
      endDate: postBody.endDate
        ? format(new Date(postBody.endDate), "yyyy-MM-dd")
        : undefined,
      serviceIds: postBody.departmentIds || [],
      filterByMyCustomer: true,
    };

    const requestBody = {
      toolId,
      workflowId,
      ...formattedBody,
    };

    try {
      const res = await fetch("/api/client-satisfaction/services", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });

      if (!res.ok) throw new Error("Failed to fetch dashboard data");

      const data: ServiceDashboardProps = await res.json();
      setGridData(data);
    } catch (err) {
      console.error("Error loading service dashboard:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const dateRangeOption = "monthly";
  const defaultDateFilterOption = "last6Months";

  useEffect(() => {
    if (!toolId || !workflowId) {
      return;
    }
    const monthlyOption = dateRangeOptions[dateRangeOption].find(
      (opt) => opt.value === defaultDateFilterOption
    );

    if (monthlyOption) {
      const [startDate, endDate] = monthlyOption.getRange();
      getData({ startDate, endDate });
    } else {
      // Provide a default date range, or do nothing
      const fallbackStart = new Date();
      const fallbackEnd = new Date();
      getData({ startDate: fallbackStart, endDate: fallbackEnd });
    }
  }, [toolId, workflowId]);

  const flattenedRows = useMemo(() => {
    if (!gridData?.resource.services) return [];

    return gridData.resource.services.flatMap((service) => {
      if (!service.serviceResponse || service.serviceResponse.length === 0) {
        // If there are no responses for this service, return empty
        return [];
      }

      // Flatten each response row, injecting serviceName, etc.
      return service.serviceResponse.map((resp) => ({
        ...resp,
        serviceName: service.serviceName,
        // If you need "site" from somewhere else, set it here, or remove that column:
        site: "",
      }));
    });
  }, [gridData]);

  const scatterServiceChartOptions = {
    autoSize: true,
    // Convert string `avgServiceRating` to a number.
    data: (gridData?.resource.services || []).map((service) => ({
      ...service,
      avgRating: parseFloat(service.avgServiceRating ?? "0"),
    })),
    series: [
      {
        type: "scatter",
        xKey: "avgRating", // the numeric x-value
        yKey: "total", // the numeric y-value
        xName: "Average Rating",
        marker: {
          enabled: true,
          size: 20,
          fill: theme.colors.primary,
          stroke: "#333333",
          strokeWidth: 0,
        },
        label: {
          enabled: true,
          placement: "top",
          fontSize: 12,
          color: "#000",
          formatter: (params: any) => {
            const { datum } = params;
            return datum.serviceName || "";
          },
        },
        tooltip: {
          renderer: (params: any) => {
            const { datum } = params;
            return {
              content: `
              <div style="padding: 4px;">
                <strong> ${datum.serviceName ?? "N/A"}</strong><br/>
                Avg Rating: ${datum.avgRating.toFixed(1)}<br/>
                Total Responses: ${datum.total}<br/>
              </div>
              `,
            };
          },
        },
      },
    ],
    axes: [
      {
        type: "number",
        position: "bottom",
        title: { text: "Average Rating" },
        min: 0,
        max: 10, // Adjust for your rating scale
        line: { width: 2, color: "#999" },
        tick: { width: 2, size: 6, color: "#666" },
        label: { fontSize: 12, fontWeight: "bold" },
        gridStyle: [{ stroke: "#ccc", lineDash: [4, 4] }],
      },
      {
        type: "number",
        position: "left",
        title: { text: "Total Responses" },
        min: 0,
        line: { width: 2, color: "#999" },
        tick: { width: 2, size: 6, color: "#666" },
        label: { fontSize: 12, fontWeight: "bold" },
        gridStyle: [{ stroke: "#ccc", lineDash: [4, 4] }],
      },
    ],
    legend: {
      enabled: false,
    },
    listeners: {
      seriesNodeClick: (params: any) => {
        const filteredData = flattenedRows.filter(
          (row) => row.serviceName === params.datum.serviceName
        );

        setCommentsGridData(filteredData);
        setCommentsModalTitle(`${params.datum.serviceName} Comments`);
        setCommentsModalFilterModel({
          serviceName: params.datum.serviceName,
        });
        setIsCommentsModalOpen(true);
      },
    },
  };

  const getRatingColor = (rating: number): string => {
    // Clamp rating between 0–10
    const clamped = Math.max(0, Math.min(10, rating));

    // Create a smoother red → orange → green scale
    const red = clamped < 5 ? 255 : Math.round(255 - ((clamped - 5) / 5) * 225); // fades out from 5→10

    const green =
      clamped > 5
        ? 180 + Math.round(((clamped - 5) / 5) * 75) // from 180→255
        : Math.round((clamped / 5) * 140); // from 0→140 for more orangey tone

    return `rgb(${red}, ${green}, 0)`;
  };

  const npsLineChartOptions = {
    autoSize: true,

    series: (gridData?.resource.services || []).map((service) => {
      const sortedNps = [...service.serviceNPS].sort((a, b) =>
        a.monthYear.localeCompare(b.monthYear)
      );

      return {
        type: "line",
        // Convert each NPS entry to { date, score, ... }
        data: sortedNps.map((nps) => {
          const [year, month] = nps.monthYear.split("-").map(Number);
          // month is 0-based in JS, so subtract 1
          const date = new Date(year, month - 1, 1);

          return {
            date,
            score: nps.score,
            promoters: nps.promoters,
            passives: nps.passives,
            detractors: nps.detractors,
            totalResponses: nps.totalResponses,
            serviceName: service.serviceName ?? "Unknown",
          };
        }),
        xKey: "date",
        yKey: "score",
        title: service.serviceName,
        marker: {
          enabled: true,
          size: 10,
        },
        tooltip: {
          renderer: (params: any) => {
            const { datum } = params;
            // Format the date however you like:
            const dateStr =
              datum.date?.toLocaleDateString("default", {
                year: "numeric",
                month: "short",
              }) || "";

            return {
              title: `${datum.serviceName} (${dateStr})`,
              content: `
                <div style="padding: 8px;">
                  <strong>NPS Score:</strong> ${datum.score}<br/>
                  <strong>Promoters:</strong> ${datum.promoters}<br/>
                  <strong>Passives:</strong> ${datum.passives}<br/>
                  <strong>Detractors:</strong> ${datum.detractors}<br/>
                </div>
              `,
            };
          },
        },
      };
    }),

    axes: [
      {
        type: "time",
        position: "bottom",
        title: { text: "Month" },
      },
      {
        type: "number",
        position: "left",
        title: { text: "NPS Score" },
        min: -100,
        max: 100,
      },
    ],

    legend: {
      enabled: true,
    },
  };

  //for histogram
  const binnedData = useMemo(() => {
    // Prepare 11 bins, one for each integer rating 0..10
    const bins: Array<{ value: number; count: number }> = [];
    for (let rating = 0; rating <= 10; rating++) {
      bins.push({ value: rating, count: 0 });
    }

    // If services is null/undefined, we won't do anything
    const services = gridData?.resource.services || [];
    services.forEach((service) => {
      // Parse the string rating. If null/undefined, default to "0"
      const avgRatingNum = parseFloat(service.avgServiceRating ?? "0");

      // Clamp to [0..10] in case you get weird out-of-range values
      const clamped = Math.max(0, Math.min(10, avgRatingNum));

      // Round to the nearest integer bin
      const binIndex = Math.round(clamped);

      // Increment the count for that bin
      bins[binIndex].count += 1;
    });

    return bins;
  }, [gridData]);

  const histogramChartOptions = {
    autoSize: true,
    data: binnedData,
    series: [
      {
        type: "bar",
        xKey: "value", // 0..10
        yKey: "count", // how many services fell into that bin
        xName: "Rating",
        strokeWidth: 0,
        shadow: {
          enabled: true,
          color: "#191919",
          xOffset: 1,
          yOffset: 1,
          blur: 4,
        },
        cornerRadius: 10,
        // itemStyler can be used for conditional coloring
        itemStyler: ({ datum }: { datum: { value: number } }) => ({
          fill: getRatingColor(datum.value), // you'll define getRatingColor
        }),
        tooltip: {
          renderer: (params: any) => {
            const { datum } = params; // e.g. { value: 3, count: 12 }
            return {
              content: `
                <div style="padding: 8px;">
                  <strong>Rounded Avg Rating:</strong> ${datum.value}<br/>
                  <strong>Services Count:</strong> ${datum.count}
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
        title: { text: "Rounded Avg Rating" },
      },
      {
        type: "number",
        position: "left",
        title: { text: "Amount of Services" },
        min: 0,
      },
    ],
    legend: { enabled: false },
  };

  return (
    <>
      <FilterSidebar
        onApplyFilters={onFilterChange}
        filterOptions={{
          showDateFilter: true,
          showSitesFilter: false,
          showDepartmentsFilter: true,
        }}
        dateFilterMode={dateRangeOption}
        defaultDateFilter={defaultDateFilterOption}
      />

      {/* All Comments Modal */}
      <Modal
        isOpen={isCommentsModalOpen}
        onClose={() => setIsCommentsModalOpen(false)}
        size="5xl"
      >
        <ModalOverlay />
        <ModalContent bgGradient={theme.gradients.modalBGGradient}>
          <ModalHeader color="white">{commentsModalTitle}</ModalHeader>
          <ModalCloseButton color="white" />
          <ModalBody pb={10}>
            <VStack minHeight={520}>
              <Box
                className="ag-theme-alpine"
                w="100%"
                p={1}
                pb="7px"
                borderRadius="xl"
                boxShadow="md"
                bgColor="white"
              >
                <DataGridComponentLight
                  data={commentsGridData}
                  initialFields={singleServiceCommentsColumnDefs}
                  showTopBar={false}
                  filterModel={commentsModalFilterModel}
                />
              </Box>
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>

      <Flex flexDirection="column" gap="4">
        <DataGridComponentLight
          data={flattenedRows}
          loading={isLoading}
          initialFields={servicesCommentsColumnDefs}
          showTopBar={false}
          onGridReady={handleGridReady}
          enableAutoRefresh={true}
          title="Services Score and Comments"
          groupDisplayType="groupRows"
        />

        <AgChartComponent
          flex="1"
          title="Total Responses vs. Average Rating"
          chartOptions={scatterServiceChartOptions}
          noData={!gridData?.resource.services?.length}
        />

        <AgChartComponent
          flex="1"
          title="Rating Distribution"
          chartOptions={histogramChartOptions}
          noData={!gridData?.resource.services?.length}
        />

        <AgChartComponent
          flex="1"
          title="Service NPS Over Time"
          chartOptions={npsLineChartOptions}
          noData={!gridData?.resource.services?.length}
        />
      </Flex>
    </>
  );
};

export default ServicesDashboard;
