import { VStack, FormControl, FormLabel, RadioGroup, Stack, Radio, Box, useTheme, useBreakpointValue } from "@chakra-ui/react";
import { Controller } from "react-hook-form";
import TeamMemberAutocomplete from "../../../big-up/components/TeamMemberAutocomplete";
import { BigUpTeamMember } from "../../../big-up/types";
import React from "react";
import { transparentize } from "@chakra-ui/theme-tools";
import MobileDrawerSelector from "@/components/modals/MobileDrawerSelector";
import { HStack, Avatar, Text, Badge } from "@chakra-ui/react";

type SectionOwnerProps = {
  ownerOption: "category" | "item" | undefined;
  setOwnerOption: (val: "category" | "item" | undefined) => void;
  teamMembers: BigUpTeamMember[];
  control: any;
  setValue: any;
};

function SectionOwner({
  ownerOption,
  setOwnerOption,
  teamMembers,
  control,
  setValue,
}: SectionOwnerProps) {
  const theme = useTheme();
  const isMobile = useBreakpointValue({ base: true, md: false });
  return (
    <Box
      p={4}
      border="1px solid"
      borderColor={transparentize(theme.colors.primaryTextColor, 0.15)(theme)}
      borderRadius="md"
      bg={theme.colors.elementBG}
    >
      <VStack align="stretch" spacing={4}>
        <FormControl mb={2}>
          <FormLabel color={theme.colors.primaryTextColor}>Owner</FormLabel>
          <Box color={theme.colors.secondaryTextColor} fontSize="sm" mb={2}>
            The selected owner will receive all notifications related to this item. Choose "Category owner" to assign the default owner for this category, or "Item owner" to specify a different team member who should receive notifications.
          </Box>
          <RadioGroup
            value={ownerOption ?? ""}
            onChange={(val) => {
              if (val === "") {
                setOwnerOption(undefined);
              } else {
                setOwnerOption(val as "category" | "item");
                if (val === "category") {
                  setValue("itemOwnerUserId", null);
                }
              }
            }}
          >
            <Stack direction="row">
              <Radio
                value="category"
                borderColor={transparentize(theme.colors.primaryTextColor, 0.15)(theme)}
                color={theme.colors.primaryTextColor}
                _hover={{ borderColor: theme.colors.primary }}
                _focus={{ borderColor: theme.colors.primary, boxShadow: `0 0 0 1px ${theme.colors.primary}` }}
              >
                Category owner
              </Radio>
              <Radio
                value="item"
                borderColor={transparentize(theme.colors.primaryTextColor, 0.15)(theme)}
                color={theme.colors.primaryTextColor}
                _hover={{ borderColor: theme.colors.primary }}
                _focus={{ borderColor: theme.colors.primary, boxShadow: `0 0 0 1px ${theme.colors.primary}` }}
              >
                Item owner
              </Radio>
            </Stack>
          </RadioGroup>
        </FormControl>
        {ownerOption === "item" && (
          <FormControl mb={4} isRequired>
            <FormLabel color={theme.colors.primaryTextColor}>Item Owner</FormLabel>
            <Box color={theme.colors.secondaryTextColor} fontSize="sm" mb={2}>
              {isMobile
                ? "Tap to select the team member who should receive notifications for this item."
                : "Start typing to search and select the team member who should receive notifications for this item."}
            </Box>
            <Controller
              name="itemOwnerUserId"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                isMobile ? (
                  <MobileDrawerSelector
                  enableSearch={true}
                    items={teamMembers.map((member) => ({
                      id: member.id,
                      label: member.fullName,
                      content: (
                        <HStack w="100%" justify="space-between" align="center">
                          <HStack w="min" justify="start" align="center" flex="1" minW={0}>
                            <Avatar
                              name={member.fullName}
                              src={member.imageUrl}
                              size="sm"
                            />
                            <Text
                              isTruncated
                              maxW="140px"
                              whiteSpace="nowrap"
                              flex="1"
                              minW={0}
                            >
                              {member.fullName}
                            </Text>
                          </HStack>
                        </HStack>
                      ),
                      searchableLabel: member.fullName,
                    }))}
                    selectedId={field.value}
                    onSelect={field.onChange}
                    triggerLabel={
                      teamMembers.find((m) => String(m.id) === String(field.value))?.fullName ||
                      "Choose a team member..."
                    }
                  />
                ) : (
                  <TeamMemberAutocomplete
                    value={field.value?.toString() || ""}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    teamMembers={teamMembers}
                    placeholder="Search team member..."
                  />
                )
              )}
            />
          </FormControl>
        )}
      </VStack>
    </Box>
  );
}

export default SectionOwner; 