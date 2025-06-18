import React, {
  useState,
  useEffect,
  useMemo,
  useCallback,
  FC,
  ChangeEvent,
} from "react";
import debounce from "lodash/debounce";
import { Input, Box, Text, Avatar, HStack } from "@chakra-ui/react";
import { BigUpTeamMember } from "../types";
import {
  AnimatedList,
  AnimatedListItem,
} from "@/components/animations/AnimatedList";

interface TeamMemberAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  teamMembers: BigUpTeamMember[];
  placeholder?: string;
}

const TeamMemberAutocomplete: FC<TeamMemberAutocompleteProps> = ({
  value,
  onChange,
  onBlur,
  teamMembers,
  placeholder = "Search team member...",
}) => {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  const handleInputChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setShowDropdown(true);
  }, []);

  useEffect(() => {
    const handler = debounce((value: string) => {
      setDebouncedSearch(value);
    }, 300);

    handler(search);

    return () => {
      handler.cancel();
    };
  }, [search]);

  const filteredMembers = useMemo(() => {
    if (!debouncedSearch.trim() || !Array.isArray(teamMembers)) return [];
    const lowerSearch = debouncedSearch.toLowerCase();
    return teamMembers.filter((member) =>
      member.fullName.toLowerCase().includes(lowerSearch)
    );
  }, [debouncedSearch, teamMembers]);

  const handleSelectMember = (member: BigUpTeamMember) => {
    setSearch(member.fullName);
    onChange(String(member.id));
    setShowDropdown(false);
  };

  return (
    <Box position="relative">
      <Input
        placeholder={placeholder}
        value={search}
        onChange={handleInputChange}
        onBlur={onBlur}
        onFocus={() => setShowDropdown(true)}
        bg="elementBG"
        color="primary"
        borderColor="primary"
        _hover={{ borderColor: "primary" }}
        _focus={{ color: "primary" }}
      />

      {showDropdown && filteredMembers.length > 0 && (
        <Box
          position="absolute"
          top="100%"
          left={0}
          right={0}
          bg="elementBG"
          border="1px solid"
          borderColor="primary"
          borderTop="none"
          zIndex={999}
          maxHeight={300}
          overflowY="auto"
        >
          <AnimatedList>
            {filteredMembers.map((member, index) => (
              <AnimatedListItem key={member.id} index={index}>
                <Box
                  px={3}
                  py={2}
                  cursor="pointer"
                  _hover={{ bg: "rgba(255, 20, 147, 0.1)" }}
                  onMouseDown={() => handleSelectMember(member)}
                >
                  <HStack>
                    <Avatar
                      name={member.fullName}
                      src={member.imageUrl}
                      size="sm"
                    />
                    <Text color="primary" ml={2}>
                      {member.fullName}
                    </Text>
                  </HStack>
                </Box>
              </AnimatedListItem>
            ))}
          </AnimatedList>
        </Box>
      )}
    </Box>
  );
};

export default TeamMemberAutocomplete;
