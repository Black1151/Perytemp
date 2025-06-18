import React, { FC, useState, useEffect, useMemo, useCallback, ChangeEvent } from "react";
import { Box, Input, HStack, Avatar, Text } from "@chakra-ui/react";
import debounce from "lodash/debounce";
import { AnimatedList, AnimatedListItem } from "@/components/animations/AnimatedList";
import { useUser } from "@/providers/UserProvider";

export interface AutocompleteUser {
  id: number;
  fullName: string;
  email: string;
  imageUrl?: string;
}

interface UserSearchAutocompleteProps {
  value?: string;
  onSelect: (user: AutocompleteUser) => void;
  placeholder?: string;
}

const UserSearchAutocomplete: FC<UserSearchAutocompleteProps> = ({
  value = "",
  onSelect,
  placeholder = "Type to search...",
}) => {
  const { user } = useUser();
  const [search, setSearch] = useState(value);
  const [options, setOptions] = useState<AutocompleteUser[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);

  const fetchUsers = useCallback(
    debounce(async (query: string) => {
      if (!query.trim() || !user?.customerId) {
        setOptions([]);
        return;
      }
      try {
        const res = await fetch(
          `/api/user/allBy?customerId=${user.customerId}&search=${encodeURIComponent(
            query,
          )}&selectColumns=id,fullName,email,imageUrl`,
        );
        const data = await res.json();
        if (res.ok) {
          setOptions(data.resource || []);
        } else {
          setOptions([]);
          console.error(data.error || "Failed to fetch users");
        }
      } catch (err) {
        console.error(err);
        setOptions([]);
      }
    }, 300),
    [user?.customerId],
  );

  useEffect(() => {
    fetchUsers(search);
    return () => {
      fetchUsers.cancel();
    };
  }, [search, fetchUsers]);

  useEffect(() => {
    setSearch(value);
  }, [value]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setShowDropdown(true);
  };

  const handleSelect = (u: AutocompleteUser) => {
    setSearch(u.fullName);
    onSelect(u);
    setShowDropdown(false);
  };

  return (
    <Box position="relative">
      <Input
        placeholder={placeholder}
        value={search}
        onChange={handleInputChange}
        onFocus={() => setShowDropdown(true)}
        bg="elementBG"
        color="primary"
        borderColor="primary"
        _hover={{ borderColor: "primary" }}
        _focus={{ color: "primary" }}
      />
      {showDropdown && options.length > 0 && (
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
            {options.map((option, index) => (
              <AnimatedListItem key={option.id} index={index}>
                <Box
                  px={3}
                  py={2}
                  cursor="pointer"
                  _hover={{ bg: "rgba(255, 20, 147, 0.1)" }}
                  onMouseDown={() => handleSelect(option)}
                >
                  <HStack>
                    <Avatar name={option.fullName} src={option.imageUrl} size="sm" />
                    <Text color="primary" ml={2}>
                      {option.fullName} ({option.email})
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

export default UserSearchAutocomplete;
