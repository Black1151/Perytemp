"use client";

import React, {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-charts-enterprise";
import { LicenseManager } from "ag-grid-charts-enterprise";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import {
  Box,
  Button,
  Flex,
  Input,
  Text,
  useBreakpointValue,
  useDisclosure,
} from "@chakra-ui/react";
import { Add, Clear, Refresh } from "@mui/icons-material";
import NoDataOverlay from "@/components/agGrids/NoDataOverlay";
import CustomGridBottomPagination from "@/components/agGrids/CustomGridBottomPagination";
import LoadingOverlay from "@/components/agGrids/LoadingOverlay";
import { ColDef, FirstDataRenderedEvent } from "ag-grid-community";

interface DataGridComponentProps<T> {
  data: T[] | null;
  initialFields: ColDef[];
  createNewUrl?: string;
  createNewUrlButtonText?: string;
  isModalEnabled?: boolean;
  loading?: boolean;
  openModalComponent?: React.ElementType;
  showTopBar?: boolean;
  defaultColDef?: ColDef;
  onGridReady?: (params: FirstDataRenderedEvent) => void;
  filterModel?: any;
  defaultPageSize?: number;
  refreshData?: () => void;
  enableAutoRefresh?: boolean;
  refreshInterval?: number;
  height?: string;
}

interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalRows: number;
  pageSize: number;
}

LicenseManager.setLicenseKey(
  "Using_this_{AG_Charts_and_AG_Grid}_Enterprise_key_{AG-066268}_in_excess_of_the_licence_granted_is_not_permitted___Please_report_misuse_to_legal@ag-grid.com___For_help_with_changing_this_key_please_contact_info@ag-grid.com___{Sedulo_Limited}_is_granted_a_{Multiple_Applications}_Developer_License_for_{2}_Front-End_JavaScript_developers___All_Front-End_JavaScript_developers_need_to_be_licensed_in_addition_to_the_ones_working_with_{AG_Charts_and_AG_Grid}_Enterprise___This_key_has_been_granted_a_Deployment_License_Add-on_for_{1}_Production_Environment___This_key_works_with_{AG_Charts_and_AG_Grid}_Enterprise_versions_released_before_{30_September_2025}____[v3]_[0102]_MTc1OTE4NjgwMDAwMA==8e565c62a9475b11e35b2c3b1f037177"
);

