"use client";

import React, { useEffect, useMemo } from "react";
import {
  useTheme,
  useColorMode,
  Flex,
  Box,
  Text,
  VStack,
  Spinner,
  Center,
  HStack,
} from "@chakra-ui/react";
import { transparentize } from "polished";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import GroupIcon from "@mui/icons-material/Group";
import TodayIcon from "@mui/icons-material/Today";

import UserRenderer from "@/components/agGrids/CellRenderers/UserRenderer";
import BookingConfirmationRenderer from "@/components/agGrids/CellRenderers/BookingConfirmationRenderer";
import DateTimeBadgeRenderer from "@/components/agGrids/CellRenderers/DateTimeBadgeRenderer";
import DateRangeFilter from "./DateRangeFilter";
import { SpringScale } from "@/components/animations/SpringScale";
import StatCard from "./StatCard";
import { formatISODate, toISODate } from "./utils";

import { ColDef } from "ag-grid-community";
import TabbedGrids from "@/components/agGrids/TabbedGrids";

/* ------------------------------------------------------------------ */
/*  Types                                                             */
/* ------------------------------------------------------------------ */
export interface BookingRow {
  id: string | number;
  itemName: string;
  startDate: string;
  endDate: string;
  bookingType: string;
  numberOfPeople?: number;
  specialRequests?: string;
  userUniqueId: string | number;
  bookerUserFullName: string;
  userImageUrl?: string | null;
  createdAt: string;
  isConfirmed: boolean;
  confirmationDate: string;
  confirmationComment: boolean;
}

/*  Static column definitions (Booker column added later) ------------ */
const bookingTableColumns: ColDef[] = [
  {
    headerName: "ID",
    field: "id",
    sortable: true,
    filter: true,
    resizable: true,
    maxWidth: 120,
  },
  {
    headerName: "Item",
    field: "itemName",
    sortable: true,
    filter: true,
    resizable: true,
    minWidth: 200,
  },
  {
    headerName: "Date & Time",
    field: "dateTime",
    cellRenderer: DateTimeBadgeRenderer,
    minWidth: 250,
  },
  {
    headerName: "Booked on",
    field: "createdAt",
    sortable: true,
    filter: true,
    resizable: true,
    minWidth: 150,
    valueFormatter: ({ value }: { value: string }) => formatISODate(value),
  },
  {
    headerName: "Type",
    field: "bookingType",
    sortable: true,
    filter: true,
    resizable: true,
    minWidth: 150,
  },
  {
    headerName: "People",
    field: "numberOfPeople",
    sortable: true,
    filter: true,
    resizable: true,
    type: "numericColumn",
    maxWidth: 120,
  },
  {
    headerName: "Special Requests",
    field: "specialRequests",
    sortable: false,
    filter: false,
    resizable: true,
    minWidth: 220,
  },
];

