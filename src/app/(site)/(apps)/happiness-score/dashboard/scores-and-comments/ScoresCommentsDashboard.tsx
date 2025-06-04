"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  Box,
  Flex,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  useBreakpointValue,
  useTheme,
  VStack,
} from "@chakra-ui/react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import "ag-grid-charts-enterprise";
import {
  ColDef,
  CreateCrossFilterChartParams,
  FirstDataRenderedEvent,
  GridApi,
  ChartRef,
} from "ag-grid-community";

import DataGridComponentLight from "@/components/agGrids/DataGrid/DataGridComponentLight";
import FilterSidebar from "@/components/Sidebars/Dashboards Filter/FilterSidebar";
import { useWorkflow } from "@/providers/WorkflowProvider";
import { useUser } from "@/providers/UserProvider";
import { addDays, format, parseISO } from "date-fns";
import { useFetchClient } from "@/hooks/useFetchClient";
import useColor from "@/hooks/useColor";
import { SectionHeader } from "@/components/sectionHeader/SectionHeader";
import { columnDefs } from "@/app/(site)/(apps)/happiness-score/dashboard/scores-and-comments/GridColumnDefs";
import { modalColDef } from "@/app/(site)/(apps)/happiness-score/dashboard/scores-and-comments/ModalColumnDefs";
import { AgNodeClickEvent } from "ag-charts-types";
import { dateRangeOptions } from "@/components/Sidebars/Dashboards Filter/dateRangeUtils";
import { useThemeContext } from "@/providers/ChakraThemeProvider";
import PerygonCard from "@/components/layout/PerygonCard";
import { SubmissionsTooltipRenderer } from "@/components/agCharts/tooltips/SubmissionsTooltipRenderer";

interface ApiResponse {
  data: RowData[];
}

interface RowData {
  role: string;
  userId: number;
  fullName: string;
  userImageUrl: string;
  userIsActive: boolean;
  userUniqueId: string;
  customerId: number;
  customerIsActive: boolean;
  siteName: string;
  siteId: number;
  teamName: string;
  teamId: number;
  deptName: string;
  deptId: number;
  happinessScore: number;
  comments: string;
  createdAt: string;
  createdBy: number;
  toolConfigId: number;
  workflowId: number;
  businessProcessId: number;
  workflowInstanceId: number;
  businessProcessInstanceId: number;
  eowDate?: string;
  monthYear?: string;
}

interface SeduloCrossFilterChartParams extends CreateCrossFilterChartParams {
  id: string;
}

