import { Box, FormControl, FormLabel, useTheme, RadioGroup, Stack, Radio } from "@chakra-ui/react";
import LocationAutocompleteInput from "./LocationAutocompleteInput";
import { useFormContext, Controller } from "react-hook-form";

export default function SectionLocation() {
  const theme = useTheme();
  const { control, watch, formState: { errors } } = useFormContext();
  const itemPhysicality = watch("itemPhysicality");

  return (
    <Box
      p={4}
      borderRadius="md"
      bg={theme.colors.elementBG}
    >
      <FormControl isRequired isInvalid={!!errors.itemPhysicality} mb={6}>
        <FormLabel color={theme.colors.primaryTextColor}>Location Type</FormLabel>
        <Box color={theme.colors.secondaryTextColor} fontSize="sm" mb={2}>
          Select whether this item requires a real-world location or is non-physical (such as a virtual service or information-only item).
        </Box>
        <Controller
          name="itemPhysicality"
          control={control}
          rules={{ required: 'Please select the type of item.' }}
          render={({ field }) => (
            <RadioGroup {...field} value={field.value || ""}>
              <Stack direction="column">
                <Radio value="physical">
                  Physical
                </Radio>
                <Radio value="non-physical">
                  Non-Physical
                </Radio>
              </Stack>
            </RadioGroup>
          )}
        />
      </FormControl>
      {itemPhysicality === "physical" && (
        <FormControl isRequired>
          <FormLabel color={theme.colors.primaryTextColor}>Location</FormLabel>
          <Box color={theme.colors.secondaryTextColor} fontSize="sm" mb={2}>
            Start typing to search and select the specific location for this item.
          </Box>
          <LocationAutocompleteInput usePortal={true} />
        </FormControl>
      )}
    </Box>
  );
} 