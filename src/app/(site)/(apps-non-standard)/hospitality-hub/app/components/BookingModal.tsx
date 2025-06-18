"use client";

import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  Button,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  useToast,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { HospitalityItem, HospitalityBooking } from "@/types/hospitalityHub";
import { useUser } from "@/providers/UserProvider";

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: HospitalityItem | null;
}

interface BookingFormProps {
  item: HospitalityItem;
  onClose: () => void;
  submit: (data: HospitalityBooking, reset: () => void) => Promise<void>;
}

function SingleDayBookingForm({ item, onClose, submit }: BookingFormProps) {
  const { user } = useUser();
  const { register, handleSubmit, reset } = useForm<HospitalityBooking>();

  const onSubmit = async (data: HospitalityBooking) => {
    await submit(data, reset);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <ModalBody>
        <input type="hidden" value={item.id} {...register("userHospitalityItemId")} />
        <input type="hidden" value={user?.customerId ?? 0} {...register("customerId")} />
        <input type="hidden" value={item.itemType} {...register("bookingType")} />

        <FormControl mb={4}>
          <FormLabel>Date</FormLabel>
          <Input type="date" {...register("startDate")} />
        </FormControl>

        <FormControl mb={4}>
          <FormLabel>Number of People</FormLabel>
          <Input type="number" {...register("numberOfPeople", { valueAsNumber: true })} />
        </FormControl>

        <FormControl mb={4}>
          <FormLabel>Special Requests</FormLabel>
          <Textarea {...register("specialRequests")} />
        </FormControl>
      </ModalBody>
      <ModalFooter>
        <Button mr={3} onClick={onClose}>Cancel</Button>
        <Button colorScheme="blue" type="submit">Submit</Button>
      </ModalFooter>
    </form>
  );
}

function MultiDayBookingForm({ item, onClose, submit }: BookingFormProps) {
  const { user } = useUser();
  const { register, handleSubmit, reset } = useForm<HospitalityBooking>();

  const onSubmit = async (data: HospitalityBooking) => {
    await submit(data, reset);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <ModalBody>
        <input type="hidden" value={item.id} {...register("userHospitalityItemId")} />
        <input type="hidden" value={user?.customerId ?? 0} {...register("customerId")} />
        <input type="hidden" value={item.itemType} {...register("bookingType")} />

        <FormControl mb={4}>
          <FormLabel>Start Date</FormLabel>
          <Input type="date" {...register("startDate")} />
        </FormControl>

        <FormControl mb={4}>
          <FormLabel>End Date</FormLabel>
          <Input type="date" {...register("endDate")} />
        </FormControl>

        <FormControl mb={4}>
          <FormLabel>Number of People</FormLabel>
          <Input type="number" {...register("numberOfPeople", { valueAsNumber: true })} />
        </FormControl>

        <FormControl mb={4}>
          <FormLabel>Special Requests</FormLabel>
          <Textarea {...register("specialRequests")} />
        </FormControl>
      </ModalBody>
      <ModalFooter>
        <Button mr={3} onClick={onClose}>Cancel</Button>
        <Button colorScheme="blue" type="submit">Submit</Button>
      </ModalFooter>
    </form>
  );
}

function SingleDayWithStartEndBookingForm({ item, onClose, submit }: BookingFormProps) {
  const { user } = useUser();
  const { register, handleSubmit, reset } = useForm<HospitalityBooking>();

  const onSubmit = async (data: HospitalityBooking) => {
    await submit(data, reset);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <ModalBody>
        <input type="hidden" value={item.id} {...register("userHospitalityItemId")} />
        <input type="hidden" value={user?.customerId ?? 0} {...register("customerId")} />
        <input type="hidden" value={item.itemType} {...register("bookingType")} />

        <FormControl mb={4}>
          <FormLabel>Date</FormLabel>
          <Input type="date" {...register("startDate")} />
        </FormControl>

        <FormControl mb={4}>
          <FormLabel>Start Time</FormLabel>
          <Input type="datetime-local" {...register("startTime")} />
        </FormControl>

        <FormControl mb={4}>
          <FormLabel>End Time</FormLabel>
          <Input type="datetime-local" {...register("endTime")} />
        </FormControl>

        <FormControl mb={4}>
          <FormLabel>Number of People</FormLabel>
          <Input type="number" {...register("numberOfPeople", { valueAsNumber: true })} />
        </FormControl>

        <FormControl mb={4}>
          <FormLabel>Special Requests</FormLabel>
          <Textarea {...register("specialRequests")} />
        </FormControl>
      </ModalBody>
      <ModalFooter>
        <Button mr={3} onClick={onClose}>Cancel</Button>
        <Button colorScheme="blue" type="submit">Submit</Button>
      </ModalFooter>
    </form>
  );
}

export default function BookingModal({ isOpen, onClose, item }: BookingModalProps) {
  const toast = useToast();
  const { user } = useUser();

  if (!item) return null;

  const submitBooking = async (data: HospitalityBooking, reset: () => void) => {
    data.userHospitalityItemId = Number(item.id);
    data.customerId = user?.customerId ?? 0;
    data.bookingType = item.itemType;

    if (data.startTime) {
      data.startTime = data.startTime.replace("T", " ") + ":00";
    }
    if (data.endTime) {
      data.endTime = data.endTime.replace("T", " ") + ":00";
    }

    try {
      const res = await fetch("/api/hospitality-hub/userHospitalityBooking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await res.json();

      if (!res.ok) {
        toast({
          title: result.error || "Failed to submit booking.",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom-right",
        });
        return;
      }

      toast({
        title: "Booking submitted.",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom-right",
      });
      reset();
      onClose();
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-right",
      });
    }
  };

  let FormComponent: React.FC<BookingFormProps> | null = null;

  switch (item.itemType) {
    case "singleDayBookable":
      FormComponent = SingleDayBookingForm;
      break;
    case "multiDayBookable":
      FormComponent = MultiDayBookingForm;
      break;
    case "singleDayBookableWithStartEnd":
      FormComponent = SingleDayWithStartEndBookingForm;
      break;
    default:
      FormComponent = null;
  }

  if (!FormComponent) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Book {item.name}</ModalHeader>
        <ModalCloseButton />
        <FormComponent item={item} onClose={onClose} submit={submitBooking} />
      </ModalContent>
    </Modal>
  );
}
