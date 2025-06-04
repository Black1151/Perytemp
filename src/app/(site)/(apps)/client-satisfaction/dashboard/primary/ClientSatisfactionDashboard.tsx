"use client";
import React, { useState, useEffect } from "react";
import AgChartComponent from "@/components/agCharts/AgChartComponent";
import AgGaugeComponent from "@/components/agCharts/AgGaugeComponent";
import { Flex, VStack, Box, Text } from "@chakra-ui/react";
import { useTheme } from "@chakra-ui/react";
import { dateRangeOptions } from "@/components/Sidebars/Dashboards Filter/dateRangeUtils";
import { ScoreTooltipRenderer } from "@/components/agCharts/tooltips/ScoreTooltipRenderer";
import { staffCommentsColumnDefs } from "./StaffGridColumnDefs";
import { serviceCommentsColumnDefs } from "./ServiceGridColumnDefs";
import { AgRadialGaugeOptions } from "ag-charts-community";
import { GridApi, FirstDataRenderedEvent } from "ag-grid-charts-enterprise";
import DataGridComponentLight from "@/components/agGrids/DataGrid/DataGridComponentLight";
import PerygonCard from "@/components/layout/PerygonCard";
import { format } from "date-fns";
import {
  clientSatisfactionDashboardResponse,
  kpiData,
  staffRating,
  staffComment,
  serviceComment,
  npsData,
  companyComment,
} from "./types";
import { useFetchClient } from "@/hooks/useFetchClient";
import { useWorkflow } from "@/providers/WorkflowProvider";
import GaugeLinkWrapper from "./GaugeLinkWrapper";
import { AgNodeClickEvent } from "ag-charts-community";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
} from "@chakra-ui/react";
import { ModalGridColumnDefs } from "./MoalGridColDefs";
import FilterSidebar from "@/components/Sidebars/Dashboards Filter/FilterSidebar";
import useColor from "@/hooks/useColor";

interface filterModel {
  monthYear: string;
  commentType: string;
}

