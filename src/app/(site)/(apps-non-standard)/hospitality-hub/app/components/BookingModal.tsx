"use client";

import React from "react";
import {
  FormControl,
  FormLabel,
  Input,
  Textarea,
  useTheme,
  useToast,
} from "@chakra-ui/react";
import { CalendarToday, EventAvailable } from "@mui/icons-material";
import { useForm } from "react-hook-form";

import { HospitalityItem, HospitalityBooking } from "@/types/hospitalityHub";
import { useUser } from "@/providers/UserProvider";
import { SpringModal } from "@/components/modals/springModal/SpringModal";

/* -------------------------------------------------------------------------- */
/*  Shared helper types                                                       */
/* -------------------------------------------------------------------------- */

/**
 * Form values *exclude* the two meta fields that aren't collected in the UI;
 * they're injected later before sending to the BE.
 */
type FormValues = Omit<HospitalityBooking, "bookingType" | "itemType">;

/* -------------------------------------------------------------------------- */
/*  FORM COMPONENT                                                            */
/* -------------------------------------------------------------------------- */

interface BookingFormProps {
  item: HospitalityItem;
  onClose: () => void;
  submit: (data: FormValues, reset: () => void) => Promise<void>;
  isSubmitting: boolean;
  setFormValid: (valid: boolean) => void;
}

function BookingForm({
  item,
  onClose,
  submit,
  isSubmitting,
  setFormValid,
}: BookingFormProps) {
  const theme = useTheme();
  const { register, handleSubmit, reset, formState: { errors, isValid } } = useForm<FormValues>({ mode: "onChange" });

  React.useEffect(() => {
    setFormValid(isValid);
  }, [isValid, setFormValid]);

  /* ---------- Render exactly ONE set of date/time inputs ------------------ */
  const renderDateInputs = () => {
    switch (item.itemType) {
      case "singleDayBookable":
        return (
          <FormControl mb={4} isInvalid={!!errors.startDate}>
            <FormLabel>Date</FormLabel>
            <Input
              type="date"
              className="white-calendar-icon"
              {...register("startDate", { required: "This field is required" })}
              bg="transparent"
              color="white"
            />
            {errors.startDate && (
              <span style={{ color: 'red', fontSize: '0.9em' }}>{errors.startDate.message as string}</span>
            )}
          </FormControl>
        );

      case "multiDayBookable":
        return (
          <>
            <FormControl mb={4} isInvalid={!!errors.startDate}>
              <FormLabel>Start date</FormLabel>
              <Input
                type="date"
                className="white-calendar-icon"
                {...register("startDate", { required: "This field is required" })}
                bg="transparent"
                color="white"
              />
              {errors.startDate && (
                <span style={{ color: 'red', fontSize: '0.9em' }}>{errors.startDate.message as string}</span>
              )}
            </FormControl>
            <FormControl mb={4} isInvalid={!!errors.endDate}>
              <FormLabel>End date</FormLabel>
              <Input
                type="date"
                className="white-calendar-icon"
                {...register("endDate", { required: "This field is required" })}
                bg="transparent"
                color="white"
              />
              {errors.endDate && (
                <span style={{ color: 'red', fontSize: '0.9em' }}>{errors.endDate.message as string}</span>
              )}
            </FormControl>
          </>
        );

      case "singleDayBookableWithStartEnd":
        return (
          <>
            <FormControl mb={4} isInvalid={!!errors.startDate}>
              <FormLabel>Date</FormLabel>
              <Input
                type="date"
                className="white-calendar-icon"
                {...register("startDate", { required: "This field is required" })}
                bg="transparent"
                color="white"
              />
              {errors.startDate && (
                <span style={{ color: 'red', fontSize: '0.9em' }}>{errors.startDate.message as string}</span>
              )}
            </FormControl>
            {/* <FormControl mb={4} isInvalid={!!errors.endDate}>
              <FormLabel>End date</FormLabel>
              <Input
                type="date"
                className="white-calendar-icon"
                {...register("endDate", { required: "This field is required" })}
                bg="transparent"
                color="white"
              />
              {errors.endDate && (
                <span style={{ color: 'red', fontSize: '0.9em' }}>{errors.endDate.message as string}</span>
              )}
            </FormControl> */}
            <FormControl mb={4} isInvalid={!!errors.startTime}>
              <FormLabel>Start time</FormLabel>
              <Input
                type="time"
                {...register("startTime", { required: "This field is required" })}
                bg="transparent"
                color="white"
              />
              {errors.startTime && (
                <span style={{ color: 'red', fontSize: '0.9em' }}>{errors.startTime.message as string}</span>
              )}
            </FormControl>
            <FormControl mb={4} isInvalid={!!errors.endTime}>
              <FormLabel>End time</FormLabel>
              <Input
                type="time"
                {...register("endTime")}
                bg="transparent"
                color="white"
              />
              {errors.endTime && (
                <span style={{ color: 'red', fontSize: '0.9em' }}>{errors.endTime.message as string}</span>
              )}
            </FormControl>
          </>
        );

      default:
        return null;
    }
  };

  /* ------------------------------------------------------------------------ */
  const onSubmit = (formData: FormValues) => submit(formData, reset);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* Hidden but UNIQUE id still registered so it appears in form values */}
      <input
        type="hidden"
        value={item.id}
        {...register("userHospitalityItemId", { valueAsNumber: true, required: true })}
      />

      {renderDateInputs()}

      <FormControl mb={4} isInvalid={!!errors.numberOfPeople}>
        <FormLabel>Number of people</FormLabel>
        <Input
          type="number"
          {...register("numberOfPeople", { valueAsNumber: true, required: "This field is required" })}
          bg="transparent"
          color="white"
        />
        {errors.numberOfPeople && (
          <span style={{ color: 'red', fontSize: '0.9em' }}>{errors.numberOfPeople.message as string}</span>
        )}
      </FormControl>

      <FormControl mb={4} isInvalid={!!errors.specialRequests}>
        <FormLabel>Special requests</FormLabel>
        <Textarea
          {...register("specialRequests", { required: "This field is required" })}
          bg="transparent"
          color="white"
        />
        {errors.specialRequests && (
          <span style={{ color: 'red', fontSize: '0.9em' }}>{errors.specialRequests.message as string}</span>
        )}
      </FormControl>

      {/* Invisible submit target for the modal's primary button */}
      <button
        type="submit"
        style={{ display: "none" }}
        disabled={isSubmitting}
      />
    </form>
  );
}