/* ------------------------------------------------------------------ */
/*  Component                                                         */
/* ------------------------------------------------------------------ */
const BookingsDashboard: React.FC = () => {
  const theme = useTheme();
  const { colorMode } = useColorMode();

  /* Default range = last 30 days ----------------------------------- */
  const defaultEnd = toISODate(new Date());
  const defaultStart = toISODate(new Date(Date.now() - 29 * 86_400_000));

  /* Date‑range state (inputs vs applied) --------------------------- */
  const [inputStart, setInputStart] = React.useState<string>(defaultStart);
  const [inputEnd, setInputEnd] = React.useState<string>(defaultEnd);
  const [appliedStart, setAppliedStart] = React.useState<string>(defaultStart);
  const [appliedEnd, setAppliedEnd] = React.useState<string>(defaultEnd);

  const applyDates = () => {
    setAppliedStart(inputStart);
    setAppliedEnd(inputEnd);
  };

  /* Bookings state -------------------------------------------------- */
  const [bookings, setBookings] = React.useState<BookingRow[]>([]);
  const [bookingsLoad, setBookingsLoad] = React.useState(false);
  const [bookingsError, setBookingsError] = React.useState<string | null>(null);

  /* Upcoming bookings state ---------------------------------------- */
  const [upcomingBookings, setUpcomingBookings] = React.useState<BookingRow[]>(
    []
  );
  const [upcomingLoad, setUpcomingLoad] = React.useState(false);
  const [upcomingError, setUpcomingError] = React.useState<string | null>(null);

  /* Fetch bookings whenever range changes -------------------------- */
  useEffect(() => {
    if (!appliedStart || !appliedEnd) return;

    const fetchBookings = async () => {
      setBookingsLoad(true);
      setBookingsError(null);

      const qs = new URLSearchParams({
        startDate: appliedStart,
        endDate: appliedEnd,
      }).toString();

      try {
        const res = await fetch(
          `/api/hospitality-hub/userHospitalityBooking?${qs}`
        );
        const json = await res.json();

        if (res.ok && json.resource) {
          setBookings(json.resource as BookingRow[]);
        } else {
          setBookings([]);
          setBookingsError(json.error ?? "Failed to fetch bookings");
        }
      } catch (err) {
        setBookings([]);
        setBookingsError(
          err instanceof Error ? err.message : "Failed to fetch bookings"
        );
      } finally {
        setBookingsLoad(false);
      }
    };

    fetchBookings();
  }, [appliedStart, appliedEnd]);

  /* Fetch upcoming bookings (no filters) --------------------------- */
  useEffect(() => {
    const fetchUpcoming = async () => {
      setUpcomingLoad(true);
      setUpcomingError(null);

      try {
        const res = await fetch("/api/hospitality-hub/getUpcomingBookings");
        const json = await res.json();

        if (res.ok && json.resource) {
          setUpcomingBookings(json.resource as BookingRow[]);
        } else {
          setUpcomingBookings([]);
          setUpcomingError(json.error ?? "Failed to fetch upcoming bookings");
        }
      } catch (err) {
        setUpcomingBookings([]);
        setUpcomingError(
          err instanceof Error
            ? err.message
            : "Failed to fetch upcoming bookings"
        );
      } finally {
        setUpcomingLoad(false);
      }
    };

    fetchUpcoming();
  }, []);

  /* Booker column definition (pulls data straight from row) -------- */
  const colsWithBooker: ColDef[] = useMemo(
    () => [
      ...bookingTableColumns,
      {
        headerName: "Confirmation",
        field: "isConfirmed",
        minWidth: 200,
        cellRenderer: BookingConfirmationRenderer,
        cellRendererParams: (params: any) => ({
          id: params.data.id,
          isConfirmed: params.data.isConfirmed,
          confirmationDate: params.data.confirmationDate,
          confirmationComment: params.data.confirmationComment,
        }),
        sortable: false,
        filter: false,
        resizable: true,
      },
      {
        headerName: "Booker",
        field: "bookerUserFullName",
        cellRenderer: UserRenderer,
        cellRendererParams: {
          uniqueIdField: "userUniqueId",
          imageUrlField: "userImageUrl",
          nameField: "bookerUserFullName",
        },
        minWidth: 180,
        flex: 1,
        sortable: false,
        filter: false,
        resizable: true,
        valueGetter: (p: any) => p.data?.bookerUserFullName ?? "",
      },
    ],
    []
  );

  /* KPI calculations ------------------------------------------------ */
  const totalBookings = bookings.length;
  const totalPeople = bookings.reduce(
    (sum, b) => sum + (b.numberOfPeople ?? 0),
    0
  );
  const upcomingCount = upcomingBookings.length;

  /* Styling helpers ------------------------------------------------- */
  const cardBg = transparentize(
    colorMode === "dark" ? 0.93 : 0.85,
    theme.colors.blue[500] ?? "#3182CE"
  );
  const cardBorder =
    colorMode === "dark" ? `1.5px solid ${theme.colors.gray[700]}` : undefined;

  /* ---------------------------------------------------------------- */
  /* Render                                                           */
  /* ---------------------------------------------------------------- */
  const isLoading = bookingsLoad || upcomingLoad;
  const hasError = bookingsError || upcomingError;

  return (
    <VStack w="100%" spacing={8} align="stretch" mt={4} mb={8}>
      {/* KPI row (always visible) ----------------------------------- */}
      <Flex w="100%" gap={6} direction={{ base: "column", md: "row" }} flex={1}>
        {/* Total Bookings ------------------------------------------- */}
        <SpringScale delay={0.1} style={{ flex: 1 }}>
          <StatCard
            icon={
              <EventAvailableIcon
                fontSize="inherit"
                style={{ color: theme.colors.primary }}
              />
            }
            title="Total Bookings"
            color={"#2a4365"}
            overlayAlpha={0.85}
          >
            <Text
              fontSize="3xl"
              fontWeight="bold"
              color={theme.colors.primaryTextColor}
            >
              {totalBookings.toLocaleString()}
            </Text>
          </StatCard>
        </SpringScale>

        {/* Total People --------------------------------------------- */}
        <SpringScale delay={0.2} style={{ flex: 1 }}>
          <StatCard
            icon={
              <GroupIcon
                fontSize="inherit"
                style={{ color: theme.colors.primary }}
              />
            }
            title="Total People"
            color={"#2a4365"}
            overlayAlpha={0.85}
          >
            <Text
              fontSize="3xl"
              fontWeight="bold"
              color={theme.colors.primaryTextColor}
            >
              {totalPeople.toLocaleString()}
            </Text>
          </StatCard>
        </SpringScale>

        {/* Upcoming Bookings ---------------------------------------- */}
        <SpringScale delay={0.3} style={{ flex: 1 }}>
          <StatCard
            icon={
              <TodayIcon
                fontSize="inherit"
                style={{ color: theme.colors.primary }}
              />
            }
            title="Upcoming Bookings"
            color={"#2a4365"}
            overlayAlpha={0.85}
          >
            <Text
              fontSize="3xl"
              fontWeight="bold"
              color={theme.colors.primaryTextColor}
            >
              {upcomingCount.toLocaleString()}
            </Text>
          </StatCard>
        </SpringScale>
      </Flex>

      {/* Date Range Filter ----------------------------------------- */}
      <SpringScale delay={0}>
        <Flex mb={2} gap={4} align="flex-end" wrap="wrap">
          <DateRangeFilter
            startDate={inputStart}
            endDate={inputEnd}
            onStartDateChange={setInputStart}
            onEndDateChange={setInputEnd}
            onApply={applyDates}
          />
        </Flex>
      </SpringScale>

      {/* Tabbed Grids or load / error states ----------------------- */}
      {isLoading ? (
        <Center minH="300px">
          <Spinner size="xl" />
        </Center>
      ) : hasError ? (
        <Center minH="300px">
          <Text color="red.400">{bookingsError ?? upcomingError}</Text>
        </Center>
      ) : (
        <SpringScale delay={0.4}>
          <TabbedGrids
            dataSources={[
              {
                title: "All Bookings",
                data: bookings,
                fields: colsWithBooker,
              },
              {
                title: "Upcoming Bookings",
                data: upcomingBookings,
                fields: colsWithBooker,
              },
            ]}
          />
        </SpringScale>
      )}
    </VStack>
  );
};

export default BookingsDashboard;