const ClientSatisfactionDashboard = () => {
  const [filterOptions, setFilterOptions] = useState<Record<string, any>>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [kpiData, setKpiData] = useState<kpiData>();
  const [npsData, setNpsData] = useState<npsData>();
  const { getColor } = useColor();
  const [companyComments, setCompanyComments] = useState<
    companyComment[] | null
  >(null);
  const theme = useTheme();
  const [topStaff, setTopStaff] = useState<staffRating[] | null>(null);
  const [topStaffByCount, setTopStaffByCount] = useState<staffRating[] | null>(
    null
  );
  const [staffComments, setStaffComments] = useState<staffComment[] | null>(
    null
  );
  const [serviceComments, setServiceComments] = useState<
    serviceComment[] | null
  >(null);
  const [staffCommentsGridData, setStaffCommentsGridData] = useState<
    Record<string, any>[]
  >([]);
  const [serviceCommentsGridData, setServiceCommentsGridData] = useState<
    Record<string, any>[]
  >([]);
  const [modalGridData, setModalGridData] = useState<Record<string, any>[]>([]);
  const [feedbackCount, setFeedbackCount] = useState<number>(0);
  const [gridApi, setGridApi] = useState<GridApi | null>(null);
  const [filterModel, setFilterModel] = useState<filterModel>({
    monthYear: "",
    commentType: "",
  });
  const { toolId, workflowId } = useWorkflow();
  const [isBarModalOpen, setIsBarModalOpen] = useState(false);
  const [barModalTitle, setBarModalTitle] = useState("");
  const [isAllCommentsModalOpen, setIsAllCommentsModalOpen] = useState(false);
  const [allCommentsModalTitle, setAllCommentsModalTitle] = useState("");
  const [allCommentsGridData, setAllCommentsGridData] = useState<
    companyComment[]
  >([]);
  const [isUserModalOpen, setUserModalOpen] = useState(false);
  const [userModalTitle, setUserModalTitle] = useState("");

  const handleGridReady = (params: FirstDataRenderedEvent) => {
    setGridApi(params.api);
  };

  const { fetchClient } = useFetchClient();

  const getData = async (postBody: Record<string, any> = filterOptions) => {
    setIsLoading(true);

    // Format dates to "yyyy-MM-dd"
    const formattedBody = {
      ...postBody,
      startDate: postBody.startDate
        ? format(new Date(postBody.startDate), "yyyy-MM-dd")
        : undefined,
      endDate: postBody.endDate
        ? format(new Date(postBody.endDate), "yyyy-MM-dd")
        : undefined,
    };

    const requestBody = {
      toolId,
      workflowId,
      ...formattedBody,
    };

    try {
      const response = await fetchClient<clientSatisfactionDashboardResponse>(
        "/api/client-satisfaction/summary",
        {
          method: "POST",
          body: requestBody,
        }
      );

      if (response && response) {
        setKpiData(response.resource.kpi);
        setTopStaff(response.resource.topStaffByRating);
        setTopStaffByCount(response.resource.topStaffByCount);
        setNpsData({ scores: response.resource.nps });
        setCompanyComments(response.resource.companyComments);
        setStaffComments(response.resource.staffComments);
        setServiceComments(response.resource.serviceComments);
        setFeedbackCount(response.resource.kpi.feedbackCount);

        // Assign grid data using staff comments
        const staffCommentsData = response.resource.staffComments.map(
          (comment) => ({
            type: "Staff",
            staffId: comment.staffId,
            staffName: comment.staffName,
            comments: comment.comment,
            site: comment.site,
            date: comment.date,
            clientId: comment.clientId,
            clientName: comment.clientName,
            rating: comment.rating,
          })
        );

        // Assign grid data using service comments
        const serviceCommentsData = response.resource.serviceComments.map(
          (comment) => ({
            type: "Service",
            serviceId: comment.serviceId,
            serviceName: comment.serviceName,
            comments: comment.comment,
            date: comment.date,
            clientId: comment.clientId,
            clientName: comment.clientName,
            rating: comment.rating,
          })
        );

        setStaffCommentsGridData(staffCommentsData);
        setServiceCommentsGridData(serviceCommentsData);
      } else {
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const onFilterChange = (postBody: Record<string, any>) => {
    setFilterOptions(postBody);
    getData(postBody);
  };

  let kpiGuagesOptions: AgRadialGaugeOptions[] = [];

  if (kpiData && npsData && companyComments && topStaff) {
    kpiGuagesOptions = [
      {
        background: {
          fill: theme.colors.elementBG,
        },
        type: "radial-gauge",
        value: kpiData.avgStaffRating,
        scale: {
          min: 0,
          max: 10,
        },
        secondaryLabel: {
          text: "Average Staff Rating",
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
      },
      {
        background: {
          fill: theme.colors.elementBG,
        },
        type: "radial-gauge",
        value: kpiData.avgServiceRating,
        scale: {
          min: 0,
          max: 10,
        },
        secondaryLabel: {
          text: "Average Service Rating",
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
      },
      {
        background: {
          fill: theme.colors.elementBG,
        },
        type: "radial-gauge",
        value: kpiData.avgOverallRating,
        scale: {
          min: 0,
          max: 10,
        },
        secondaryLabel: {
          text: "Average Overall Rating",
          color: theme.colors.secondaryTextColor,
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
      },
      {
        background: {
          fill: theme.colors.elementBG,
        },
        type: "radial-gauge",
        value: kpiData.nps,
        scale: {
          min: -100,
          max: 100,
        },
        secondaryLabel: {
          text: "NPS Score",
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
      },
    ];
  }

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
      getData();
    }
  }, [toolId, workflowId]);

  useEffect(() => {
    if (isBarModalOpen && filterModel && companyComments) {
      setModalGridData(
        companyComments.filter((data) => {
          const commentMonth = data.date.slice(0, 7); // Extracts "YYYY-MM"
          const commentType =
            data.rating > 8
              ? "promoters"
              : data.rating > 6
                ? "passives"
                : "detractors";

          return (
            commentMonth === filterModel.monthYear &&
            commentType === filterModel.commentType
          );
        })
      );
    }
  }, [isBarModalOpen, filterModel, companyComments]);

  const handleResponsesKPIClick = () => {
    setAllCommentsModalTitle("All Client Responses - Company Comments");
    setAllCommentsGridData(companyComments || []);
    setIsAllCommentsModalOpen(true);
  };

  const handleUserModalClick = () => {
    setUserModalTitle("User X Data");
    setUserModalOpen(true);
  };

  return (
    <>
      <FilterSidebar
        onApplyFilters={onFilterChange}
        filterOptions={{
          showDateFilter: true,
          showSitesFilter: false,
          showDepartmentsFilter: false,
        }}
        dateFilterMode={dateRangeOption}
        defaultDateFilter={defaultDateFilterOption}
      />

      {isLoading ? (
        <div>Loading...</div>
      ) : !kpiData || !npsData || !companyComments ? (
        <div>Data Missing</div>
      ) : (
        <>
          {/* Bar Modal */}
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
                      data={modalGridData}
                      initialFields={ModalGridColumnDefs}
                      showTopBar={false}
                      filterModel={filterModel}
                    />
                  </Box>
                </VStack>
              </ModalBody>
            </ModalContent>
          </Modal>

          {/* All Comments Modal */}
          <Modal
            isOpen={isAllCommentsModalOpen}
            onClose={() => setIsAllCommentsModalOpen(false)}
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
                      data={allCommentsGridData}
                      initialFields={ModalGridColumnDefs}
                      showTopBar={false}
                      filterModel={filterModel}
                    />
                  </Box>
                </VStack>
              </ModalBody>
            </ModalContent>
          </Modal>

          {/* Client Modal */}
          <Modal
            isOpen={isUserModalOpen}
            onClose={() => setUserModalOpen(false)}
            size="5xl"
          >
            <ModalOverlay />
            <ModalContent bgGradient={theme.gradients.modalBGGradient}>
              <ModalHeader color="white">{userModalTitle}</ModalHeader>
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
                    User Data Here
                  </Box>
                </VStack>
              </ModalBody>
            </ModalContent>
          </Modal>

          {/* KPI Cards */}
          <VStack align="stretch" spacing={6} w="full" py={4}>
            <Flex w="100%" gap={6} direction={{ base: "column", lg: "row" }}>
              {/* Left column (Gauge) */}
              <Flex w={{ base: "100%", lg: "40%" }} gap={6} direction="column">
                <Box flex="1" height="300px">
                  <Box height={{ base: "300px", lg: "100%" }}>
                    <AgGaugeComponent
                      flex="1"
                      chartOptions={kpiGuagesOptions[3]}
                      noData={!kpiData}
                      height="100%"
                    />
                  </Box>
                </Box>
              </Flex>

              {/* Right column */}
              <Flex w={{ base: "100%", lg: "60%" }} gap={6} direction="column">
                {/* Row #1 on desktop; stack on mobile */}
                <Flex
                  w="100%"
                  gap={6}
                  direction={{ base: "column", md: "row" }}
                >
                  <Box flex="1" height="300px">
                    <AgGaugeComponent
                      flex="1"
                      chartOptions={kpiGuagesOptions[2]}
                      noData={!kpiData}
                      height="300px"
                    />
                  </Box>

                  <Box flex="1" height="300px">
                    <AgGaugeComponent
                      flex="1"
                      chartOptions={kpiGuagesOptions[0]}
                      noData={!kpiData}
                      height="300px"
                    />
                  </Box>
                </Flex>

                {/* Row #2 on desktop; stack on mobile */}
                <Flex
                  w="100%"
                  gap={6}
                  direction={{ base: "column", md: "row" }}
                >
                  <Box flex="1" height="300px">
                    <AgGaugeComponent
                      flex="1"
                      chartOptions={kpiGuagesOptions[1]}
                      noData={!kpiData}
                      height="300px"
                    />
                  </Box>

                  <Box
                    flex="1"
                    minWidth="300px"
                    height="300px"
                    onClick={handleResponsesKPIClick}
                    cursor="pointer"
                  >
                    <PerygonCard height="100%">
                      <Flex
                        align="center"
                        gap={1}
                        direction="column"
                        justifyContent="center"
                        height="100%"
                      >
                        <Text fontSize="6xl">{feedbackCount}</Text>
                        <Text fontSize="xl">Total Client Responses</Text>
                        <Text fontSize="md">
                          <i>Click to view</i>
                        </Text>
                      </Flex>
                    </PerygonCard>
                  </Box>
                </Flex>
              </Flex>
            </Flex>
          </VStack>

          {/* NPS Trend Line Chart */}
          <VStack align="stretch" spacing={6} w="full" py={4}>
            <Flex w={"100%"} gap={6} direction={"row"}>
              <AgChartComponent
                flex={"1 1 45%"}
                title={"NPS Trend Over Time"}
                chartOptions={{
                  type: "line",
                  data: npsData.scores.map((score) => ({
                    x: score.monthYear,
                    y: score.score,
                  })),
                  series: [
                    {
                      type: "line",
                      xKey: "x",
                      yKey: "y",
                      stroke: theme.colors.primary,
                      interpolation: {
                        type: "smooth",
                      },
                      tooltip: {
                        renderer: ScoreTooltipRenderer(theme.colors),
                      },
                      marker: {
                        enabled: true,
                        itemStyler: (params: any) => {
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
                      title: {
                        text: "Month",
                      },
                    },
                    {
                      type: "number",
                      position: "left",
                      title: {
                        text: "NPS Score",
                      },
                      min: 0,
                    },
                  ],
                }}
                noData={npsData.scores.length === 0}
              />
            </Flex>
          </VStack>

          {/* NPS Breakdown Bar Chart */}
          <VStack align="stretch" spacing={6} w="full" py={4}>
            <Flex w={"100%"} gap={6} flexWrap={"wrap"}>
              <AgChartComponent
                flex={"1 1 100%"}
                title={"Promoters, Passives & Detractors Over Time"}
                chartOptions={{
                  type: "bar",
                  data: npsData.scores.map((score) => ({
                    month: score.monthYear,
                    detractors: score.detractors,
                    passives: score.passives,
                    promoters: score.promoters,
                  })),
                  series: [
                    {
                      type: "bar",
                      stacked: true,
                      xKey: "month",
                      yKey: "detractors",
                      yName: "Detractors",
                      fill: "red",
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
                      stacked: true,
                      xKey: "month",
                      yKey: "passives",
                      yName: "Passives",
                      fill: theme.colors.yellow,
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
                      stacked: true,
                      xKey: "month",
                      yKey: "promoters",
                      yName: "Promoters",
                      fill: theme.colors.seduloGreen,
                      shadow: {
                        enabled: true,
                        color: "#191919",
                        xOffset: 1,
                        yOffset: 1,
                        blur: 4,
                      },
                    },
                  ],
                  listeners: {
                    seriesNodeClick: (params: AgNodeClickEvent<any, any>) => {
                      const { xKey, yKey, datum } = params;

                      if (datum && xKey && yKey) {
                        // Extract month (x-axis value)
                        const xValue =
                          typeof datum[xKey] === "object"
                            ? datum[xKey]?.value
                            : datum[xKey];

                        // Convert to lowercase label for title
                        const label =
                          yKey.charAt(0).toUpperCase() + yKey.slice(1);

                        // Determine rating range based on the clicked series
                        let ratingFilter: (rating: number) => boolean = () =>
                          true;

                        if (yKey === "promoters") {
                          ratingFilter = (r) => r >= 9 && r <= 10;
                        } else if (yKey === "passives") {
                          ratingFilter = (r) => r >= 7 && r <= 8;
                        } else if (yKey === "detractors") {
                          ratingFilter = (r) => r >= 0 && r <= 6;
                        }

                        // Filter companyComments based on month and rating
                        const filteredData = companyComments.filter(
                          (comment) => {
                            const matchesRating = ratingFilter(comment.rating);

                            // Extract month from date string (assuming format like "2025-04-10")
                            const commentMonth = new Date(
                              comment.date
                            ).toLocaleString("default", {
                              month: "short",
                              year: "numeric",
                            });

                            const matchesMonth = commentMonth === xValue;

                            return matchesRating && matchesMonth;
                          }
                        );

                        // Update modal state
                        setBarModalTitle(`${xValue} - ${label}`);
                        setFilterModel({
                          monthYear: xValue,
                          commentType: yKey,
                        });

                        // Build modalGridData with full row info
                        const finalModalGridRows = filteredData.map(
                          (comment) => ({
                            clientName: comment.clientName,
                            rating: comment.rating,
                            comment: comment.comment,
                          })
                        );

                        setModalGridData(finalModalGridRows);
                        setIsBarModalOpen(true);
                      }
                    },
                  },

                  axes: [
                    {
                      type: "category",
                      position: "bottom",
                      title: {
                        text: "Month",
                        fontSize: 12,
                        fontWeight: 500,
                      },
                    },
                    {
                      type: "number",
                      position: "left",
                      title: {
                        text: "Responses",
                        fontSize: 12,
                        fontWeight: 500,
                      },
                    },
                  ],
                }}
                noData={npsData.scores.length === 0}
              />
            </Flex>
          </VStack>

          {/* Staff Ratings and Feedback Breakdown Bar Charts */}
          <VStack align="stretch" spacing={6} w="full" py={4}>
            <Flex w="100%" gap={6} flexWrap="wrap">
              {/* Combine topStaff and bottomStaff */}
              {topStaff && topStaffByCount && (
                <>
                  <Flex
                    direction={{ base: "column", md: "row" }}
                    gap={6}
                    w="100%"
                  >
                    {/* Top 5 Staff Ratings */}
                    <AgChartComponent
                      flex="1"
                      title="Top 5 Average Staff Ratings"
                      chartOptions={{
                        type: "bar",
                        data: topStaff.map((staff) => ({
                          name: staff.staffName,
                          rating: staff.avgRating,
                        })),
                        series: [
                          {
                            type: "bar",
                            xKey: "name",
                            yKey: "rating",
                            yName: "Average Rating",
                            fill: theme.colors.seduloGreen,
                            cornerRadius: 10,
                            shadow: {
                              enabled: true,
                              color: "#191919",
                              xOffset: 1,
                              yOffset: 1,
                              blur: 4,
                            },
                            tooltip: {
                              renderer: ({
                                datum,
                              }: {
                                datum: { name: string; rating: number };
                              }) => ({
                                content: `${datum.name}: ${datum.rating.toFixed(2)}`,
                              }),
                            },
                          },
                        ],
                        axes: [
                          {
                            type: "category",
                            position: "bottom",
                            title: {
                              text: "Staff Member",
                              fontSize: 12,
                              fontWeight: 500,
                            },
                            label: {
                              rotation: -30,
                            },
                          },
                          {
                            type: "number",
                            position: "left",
                            title: {
                              text: "Average Rating",
                              fontSize: 12,
                              fontWeight: 500,
                            },
                            min: 0,
                            max: 10,
                          },
                        ],
                      }}
                      noData={!topStaff || topStaff.length === 0}
                    />

                    {/* Top 5 Feedback Breakdown */}
                    <AgChartComponent
                      flex="1"
                      title="Top 5 Staff By Count"
                      chartOptions={{
                        type: "bar",
                        data: topStaffByCount.map((staff) => ({
                          name: staff.staffName,
                          positive: staff.positiveCount,
                          neutral: staff.neutralCount,
                          negative: staff.negativeCount,
                        })),
                        series: [
                          {
                            type: "bar",
                            xKey: "name",
                            yKey: "positive",
                            yName: "Positive",
                            stacked: true,
                            fill: theme.colors.seduloGreen,
                            cornerRadius: 10,
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
                            yKey: "neutral",
                            yName: "Neutral",
                            stacked: true,
                            fill: theme.colors.yellow,
                            cornerRadius: 10,
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
                            yKey: "negative",
                            yName: "Negative",
                            stacked: true,
                            fill: "#f44336",
                            cornerRadius: 10,
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
                            title: {
                              text: "Staff Member",
                              fontSize: 12,
                              fontWeight: 500,
                            },
                            label: {
                              rotation: -30,
                            },
                          },
                          {
                            type: "number",
                            position: "left",
                            title: {
                              text: "Feedback Count",
                              fontSize: 12,
                              fontWeight: 500,
                            },
                          },
                        ],
                      }}
                      noData={!topStaff || topStaff.length === 0}
                    />
                  </Flex>
                </>
              )}
            </Flex>
          </VStack>

          {/* Staff and Service Comments Grids */}
          <VStack align="stretch" spacing={6} w="full" py={4}>
            <DataGridComponentLight
              data={staffCommentsGridData}
              loading={isLoading}
              initialFields={staffCommentsColumnDefs}
              showTopBar={false}
              onGridReady={handleGridReady}
              refreshData={getData}
              enableAutoRefresh={true}
              title="Staff Comments"
              groupDisplayType="groupRows"
            />

            <DataGridComponentLight
              data={serviceCommentsGridData}
              loading={isLoading}
              initialFields={serviceCommentsColumnDefs}
              showTopBar={false}
              onGridReady={handleGridReady}
              refreshData={getData}
              enableAutoRefresh={true}
              title="Service Comments"
              groupDisplayType="groupRows"
            />
          </VStack>
        </>
      )}
    </>
  );
};

export default ClientSatisfactionDashboard;
