"use client";

import React, {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-charts-enterprise";
import {
  GetRowIdParams,
  GridApi,
  GridReadyEvent,
  LicenseManager,
  RowDataTransaction,
  RowDropZoneParams,
  RowSelectionOptions,
} from "ag-grid-charts-enterprise";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import {
  Alert,
  AlertIcon,
  Box,
  Button,
  Flex,
  Heading,
  IconButton,
  Input,
  Stack,
  Text,
  Tooltip,
  useBreakpointValue,
} from "@chakra-ui/react";
import {
  Add,
  Clear,
  Close,
  Done,
  InfoOutlined,
  Remove,
  Undo,
} from "@mui/icons-material";
import CustomGridBottomPagination from "@/components/agGrids/CustomGridBottomPagination";
import LoadingOverlay from "@/components/agGrids/LoadingOverlay";
import DraggableNoDataOverlay from "@/components/agGrids/DraggableNoDataOverlay";
import { useFetchClient } from "@/hooks/useFetchClient";
import { ColDef } from "ag-grid-community";

LicenseManager.setLicenseKey(
  "Using_this_{AG_Charts_and_AG_Grid}_Enterprise_key_{AG-066268}_in_excess_of_the_licence_granted_is_not_permitted___Please_report_misuse_to_legal@ag-grid.com___For_help_with_changing_this_key_please_contact_info@ag-grid.com___{Sedulo_Limited}_is_granted_a_{Multiple_Applications}_Developer_License_for_{2}_Front-End_JavaScript_developers___All_Front-End_JavaScript_developers_need_to_be_licensed_in_addition_to_the_ones_working_with_{AG_Charts_and_AG_Grid}_Enterprise___This_key_has_been_granted_a_Deployment_License_Add-on_for_{1}_Production_Environment___This_key_works_with_{AG_Charts_and_AG_Grid}_Enterprise_versions_released_before_{30_September_2025}____[v3]_[0102]_MTc1OTE4NjgwMDAwMA==8e565c62a9475b11e35b2c3b1f037177"
);

interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalRows: number;
  pageSize: number;
}

interface DraggableGridsComponentProps {
  populationData: any[] | null;
  populationTitle?: string;
  sampleData: any[] | null;
  sampleTitle?: string;
  endpoint: string;
  fieldDefs: ColDef[];
  dynamicIdField: string;
  mappingField: string;
  payloadKey: string;
  showTooltip?: boolean;
  submitTitle?: string;
  onUndoStackChange?: (hasUndoStack: boolean) => void;
  resetRef?: React.MutableRefObject<(() => void) | null>;
}

