import React, { useMemo } from "react";
import {
  background,
  Box,
  Button,
  Flex,
  IconButton,
  Select,
  Text,
  useBreakpointValue,
  useTheme,
} from "@chakra-ui/react";
import {
  ArrowBack,
  ArrowForward,
  KeyboardArrowLeft,
  KeyboardArrowRight,
} from "@mui/icons-material";
import { AgGridReact } from "ag-grid-react";

interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalRows: number;
  pageSize: number;
}

interface CustomGridBottomPaginationProps {
  gridRef: React.RefObject<AgGridReact>;
  paginationInfo: PaginationInfo;
  onPageChange: () => void;
  setPaginationInfo: React.Dispatch<React.SetStateAction<PaginationInfo>>;
}

function getPageSizeOptions(totalRows: number) {
  const baseSizes = [10, 25, 50, 100, 250];
  let filtered = baseSizes.filter((size) => size <= totalRows);

  if (totalRows <= 500) {
    filtered.push(totalRows); // Add totalRows if it's less than or equal to 1000
  } else {
    filtered.push(500); // Add 1000 as the max if totalRows exceeds 1000
  }

  return filtered;
}

const CustomGridBottomPagination: React.FC<CustomGridBottomPaginationProps> = ({
  gridRef,
  paginationInfo,
  onPageChange,
  setPaginationInfo,
}) => {
  const isMobile = useBreakpointValue({ base: true, md: false });

  const pageSizeOptions = useMemo(
    () => getPageSizeOptions(paginationInfo.totalRows),
    [paginationInfo.totalRows]
  );

  const goToFirstPage = () => {
    gridRef.current?.api.paginationGoToFirstPage();
    onPageChange();
  };

  const goToLastPage = () => {
    gridRef.current?.api.paginationGoToLastPage();
    onPageChange();
  };

  const goToNextPage = () => {
    gridRef.current?.api.paginationGoToNextPage();
    onPageChange();
  };

  const goToPreviousPage = () => {
    gridRef.current?.api.paginationGoToPreviousPage();
    onPageChange();
  };

  const pageDisplay = `Page ${paginationInfo.currentPage == 0 ? 0 : paginationInfo.currentPage} of ${paginationInfo.totalPages}`;

  const rowDisplay = `${paginationInfo.totalRows == 0 ? 0 : paginationInfo.currentPage * paginationInfo.pageSize - paginationInfo.pageSize + 1} to ${paginationInfo.currentPage * paginationInfo.pageSize < paginationInfo.totalRows ? paginationInfo.currentPage * paginationInfo.pageSize : paginationInfo.totalRows} of ${paginationInfo.totalRows}`;

  const theme = useTheme();

  return (
    <Box
      w={"full"}
      px={4}
      pt={2}
      borderTop={"1px solid white"}
      borderBottom={"1px solid white"}
      color={"white"}
    >
      <Flex
        direction={isMobile ? "column" : "row"}
        alignItems={isMobile ? "stretch" : "center"}
        justifyContent={isMobile ? "center" : "space-between"}
        gap={isMobile ? 1 : 2}
      >
        <Flex justify={"center"} align={"center"} gap={isMobile ? 1 : 2}>
          <Select
            size="sm"
            width="auto"
            sx={{
              option: {
                backgroundColor: theme.colors.elementBG,
              },
            }}
            value={paginationInfo.pageSize}
            onChange={(e) => {
              const newPageSize = Number(e.target.value);
              if (gridRef.current?.api) {
                // Correct method to set the page size
                gridRef.current.api.setGridOption(
                  "paginationPageSize",
                  newPageSize
                );
                // Update the pagination info state
                setPaginationInfo((prev) => ({
                  ...prev,
                  pageSize: newPageSize,
                  totalPages: Math.ceil(prev.totalRows / newPageSize), // Use prev to access the current totalRows
                }));
              }
            }}
          >
            {pageSizeOptions.map((option) => (
              <option key={option} value={option} style={{ color: "black" }}>
                {option}
              </option>
            ))}
          </Select>

          <Text>of {paginationInfo.totalRows}</Text>
        </Flex>

        <Flex
          gap={isMobile ? 1 : 2}
          justifyContent={isMobile ? "center" : "center"}
          align={"center"}
        >
          <Flex justifyContent="center" align={"center"} gap={isMobile ? 1 : 2}>
            <Flex
              direction={"column"}
              justify={"center"}
              align={isMobile ? "center" : "flex-start"}
              gap={isMobile ? 1 : 2}
            >
              {!isMobile && <Text>{pageDisplay}</Text>}
              {/*<Text>{rowDisplay}</Text>*/}
            </Flex>
            <Button
              size={isMobile ? "sm" : "md"}
              onClick={goToFirstPage}
              variant="agPrimary"
              my={2}
            >
              <KeyboardArrowLeft />
            </Button>
            <IconButton
              aria-label="Previous Page"
              icon={<ArrowBack />}
              size={isMobile ? "sm" : "md"}
              onClick={goToPreviousPage}
              variant="agPrimary"
              my={2}
            />

            <IconButton
              aria-label="Next Page"
              icon={<ArrowForward />}
              size={isMobile ? "sm" : "md"}
              onClick={goToNextPage}
              variant="agPrimary"
              my={2}
            />
            <Button
              size={isMobile ? "sm" : "md"}
              onClick={goToLastPage}
              variant="agPrimary"
              my={2}
            >
              <KeyboardArrowRight />
            </Button>
          </Flex>
        </Flex>
      </Flex>
    </Box>
  );
};

export default CustomGridBottomPagination;
