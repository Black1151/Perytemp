// AllEnpsDashboard.tsx

"use client";

import React, { useState, useEffect } from "react";
import AgChartComponent from "@/components/agCharts/AgChartComponent";
import AgGaugeComponent from "@/components/agCharts/AgGaugeComponent";
import FilterSidebar from "@/components/Sidebars/Dashboards Filter/FilterSidebar";
import {
  Flex,
  VStack,
  useTheme,
  Box,
  Tooltip,
  IconButton,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  Heading,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { Info } from "@mui/icons-material";
import {
  AgChartOptions,
  AgRadialGaugeOptions,
  AgPolarChartOptions,
  AgPieSeriesOptions,
} from "ag-charts-types";
import { useFetchClient } from "@/hooks/useFetchClient";
import useColor from "@/hooks/useColor";
import { dateRangeOptions } from "@/components/Sidebars/Dashboards Filter/dateRangeUtils";
import { ScoreTooltipRenderer } from "@/components/agCharts/tooltips/ScoreTooltipRenderer";
import { SubmissionsTooltipRenderer } from "@/components/agCharts/tooltips/SubmissionsTooltipRenderer";
import { PieChartTooltipRenderer } from "@/components/agCharts/tooltips/PieChartTooltipRenderer";
import { useUser } from "@/providers/UserProvider";

interface enpsMainDashboardResponse {
  resource: {
    gauge: GaugeData;
    histogram: HistogramRecord[];
    monthlyLineChart: LineDataRecord[];
    pieChart: PieChartDataRecord[];
  };
}

interface GaugeData {
  minScore: number;
  maxScore: number;
  value: number;
  count?: number;
}

interface HistogramRecord {
  value: number;
  count: number;
}

interface LineDataRecord {
  monthYear: string;
  value: number;
}

interface PieChartDataRecord {
  category: string;
  value: number;
}

const AllEnpsDashboard = () => {
  const [filterOptions, setFilterOptions] = useState<Record<string, any>>({});
  const theme = useTheme();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { fetchClient } = useFetchClient();
  const { getColor } = useColor();
  const user = useUser();
  const isFree = user?.user?.customerIsFree ?? false;

  const [gaugeData, setGaugeData] = useState<GaugeData>({
    minScore: -100,
    maxScore: 100,
    value: 0,
    count: undefined,
  });
  const [histogramData, setHistogramData] = useState<HistogramRecord[]>([]);
  const [lineChartData, setLineChartData] = useState<LineDataRecord[]>([]);
  const [pieChartData, setPieChartData] = useState<PieChartDataRecord[]>();

  // Modal state
  const { isOpen, onOpen, onClose } = useDisclosure();

  const gaugeOptions: AgRadialGaugeOptions = {
    background: {
      fill: theme.colors.elementBG,
    },
    type: "radial-gauge",
    value: gaugeData.value,
    scale: {
      min: gaugeData.minScore,
      max: gaugeData.maxScore,
    },
    secondaryLabel: {
      text: "eNPS Score",
    },
    cornerMode: "item",
    cornerRadius: 99,
    startAngle: 225,
    endAngle: 495,
    bar: {
      fills: [
        { color: "red", stop: -100 },
        { color: theme.colors.yellow, stop: 0 },
        { color: theme.colors.seduloGreen, stop: 100 },
      ],
      fillMode: "continuous",
    },
    segmentation: {
      enabled: true,
      interval: {
        count: 3,
      },
      spacing: 4,
    },
  };

  const histogramOptions: AgChartOptions = {
    background: {
      fill: theme.colors.elementBG,
    },
    series: [
      {
        type: "bar",
        xKey: "value",
        yKey: "count",
        yName: "Count of Scores",
        cornerRadius: 10,
        shadow: {
          enabled: true,
          color: "#191919",
          xOffset: 1,
          yOffset: 1,
          blur: 4,
        },
        itemStyler: (params) => {
          const { datum, xKey } = params;
          const score = datum[xKey];
          let color = "";
          if (score < 7) {
            color = "red";
          } else if (score < 9) {
            color = theme.colors.yellow;
          } else {
            color = theme.colors.seduloGreen;
          }
          return {
            fill: color,
          };
        },
        tooltip: {
          renderer: SubmissionsTooltipRenderer(theme.colors),
        },
      },
    ],
    axes: [
      {
        type: "category",
        position: "bottom",
        label: {
          fontSize: 12,
          color: theme.colors.primary,
        },
        gridLine: {
          width: 0,
        },
      },
      {
        type: "number",
        position: "left",
        label: {
          fontSize: 12,
          color: theme.colors.primary,
        },
      },
    ],
    data: histogramData,
  };

  const lineChartOptions: AgChartOptions = {
    background: {
      fill: theme.colors.elementBG,
    },
    data: lineChartData,
    series: [
      {
        type: "line",
        yKey: "value",
        xKey: "monthYear",
        stroke: theme.colors.primary,
        interpolation: {
          type: "smooth",
        },
        tooltip: {
          renderer: ScoreTooltipRenderer(theme.colors),
        },
        marker: {
          enabled: true,
          itemStyler: (params) => {
            const { datum, yKey } = params;
            const score = datum[yKey];
            const fillColor = getColor(score);
            return {
              fill: fillColor,
              size: 10,
            };
          },
        },
      },
    ],
    axes: [
      {
        type: "category",
        position: "bottom",
        label: {
          rotation: 300,
          fontSize: 12,
          color: theme.colors.primary,
        },
        gridLine: {
          width: 0,
        },
      },
      {
        type: "number",
        position: "left",
        min: -100,
        max: 100,
        title: {
          text: "eNPS Score",
          fontSize: 12,
          color: theme.colors.primary,
        },
        label: {
          fontSize: 12,
          color: theme.colors.primary,
        },
      },
    ],
    padding: { top: 20, left: 20, right: 20, bottom: 50 },
    legend: { enabled: false },
    zoom: { enabled: false },
    navigator: { enabled: false },
  };

  const pieChartSeries: AgPieSeriesOptions<any> = {
    type: "pie",
    angleKey: "value",
    calloutLabelKey: "category",
    calloutLabel: {
      color: theme.colors.primary,
      fontSize: 12,
    },
    sectorLabelKey: "value",
    radiusKey: "yield",
    itemStyler: (params) => {
      const { datum } = params;
      const category = datum.category;
      let color = "";
      if (category === "Promoters") {
        color = theme.colors.seduloGreen;
      } else if (category === "Passives") {
        color = theme.colors.yellow;
      } else if (category === "Detractors") {
        color = "red";
      }
      return { fill: color };
    },
    tooltip: {
      enabled: true,
      renderer: PieChartTooltipRenderer(theme.colors),
    },
  };

  const pieChartOptions: AgPolarChartOptions = {
    background: {
      fill: theme.colors.elementBG,
    },
    data: pieChartData,
    series: [pieChartSeries],
  };

  function safeJsonParse(str: any) {
    try {
      return JSON.parse(str);
    } catch {
      return [];
    }
  }

  const getData = async (postBody: Record<string, any> = filterOptions) => {
    setIsLoading(true);
    try {
      const response = await fetchClient<enpsMainDashboardResponse>(
        "/api/enps/dashboards/company-enps",
        {
          method: "POST",
          body: postBody,
          redirectOnError: false,
        }
      );

      if (response && response.resource) {
        setGaugeData(safeJsonParse(response.resource.gauge));
        setHistogramData(safeJsonParse(response.resource.histogram));
        setLineChartData(safeJsonParse(response.resource.monthlyLineChart));
        setPieChartData(safeJsonParse(response.resource.pieChart));
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const onFilterChange = (postBody: Record<string, any>) => {
    setFilterOptions(postBody);
    getData(postBody);
  };

  const dateRangeOption = "monthly";
  const defaultDateFilterOption = "last6Months";

  useEffect(() => {
    const monthlyOption = dateRangeOptions[dateRangeOption].find(
      (opt) => opt.value === defaultDateFilterOption
    );

    if (monthlyOption) {
      const [startDate, endDate] = monthlyOption.getRange();
      getData({ startDate, endDate });
    } else {
      getData();
    }
  }, []);

  return (
    <>
      <FilterSidebar
        onApplyFilters={onFilterChange}
        filterOptions={{
          showDepartmentsFilter: false,
          showSitesFilter: false,
          showDateFilter: true,
        }}
        dateFilterMode={dateRangeOption}
        defaultDateFilter={defaultDateFilterOption}
      />

      <VStack align="stretch" spacing={6} w="full" py={4}>
        <Flex w="100%" gap={6} flexWrap="wrap" align="flex-start">
          {/* Gauge + Info Icon */}
          <Box flex="1 1 45%" position="relative">
            <AgGaugeComponent
              flex="1 1 45%"
              title="eNPS Score"
              chartOptions={gaugeOptions}
              noData={gaugeData.count === 0 || !gaugeData.count}
            />
            <Tooltip label="How to calculate eNPS" hasArrow>
              <IconButton
                aria-label="NPS Info"
                icon={<Info />}
                variant="ghost"
                color="white"
                _hover={{ color: "primary", background: "white" }}
                position="absolute"
                top="0px"
                right="0px"
                onClick={onOpen}
              />
            </Tooltip>
          </Box>

          {/* Pie Chart */}
          <AgChartComponent
            flex="1 1 45%"
            title="Category Breakdown"
            chartOptions={pieChartOptions}
            noData={pieChartData?.length === 0}
            locked={isFree}
            lockedReason="Not available on trial..."
          />

          {/* Histogram */}
          <AgChartComponent
            flex="1 1 45%"
            title="Score Spread"
            chartOptions={histogramOptions}
            noData={histogramData.length === 0}
            locked={isFree}
            lockedReason="Not available on trial..."
          />

          {/* Line Chart */}
          <AgChartComponent
            flex="1 1 45%"
            title="eNPS Trend"
            chartOptions={lineChartOptions}
            noData={lineChartData.length === 0}
            locked={isFree}
            lockedReason="Not available on trial..."
          />
        </Flex>
      </VStack>

      {/* NPS Calculation Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="xl" isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader fontFamily={"bonfire"}>How to calculate Employee Net Promoter Score (eNPS)</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack align="start" spacing={4} textAlign="left">
              <Text>
                Ask your employees: “On a scale from 0 to 10, how likely are you
                to recommend our organisation as a place to work?”
              </Text>
              <Heading as="h4" size="sm">
                Categorise the responses:
              </Heading>
              <Box pl={4}>
                <Text>• Promoters: 9–10</Text>
                <Text>• Passives: 7–8</Text>
                <Text>• Detractors: 0–6</Text>
              </Box>
              <Heading as="h4" size="sm" pt={2}>
                Calculate the percentages:
              </Heading>
              <Box pl={4}>
                <Text>
                  % Promoters = (Number of Promoters ÷ Total Responses) × 100
                </Text>
                <Text>
                  % Detractors = (Number of Detractors ÷ Total Responses) × 100
                </Text>
              </Box>
              <Heading as="h4" size="sm" pt={2}>
                Subtract:
              </Heading>
              <Box pl={4}>
                <Text>NPS = % Promoters - % Detractors</Text>
              </Box>
              <Text pt={2}>
                The final score ranges from -100 to +100. Higher is better!
              </Text>
            </VStack>
          </ModalBody>
          <ModalFooter justifyContent={"center"}>
            <Button colorScheme="primary" onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default AllEnpsDashboard;
