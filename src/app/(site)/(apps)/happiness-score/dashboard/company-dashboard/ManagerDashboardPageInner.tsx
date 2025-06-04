"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Box,
  Flex,
  Grid,
  GridItem,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Spinner,
  useTheme,
  VStack,
  Avatar,
  useBreakpointValue,
  HStack,
  Text,
} from "@chakra-ui/react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import "ag-grid-charts-enterprise";

import LineGraph from "@/components/graphs/LineGraph";
import { HappinessScoreMasonry } from "../../HappinessScoreMasonry";
import SpeechBubble from "../../SpeechBubble";
import { SectionHeader } from "@/components/sectionHeader/SectionHeader";
import { SpringScale } from "@/components/animations/SpringScale";
import StaffHappinessDetailModal from "./StaffHappinessDetailModal";
import { ColDef } from "ag-grid-community";
import { NoDataOverlayPink } from "@/components/agGrids/DataGrid/DataGridComponentLight";
import PerygonCard from "@/components/layout/PerygonCard";
import { AgBarChart } from "@/components/graphs/AgBarChart";
import DataGridComponentLight from "@/components/agGrids/DataGrid/DataGridComponentLight";
import {
  DataPoint,
  DepartmentBarGraphData,
  Person,
  SiteBarGraphData,
  SpeechBubbleData,
} from "./types";
import { useFetchClient } from "@/hooks/useFetchClient";
import StaffHappinessDetailsRenderer from "@/components/agGrids/CellRenderers/HappinessScore/StaffHappinessDetailsRenderer";

interface ManagerDashboardPageInnerProps {
  loading: boolean;
  speechBubbleData: SpeechBubbleData | null;
  lineGraphData: DataPoint[];
  masonryData: number[];
  peopleListData: Person[];
  departmentsData: DepartmentBarGraphData[];
  sitesData: SiteBarGraphData[];
  fetchHappinessScoreTwoMonthHistory: (userId: number) => void;
  isModalOpen: boolean;
  setIsModalOpen: (isOpen: boolean) => void;
  staffHappinessDetailsModalData: any;
  drawerState: "closed" | "fully-open";
}

interface HappinessResponse {
  success: boolean;
  data: DataPoint[];
}