const DraggableGridsComponent: React.FC<DraggableGridsComponentProps> = ({
  populationData,
  populationTitle,
  sampleData,
  sampleTitle,
  endpoint,
  fieldDefs,
  dynamicIdField,
  mappingField,
  payloadKey,
  showTooltip = false,
  submitTitle = "Submit",
  onUndoStackChange,
  resetRef,
}) => {
  const [checkpoints, setCheckpoints] = useState<{
    population: any[];
    sample: any[];
  }>({
    population: [],
    sample: [],
  });
  const isMobile = useBreakpointValue({ base: true, md: false });
  const [populationRowData, setPopulationRowData] = useState<any[]>(
    populationData || []
  );
  const [sampleRowData, setSampleRowData] = useState<any[]>(sampleData || []);
  const { fetchClient, loading } = useFetchClient();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [undoStack, setUndoStack] = useState<any[]>([]);
  const [populationHasSelectedRows, setPopulationHasSelectedRows] =
    useState<boolean>(false);
  const [sampleHasSelectedRows, setSampleHasSelectedRows] =
    useState<boolean>(false);
  const uniquePopulationQuickFilterId = useId();
  const uniqueSampleQuickFilterId = useId();

  const resetFiltersButtonText = useBreakpointValue({
    base: "",
    sm: "",
    md: "Reset Filters",
  });
  const undoButtonText = useBreakpointValue({
    base: "",
    sm: "",
    md: "Undo",
  });
  const addAllButtonText = useBreakpointValue({
    base: "",
    sm: "",
    md: !populationHasSelectedRows ? "Add All" : "Add Selected",
  });

  const removeAllButtonText = useBreakpointValue({
    base: "",
    sm: "",
    md: !sampleHasSelectedRows ? "Remove All" : "Remove Selected",
  });
  const submitButtonText = useBreakpointValue({
    base: "",
    sm: "",
    md: submitTitle,
  });

  // Reset all filters and quick filter
  const resetFilter = useCallback(
    (gridRef: React.RefObject<AgGridReact>, filterId: string) => {
      gridRef.current?.api.setFilterModel(null);
      gridRef.current?.api.setGridOption(
        "quickFilterText",
        ((document.getElementById(filterId) as HTMLInputElement).value = "")
      );
    },
    []
  );

  const resetData = () => {
    setUndoStack([]);
    // Update state for population and sample grids
    setPopulationRowData([...checkpoints.population]);
    setSampleRowData([...checkpoints.sample]);
  };

  useEffect(() => {
    if (resetRef) {
      resetRef.current = resetData;
    }
    return () => {
      if (resetRef) {
        resetRef.current = null;
      }
    };
  }, [resetData, resetRef]);

  const onPopulationSearchChange = useCallback(() => {
    populationGridRef?.current?.api.setGridOption(
      "quickFilterText",
      (
        document.getElementById(
          `population-quick-filter-${uniquePopulationQuickFilterId}`
        ) as HTMLInputElement
      ).value
    );
  }, []);

  const onSampleSearchChange = useCallback(() => {
    sampleGridRef?.current?.api.setGridOption(
      "quickFilterText",
      (
        document.getElementById(
          `sample-quick-filter-${uniqueSampleQuickFilterId}`
        ) as HTMLInputElement
      ).value
    );
  }, []);

  const moveRowWithUndo = (
    oldGridApi: GridApi,
    newGridApi: GridApi,
    data: any[]
  ) => {
    addRecordsToGrid(oldGridApi, newGridApi, data);
    setUndoStack((prevUndoStack) => [
      ...prevUndoStack,
      { oldGridApi, newGridApi, data },
    ]);
  };

  const handleUndo = () => {
    const lastMove = undoStack.pop();
    if (lastMove) {
      addRecordsToGrid(lastMove.newGridApi, lastMove.oldGridApi, lastMove.data);
      setUndoStack([...undoStack]);
    }
  };

  useEffect(() => {
    const hasUndoStack = undoStack.length > 0;
    onUndoStackChange?.(undoStack.length > 0);
  }, [undoStack]);

  const onPopulationSelectionChanged = () => {
    const selectedRows = populationGridRef.current?.api.getSelectedRows();
    setPopulationHasSelectedRows(!!(selectedRows && selectedRows.length > 0)); // Ensures a boolean value
  };

  const onSampleSelectionChanged = () => {
    const selectedRows = sampleGridRef.current?.api.getSelectedRows();
    setSampleHasSelectedRows(!!(selectedRows && selectedRows.length > 0)); // Ensures a boolean value
  };

  const [isAlertVisible, setIsAlertVisible] = useState<boolean>(false);

  const toggleAlertVisibility = () => {
    setIsAlertVisible((prevVisible) => !prevVisible);
  };

  // Checks for duplicate IDs and displays an error message if duplicates are found
  const checkForDuplicateIds = useCallback(() => {
    const checkDuplicates = (data: any[], idField: string) => {
      const seenIds = new Set();
      for (const item of data) {
        if (seenIds.has(item[idField])) {
          return item[idField];
        }
        seenIds.add(item[idField]);
      }
      return null;
    };

    if (populationData && sampleData) {
      const duplicateInPopulation = checkDuplicates(
        populationData,
        dynamicIdField
      );
      const duplicateInSample = checkDuplicates(sampleData, dynamicIdField);

      if (duplicateInPopulation) {
        setErrorMessage(
          `Duplicate ID found in Population data: ${duplicateInPopulation}`
        );
        return true;
      }
      if (duplicateInSample) {
        setErrorMessage(
          `Duplicate ID found in Sample data: ${duplicateInSample}`
        );
        return true;
      }
    }

    setErrorMessage(null);
    return false;
  }, [populationData, sampleData, dynamicIdField]);

  useEffect(() => {
    checkForDuplicateIds();
  }, [populationData, sampleData, dynamicIdField, checkForDuplicateIds]);

  useEffect(() => {
    if (populationData && sampleData) {
      // Create a Set of IDs from the sample data
      const sampleIds = new Set(sampleData.map((row) => row[mappingField]));

      // Split the population data into remaining and removed rows
      const updatedPopulationData = populationData.filter(
        (row) => !sampleIds.has(row[dynamicIdField])
      );

      const newSampleData = populationData.filter((row) =>
        sampleIds.has(row[dynamicIdField])
      );

      setCheckpoints({
        population: updatedPopulationData,
        sample: newSampleData,
      });

      // Update state for population and sample grids
      setPopulationRowData(updatedPopulationData);
      setSampleRowData(newSampleData);
    }
  }, [populationData, sampleData, dynamicIdField, mappingField]);

  const populationDraggableBoxRef = useRef<HTMLDivElement>(null);
  const sampleDraggableBoxRef = useRef<HTMLDivElement>(null);
  const populationGridRef = useRef<AgGridReact>(null);
  const sampleGridRef = useRef<AgGridReact>(null);

  const commonPaginationInfo = {
    currentPage: 1,
    totalPages: 0,
    totalRows: 0,
    pageSize: 25,
  };

  const [populationPaginationInfo, setPopulationPaginationInfo] =
    useState<PaginationInfo>(commonPaginationInfo);
  const [samplePaginationInfo, setSamplePaginationInfo] =
    useState<PaginationInfo>(commonPaginationInfo);

  const defaultColDef: ColDef = useMemo(
    () => ({
      flex: isMobile ? 0 : 1,
      sortable: true,
      filter: true,
      floatingFilter: false,
      resizable: true,
    }),
    [isMobile]
  );

  const updatePaginationInfo = useCallback(
    (
      gridRef: React.RefObject<AgGridReact>,
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

  const getRowId = (params: GetRowIdParams) =>
    String(params.data[dynamicIdField]);

  const addRecordsToGrid = (
    oldGridApi: GridApi,
    newGridApi: GridApi,
    data: any[]
  ) => {
    if (!data || data.length === 0) {
      return;
    }

    // Add rows to the new grid
    const newTransaction: RowDataTransaction = {
      add: data,
    };
    newGridApi!.applyTransaction(newTransaction);

    // Remove rows from the old grid
    const oldTransaction: RowDataTransaction = {
      remove: data,
    };
    oldGridApi!.applyTransaction(oldTransaction);
  };

  const addDropZoneToGrid = useCallback(
    (
      params: GridReadyEvent,
      sourceGridRef: React.RefObject<AgGridReact>,
      targetGridRef: React.RefObject<AgGridReact>,
      targetDropZoneRef: React.RefObject<HTMLDivElement>
    ) => {
      const dropZoneContainer = targetDropZoneRef.current;

      if (!dropZoneContainer) {
        console.error("Drop zone container not found.");
        return;
      }

      if (!sourceGridRef.current?.api || !targetGridRef.current?.api) {
        console.error("Grid references are null or API is not available.");
        return;
      }

      const dropZone: RowDropZoneParams = {
        getContainer: () => dropZoneContainer,
        onDragStop: (draggedParams) => {
          const selectedRows = sourceGridRef.current?.api.getSelectedRows();
          let rowsToMove =
            selectedRows && selectedRows.length > 0
              ? selectedRows
              : [draggedParams.node.data];

          if (sourceGridRef.current?.api && targetGridRef.current?.api) {
            moveRowWithUndo(
              sourceGridRef.current.api,
              targetGridRef.current.api,
              rowsToMove
            );
          }
        },
      };

      params.api.addRowDropZone(dropZone);
    },
    [addRecordsToGrid]
  );

  const handleSubmission = async () => {
    if (
      !sampleGridRef.current ||
      !sampleGridRef.current.api ||
      !populationGridRef.current ||
      !populationGridRef.current.api
    ) {
      console.error("Grid API not available");
      return;
    }

    // Extract row data from sampleGridRef
    const sampleGridData: any[] = [];
    sampleGridRef.current.api.forEachNode((node) =>
      sampleGridData.push(node.data)
    );

    // Extract row data from populationGridRef
    const populationGridData: any[] = [];
    populationGridRef.current.api.forEachNode((node) =>
      populationGridData.push(node.data)
    );

    const rowData: any[] = [];
    sampleGridRef.current.api.forEachNode((node) =>
      rowData.push(node.data[dynamicIdField])
    );

    const payload = {
      [payloadKey]: rowData,
    };

    await fetchClient(endpoint, {
      method: "POST",
      body: payload,
      successMessage: `${populationTitle} saved successfully.`,
      errorMessage: "Unable to send data. Please try again.",
      redirectOnError: false,
      toastPosition: "bottom-right",
    });

    // Update the checkpoints with the current grid data
    setCheckpoints({
      population: [...populationGridData],
      sample: [...sampleGridData],
    });

    setUndoStack([]);
  };

  const moveAllToSample = () => {
    if (populationGridRef.current && sampleGridRef.current) {
      let selectedRows = populationGridRef.current.api.getSelectedRows();

      if (selectedRows.length > 0) {
        // If there are selected rows, move only the selected rows
        moveRowWithUndo(
          populationGridRef.current.api,
          sampleGridRef.current.api,
          selectedRows
        );
      } else {
        // If no rows are selected, move all rows
        const allPopulationRows: any[] = [];
        populationGridRef.current.api.forEachNode((node) => {
          allPopulationRows.push(node.data);
        });

        if (allPopulationRows.length > 0) {
          moveRowWithUndo(
            populationGridRef.current.api,
            sampleGridRef.current.api,
            allPopulationRows
          );
        }
      }
    }
  };

  const moveAllToPopulation = () => {
    if (sampleGridRef.current && populationGridRef.current) {
      let selectedRows = sampleGridRef.current.api.getSelectedRows();

      if (selectedRows.length > 0) {
        // If there are selected rows, move only the selected rows
        moveRowWithUndo(
          sampleGridRef.current.api,
          populationGridRef.current.api,
          selectedRows
        );
      } else {
        // If no rows are selected, move all rows
        const allSampleRows: any[] = [];
        sampleGridRef.current.api.forEachNode((node) => {
          allSampleRows.push(node.data);
        });

        if (allSampleRows.length > 0) {
          moveRowWithUndo(
            sampleGridRef.current.api,
            populationGridRef.current.api,
            allSampleRows
          );
        }
      }
    }
  };

  const rowSelection: RowSelectionOptions = { mode: "multiRow" };

  return (
    <Box className="ag-theme-alpine ag-theme-perygon" w="full" pt={4}>
      {!errorMessage ? (
        <>
          {/* Conditionally render the alert based on state */}
          {showTooltip && (
            <Alert
              status="info"
              mb={4}
              borderRadius="lg"
              bg={isAlertVisible ? "#E2E8F0" : "transparent"}
              color="#1A202C"
              border={
                isAlertVisible ? "1px solid #CBD5E0" : "1px solid transparent"
              }
              boxShadow={isAlertVisible ? "lg" : ""}
            >
              <Flex justify="space-between" align="center" w="full" gap={4}>
                {isAlertVisible && (
                  <>
                    <AlertIcon color="#3182CE" /> {/* Subtle alert icon */}
                    <Text fontWeight="500" fontSize="md">
                      You can drag and drop rows between grids, select multiple
                      rows, or use the buttons to move all rows at once.
                    </Text>
                  </>
                )}
                <Box ml={"auto"}>
                  {!isAlertVisible ? (
                    <Tooltip
                      label="Click to show instructions"
                      aria-label="Info Tooltip"
                      hasArrow
                    >
                      <IconButton
                        icon={
                          <InfoOutlined
                            sx={{
                              fontSize: "1.5rem",
                              color: "#718096",
                            }}
                          />
                        } // Larger, modern icon style
                        aria-label="Toggle Instructions"
                        onClick={toggleAlertVisibility}
                        size="lg"
                        variant="ghost"
                        _hover={{
                          backgroundColor: "transparent",
                          color: "#2D3748",
                          border: "1px solid white",
                        }} // Hover effect
                      />
                    </Tooltip>
                  ) : (
                    <IconButton
                      aria-label="Close"
                      icon={
                        <Close
                          style={{
                            fontSize: "1.5rem",
                            color: "#718096",
                          }}
                        />
                      } // Modern, subtle close button style
                      onClick={toggleAlertVisibility}
                      size="lg"
                      variant="ghost"
                      _hover={{
                        backgroundColor: "transparent",
                        color: "#2D3748",
                        border: "1px solid black",
                      }} // Modern hover effect
                    />
                  )}
                </Box>
              </Flex>
            </Alert>
          )}

          <Stack
            w="full"
            align="center"
            gap={8}
            direction={{ base: "column", md: "row" }}
          >
            {/* Population Grid Section */}
            <Flex
              direction="column"
              height="500px"
              w={"full"}
              flexGrow={1}
              ref={populationDraggableBoxRef}
            >
              <Flex
                direction={"row"}
                w={"full"}
                justify={"flex-start"}
                align={"center"}
                p={1}
                gap={2}
              >
                <Heading color={"white"} fontSize={isMobile ? "lg" : "2xl"}>
                  {populationTitle ?? "Original Data"}
                </Heading>
                <Button
                  variant="solid"
                  bg="secondary"
                  aria-label="reset-filters"
                  onClick={() => {
                    resetFilter(
                      populationGridRef,
                      `population-quick-filter-${uniquePopulationQuickFilterId}`
                    );
                  }}
                  ml={"auto"}
                  size="md"
                  color="white"
                  _hover={{ bg: "primary" }}
                  display="flex"
                  alignItems="center"
                  gap={[0, 0, 2]}
                  lineHeight={0}
                >
                  <Clear />
                  {resetFiltersButtonText}
                </Button>
                <Input
                  variant="outline"
                  id={`population-quick-filter-${uniquePopulationQuickFilterId}`}
                  placeholder="Search..."
                  onInput={onPopulationSearchChange}
                  w={[128, 128, 256]}
                  bg="white"
                  borderColor="gray.300"
                  _hover={{ borderColor: "gray.400" }}
                  _focus={{
                    borderColor: "perygonPink",
                    boxShadow: "0 0 0 1px #ff0070",
                  }}
                />
              </Flex>
              <AgGridReact
                ref={populationGridRef}
                rowData={populationRowData}
                pagination
                suppressPaginationPanel
                getRowId={getRowId}
                onPaginationChanged={() =>
                  updatePaginationInfo(
                    populationGridRef,
                    setPopulationPaginationInfo
                  )
                }
                defaultColDef={defaultColDef}
                rowSelection={rowSelection}
                onSelectionChanged={onPopulationSelectionChanged}
                paginationPageSize={populationPaginationInfo.pageSize}
                noRowsOverlayComponent={DraggableNoDataOverlay}
                noRowsOverlayComponentParams={{ gridType: "population" }}
                loadingOverlayComponent={LoadingOverlay}
                columnDefs={fieldDefs}
                onGridReady={(params) =>
                  addDropZoneToGrid(
                    params,
                    populationGridRef,
                    sampleGridRef,
                    sampleDraggableBoxRef
                  )
                }
              />
              <CustomGridBottomPagination
                gridRef={populationGridRef}
                paginationInfo={populationPaginationInfo}
                onPageChange={() =>
                  updatePaginationInfo(
                    populationGridRef,
                    setPopulationPaginationInfo
                  )
                }
                setPaginationInfo={setPopulationPaginationInfo}
              />
            </Flex>

            {/* Sample Grid Section */}
            <Flex
              direction="column"
              height="500px"
              w={"full"}
              flexGrow={1}
              ref={sampleDraggableBoxRef}
            >
              <Flex
                direction={"row"}
                w={"full"}
                justify={"flex-start"}
                align={"center"}
                p={1}
                gap={2}
              >
                <Heading color={"white"} fontSize={isMobile ? "lg" : "2xl"}>
                  {sampleTitle ?? "New Data"}
                </Heading>
                <Button
                  variant="solid"
                  bg="secondary"
                  aria-label="reset-filters"
                  onClick={() => {
                    resetFilter(
                      sampleGridRef,
                      `sample-quick-filter-${uniqueSampleQuickFilterId}`
                    );
                  }}
                  ml={"auto"}
                  size="md"
                  color="white"
                  _hover={{ bg: "perygonPink" }}
                >
                  <Clear />
                  {resetFiltersButtonText}
                </Button>
                <Input
                  variant="outline"
                  id={`sample-quick-filter-${uniqueSampleQuickFilterId}`}
                  placeholder="Search..."
                  onInput={onSampleSearchChange}
                  w={[128, 128, 256]}
                  bg="white"
                  borderColor="gray.300"
                  _hover={{ borderColor: "gray.400" }}
                  _focus={{
                    borderColor: "perygonPink",
                    boxShadow: "0 0 0 1px #ff0070",
                  }}
                />
              </Flex>
              <AgGridReact
                ref={sampleGridRef}
                rowData={sampleRowData}
                pagination
                getRowId={getRowId}
                suppressPaginationPanel
                onPaginationChanged={() =>
                  updatePaginationInfo(sampleGridRef, setSamplePaginationInfo)
                }
                defaultColDef={defaultColDef}
                onSelectionChanged={onSampleSelectionChanged}
                rowSelection={rowSelection}
                paginationPageSize={samplePaginationInfo.pageSize}
                noRowsOverlayComponent={DraggableNoDataOverlay}
                noRowsOverlayComponentParams={{ gridType: "sample" }}
                loadingOverlayComponent={LoadingOverlay}
                onGridReady={(params) =>
                  addDropZoneToGrid(
                    params,
                    sampleGridRef,
                    populationGridRef,
                    populationDraggableBoxRef
                  )
                }
                columnDefs={fieldDefs}
              />
              <CustomGridBottomPagination
                gridRef={sampleGridRef}
                paginationInfo={samplePaginationInfo}
                onPageChange={() =>
                  updatePaginationInfo(sampleGridRef, setSamplePaginationInfo)
                }
                setPaginationInfo={setSamplePaginationInfo}
              />
            </Flex>
          </Stack>

          <Flex mt={4} justify="flex-end" gap={4}>
            <Button
              mr={3}
              bgColor="darkGray"
              border="1px solid darkGray"
              color="white"
              _hover={{ color: "darkGray", backgroundColor: "white" }}
              onClick={handleUndo}
              isDisabled={undoStack.length === 0}
            >
              <Undo />
              {undoButtonText}
            </Button>
            <Button
              mr={3}
              bgColor="darkGray"
              border="1px solid darkGray"
              color="white"
              _hover={{ color: "darkGray", backgroundColor: "white" }}
              onClick={moveAllToSample}
              isDisabled={
                populationGridRef.current?.api?.getDisplayedRowCount() === 0
              }
            >
              <Add />
              {addAllButtonText}
            </Button>
            <Button
              mr={3}
              bgColor="darkGray"
              border="1px solid darkGray"
              color="white"
              _hover={{ color: "darkGray", backgroundColor: "white" }}
              onClick={moveAllToPopulation}
              isDisabled={
                sampleGridRef.current?.api?.getDisplayedRowCount() === 0
              }
            >
              <Remove />
              {removeAllButtonText}
            </Button>
            <Button
              bgColor="green"
              border="1px solid lightGray"
              color="white"
              _hover={{ color: "green", backgroundColor: "white" }}
              onClick={handleSubmission}
              isDisabled={!!errorMessage || undoStack.length === 0}
              isLoading={loading}
            >
              <Done />
              {submitButtonText}
            </Button>
          </Flex>
        </>
      ) : (
        <Box my={4} p={4} bg="red.100" color="red.800">
          <Text>{errorMessage}</Text>
        </Box>
      )}
    </Box>
  );
};
export default DraggableGridsComponent;
