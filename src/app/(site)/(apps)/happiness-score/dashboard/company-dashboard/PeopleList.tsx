import React, { useEffect, useState } from "react";
import {
  Avatar,
  Box,
  Grid,
  HStack,
  IconButton,
  Select,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useBreakpointValue,
  useTheme,
  VStack,
} from "@chakra-ui/react";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { AnimatePresence, motion } from "framer-motion";

interface Person {
  userId: number;
  fullName: string;
  jobTitle: string;
  department: string;
  site: string;
  score: number;
  imageUrl: string;
}

interface PeopleListProps {
  people: Person[];
  currentPage: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  onItemsPerPageChange: (itemsPerPage: number) => void;
  handleUserClick: (userId: number) => void;
}

const PeopleList: React.FC<PeopleListProps> = ({
  people,
  currentPage,
  itemsPerPage,
  onPageChange,
  onItemsPerPageChange,
  handleUserClick,
}) => {
  const isMobile = useBreakpointValue({ base: true, sm: true, md: false });
  const [paginationText, setPaginationText] = useState("");

  const [sortConfig, setSortConfig] = React.useState<{
    key: keyof Person;
    direction: "ascending" | "descending";
  } | null>(null);

  const sortedPeople = React.useMemo(() => {
    const sorted = [...people].sort((a, b) => {
      if (!sortConfig) return 0;

      const { key, direction } = sortConfig;

      if (a[key] < b[key]) {
        return direction === "ascending" ? -1 : 1;
      }
      if (a[key] > b[key]) {
        return direction === "ascending" ? 1 : -1;
      }
      return 0;
    });
    return sorted;
  }, [people, sortConfig]);

  const totalPages = Math.ceil(sortedPeople.length / itemsPerPage);

  React.useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      onPageChange(totalPages);
    }
  }, [currentPage, totalPages, onPageChange]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedPeople.slice(indexOfFirstItem, indexOfLastItem);

  const handleSort = (key: keyof Person) => {
    setSortConfig((prevState) => {
      if (prevState?.key === key && prevState.direction === "ascending") {
        return { key, direction: "descending" };
      }
      return { key, direction: "ascending" };
    });
  };

  const getSortIcon = (key: keyof Person) => {
    if (!sortConfig || sortConfig.key !== key) return null;
    return sortConfig.direction === "ascending" ? (
      <ArrowDropUpIcon />
    ) : (
      <ArrowDropDownIcon />
    );
  };

  const handleItemsPerPageChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    onItemsPerPageChange(Number(event.target.value));
    onPageChange(1);
  };

  const handlePreviousPage = () => {
    onPageChange(Math.max(currentPage - 1, 1));
  };

  const handleNextPage = () => {
    onPageChange(Math.min(currentPage + 1, totalPages));
  };

  const columns = [
    {
      key: "imageUrl",
      label: "",
      sortable: false,
      width: "60px",
    },
    {
      key: "fullName",
      label: "Name",
      sortable: true,
    },
    {
      key: "jobTitle",
      label: "Job Title",
      sortable: true,
      display: ["none", "table-cell"],
    },
    {
      key: "department",
      label: "Department",
      sortable: true,
      display: ["none", null, null, null, "table-cell"],
    },
    {
      key: "site",
      label: "Site",
      sortable: true,
      display: ["none", null, null, null, "table-cell"],
    },
    {
      key: "score",
      label: "Score",
      sortable: true,
      width: "100px",
    },
  ];

  const baseDelay = 0.1;
  const delayIncrement = 0.05;

  const itemVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: (index: number) => ({
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.3,
        delay: baseDelay + index * delayIncrement,
      },
    }),
    exit: { opacity: 0, x: -50, transition: { duration: 0.3 } },
  };

  const paginationNumbers = Array.from(
    new Set(
      [5, 10, 25, 50, 100, 200, 500]
        .filter((option) => option <= people.length)
        .concat(people.length)
    )
  )
    .sort((a, b) => a - b) // Ensure options are sorted numerically
    .map((option) => (
      <option key={option} value={option}>
        {option}
      </option>
    ));

  useEffect(() => {
    const text = isMobile
      ? `${currentPage} of ${totalPages}`
      : `Page ${currentPage} of ${totalPages}`;
    setPaginationText(text);
  }, [isMobile, currentPage, totalPages]);

  const theme = useTheme();

  return (
    <VStack
      p={4}
      borderWidth={1}
      borderRadius="2xl"
      overflow="hidden"
      bg="white"
      maxW="100%"
      flex={1}
      justifyContent="space-between"
    >
      <TableContainer
        overflowX="auto"
        overflowY="auto"
        maxHeight={428}
        width="100%"
      >
        <Table variant="unstyled" colorScheme="gray" size="sm" layout="fixed">
          <Thead>
            <Tr>
              {columns.map(({ key, label, sortable, width, display }) => (
                <Th
                  key={key}
                  cursor={sortable ? "pointer" : "default"}
                  onClick={() => sortable && handleSort(key as keyof Person)}
                  textOverflow="ellipsis"
                  whiteSpace="nowrap"
                  overflow="hidden"
                  bg="white"
                  position="sticky"
                  top="0"
                  zIndex={1}
                  width={width || "auto"}
                  display={display || "table-cell"}
                  textTransform="none"
                >
                  <HStack spacing={2}>
                    <Text fontSize={["xs", "sm"]}>{label}</Text>
                    {sortable && (
                      <Box w="40px" textAlign="center">
                        {getSortIcon(key as keyof Person)}
                      </Box>
                    )}
                  </HStack>
                </Th>
              ))}
            </Tr>
          </Thead>
          <Tbody>
            <AnimatePresence>
              {currentItems.map((person, index) => (
                <motion.tr
                  key={`${person.userId}-${person.fullName}-${index}`}
                  variants={itemVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  custom={index}
                  style={{
                    cursor: "pointer",
                  }}
                  onClick={() => handleUserClick(person.userId)}
                >
                  {columns.map(({ key, display, width }) => {
                    const isOddRow = index % 2 !== 0;
                    if (key === "imageUrl") {
                      return (
                        <Td
                          key={key}
                          display={display || "table-cell"}
                          width={width}
                          bg={isOddRow ? "gray.100" : "white"}
                        >
                          <Avatar
                            src={person.imageUrl}
                            name={person.fullName}
                            size="sm"
                          />
                        </Td>
                      );
                    } else {
                      return (
                        <Td
                          key={key}
                          display={display || "table-cell"}
                          width={width || "auto"}
                          bg={isOddRow ? "gray.100" : "white"}
                          textOverflow="ellipsis"
                          whiteSpace="nowrap"
                          overflow="hidden"
                        >
                          {person[key as keyof Person]}
                        </Td>
                      );
                    }
                  })}
                </motion.tr>
              ))}
            </AnimatePresence>
          </Tbody>
        </Table>
      </TableContainer>
      <Grid mt={4} width="100%" templateColumns="1fr 1fr">
        <HStack>
          <Text display={["none", null, null, null, "block"]} mr={2}>
            Showing:
          </Text>
          <Select
            value={itemsPerPage}
            onChange={handleItemsPerPageChange}
            size="sm"
            width="auto"
            sx={{
              option: {
                backgroundColor: theme.colors.elementBG,
              },
            }}
          >
            {paginationNumbers}
          </Select>
          <Text>of {people.length}</Text>
        </HStack>
        <HStack justifyContent="flex-end">
          <Text mx={1} minWidth={["60px", null, "120px"]} textAlign="center">
            {paginationText}
          </Text>
          <IconButton
            onClick={handlePreviousPage}
            isDisabled={currentPage === 1}
            icon={<ChevronLeftIcon />}
            aria-label="Previous page"
            size="sm"
          />
          <IconButton
            onClick={handleNextPage}
            isDisabled={currentPage === totalPages || totalPages === 0}
            icon={<ChevronRightIcon />}
            aria-label="Next page"
            size="sm"
          />
        </HStack>
      </Grid>
    </VStack>
  );
};

export default PeopleList;