export default function ManagerDashboardInner({
  loading,
  speechBubbleData,
  lineGraphData,
  masonryData,
  peopleListData,
  departmentsData,
  sitesData,
  fetchHappinessScoreTwoMonthHistory,
  isModalOpen,
  setIsModalOpen,
  staffHappinessDetailsModalData,
}: ManagerDashboardPageInnerProps) {
  const theme = useTheme();

  const hideJobTitle = useBreakpointValue({ base: true, sm: false });
  const hideSite = useBreakpointValue({ base: true, lg: false });
  const hideDepartment = useBreakpointValue({ base: true, lg: false });

  const { fetchClient } = useFetchClient();

  const [barModalLineGraphData, setBarModalLineGraphData] = useState<
    DataPoint[]
  >([]);

  const [barModalData, setBarModalData] = useState<Person[]>([]);
  const [isBarModalOpen, setIsBarModalOpen] = useState(false);
  const [barModalTitle, setBarModalTitle] = useState("");

  const [barModalAverageScore, setBarModalAverageScore] = useState<
    number | null
  >(null);
  const [barModalCount, setBarModalCount] = useState<number | null>(null);

  const fetchSiteHistory = useCallback(
    async (siteId: number) => {
      const response = await fetchClient<HappinessResponse>(
        `/api/happiness-score/dashboards/historic-line-graph?siteId=${siteId}`,
        {
          method: "GET",
          // successMessage: "Site data fetched successfully!",
          errorMessage: "Could not retrieve site data.",
          redirectOnError: false,
        }
      );
      setBarModalLineGraphData(response?.data ?? []);
      return response;
    },
    [fetchClient]
  );

  const fetchDeptHistory = useCallback(
    async (deptId: number) => {
      const response = await fetchClient<HappinessResponse>(
        `/api/happiness-score/dashboards/historic-line-graph?deptId=${deptId}`,
        {
          method: "GET",
          errorMessage: "Could not retrieve department data.",
          redirectOnError: false,
        }
      );
      setBarModalLineGraphData((response?.data as DataPoint[]) ?? []);
      return response;
    },
    [fetchClient]
  );

  const handleUserClick = useCallback(
    (userId: number) => {
      fetchHappinessScoreTwoMonthHistory(userId);
      setIsBarModalOpen(false);
    },
    [fetchHappinessScoreTwoMonthHistory]
  );

  const departmentBarData = useMemo(
    () =>
      departmentsData.map((dept) => ({
        title: dept.department,
        value: dept.averageScore,
        count: dept.count,
        deptId: dept.deptId,
      })),
    [departmentsData]
  );

  const siteBarData = useMemo(
    () =>
      sitesData.map((site) => ({
        title: site.site,
        siteId: site.siteId,
        value: site.averageScore,
        count: site.count,
      })),
    [sitesData]
  );

  const handleDepartmentBarClick = useCallback(
    async (title: string) => {
      const dataPoint = departmentBarData.find((d) => d.title === title);
      const filteredPeople = peopleListData.filter(
        (person) => person.department === title && person.score !== null
      );

      setBarModalTitle(`Department: ${title}`);
      setBarModalData(filteredPeople);
      setBarModalAverageScore(dataPoint?.value ?? null);
      setBarModalCount(dataPoint?.count ?? null);

      if (dataPoint?.deptId) {
        await fetchDeptHistory(dataPoint.deptId);
        setIsBarModalOpen(true);
      }
    },
    [peopleListData, departmentBarData, fetchDeptHistory]
  );

  const handleSiteBarClick = useCallback(
    async (title: string) => {
      const dataPoint = siteBarData.find((d) => d.title === title);
      const filteredPeople = peopleListData.filter(
        (person) => person.site === title && person.score !== null
      );

      setBarModalTitle(`Site: ${title}`);
      setBarModalData(filteredPeople);
      setBarModalAverageScore(dataPoint?.value ?? null);
      setBarModalCount(dataPoint?.count ?? null);

      if (dataPoint?.siteId) {
        await fetchSiteHistory(dataPoint.siteId);
        setIsBarModalOpen(true);
      }
    },
    [peopleListData, siteBarData, fetchSiteHistory]
  );

  const handleMasonryClick = useCallback(
    (category: string) => {
      if (category === "Did not participate") {
        const nonParticipants = peopleListData.filter(
          (person) => person.score === null || person.score === undefined
        );
        setBarModalTitle("Did Not Participate");
        setBarModalData(nonParticipants);
        setBarModalAverageScore(null);
        setBarModalCount(null);
        setBarModalLineGraphData([]);
        setIsBarModalOpen(true);
        return;
      }

      let minScore = 0;
      let maxScore = 0;
      if (category === "1-2") {
        minScore = 1;
        maxScore = 2;
      } else if (category === "3-5") {
        minScore = 3;
        maxScore = 5;
      } else if (category === "6-8") {
        minScore = 6;
        maxScore = 8;
      } else if (category === "9-10") {
        minScore = 9;
        maxScore = 10;
      } else {
        return;
      }

      const filteredPeople = peopleListData.filter(
        (person) =>
          person.score !== null &&
          person.score >= minScore &&
          person.score <= maxScore
      );

      setBarModalTitle(`Score Range: ${category}`);
      setBarModalData(filteredPeople);
      setBarModalAverageScore(null);
      setBarModalCount(null);
      setBarModalLineGraphData([]);
      setIsBarModalOpen(true);
    },
    [peopleListData]
  );

  const columnDefs = useMemo<ColDef<Person>[]>(() => {
    return [
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
        headerName: "Score",
        field: "score",
        sortable: true,
        filter: true,
        flex: 1,
        valueFormatter: (params) => {
          return params.value === null ? "N/A" : `${params.value}`;
        },
        cellStyle: { color: "black" },
      },
      {
        headerName: "Job Title",
        field: "jobTitle",
        sortable: true,
        filter: true,
        flex: 1,
        hide: hideJobTitle,
        cellStyle: { color: "black" },
      },
      {
        headerName: "Department",
        field: "department",
        sortable: true,
        filter: true,
        flex: 1,
        hide: hideDepartment,
        cellStyle: { color: "black" },
      },
      {
        headerName: "Site",
        field: "site",
        sortable: true,
        filter: true,
        flex: 1,
        hide: hideSite,
        cellStyle: { color: "black" },
      },
    ];
  }, [hideJobTitle, hideSite, hideDepartment, handleUserClick]);

  const defaultColDef = useMemo(() => {
    return {
      flex: 1,
      minWidth: 100,
      resizable: true,
    };
  }, []);

  const submittedPeopleListData = useMemo(() => {
    return peopleListData.filter(
      (person) => person.score !== null && person.score !== undefined
    );
  }, [peopleListData]);

  return (
    <>
      {loading ? (
        <Flex justifyContent="center" alignItems="center">
          <Spinner size="xl" color="primary" />
        </Flex>
      ) : (
        <Box pb={[8, 0]}>
          {staffHappinessDetailsModalData && (
            <StaffHappinessDetailModal
              isOpen={isModalOpen}
              onClose={() => setIsModalOpen(false)}
              {...staffHappinessDetailsModalData}
            />
          )}

          <Modal
            isOpen={isBarModalOpen}
            onClose={() => setIsBarModalOpen(false)}
            size="5xl"
            autoFocus={false}
            trapFocus={false}
            returnFocusOnClose={false}
          >
            <ModalOverlay />
            <ModalContent bgGradient={theme.gradients.modalBGGradient}>
              <ModalHeader color="white">{barModalTitle}</ModalHeader>
              <ModalCloseButton color="white" />
              <ModalBody pb={10}>
                {(barModalAverageScore !== null || barModalCount !== null) && (
                  <Grid
                    templateColumns={["1fr", null, "1fr 2fr"]}
                    gap={6}
                    mb={6}
                    color="white"
                    alignItems="center"
                  >
                    <VStack>
                      <SpeechBubble
                        score={barModalAverageScore ?? 0}
                        change={0}
                        positiveChange={false}
                      />
                      {barModalCount !== null && (
                        <Text fontWeight="semibold">
                          Count: {barModalCount}
                        </Text>
                      )}
                    </VStack>

                    <LineGraph
                      graphHeight={150}
                      DataPoints={barModalLineGraphData}
                    />
                  </Grid>
                )}

                <VStack minHeight={520} mt={6}>
                  <Box className="ag-theme-alpine" w="100%">
                    <DataGridComponentLight
                      data={barModalData}
                      initialFields={columnDefs}
                      defaultColDef={defaultColDef}
                      showTopBar={false}
                    />
                  </Box>
                </VStack>
              </ModalBody>
            </ModalContent>
          </Modal>

          <Grid
            templateColumns={["1fr", null, null, "1fr 1fr 1fr 1fr 1fr 1fr"]}
            gap={[8, 6]}
            mt={6}
          >
            <GridItem colSpan={[1, null, null, 3]}>
              <SpringScale>
                <Flex maxWidth={600} flexDirection="column">
                  <Flex width="100%" justifyContent="center" mb={4}>
                    <SectionHeader>This Week&apos;s Average</SectionHeader>
                  </Flex>
                  <SpeechBubble
                    score={speechBubbleData?.currentScore || 0}
                    change={speechBubbleData?.change || 0}
                    positiveChange={speechBubbleData?.positiveChange || false}
                  />
                </Flex>
              </SpringScale>
            </GridItem>

            <GridItem colSpan={[1, null, null, 3]}>
              <SpringScale>
                <Flex width="100%" justifyContent="center" mb={4}>
                  <SectionHeader>Trend</SectionHeader>
                </Flex>
                {lineGraphData.length > 1 ? (
                  <LineGraph DataPoints={lineGraphData} />
                ) : (
                  <PerygonCard width="100%" height={400}>
                    <NoDataOverlayPink />
                  </PerygonCard>
                )}
              </SpringScale>
            </GridItem>

            <GridItem colSpan={[1, null, null, 2]}>
              <Flex width="100%" justifyContent="center" mb={4}>
                <SectionHeader>Breakdown</SectionHeader>
              </Flex>
              <HappinessScoreMasonry
                masonryValues={masonryData}
                onStatClick={handleMasonryClick}
              />
            </GridItem>

            <GridItem colSpan={[1, null, null, 4]}>
              <VStack minH="100%">
                <Flex width="100%" justifyContent="center" mb={2}>
                  <SectionHeader>Submissions</SectionHeader>
                </Flex>
                <Box
                  className="ag-theme-alpine"
                  w="100%"
                  pb={1}
                  borderRadius="xl"
                >
                  <DataGridComponentLight
                    data={submittedPeopleListData}
                    initialFields={columnDefs}
                    defaultColDef={defaultColDef}
                    showTopBar={false}
                  />
                </Box>
              </VStack>
            </GridItem>

            <GridItem colSpan={[1, null, null, 3]}>
              {departmentBarData && (
                <VStack height="100%">
                  <Flex width="100%" justifyContent="center" mb={4}>
                    <SectionHeader>Department Comparison</SectionHeader>
                  </Flex>
                  <AgBarChart
                    data={departmentBarData}
                    onBarClick={handleDepartmentBarClick}
                  />
                </VStack>
              )}
            </GridItem>

            <GridItem colSpan={[1, null, null, 3]}>
              <VStack>
                <Flex width="100%" justifyContent="center" mb={4}>
                  <SectionHeader>Site Comparison</SectionHeader>
                </Flex>
                <AgBarChart
                  data={siteBarData}
                  onBarClick={handleSiteBarClick}
                />
              </VStack>
            </GridItem>
          </Grid>
        </Box>
      )}
    </>
  );
}
