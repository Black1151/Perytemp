import React, { useEffect, useState } from "react";
import {
  DateRangeMode,
  ModeValueMap,
} from "@/components/Sidebars/Dashboards Filter/dateRangeUtils";
import Sidebar from "@/components/Sidebars/Sidebar";
import {
  Box,
  Button,
  Checkbox,
  Flex,
  Text,
  useTheme,
  VStack,
} from "@chakra-ui/react";
import { useFetchClient } from "@/hooks/useFetchClient";
import { Clear, FilterAlt } from "@mui/icons-material";
import DateFilter from "@/components/Sidebars/Dashboards Filter/DateFilterComponent";
import { format, parseISO } from "date-fns";
import { DrawerStateOptions } from "@/components/Sidebars/useDrawerState";

interface FilterSidebarProps {
  onApplyFilters: (postBody: Record<string, any>) => void;
  filterOptions?: {
    showDateFilter?: boolean;
    showSitesFilter?: boolean;
    showDepartmentsFilter?: boolean;
  };
  dateFilterMode?: DateRangeMode;
  defaultDateFilter?: string;
}

interface Site {
  id: number;
  siteName: string;
}

interface Department {
  id: number;
  name: string;
}

interface SiteResponse {
  resource: Site[];
}

interface DepartmentResponse {
  resource: Department[];
}

