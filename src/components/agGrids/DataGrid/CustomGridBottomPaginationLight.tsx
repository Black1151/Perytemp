import React, { useMemo } from "react";
import {
  Box,
  Grid,
  HStack,
  IconButton,
  Select,
  Text,
  useBreakpointValue,
  useTheme,
} from "@chakra-ui/react";
import { KeyboardArrowLeft, KeyboardArrowRight } from "@mui/icons-material";
import { AgGridReact } from "ag-grid-react";

interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalRows: number;
  pageSize: number;
}

interface CustomGridBottomPaginationLightProps {
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

const CustomGridBottomPaginationLight: React.FC<
  CustomGridBottomPaginationLightProps
> = ({ gridRef, paginationInfo, onPageChange, setPaginationInfo }) => {
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

  const paginationText = isMobile
    ? `${paginationInfo.currentPage} of ${paginationInfo.totalPages}`
    : `Page ${paginationInfo.currentPage} of ${paginationInfo.totalPages}`;

  const theme = useTheme();

  return (
    <Box w="full" px={1} color="black" mt={2}>
      <Grid templateColumns="1fr 1fr" alignItems="center">
        <HStack>
          <Text
            display={["none", null, null, null, "block"]}
            mr={2}
            color="primaryTextColor"
          >
            Showing:
          </Text>
          <Select
            size="sm"
            width="auto"
            value={paginationInfo.pageSize}
            color="primaryTextColor"
            sx={{
              option: {
                backgroundColor: theme.colors.elementBG,
              },
            }}
            onChange={(e) => {
              const newPageSize = Number(e.target.value);
              if (gridRef.current?.api) {
                gridRef.current.api.setGridOption(
                  "paginationPageSize",
                  newPageSize
                );
                setPaginationInfo((prev) => ({
                  ...prev,
                  pageSize: newPageSize,
                  totalPages: Math.ceil(prev.totalRows / newPageSize),
                }));
              }
            }}
          >
            {pageSizeOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </Select>

          <Text color="primaryTextColor">of {paginationInfo.totalRows}</Text>
        </HStack>
        <HStack justifyContent="flex-end">
          <Text
            mx={1}
            minWidth={["60px", null, "120px"]}
            textAlign="center"
            color="primaryTextColor"
          >
            {paginationText}
          </Text>
          <IconButton
            aria-label="Previous Page"
            icon={<KeyboardArrowLeft />}
            size="sm"
            onClick={goToPreviousPage}
            disabled={paginationInfo.currentPage <= 1}
            variant="agPrimary"
            color="primaryTextColor"
            _hover={{
              backgroundColor: "primary",
              color: "white",
            }}
          />
          <IconButton
            aria-label="Next Page"
            icon={<KeyboardArrowRight />}
            size="sm"
            onClick={goToNextPage}
            disabled={paginationInfo.currentPage >= paginationInfo.totalPages}
            variant="agPrimary"
            color="primaryTextColor"
            _hover={{
              backgroundColor: "primary",
              color: "white",
            }}
          />
        </HStack>
      </Grid>
    </Box>
  );
};

export default CustomGridBottomPaginationLight;