/* -------------------------------------------------------------------------- */
/*  MODAL COMPONENT                                                           */
/* -------------------------------------------------------------------------- */

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: HospitalityItem | null;
  onSuccess?: () => void;
}

export default function BookingModal({
  isOpen,
  onClose,
  item,
  onSuccess,
}: BookingModalProps) {
  const toast = useToast();
  const theme = useTheme();
  const { user } = useUser();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isFormValid, setIsFormValid] = React.useState(false);

  if (!item) return null;

  /* ---------- Build a clean payload with unique keys ---------------------- */
  const buildPayload = (
    raw: FormValues
  ): HospitalityBooking & { bookingType: string; itemType: string } => {
    const {
      startDate,
      endDate,
      startTime,
      endTime,
      numberOfPeople,
      specialRequests,
      userHospitalityItemId,
    } = raw;

    return {
      startDate,
      endDate,
      startTime: startTime ? startTime.replace("T", " ") + ":00" : undefined,
      endTime: endTime ? endTime.replace("T", " ") + ":00" : undefined,
      numberOfPeople,
      specialRequests,
      userHospitalityItemId,
      /* server-required meta */
      customerId: user?.customerId ?? 0,
      bookingType: item.itemType,
      itemType: item.itemType,
      bookerUserId: user?.userId ?? 0,
      ownerUserId: Number(
        (item.itemOwnerUserId as unknown) ?? (item as any).catOwnerUserId ?? 0
      ),
    };
  };

  /* ---------- Submit ------------------------------------------------------ */
  const submit = async (form: FormValues, reset: () => void) => {
    setIsSubmitting(true);
    const payload = buildPayload(form);

    try {
      const res = await fetch("/api/hospitality-hub/userHospitalityBooking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
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
        setIsSubmitting(false);
        return;
      }

      toast({
        title: "Booking submitted.",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom-right",
      });

      // Log engagement
      if (user?.userId && user?.customerId && item?.id) {
        try {
          await fetch("/api/hospitality-hub/engagement", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              userId: user.userId,
              customerId: user.customerId,
              hospitalityItemId: item.id,
              engagementType: "offerTaken",
            }),
          });
        } catch (err) {
          // Optionally log error, but do not block UI
          console.error("Failed to log engagement", err);
        }
      }

      reset();
      if (onSuccess) onSuccess();
      onClose();
    } catch (error: any) {
      toast({
        title: error.message || "Network error",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-right",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  /* ---------- Render ------------------------------------------------------ */
  return (
    <>
      <SpringModal
        isOpen={isOpen}
        onClose={onClose}
        showClose
        header={`Book ${item.name}`}
        body={
          <BookingForm
            item={item}
            onClose={onClose}
            submit={submit}
            isSubmitting={isSubmitting}
            setFormValid={setIsFormValid}
          />
        }
        frontIcon={<EventAvailable fontSize="inherit" />}
        bgIcon={<EventAvailable fontSize="inherit" />}
        bg="rgba(0,0,0,0.6)"
        color={theme.colors.hospitalityHubPremium}
        primaryLabel="Submit booking"
        border="1px solid #404040"
        primaryBg={theme.colors.hospitalityHubPremium}
        primaryColor="black"
        /* Trigger the hidden form button */
        onPrimaryClick={() =>
          document
            .querySelector<HTMLButtonElement>('form button[type="submit"]')
            ?.click()
        }
        isPrimaryLoading={isSubmitting}
        primaryDisabled={isSubmitting || !isFormValid}
        secondaryLabel="Cancel"
        onSecondaryClick={onClose}
      />
      <style jsx global>{`
        input.white-calendar-icon::-webkit-calendar-picker-indicator {
          filter: invert(1);
        }
        input.white-calendar-icon::-moz-calendar-picker-indicator {
          filter: invert(1);
        }
        input[type='time']::-webkit-calendar-picker-indicator {
          filter: invert(1);
        }
        input[type='time']::-moz-calendar-picker-indicator {
          filter: invert(1);
        }
      `}</style>
    </>
  );
}
