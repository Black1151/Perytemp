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
  Icon,
  Input,
  Text,
  useBreakpointValue,
  useDisclosure,
  useTheme,
  VStack,
} from "@chakra-ui/react";
import { Add, Clear, QueryStats, Refresh } from "@mui/icons-material";
import { ColDef, FirstDataRenderedEvent } from "ag-grid-community";
import CustomGridBottomPaginationLight from "./CustomGridBottomPaginationLight";
import LoadingOverlayPink from "../LoadingOverlayPink";
import { SectionHeader } from "@/components/sectionHeader/SectionHeader";
import PerygonCard from "@/components/layout/PerygonCard";

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
  flex?: string;
  title?: string;
  handleRowClick?: (rowData: T) => void;
  groupDisplayType?:
    | "singleColumn"
    | "multipleColumns"
    | "groupRows"
    | "custom";
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

function DataGridComponentLight<T>({
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
  flex = "1 1 100%",
  title,
  handleRowClick,
  groupDisplayType = "singleColumn",
}: DataGridComponentProps<T>) {
  const gridRef = useRef<AgGridReact>(null);
  const router = useRouter();

  const isMobile = useBreakpointValue({ base: true, sm: true, md: false });
  const uniqueQuickFilterId = useId();

  const [fields, setFields] = useState<ColDef[]>(initialFields);
  const [isGridReady, setIsGridReady] = useState(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const [rowData, setRowData] = useState<T[]>(() => data || []);

  useEffect(() => setFields(initialFields), [initialFields]);

  const { isOpen, onOpen, onClose } = useDisclosure();

  const theme = useTheme();
  const { alternateRowBG, alternateRowTextColor } =
    theme.components.dataGridComponentLight.baseStyle;

  const startTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (enableAutoRefresh && refreshData && refreshInterval > 0) {
      const intervalMs = refreshInterval * 60_000;
      timerRef.current = setInterval(() => {
        refreshData();
      }, intervalMs);
    }
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  useEffect(() => {
    if (enableAutoRefresh && refreshData) {
      startTimer();
    }
  }, [enableAutoRefresh, refreshData, refreshInterval]);

  const defaultColDef = useMemo(
    () => ({
      flex: isMobile ? 0 : 1,
      sortable: true,
      filter: true,
      floatingFilter: false,
      resizable: true,
      cellStyle: {
        fontSize: "13px",
        display: "flex",
        alignItems: "center",
        fontFamily: "Metropolis",
      },
      headerClass: "dg-align-left",
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
    setIsGridReady(true);
    if (onGridReady) onGridReady(params);
  };

  const handleCreateNewClick = () => {
    if (isModalEnabled && ModalComponent) {
      onOpen();
    } else if (createNewUrl) {
      router.push(createNewUrl);
    }
  };

  const finalCreateNewUrlButtonText = useBreakpointValue({
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

  const onFilterTextBoxChanged = useCallback(() => {
    // @ts-ignore
    gridRef.current?.api.setGridOption(
      "quickFilterText",
      (
        document.getElementById(
          `filter-text-box-${uniqueQuickFilterId}`
        ) as HTMLInputElement
      )?.value
    );
  }, [uniqueQuickFilterId]);

  const resetFilter = useCallback(() => {
    const api = gridRef.current?.api;
    if (!api) return;
    api.setFilterModel(null);
    api.setGridOption("quickFilterText", "");
    const input = document.getElementById(
      `filter-text-box-${uniqueQuickFilterId}`
    ) as HTMLInputElement;
    if (input) input.value = "";
  }, [uniqueQuickFilterId]);

  useEffect(() => {
    if (data) {
      setRowData(data);
    }
  }, [data]);

  useEffect(() => {
    if (isGridReady && gridRef.current?.api && filterModel) {
      gridRef.current.api.setFilterModel(filterModel);
    }
  }, [filterModel, isGridReady]);

  const handleFilterChanged = () => {
    const currentFilterModel = gridRef.current?.api.getFilterModel();
    // do something if needed
  };

  return (
    <Box flex={flex} borderRadius={"lg"}>
      {title && (
        <Flex width="100%" justifyContent="center" align="center" mb={4}>
          <SectionHeader>{title}</SectionHeader>
        </Flex>
      )}

      <PerygonCard className="ag-theme-alpine" w="100%" p={1} pb="7px">
        <Box w="full" p={2} pb={0}>
          {showTopBar && (
            <Flex w="full" justify="flex-start" align="center" my={0} gap={2}>
              <Input
                variant="outline"
                id={`filter-text-box-${uniqueQuickFilterId}`}
                placeholder="Search..."
                onInput={onFilterTextBoxChanged}
                maxW={256}
                bg="elementBG"
                borderColor="gray.300"
                _hover={{ borderColor: "gray.400" }}
                _focus={{
                  borderColor: "primary",
                  boxShadow: "0 0 0 1px #ff0070",
                }}
              />
              <Flex
                flex={1}
                justify="flex-end"
                align="center"
                gap={2}
                color="white"
              >
                {refreshData && (
                  <Button
                    variant="solid"
                    aria-label="refresh-data"
                    onClick={refreshData}
                    gap={[0, 0, 2]}
                    lineHeight={0}
                  >
                    <Refresh />
                    <Text>{refreshButtonText}</Text>
                  </Button>
                )}

                <Button
                  variant="solid"
                  aria-label="reset-filters"
                  onClick={resetFilter}
                  gap={[0, 0, 2]}
                  lineHeight={0}
                  color="white"
                >
                  <Clear />
                  <Text>{resetFiltersButtonText}</Text>
                </Button>

                {(createNewUrl || isModalEnabled) && (
                  <Button
                    variant="solid"
                    aria-label="create-new"
                    onClick={handleCreateNewClick}
                    gap={[0, 0, 2]}
                    lineHeight={0}
                  >
                    <Add />
                    <Text>{finalCreateNewUrlButtonText}</Text>
                  </Button>
                )}
              </Flex>
            </Flex>
          )}

          <Flex direction="column" height={height} mt={2}>
            {/* Global style overrides for AG Grid */}
            <style jsx global>{`
              .ag-theme-alpine .ag-header,
              .ag-theme-alpine .ag-row,
              .ag-theme-alpine .ag-cell,
              .ag-theme-alpine .ag-root-wrapper,
              .ag-theme-alpine .ag-body-viewport {
                border: none !important;
                background-color: transparent !important;
              }

              .ag-theme-alpine .ag-header {
                background-color: var(--chakra-colors-primary) !important;
              }

              .ag-theme-alpine .ag-row:nth-child(odd) {
                background-color: var(--chakra-colors-elementBG) !important;
              }

              .ag-theme-alpine .ag-row:nth-child(even) {
                background-color: var(
                  --chakra-colors-${alternateRowBG}
                ) !important;
                color: var(--chakra-colors-${alternateRowTextColor}) !important;
              }

              .ag-theme-alpine .ag-header,
              .ag-theme-alpine .ag-header-cell,
              .ag-theme-alpine .ag-row,
              .ag-theme-alpine .ag-cell {
                color: var(--chakra-colors-primaryTextColor) !important;
              }

              .ag-theme-alpine .ag-header-icon .ag-icon {
                color: var(--chakra-colors-primaryTextColor) !important;
                fill: var(--chakra-colors-primaryTextColor) !important;
              }

              .ag-theme-alpine .ag-header-icon:hover .ag-icon {
                color: var(--chakra-colors-themeTextColor) !important;
                fill: var(--chakra-colors-themeTextColor) !important;
              }
            `}</style>

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
              defaultColDef={defaultColDef}
              paginationPageSize={paginationInfo.pageSize}
              noRowsOverlayComponent={NoDataOverlayPink}
              suppressDragLeaveHidesColumns={true}
              loadingOverlayComponent={LoadingOverlayPink}
              onFirstDataRendered={handleGridReady}
              onFilterChanged={handleFilterChanged}
              suppressCellFocus={true}
              onRowClicked={
                handleRowClick
                  ? (params) => handleRowClick(params.data as T)
                  : undefined
              }
              rowHeight={50}
              getChartToolbarItems={() => []}
              groupDisplayType={groupDisplayType}
            />

            <CustomGridBottomPaginationLight
              gridRef={gridRef}
              paginationInfo={paginationInfo}
              onPageChange={() => {
                updatePaginationInfo(gridRef, setPaginationInfo);
              }}
              setPaginationInfo={setPaginationInfo}
            />
          </Flex>

          {isModalEnabled && ModalComponent && (
            <ModalComponent isOpen={isOpen} onClose={onClose} />
          )}
        </Box>
      </PerygonCard>
    </Box>
  );
}

export const NoDataOverlayPink: React.FC = () => {
  return (
    <Flex
      direction="column"
      align="center"
      justify="center"
      py={20}
      px={5}
      width="100%"
      height="100%"
      borderRadius="md"
    >
      <VStack spacing={4}>
        <Icon as={QueryStats} boxSize={20} color="primary" />
        <Text
          fontSize="2xl"
          fontWeight="bold"
          color="primary"
          fontFamily="heading"
        >
          No Data Available
        </Text>
        <Text
          fontSize="lg"
          color="primary"
          textAlign="center"
          fontFamily="body"
        >
          It looks like there is nothing to display at the moment.
        </Text>
      </VStack>
    </Flex>
  );
};

export default DataGridComponentLight;
