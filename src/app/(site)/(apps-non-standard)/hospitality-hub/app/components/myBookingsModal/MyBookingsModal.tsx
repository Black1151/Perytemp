import React, { useEffect, useState, useMemo } from "react";
import TableModal from "@/components/modals/TableModal";
import { HospitalityBooking } from "@/types/hospitalityHub";
import { ColDef } from "ag-grid-community";
import { format } from "date-fns";
import { Spinner, Center, Text } from "@chakra-ui/react";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import { useUser } from "@/providers/UserProvider";
import DateTimeBadgeRenderer from "@/components/agGrids/CellRenderers/DateTimeBadgeRenderer";
import ConfirmationBadgeRenderer from "@/components/agGrids/CellRenderers/ConfirmationBadgeRenderer";
import PeopleIconRenderer from "@/components/agGrids/CellRenderers/PeopleIconRenderer";

export interface MyBookingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MyBookingsModal({ isOpen, onClose }: MyBookingsModalProps) {
  const { user } = useUser();
  const [data, setData] = useState<HospitalityBooking[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    if (!user?.userId) return;
    setLoading(true);
    setError(null);
    const userId = user.userId;
    const url = `/api/hospitality-hub/userHospitalityBooking?userId=${encodeURIComponent(userId)}`;
    fetch(url)
      .then(async (res) => {
        const json = await res.json();
        if (res.ok && json.resource) {
          setData(json.resource);
        } else {
          setData([]);
          setError(json.error ?? "Failed to fetch bookings");
        }
      })
      .catch((err) => {
        setData([]);
        setError(err?.message ?? "Failed to fetch bookings");
      })
      .finally(() => setLoading(false));
  }, [isOpen, user]);

  const columns: ColDef[] = useMemo(() => [
    { 
      headerName: "Item", 
      field: "itemName", 
      minWidth: 300
    },
    { 
      headerName: "Date & Time", 
      field: "dateTime", 
      cellRenderer: DateTimeBadgeRenderer
    },
    { headerName: "People", field: "numberOfPeople", maxWidth: 170, type: "numericColumn", cellRenderer: PeopleIconRenderer },
    { headerName: "Your Special Requests", field: "specialRequests", minWidth: 200 },
    { headerName: "Confirmed At", field: "confirmationDate", cellRenderer: ConfirmationBadgeRenderer },
  ], []);

  if (!user?.userId) {
    return (
      <Center minH="200px">
        <Spinner size="lg" />
        <Text ml={4}>Loading user information...</Text>
      </Center>
    );
  }

  return (
    <TableModal
      isOpen={isOpen}
      onClose={onClose}
      icon={<EventAvailableIcon fontSize="large" color="primary" />}
      title="My Bookings"
      total={data?.length}
      initialFields={columns}
      data={data}
      loading={loading}
      showTopBar={true}
    />
  );
} 