const DataGridComponent = <T,>({
  data,
  loading,
  initialFields,
  createNewUrl,
  createNewUrlButtonText,
  isModalEnabled,
  defaultPageSize = 25,
  openModalComponent: ModalComponent,
  showTopBar = true,
  defaultColDef: customDefaultColDef,
  onGridReady,
  filterModel,
  refreshData,
  enableAutoRefresh = false,
  refreshInterval = 10,
  height = "500px",
}: DataGridComponentProps<T>) => {
  const gridRef = useRef<AgGridReact>(null);
  const router = useRouter();

  const isMobile = useBreakpointValue({ base: true, sm: true, md: false });
  const uniqueQuickFilterId = useId();

  const [fields, setFields] = useState<any[]>(initialFields);
  const [isGridReady, setIsGridReady] = useState(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const [rowData, setRowData] = useState<T[]>(data || []);

  useEffect(() => {
    setFields(initialFields);
  }, [initialFields]);

  // Modal disclosure state for Chakra UI
  const { isOpen, onOpen, onClose } = useDisclosure();

  // Function to start the timer
  const startTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current); // Clear any existing timer
    }
    if (enableAutoRefresh && refreshData && refreshInterval > 0) {
      const intervalInMilliseconds = refreshInterval * 60000; // Convert minutes to milliseconds
      timerRef.current = setInterval(() => {
        refreshData(); // Call refreshData at the specified interval
      }, intervalInMilliseconds);
    }
  };

  // Clear the timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  // Start the timer when the component mounts, only if auto-refresh is enabled
  useEffect(() => {
    if (enableAutoRefresh && refreshData) {
      startTimer();
    }
  }, [enableAutoRefresh, refreshData]);

  // Memoize defaultColDef to avoid re-renders
  const defaultColDef = useMemo(
    () => ({
      flex: isMobile ? 0 : 1,
      sortable: true,
      filter: true,
      floatingFilter: false,
      resizable: true,
      cellStyle: { "font-size": "13px" },
      ...customDefaultColDef,
    }),
    [isMobile, customDefaultColDef]
  );

  const [paginationInfo, setPaginationInfo] = useState({
    currentPage: 1,
    totalPages: 0,
    totalRows: 0,
    pageSize: defaultPageSize,
  });

  // General function to update pagination info for both grids
  const updatePaginationInfo = useCallback(
    (
      gridRef: React.RefObject<AgGridReact<any>>,
      setPaginationInfo: React.Dispatch<React.SetStateAction<PaginationInfo>>
    ) => {
      if (gridRef.current?.api) {
        setPaginationInfo({
          currentPage: gridRef.current.api.paginationGetCurrentPage() + 1,
          totalPages: gridRef.current.api.paginationGetTotalPages(),
          pageSize: gridRef.current.api.paginationGetPageSize(),
          totalRows: gridRef.current.api.paginationGetRowCount(),
        });
      }
    },
    []
  );

  const handleGridReady = (params: FirstDataRenderedEvent) => {
    setIsGridReady(true); // Mark the grid as ready
    if (onGridReady) {
      onGridReady(params); // Call the provided onGridReady callback
    }
  };

  // Handle the click for creating new items
  const handleCreateNewClick = () => {
    if (isModalEnabled && ModalComponent) {
      onOpen(); // Open the modal if enabled
    } else if (createNewUrl) {
      router.push(createNewUrl); // Navigate to the URL if modal is not enabled
    }
  };

  createNewUrlButtonText = useBreakpointValue({
    base: "",
    sm: "",
    md: createNewUrlButtonText ?? "Create New",
  });
  const resetFiltersButtonText = useBreakpointValue({
    base: "",
    sm: "",
    md: "Reset Filters",
  });
  const refreshButtonText = useBreakpointValue({
    base: "",
    sm: "",
    md: "Refresh Data",
  });

  // Quick Filter
  const onFilterTextBoxChanged = useCallback(() => {
    gridRef.current!.api.setGridOption(
      "quickFilterText",
      (
        document.getElementById(
          `filter-text-box-${uniqueQuickFilterId}`
        ) as HTMLInputElement
      ).value
    );
  }, []);

  // Reset all filters and quick filter
  const resetFilter = useCallback(() => {
    gridRef.current?.api.setFilterModel(null);
    gridRef.current?.api.setGridOption(
      "quickFilterText",
      ((
        document.getElementById(
          `filter-text-box-${uniqueQuickFilterId}`
        ) as HTMLInputElement
      ).value = "")
    );
  }, []);

  // Effect to update rowData when the prop `data` changes
  useEffect(() => {
    if (data) {
      setRowData(data);
    }
  }, [data]); // Run this effect whenever the data prop changes

  useEffect(() => {
    if (isGridReady && gridRef.current?.api && filterModel) {
      gridRef.current.api.setFilterModel(filterModel); // Apply the filter model when grid is ready
    }
  }, [filterModel, isGridReady]);

  const handleFilterChanged = () => {
    if (gridRef.current?.api) {
      const currentFilterModel = gridRef.current.api.getFilterModel();
    }
  };

  return (
    <Box
      className={`ag-theme-alpine ag-theme-perygon`}
      w={"full"}
      borderRadius={"xl"}
      overflow={"hidden"}
    >
      {showTopBar && (
        <Flex w={"full"} justify={"flex-start"} align={"center"} my={4} gap={2}>
          {/* Quick Filter */}
          <Input
            variant="outline"
            id={`filter-text-box-${uniqueQuickFilterId}`}
            placeholder="Search..."
            onInput={onFilterTextBoxChanged}
            w={256}
            bg="white"
            borderColor="gray.300"
            _hover={{ borderColor: "gray.400" }}
            _focus={{
              borderColor: "primary",
              boxShadow: "0 0 0 1px #ff0070",
            }}
          />

          <Flex flex={1} justify={"flex-end"} align={"center"} gap={2}>
            {refreshData && (
              <Button
                variant="solid"
                bg="secondary"
                aria-label="reset-filters"
                onClick={refreshData}
                size="md"
                color="white"
                _hover={{ bg: "primary" }}
                display="flex"
                alignItems="center"
                gap={[0, 0, 2]}
                lineHeight={0}
              >
                <Refresh />
                <Text>{refreshButtonText}</Text>
              </Button>
            )}

            <Button
              variant="solid"
              bg="seduloRed"
              aria-label="reset-filters"
              onClick={resetFilter}
              size="md"
              color="white"
              _hover={{ bg: "primary" }}
              display="flex"
              alignItems="center"
              gap={[0, 0, 2]}
              lineHeight={0}
            >
              <Clear />
              <Text>{resetFiltersButtonText}</Text>
            </Button>

            {/* Create New Button */}
            {(createNewUrl || isModalEnabled) && (
              <Button
                variant="solid"
                bg="lightGreen"
                aria-label="create-new"
                onClick={handleCreateNewClick}
                size="md"
                color="white"
                display="flex"
                alignItems="center"
                gap={[0, 0, 2]}
                lineHeight={0}
              >
                <Add />
                <Text>{createNewUrlButtonText}</Text>
              </Button>
            )}
          </Flex>
        </Flex>
      )}

      <Flex direction={"column"} height={height}>
        <AgGridReact
          ref={gridRef}
          loading={loading}
          rowData={rowData}
          columnDefs={fields}
          rowBuffer={100}
          suppressColumnVirtualisation={true}
          suppressRowVirtualisation={true}
          pagination={true}
          suppressPaginationPanel={true}
          onPaginationChanged={() => {
            updatePaginationInfo(gridRef, setPaginationInfo);
          }}
          suppressDragLeaveHidesColumns={true}
          defaultColDef={defaultColDef}
          paginationPageSize={paginationInfo.pageSize}
          noRowsOverlayComponent={NoDataOverlay}
          loadingOverlayComponent={LoadingOverlay}
          onFirstDataRendered={handleGridReady}
          onFilterChanged={handleFilterChanged}
          suppressCellFocus={true}
        />
        <CustomGridBottomPagination
          gridRef={gridRef}
          paginationInfo={paginationInfo}
          onPageChange={() => {
            updatePaginationInfo(gridRef, setPaginationInfo);
          }}
          setPaginationInfo={setPaginationInfo}
        />
      </Flex>

      {/* Render the modal component with modal state control */}
      {isModalEnabled && ModalComponent && (
        <ModalComponent isOpen={isOpen} onClose={onClose} />
      )}
    </Box>
  );
};

export default DataGridComponent;
