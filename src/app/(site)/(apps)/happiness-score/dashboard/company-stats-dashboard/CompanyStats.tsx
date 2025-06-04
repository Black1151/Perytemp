"use client";

import React, { useEffect, useState } from "react";
import {
  Box,
  Flex,
  IconButton,
  Text,
  Tooltip,
  useBreakpointValue,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import "ag-grid-charts-enterprise";
import { ColDef } from "ag-grid-community";
import DataGridComponentLight from "@/components/agGrids/DataGrid/DataGridComponentLight";
import { SectionHeader } from "@/components/sectionHeader/SectionHeader";
import { useFetchClient } from "@/hooks/useFetchClient";
import { Info } from "@mui/icons-material";
import SurveyModal from "@/components/surveyjs/layout/default/SurveyModal";
import HappinessScoreRenderer from "@/components/agGrids/CellRenderers/HappinessScoreRenderer";
import HappinessDifferenceRenderer from "@/components/agGrids/CellRenderers/HappinessDifferenceRenderer";
import HappinessHistogramRenderer from "@/components/agGrids/CellRenderers/HappinessHistogramRenderer";
import { CompanyBubble } from "@/app/(site)/(apps)/happiness-score/dashboard/company-stats-dashboard/CompanyBubble";
import { CompanyHistogram } from "@/app/(site)/(apps)/happiness-score/dashboard/company-stats-dashboard/CompanyHistogram";
import { useWorkflow } from "@/providers/WorkflowProvider";
import { useUser } from "@/providers/UserProvider";
import StaffHappinessDetailsRenderer from "@/components/agGrids/CellRenderers/HappinessScore/StaffHappinessDetailsRenderer";
import PerygonCard from "@/components/layout/PerygonCard";

interface ApiResponse {
  userResource: RowData[];
  companyResource: CompanyData;
}

interface CompanyData {
  avgHappinessScore: string;
  stddevHappinessScore: string;
  minHappinessScore: number;
  maxHappinessScore: number;
  totalEntries: number;
  lastMonthHappinessScore: string;
  currentRagStatus: string;
  scoreDistribution: ScoreDistribution[];
  companyScores: Scores[];
}

interface ScoreDistribution {
  count: number;
  score: number;
}

interface Scores {
  score: number;
  countOfScore: number;
  dayOfSubmission: string;
}

interface RowData {
  userId: number;
  fullName: string;
  deptName: string;
  teamName: string | null;
  siteName: string;
  avgHappinessScore: string;
  stddevHappinessScore: string;
  minHappinessScore: number;
  maxHappinessScore: number;
  totalEntries: number;
  lastMonthHappinessScore: string;
  currentRagStatus: string;
}

const CompanyStats: React.FC = () => {
  const [rowData, setRowData] = useState<RowData[]>([]);
  const [companyData, setCompanyData] = useState<CompanyData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [columnDefs, setColumnDefs] = useState<ColDef[]>([]);
  const isMobile = useBreakpointValue({ base: true, md: false });
  const { toolId, workflowId } = useWorkflow();
  const { user } = useUser();
  const [modalData, setModalData] = useState<{
    title: string;
    body: string | React.ReactNode;
  }>({
    title: "How to Filter",
    body: (
      <>
        <Text mb={4}>To filter the dashboard:</Text>
        <Text as="ul" ml={4}>
          <li>
            Use the filter icon on column headers to find specific entries of
            your choice.
          </li>
        </Text>
        <br />
        <Text mb={4}>
          The difference column indicates where the last months average has
          positively/negatively shifted compared to the previous 12 months
          average for an individual.
        </Text>
        <Text as="ul" ml={4}>
          <li>Purple: A lot happier</li>
          <li>Green: Normal happiness</li>
          <li>Amber: Slightly lower than their normal happiness</li>
          <li>Red: A lot lower than their normal happiness</li>
          <li>Gray: Have not submitted a score in the last month</li>
          <li>N/A: Not enough submissions</li>
        </Text>
      </>
    ),
  });

  const { fetchClient } = useFetchClient();

  useEffect(() => {
    // Fetch data only when toolId, workflowId, and user.customerId are available
    if (toolId && workflowId && user?.customerId) {
      getData();
    }
  }, [toolId, workflowId, user?.customerId]);

  const getData = async () => {
    if (!toolId || !workflowId || !user?.customerId) {
      console.warn(
        "Required data (toolId, workflowId, or customerId) is missing"
      );
      return; // Prevent fetching if values are not ready
    }

    setIsLoading(true);

    try {
      const response = await fetchClient<ApiResponse>(
        "/api/happiness-score/dashboards/company-stats",
        {
          method: "POST",
          body: {
            toolId: toolId,
            workflowId: workflowId,
            customerId: user.customerId,
          },
        }
      );

      if (response) {
        setRowData(response.userResource || []);
        setCompanyData(response.companyResource || null);
      } else {
        console.error("Invalid response:", response);
        setRowData([]);
        setCompanyData(null);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setRowData([]);
      setCompanyData(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const desktopColumnDefs: ColDef[] = [
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
        field: "minHappinessScore",
        headerName: "Min Score",
        sortable: true,
        cellRenderer: HappinessScoreRenderer,
        filter: "agNumberColumnFilter",
        cellDataType: "number",
      },
      {
        field: "maxHappinessScore",
        headerName: "Max Score",
        sortable: true,
        cellRenderer: HappinessScoreRenderer,
        filter: "agNumberColumnFilter",
        cellDataType: "number",
      },
      {
        field: "totalEntries",
        headerName: "Submissions",
        sortable: true,
        filter: "agNumberColumnFilter",
        cellDataType: "number",
        type: "rightAligned",
      },
      {
        field: "avgHappinessScore",
        headerName: "Average Happiness Score",
        sortable: true,
        cellRenderer: HappinessScoreRenderer,
        filter: "agNumberColumnFilter",
        cellDataType: "number",
      },
      {
        field: "stddevHappinessScore",
        headerName: "Std Dev",
        sortable: true,
        hide: true,
      },
      {
        field: "lastMonthHappinessScore",
        headerName: "Last Month Avg",
        sortable: true,
        cellRenderer: HappinessScoreRenderer,
        filter: "agNumberColumnFilter",
        cellDataType: "number",
      },
      {
        field: "currentRagStatus",
        headerName: "Difference",
        sortable: true,
        cellRenderer: HappinessDifferenceRenderer,
      },
      {
        field: "action",
        headerName: "Action",
        cellRenderer: HappinessHistogramRenderer,
      },
    ];

    const mobileColumnDefs: ColDef[] = [
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
        field: "minHappinessScore",
        headerName: "Min Score",
        sortable: true,
        cellRenderer: HappinessScoreRenderer,
        filter: "agNumberColumnFilter",
        cellDataType: "number",
      },
      {
        field: "maxHappinessScore",
        headerName: "Max Score",
        sortable: true,
        cellRenderer: HappinessScoreRenderer,
        filter: "agNumberColumnFilter",
        cellDataType: "number",
      },
      {
        field: "totalEntries",
        headerName: "Submissions",
        sortable: true,
        filter: "agNumberColumnFilter",
        cellDataType: "number",
        type: "rightAligned",
      },
      {
        field: "avgHappinessScore",
        headerName: "Average Happiness Score",
        sortable: true,
        cellRenderer: HappinessScoreRenderer,
        filter: "agNumberColumnFilter",
        cellDataType: "number",
      },
      {
        field: "stddevHappinessScore",
        headerName: "Std Dev",
        sortable: true,
        hide: true,
      },
      {
        field: "lastMonthHappinessScore",
        headerName: "Last Month Avg",
        sortable: true,
        cellRenderer: HappinessScoreRenderer,
        filter: "agNumberColumnFilter",
        cellDataType: "number",
      },
      {
        field: "currentRagStatus",
        headerName: "Difference",
        sortable: true,
        cellRenderer: HappinessDifferenceRenderer,
      },
      {
        field: "action",
        headerName: "Action",
        cellRenderer: HappinessHistogramRenderer,
      },
    ];

    setColumnDefs(isMobile ? mobileColumnDefs : desktopColumnDefs);
  }, [isMobile]);

  const defaultColDef: ColDef = {
    resizable: true,
    filter: true,
  };

  // Handler for the "How to Filter" modal
  const showFilterHelp = () => {
    setModalData({
      title: "How to Filter",
      body: (
        <>
          <Text mb={4}>To filter the dashboard:</Text>
          <Text as="ul" ml={4}>
            <li>
              Use the filter icon on column headers to find specific entries.
            </li>
            <li>Filtering will affect the dashboard charts below.</li>
          </Text>
          <br />
          <Text mb={4}>
            The difference column indicates how last months average compares to
            the previous 12 months for an individual.
          </Text>
          <Text as="ul" ml={4}>
            <li>Purple: A lot happier</li>
            <li>Green: Normal happiness</li>
            <li>Amber: Slightly lower than normal</li>
            <li>Red: A lot lower than normal</li>
            <li>Gray: No recent submission</li>
            <li>N/A: Not enough submissions</li>
          </Text>
        </>
      ),
    });
    onOpen();
  };

  // Handler for the "What is a Punch Card?" modal
  const showPunchCardHelp = () => {
    setModalData({
      title: "What is a Punch Card?",
      body: (
        <>
          <Text mb={4}>
            A punch card visualization shows how frequently events occur over
            time. In this context, each circle represents a specific day and the
            size of the circle corresponds to the number of happiness scores
            submitted on that day.
          </Text>
          <Text>
            This helps you quickly identify patterns: for example, heavier usage
            (larger) on certain days or dips in engagement on others.
          </Text>
        </>
      ),
    });
    onOpen();
  };

  return (
    <VStack align="stretch" w="full" spacing={6} py={2}>
      <SurveyModal
        isOpen={isOpen}
        onClose={onClose}
        onConfirm={onClose}
        showButtons={{ close: false, confirm: true }}
        title={modalData.title}
        titleProps={{
          fontFamily: "Bonfire",
          fontSize: "2xl",
          fontWeight: "bold",
          color: "primary",
        }}
        bodyContent={modalData.body}
      />
      {/* Grid Section */}
      <Box className="ag-theme-alpine" width="100%" borderRadius="lg">
        <Flex width="100%" justifyContent="center" mb={4}>
          <SectionHeader>
            Individuals Stats for previous 12 months{" "}
          </SectionHeader>
          <Tooltip label="Click to learn how to filter the dashboard" hasArrow>
            <IconButton
              aria-label="Filter Help"
              icon={<Info />}
              variant="ghost"
              onClick={showFilterHelp}
              color={"white"}
              _hover={{ color: "primary", background: "white" }}
              ml={2}
            />
          </Tooltip>
        </Flex>
        <DataGridComponentLight
          data={rowData}
          loading={isLoading}
          initialFields={columnDefs}
          showTopBar={true}
          defaultColDef={defaultColDef}
          refreshData={getData}
          enableAutoRefresh={true}
        />
      </Box>
      {rowData.length > 0 && (
        <>
          {companyData && companyData.scoreDistribution && (
            <>
              <Flex width="100%" justifyContent="center">
                <SectionHeader>Frequency of Scores</SectionHeader>
              </Flex>
              <PerygonCard>
                <CompanyHistogram
                  scoreDistribution={companyData.scoreDistribution}
                />
              </PerygonCard>
            </>
          )}
          {companyData && companyData.companyScores && (
            <>
              <Flex width="100%" justifyContent="center" align="center">
                <SectionHeader>Punch Card</SectionHeader>
                <Tooltip
                  label="Click to learn more about the Punch Card visualization"
                  hasArrow
                >
                  <IconButton
                    aria-label="Punch Card Help"
                    icon={<Info />}
                    variant="ghost"
                    onClick={showPunchCardHelp}
                    color={"white"}
                    _hover={{ color: "primary", background: "white" }}
                    ml={2}
                  />
                </Tooltip>
              </Flex>
              <PerygonCard>
                <CompanyBubble scores={companyData.companyScores} />
              </PerygonCard>
            </>
          )}
        </>
      )}
    </VStack>
  );
};

export default CompanyStats;