const ScoresCommentsDashboard: React.FC = () => {
  const isMobile = useBreakpointValue({ base: true, sm: true, md: false });
  const theme = useTheme();
  const [gridData, setGridData] = useState<Record<string, any>[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [filterOptions, setFilterOptions] = useState<Record<string, any>>({});
  const { toolId, workflowId } = useWorkflow();
  const { fetchClient } = useFetchClient();
  const { user } = useUser();
  const { getColor } = useColor();

  const [gridApi, setGridApi] = useState<GridApi | null>(null);

  const chartRefs = useRef<ChartRef[]>([]);

  const [isBarModalOpen, setIsBarModalOpen] = useState(false);
  const [barModalTitle, setBarModalTitle] = useState("");
  const [filterModel, setFilterModel] = useState({});

  const defaultColDef: ColDef = {
    resizable: true,
    filter: false,
    sortable: false,
    flex: isMobile ? 0 : 1,
  };
  const modalDefaultColDef: ColDef = {
    resizable: true,
    sortable: true,
    flex: isMobile ? 0 : 1,
  };

  const getData = async (postBody: Record<string, any> = filterOptions) => {
    if (!toolId || !workflowId || !user?.customerId) {
      return;
    }

    setLoading(true);
    try {
      const response = await fetchClient<ApiResponse>(
        `/api/happiness-score/dashboards/all-scores`,
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

      if (response && typeof response === "object" && "data" in response) {
        const processedData = response.data.map((item: RowData) => {
          const createdAtDate = parseISO(item.createdAt);
          const dayOfWeek = createdAtDate.getDay();
          const eowDate = addDays(createdAtDate, 7 - dayOfWeek);
          return {
            ...item,
            eowDate: format(eowDate, "yyyy-MM-dd"),
            monthYear: format(createdAtDate, "MM-yyyy"),
          };
        });
        setGridData(processedData);
      } else {
        setGridData([]);
      }
    } catch (error) {
      setGridData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!gridApi || gridData.length === 0) return;

    chartRefs.current.forEach((chartRef) => {
      chartRef.destroyChart();
    });
    chartRefs.current = [];

    const chartConfigs: SeduloCrossFilterChartParams[] = [
      {
        id: "chart1",
        cellRange: {
          columns: ["deptName", "happinessScore"],
        },
        chartType: "bar",
        aggFunc: "avg",
        chartThemeOverrides: {
          common: {
            background: {
              fill: theme.colors.elementBG,
            },
            padding: { top: 20, left: 20, right: 20, bottom: 20 },
            axes: {
              category: {
                label: {
                  rotation: 340,
                  fontSize: 10,
                  fontFamily: "Metropolis",
                  color: theme.colors.primaryTextColor,
                },
                gridLine: { width: 0 },
              },
              number: {
                position: "right",
                label: {
                  color: theme.colors.primaryTextColor,
                },
                crosshair: {
                  enabled: true,
                  label: { enabled: true },
                },
              },
            },
            legend: { enabled: false },
            zoom: { enabled: false },
            navigator: { enabled: false },
            overlays: {
              noData: { text: "NO DATA" },
              loading: { text: "Loading..." },
            },
          },
          bar: {
            series: {
              tooltip: {
                renderer: SubmissionsTooltipRenderer(theme.colors),
              },
              cornerRadius: 10,
              shadow: {
                enabled: true,
                color: "#191919",
                xOffset: 1,
                yOffset: 1,
                blur: 4,
              },
              itemStyler: (params) => {
                const { datum, yKey } = params;
                const score = datum[yKey];
                return { fill: getColor(score) };
              },
              listeners: {
                nodeClick: (params: AgNodeClickEvent<any, any>) => {
                  const { xKey, datum } = params;
                  if (datum && xKey) {
                    const value =
                      typeof datum[xKey] === "object"
                        ? datum[xKey]?.value
                        : datum[xKey];

                    const newFilterModel = {
                      [xKey]: {
                        filterType: "multi",
                        filterModels: [
                          null,
                          {
                            values: value ? [value] : [],
                            filterType: "set",
                          },
                        ],
                      },
                    };
                    setBarModalTitle(`Department: ${value}`);
                    setFilterModel(newFilterModel);
                    setIsBarModalOpen(true);
                  }
                },
              },
            },
          },
        },
      },
      {
        id: "chart2",
        cellRange: {
          columns: ["siteName", "happinessScore"],
        },
        chartType: "column",
        aggFunc: "avg",
        chartThemeOverrides: {
          common: {
            background: {
              fill: theme.colors.elementBG,
            },
            padding: { top: 20, left: 20, right: 20, bottom: 20 },
            axes: {
              category: {
                label: {
                  rotation: 300,
                  fontSize: 10,
                  fontFamily: "Metropolis",
                  color: theme.colors.primaryTextColor,
                },
                gridLine: { width: 0 },
              },
              number: {
                position: "left",
                label: {
                  color: theme.colors.primaryTextColor,
                },
                crosshair: {
                  enabled: true,
                  label: { enabled: true },
                },
              },
            },
            legend: { enabled: false },
            zoom: { enabled: false },
            navigator: { enabled: false },
            overlays: {
              noData: { text: "NO DATA" },
              loading: { text: "Loading..." },
            },
          },
          bar: {
            series: {
              cornerRadius: 10,
              tooltip: {
                renderer: SubmissionsTooltipRenderer(theme.colors),
              },
              shadow: {
                enabled: true,
                color: "#191919",
                xOffset: 1,
                yOffset: 1,
                blur: 4,
              },
              itemStyler: (params) => {
                const { datum, yKey } = params;
                return { fill: getColor(datum[yKey]) };
              },
              listeners: {
                nodeClick: (params: AgNodeClickEvent<any, any>) => {
                  const { xKey, datum } = params;
                  if (datum && xKey) {
                    const value =
                      typeof datum[xKey] === "object"
                        ? datum[xKey]?.value
                        : datum[xKey];

                    const newFilterModel = {
                      [xKey]: {
                        filterType: "multi",
                        filterModels: [
                          null,
                          {
                            values: value ? [value] : [],
                            filterType: "set",
                          },
                        ],
                      },
                    };
                    setBarModalTitle(`Site: ${value}`);
                    setFilterModel(newFilterModel);
                    setIsBarModalOpen(true);
                  }
                },
              },
            },
          },
        },
      },
      {
        id: "chart3",
        cellRange: {
          columns: ["eowDate", "happinessScore"],
        },
        chartType: "line",
        aggFunc: "avg",
        chartThemeOverrides: {
          common: {
            background: {
              fill: theme.colors.elementBG,
            },
            padding: { top: 20, left: 20, right: 20, bottom: 20 },
            axes: {
              category: {
                label: {
                  rotation: 300,
                  fontSize: 10,
                  fontFamily: "Metropolis",
                  color: theme.colors.primaryTextColor,
                },
                gridLine: { width: 0 },
              },
              number: {
                position: "left",
                label: {
                  color: theme.colors.primaryTextColor,
                },
                crosshair: {
                  enabled: true,
                  label: { enabled: true },
                },
              },
            },
            legend: { enabled: false },
            zoom: { enabled: false },
            navigator: { enabled: false },
            overlays: {
              noData: { text: "NO DATA" },
              loading: { text: "Loading..." },
            },
          },
          line: {
            series: {
              stroke: theme.colors.primary,
              interpolation: { type: "smooth" },
              marker: {
                enabled: true,
                itemStyler: (params) => {
                  const { datum, yKey } = params;
                  return {
                    fill: getColor(datum[yKey]),
                    size: 10,
                  };
                },
              },
              tooltip: {
                renderer: SubmissionsTooltipRenderer(theme.colors),
              },
            },
          },
        },
      },
      {
        id: "chart4",
        cellRange: {
          columns: ["monthYear", "happinessScore"],
        },
        chartType: "line",
        aggFunc: "avg",
        chartThemeOverrides: {
          common: {
            background: {
              fill: theme.colors.elementBG,
            },
            padding: { top: 20, left: 20, right: 20, bottom: 20 },
            axes: {
              category: {
                label: {
                  rotation: 300,
                  fontSize: 10,
                  fontFamily: "Metropolis",
                  color: theme.colors.primaryTextColor,
                },
                gridLine: { width: 0 },
              },
              number: {
                position: "left",
                label: {
                  color: theme.colors.primaryTextColor,
                },
                crosshair: {
                  enabled: true,
                  label: { enabled: true },
                },
              },
            },
            legend: { enabled: false },
            zoom: { enabled: false },
            navigator: { enabled: false },
            overlays: {
              noData: { text: "NO DATA" },
              loading: { text: "Loading..." },
            },
          },
          line: {
            series: {
              stroke: theme.colors.primary,
              interpolation: { type: "smooth" },
              marker: {
                enabled: true,
                itemStyler: (params) => {
                  const { datum, yKey } = params;
                  return {
                    fill: getColor(datum[yKey]),
                    size: 10,
                  };
                },
              },
              tooltip: {
                renderer: SubmissionsTooltipRenderer(theme.colors),
              },
            },
          },
        },
      },
    ];

    chartConfigs.forEach((config) => {
      const container = document.getElementById(config.id) as HTMLElement;
      if (container) {
        const chartRef = gridApi.createRangeChart({
          ...config,
          chartContainer: container,
          suppressChartRanges: true,
        });
        chartRefs.current.push(chartRef as ChartRef);
      }
    });
  }, [gridApi, gridData, theme, getColor]);

  const handleGridReady = (params: FirstDataRenderedEvent) => {
    setGridApi(params.api);
  };

  const onFilterChange = (postBody: Record<string, any>) => {
    setFilterOptions(postBody);
    getData(postBody);
  };

  useEffect(() => {
    if (!toolId || !workflowId || !user?.customerId) return;

    const dateRangeOption = "weekly";
    const defaultDateFilterOption = "currentWeek";
    const weeklyOption = dateRangeOptions[dateRangeOption].find(
      (opt) => opt.value === defaultDateFilterOption
    );

    if (weeklyOption) {
      const [startDate, endDate] = weeklyOption.getRange();
      getData({ startDate, endDate });
    } else {
      getData();
    }
  }, [toolId, workflowId, user]);

  return (
    <>
      <FilterSidebar
        onApplyFilters={onFilterChange}
        filterOptions={{
          showDateFilter: true,
          showSitesFilter: false,
          showDepartmentsFilter: false,
        }}
        dateFilterMode="weekly"
        defaultDateFilter="currentWeek"
      />

      <Modal
        isOpen={isBarModalOpen}
        onClose={() => setIsBarModalOpen(false)}
        size="5xl"
      >
        <ModalOverlay />
        <ModalContent bgGradient={theme.gradients.modalBGGradient}>
          <ModalHeader color="white">{barModalTitle}</ModalHeader>
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
                  data={gridData}
                  initialFields={modalColDef}
                  showTopBar={false}
                  defaultColDef={modalDefaultColDef}
                  filterModel={filterModel}
                />
              </Box>
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>

      <VStack align="stretch" spacing={6} w="full" py={2}>
        <Flex w="100%" gap={6} flexWrap="wrap" pb={4}>
          <DataGridComponentLight
            data={gridData}
            loading={loading}
            initialFields={columnDefs}
            showTopBar={false}
            defaultColDef={defaultColDef}
            onGridReady={handleGridReady}
            refreshData={getData}
            enableAutoRefresh={true}
            title="Score and Comments"
          />

          {gridData.length > 0 && (
            <Flex
              width="100%"
              flexWrap="wrap"
              gap={6}
              justify="space-between"
              flex={1}
            >
              <Box
                minW={["100%", "100%", "48%"]}
                flex={1}
                textAlign="center"
                borderRadius="lg"
              >
                <Flex
                  width="100%"
                  justifyContent="center"
                  align="center"
                  mb={4}
                >
                  <SectionHeader>Happiness by Department</SectionHeader>
                </Flex>

                <PerygonCard
                  id="chart1"
                  height="400px"
                  w="full"
                  borderRadius="2xl"
                  overflow="hidden"
                >
                  {" "}
                </PerygonCard>
              </Box>

              <Box
                minW={["100%", "100%", "48%"]}
                flex={1}
                textAlign="center"
                borderRadius="lg"
              >
                <Flex
                  width="100%"
                  justifyContent="center"
                  align="center"
                  mb={4}
                >
                  <SectionHeader>Happiness by Office</SectionHeader>
                </Flex>
                <PerygonCard
                  id="chart2"
                  height="400px"
                  w="full"
                  borderRadius="2xl"
                  overflow="hidden"
                >
                  {" "}
                </PerygonCard>
              </Box>

              <Box
                minW={["100%", "100%", "100%"]}
                flex={1}
                textAlign="center"
                borderRadius="lg"
              >
                <Flex
                  width="100%"
                  justifyContent="center"
                  align="center"
                  mb={4}
                >
                  <SectionHeader>Historic Weekly Average</SectionHeader>
                </Flex>
                <PerygonCard
                  id="chart3"
                  height="400px"
                  w="full"
                  borderRadius="2xl"
                  overflow="hidden"
                >
                  {" "}
                </PerygonCard>
              </Box>

              <Box
                minW={["100%", "100%", "100%"]}
                flex={1}
                textAlign="center"
                borderRadius="lg"
              >
                <Flex
                  width="100%"
                  justifyContent="center"
                  align="center"
                  mb={4}
                >
                  <SectionHeader>Historic Monthly Average</SectionHeader>
                </Flex>
                <PerygonCard
                  id="chart4"
                  height="400px"
                  w="full"
                  borderRadius="2xl"
                  overflow="hidden"
                >
                  {" "}
                </PerygonCard>
              </Box>
            </Flex>
          )}
        </Flex>
      </VStack>
    </>
  );
};

export default ScoresCommentsDashboard;
