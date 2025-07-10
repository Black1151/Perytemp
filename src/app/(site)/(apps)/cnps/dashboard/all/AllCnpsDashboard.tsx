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

interface cnpsMainDashboardResponse {
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

const AllCnpsDashboard = () => {
  const [filterOptions, setFilterOptions] = useState<Record<string, any>>({});
  const theme = useTheme();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { fetchClient } = useFetchClient();
  const { getColor } = useColor();
  const user = useUser();

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
      const response = await fetchClient<cnpsMainDashboardResponse>(
        "/api/enps/dashboards/company-enps",
        {
          method: "POST",
          body: postBody,
          redirectOnError: false,
        }
      );

      if (response && response.resource) {
        // setGaugeData(safeJsonParse(response.resource.gauge));
        // setHistogramData(safeJsonParse(response.resource.histogram));
        // setLineChartData(safeJsonParse(response.resource.monthlyLineChart));
        // setPieChartData(safeJsonParse(response.resource.pieChart));
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
      {/* <FilterSidebar
        onApplyFilters={onFilterChange}
        filterOptions={{
          showDepartmentsFilter: false,
          showSitesFilter: false,
          showDateFilter: true,
        }}
        dateFilterMode={dateRangeOption}
        defaultDateFilter={defaultDateFilterOption}
      /> */}

      <VStack align="stretch" spacing={6} w="full" py={4}>
        <Flex w="100%" gap={6} flexWrap="wrap" align="flex-start">
          <Text color="white">cNPS Coming Soon! 🕑</Text>
        </Flex>
      </VStack>
    </>
  );
};

export default AllCnpsDashboard;