const FilterSidebar: React.FC<FilterSidebarProps> = ({
  onApplyFilters,
  filterOptions = {
    showDateFilter: true,
    showSitesFilter: true,
    showDepartmentsFilter: true,
  },
  dateFilterMode = "monthly",
  defaultDateFilter,
}) => {
  const theme = useTheme();
  const { fetchClient } = useFetchClient();

  const [drawerState, setDrawerState] = useState<DrawerStateOptions>("closed");
  const canHalf = false;
  const canFull = true;

  const onOpen = () => {
    if (canHalf) setDrawerState("half-open");
    else setDrawerState("fully-open");
  };
  const onToggle = () => {
    setDrawerState((curr) =>
      curr === "half-open" ? "fully-open" : "half-open",
    );
  };
  const onClose = () => {
    setDrawerState("closed");
  };

  const [sites, setSites] = useState<Site[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);

  const [selectedSites, setSelectedSites] = useState<number[]>([]);
  const [selectedDepartments, setSelectedDepartments] = useState<number[]>([]);

  const [dateRange, setDateRange] = useState<{
    startDate: string;
    endDate: string;
  } | null>(null);
  const [clearSignal, setClearsignal] = useState(0);

  const [dateFilterValue, setDateFilterValue] = useState(defaultDateFilter);

  useEffect(() => {
    if (!filterOptions.showSitesFilter) return;
    (async () => {
      try {
        const response = await fetchClient<SiteResponse>(
          "/api/site/allBy?selectColumns=id,siteName",
          { method: "GET", redirectOnError: false },
        );
        if (response && response.resource) setSites(response.resource);
      } catch (error) {
        console.error("Error fetching sites:", error);
      }
    })();
  }, [filterOptions.showSitesFilter]);

  useEffect(() => {
    if (!filterOptions.showDepartmentsFilter) return;
    (async () => {
      try {
        const response = await fetchClient<DepartmentResponse>(
          "/api/userTeam/allBy?selectColumns=id,name&parentTeamId=null",
          { method: "GET", redirectOnError: false },
        );
        if (response && response.resource) setDepartments(response.resource);
      } catch (error) {
        console.error("Error fetching departments:", error);
      }
    })();
  }, [filterOptions.showDepartmentsFilter]);

  const handleSiteChange = (siteId: number) => {
    setSelectedSites((prev) =>
      prev.includes(siteId)
        ? prev.filter((id) => id !== siteId)
        : [...prev, siteId],
    );
  };

  const handleDepartmentChange = (deptId: number) => {
    setSelectedDepartments((prev) =>
      prev.includes(deptId)
        ? prev.filter((id) => id !== deptId)
        : [...prev, deptId],
    );
  };

  const clearAllFilters = () => {
    setDateRange(null);
    setSelectedSites([]);
    setSelectedDepartments([]);
    setClearsignal((prev) => prev + 1);
  };

  const handleApplyFilters = () => {
    const postBody: Record<string, any> = {};

    if (dateRange) {
      postBody.startDate = dateRange.startDate;
      postBody.endDate = dateRange.endDate;
    }

    if (selectedSites.length > 0) postBody.siteIds = selectedSites;
    if (selectedDepartments.length > 0)
      postBody.departmentIds = selectedDepartments;

    onApplyFilters(postBody);
    onClose();
  };

  const fullBarMenu = (
    <Flex flexDirection="column" pb={[24, 6]} gap={3} bg="elementBG" zIndex={160}>
      {/* Date Filter (only if enabled) */}
      {filterOptions.showDateFilter && (
        <Box px={2}>
          <DateFilter
            filterMode={dateFilterMode}
            defaultDateFilter={
              dateFilterValue as ModeValueMap[typeof dateFilterMode]
            }
            onDateChange={(start, end, newValue) => {
              if (!start || !end) {
                setDateRange(null);
              } else {
                setDateRange({ startDate: start, endDate: end });
              }

              if (newValue) {
                setDateFilterValue(newValue);
              } else {
                setDateFilterValue(undefined);
              }
            }}
            clearSignal={clearSignal}
          />
        </Box>
      )}

      <Box px={2} fontSize={"sm"} w={"full"}>
        <Text color={theme.colors.primaryTextColor} fontWeight="bold">
          Selected Date Range:
        </Text>
        <Flex justify={"space-between"} w={"full"}>
          <Text color={theme.colors.primaryTextColor} fontWeight="bold">
            Start:
          </Text>
          <Text color={theme.colors.primaryTextColor}>
            {dateRange &&
              format(parseISO(dateRange.startDate), "EE, dd-MM-yyyy")}
          </Text>
        </Flex>
        <Flex justify={"space-between"} w={"full"}>
          <Text color={theme.colors.primaryTextColor} fontWeight="bold">
            End
          </Text>
          <Text color={theme.colors.primaryTextColor}>
            {dateRange && format(parseISO(dateRange.endDate), "EE, dd-MM-yyyy")}
          </Text>
        </Flex>
      </Box>

      {/* Clear Filters */}
      <Button
        width="100%"
        minH={"40px"}
        variant="red"
        onClick={clearAllFilters}
        leftIcon={<Clear component="svg" />}
      >
        Clear Filters
      </Button>

      {/* Apply Filters */}
      <Button
        width="100%"
        minH={"40px"}
        variant="green"
        onClick={handleApplyFilters}
      >
        Apply Filters
      </Button>

      {/* Sites Filter */}
      {filterOptions.showSitesFilter && (
        <Box
          border="1px solid"
          borderColor={theme.colors.primary}
          borderRadius="md"
          p={2}
          fontSize={["14px", "16px"]}
          boxShadow="lg"
        >
          <Box width="100%" display="flex" justifyContent="center">
            <Text
              fontWeight="bold"
              mb={2}
              bg={theme.colors.primary}
              color="white"
              width="100%"
              p={2}
              fontSize={["14px", "16px"]}
              borderRadius="md"
            >
              Sites
            </Text>
          </Box>
          <VStack align="start" spacing={2}>
            {sites.map((site) => (
              <Checkbox
                key={site.id}
                size={["sm", "md"]}
                isChecked={selectedSites.includes(site.id)}
                onChange={() => handleSiteChange(site.id)}
              >
                <Text color={theme.colors.primaryTextColor}>
                  {site.siteName}
                </Text>
              </Checkbox>
            ))}
          </VStack>
        </Box>
      )}

      {/* Departments Filter */}
      {filterOptions.showDepartmentsFilter && (
        <Box
          border="1px solid"
          borderColor={theme.colors.primary}
          borderRadius="md"
          p={2}
          fontSize={["14px", "16px"]}
          boxShadow="lg"
        >
          <Box width="100%" display="flex" justifyContent="center">
            <Text
              fontWeight="bold"
              mb={2}
              bg={theme.colors.primary}
              color="white"
              width="100%"
              p={2}
              fontSize={["14px", "16px"]}
              borderRadius="md"
            >
              Departments
            </Text>
          </Box>
          <VStack align="start" spacing={2}>
            {departments.map((dept) => (
              <Checkbox
                key={dept.id}
                size={["sm", "md"]}
                isChecked={selectedDepartments.includes(dept.id)}
                onChange={() => handleDepartmentChange(dept.id)}
              >
                <Text color={theme.colors.primaryTextColor}>{dept.name}</Text>
              </Checkbox>
            ))}
          </VStack>
        </Box>
      )}
    </Flex>
  );

  return (
    <Sidebar
      drawerState={drawerState}
      canHalf={canHalf}
      canFull={canFull}
      onOpen={onOpen}
      onToggle={onToggle}
      onClose={onClose}
      side={"right"}
      openButtonIcon={FilterAlt}
      title={"Filter Options"}
      fullyOpenContent={fullBarMenu}
      fadeOnFull={true}
    />
  );
};

export default FilterSidebar;
