import {
  Box,
  Text,
  VStack,
  HStack,
  Switch,
  Tag,
  Divider,
  Select,
  FormControl,
  FormLabel,
  Button,
  Stack,
  Spacer,
  Badge,
  useToast,
  useTheme,
} from "@chakra-ui/react";
import { EmailSchedule } from "@/types/schedules";
import { useState, useEffect } from "react";
import { transparentize } from '@chakra-ui/theme-tools';

type EmailSchedulePanelProps = {
  schedule: EmailSchedule;
  onUpdateSchedule: (updated: EmailSchedule) => void;
  customerId: number;
  toolId: number;
};

export default function EmailSchedulePanel({
  schedule,
  onUpdateSchedule,
  customerId,
  toolId
}: EmailSchedulePanelProps) {
  const theme = useTheme();
  // 1) Manage toggling active/inactive
  const [isActive, setIsActive] = useState(schedule.isActive);
  const isEditable = isActive;

  // 2) Local copy for fields, plus separate timeOfDay & dayOfWeek for weekly
  const [editableSchedule, setEditableSchedule] =
    useState<EmailSchedule>(schedule);
  const [localTimeOfDay, setLocalTimeOfDay] = useState<
    "morning" | "afternoon" | "evening"
  >(deriveTimeOfDay(schedule.sendTime));
  const [localDayOfWeek, setLocalDayOfWeek] = useState<number>(
    schedule.daysOfWeek.length > 0 ? schedule.daysOfWeek[0] : 1
  );

  // 3) Track if any change was made
  const [hasChanges, setHasChanges] = useState(false);

  const toast = useToast();

  // Reset local state whenever the parent `schedule` prop changes
  useEffect(() => {
    setEditableSchedule(schedule);
    setIsActive(schedule.isActive);
    setLocalTimeOfDay(deriveTimeOfDay(schedule.sendTime));
    setLocalDayOfWeek(
      schedule.daysOfWeek.length > 0 ? schedule.daysOfWeek[0] : 1
    );
    setHasChanges(false);
  }, [schedule]);

  // Helper: derive "morning"/"afternoon"/"evening" from "HH:mm:ss"
  function deriveTimeOfDay(
    sendTime: string
  ): "morning" | "afternoon" | "evening" {
    const hour = parseInt(sendTime.split(":")[0], 10);
    if (hour < 12) return "morning";
    if (hour < 18) return "afternoon";
    return "evening";
  }

  // 4) Handle field changes (only valid when active)
  const handleDayOfWeekChange = (newDay: number) => {
    if (!isEditable) return;
    setLocalDayOfWeek(newDay);
    setHasChanges(true);
  };

  const handleTimeOfDayChange = (
    newTime: "morning" | "afternoon" | "evening"
  ) => {
    if (!isEditable) return;
    setLocalTimeOfDay(newTime);
    setHasChanges(true);
  };

  // 5) Toggle Active/Inactive → must send { isActive } only
  const handleActiveToggle = async (checked: boolean) => {
    const payload: any = {
      customerId,
      toolId,
      subscriptionType: schedule.subscriptionType,
      singleToolSched: schedule.scheduleId,
      isActive: checked,
    };

    try {
      const resp = await fetch("/api/quickSchedules", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!resp.ok) {
        const errorJson = await resp.json().catch(() => null);
        const message =
          errorJson?.error || "Unknown error toggling active status";
        console.error("→ Toggle API error:", message);
        toast({
          title: "Error toggling status",
          description: message,
          status: "error",
          duration: 4000,
          isClosable: true,
        });
        return;
      }

      const result = await resp.json();

      // Update local and parent state
      setIsActive(checked);
      const updatedSched: EmailSchedule = {
        ...editableSchedule,
        isActive: checked,
      };
      onUpdateSchedule(updatedSched);

      // If toggled off, clear any pending edits
      if (!checked) {
        setHasChanges(false);
      }

      toast({
        title: checked ? "Activated" : "Deactivated",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (err: any) {
      console.error("→ Exception in toggleActive:", err);
      toast({
        title: "Network error",
        description: "Could not toggle active status.",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    }
  };

  // Fetch the updated schedule from the backend's "view" response
  const fetchLatestSchedule = async () => {
    try {
      const resp = await fetch("/api/quickSchedules", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerId,
          toolId,
          subscriptionType: "view",
        }),
      });

      if (!resp.ok) {
        console.error(
          "→ Error fetching latest schedules for refresh:",
          resp.status
        );
        return null;
      }

      const data = await resp.json();
      // data.schedules.resource[0].schedule_status is a JSON string
      const resourceArray = Array.isArray(data.schedules.resource)
        ? data.schedules.resource
        : [];
      if (resourceArray.length === 0) return null;

      const parsed: EmailSchedule[] = JSON.parse(
        resourceArray[0].schedule_status
      );
      // Find the one we care about
      return parsed.find((s) => s.scheduleId === schedule.scheduleId) || null;
    } catch (err) {
      console.error("→ Exception in fetchLatestSchedule:", err);
      return null;
    }
  };

  // 6) Save edits (weekly only: send { timeOfDay, day } and then refresh from backend)
  const handleSave = async () => {
    if (!hasChanges) return;

    // Build payload: at least one of timeOfDay or day must be present
    const payload: any = {
      customerId,
      toolId,
      subscriptionType: "paid",
      singleToolSched: schedule.scheduleId,
      timeOfDay: localTimeOfDay,
      day: localDayOfWeek,
    };


    try {
      const resp = await fetch("/api/quickSchedules", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!resp.ok) {
        const errorJson = await resp.json().catch(() => null);
        const message =
          errorJson?.error || "Unknown error saving changes to schedule";
        console.error("→ Save API error:", message);
        toast({
          title: "Error saving changes",
          description: message,
          status: "error",
          duration: 4000,
          isClosable: true,
        });
        return;
      }

      const result = await resp.json();

      // Now immediately fetch back the latest copy of this exact schedule
      const latest = await fetchLatestSchedule();
      if (latest) {
        setEditableSchedule(latest);
        setIsActive(latest.isActive);
        setLocalTimeOfDay(deriveTimeOfDay(latest.sendTime));
        setLocalDayOfWeek(
          latest.daysOfWeek.length > 0 ? latest.daysOfWeek[0] : 1
        );
        setHasChanges(false);
        onUpdateSchedule(latest);
      }

      toast({
        title: "Changes saved",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (err: any) {
      console.error("→ Exception in save:", err);
      toast({
        title: "Network error",
        description: "Could not save changes.",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    }
  };

  return (
    <Box 
      p={4} 
      border="1px solid" 
      borderColor={transparentize(theme.colors.primaryTextColor, 0.15)(theme)} 
      borderRadius="md" 
      bg={theme.colors.elementBG}
    >
      {/* Top Bar: Name + Active Switch + Status Badge */}
      <Stack mb={6} justify="space-between" w="full" direction={["column", "row"]}>
        <Text fontSize={["lg", "xl"]} fontWeight="bold" color={theme.colors.primaryTextColor}>
          {editableSchedule.name}
        </Text>
        <FormControl display="flex" alignItems="center" w="auto" gap={1}>
          <Box
            as="span"
            position="relative"
            w="85px"
            h="28px"
            display="inline-block"
          >
            <Box
              as={Badge}
              colorScheme={isActive ? "green" : "red"}
              position="absolute"
              top={0}
              left={0}
              w="100%"
              h="100%"
              display="flex"
              alignItems="center"
              justifyContent="center"
              fontSize="sm"
              fontWeight="semibold"
              borderRadius="md"
              transition="all 0.5s cubic-bezier(.4,0,.2,1)"
              opacity={isActive ? 1 : 0}
              transform={isActive ? "scale(1)" : "scale(0.90)"}
              zIndex={isActive ? 2 : 1}
            >
              Active
            </Box>
            <Box
              as={Badge}
              colorScheme="red"
              position="absolute"
              top={0}
              left={0}
              w="100%"
              h="100%"
              display="flex"
              alignItems="center"
              justifyContent="center"
              fontSize="sm"
              fontWeight="semibold"
              borderRadius="md"
              transition="all 0.5s cubic-bezier(.4,0,.2,1)"
              opacity={isActive ? 0 : 1}
              transform={isActive ? "scale(0.90)" : "scale(1)"}
              zIndex={isActive ? 1 : 2}
            >
              Inactive
            </Box>
          </Box>
          <Switch
            size={"lg"}
            isChecked={isActive}
            onChange={(e) => handleActiveToggle(e.target.checked)}
          />
        </FormControl>
      </Stack>

      <VStack align="stretch" spacing={4}>
        {editableSchedule.frequency === "weekly" ? (
          <>
            {/* Weekly: Day of Week */}
            <FormControl>
              <FormLabel color={theme.colors.primaryTextColor}>Day of Week</FormLabel>
              <Select
                value={localDayOfWeek}
                onChange={(e) => handleDayOfWeekChange(+e.target.value)}
                isDisabled={!isActive}
                borderColor={transparentize(theme.colors.primaryTextColor, 0.15)(theme)}
                _hover={{ borderColor: theme.colors.primary }}
                _focus={{ borderColor: theme.colors.primary, boxShadow: `0 0 0 1px ${theme.colors.primary}` }}
                color={theme.colors.primaryTextColor}
              >
                <option value={1}>Monday</option>
                <option value={2}>Tuesday</option>
                <option value={3}>Wednesday</option>
                <option value={4}>Thursday</option>
                <option value={5}>Friday</option>
                <option value={6}>Saturday</option>
                <option value={7}>Sunday</option>
              </Select>
            </FormControl>

            {/* Weekly: Time of Day */}
            <FormControl>
              <FormLabel color={theme.colors.primaryTextColor}>Time of Day</FormLabel>
              <Select
                value={localTimeOfDay}
                onChange={(e) => handleTimeOfDayChange(e.target.value as any)}
                isDisabled={!isActive}
                borderColor={transparentize(theme.colors.primaryTextColor, 0.15)(theme)}
                _hover={{ borderColor: theme.colors.primary }}
                _focus={{ borderColor: theme.colors.primary, boxShadow: `0 0 0 1px ${theme.colors.primary}` }}
                color={theme.colors.primaryTextColor}
              >
                <option value="morning">Morning</option>
                <option value="afternoon">Afternoon</option>
                <option value="evening">Evening</option>
              </Select>
            </FormControl>
          </>
        ) : (
          <>
            {/* Non-Weekly: Show frequency */}
            <FormControl>
              <FormLabel color={theme.colors.primaryTextColor}>Frequency</FormLabel>
              <Text textTransform="capitalize" color={theme.colors.primaryTextColor}>
                {editableSchedule.frequency}
              </Text>
            </FormControl>
            {/* Non-Weekly: Show derived time-of-day from sendTime */}
            <FormControl>
              <FormLabel color={theme.colors.primaryTextColor}>Time of Day</FormLabel>
              <Text textTransform="capitalize" color={theme.colors.primaryTextColor}>
                {deriveTimeOfDay(editableSchedule.sendTime)}
              </Text>
            </FormControl>
          </>
        )}

        {/* Distribution Groups (read-only) */}
        <FormControl>
          <FormLabel color={theme.colors.primaryTextColor}>Groups</FormLabel>
          {editableSchedule.userDistGroupNames.length > 0 ? (
            <HStack wrap="wrap">
              {editableSchedule.userDistGroupNames.map((group) => (
                <Tag 
                  key={group} 
                  colorScheme="blue"
                >
                  {group}
                </Tag>
              ))}
            </HStack>
          ) : (
            <Text color={theme.colors.primaryTextColor}>No groups assigned</Text>
          )}
        </FormControl>
      </VStack>

      {/* Save Button */}
      <HStack mt={6} justify="flex-end">
        <Button
          bg={theme.colors.primary}
          color={theme.colors.white}
          _hover={{ bg: transparentize(theme.colors.primary, 0.8)(theme) }}
          onClick={handleSave}
          isDisabled={!hasChanges || !isActive}
        >
          Save
        </Button>
      </HStack>
    </Box>
  );

  // Generic handler to update `editableSchedule` fields
  function handleChange<K extends keyof EmailSchedule>(
    key: K,
    value: EmailSchedule[K]
  ) {
    if (!isEditable) return;
    setEditableSchedule((prev) => ({ ...prev, [key]: value }));
    setHasChanges(true);
  }
}
