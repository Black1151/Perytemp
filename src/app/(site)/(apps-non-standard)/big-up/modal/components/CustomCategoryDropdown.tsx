import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  Box,
  Text,
  Flex,
  List,
  ListItem,
  useTheme,
  useOutsideClick,
  Icon,
  HStack,
  VStack,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Badge,
  Portal,
} from "@chakra-ui/react";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
interface Category {
  id: number;
  name: string;
  points: number;
  giverPoints: number;
}

interface CustomCategoryDropdownProps {
  categories: Category[];
  value: string | number;
  onChange: (value: string | number) => void;
  isInvalid?: boolean;
  isRequired?: boolean;
  errorMessage?: string;
}

const CustomCategoryDropdown: React.FC<CustomCategoryDropdownProps> = ({
  categories,
  value,
  onChange,
  isInvalid,
  isRequired,
  errorMessage,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownPos, setDropdownPos] = useState<{ left: number; top: number; width: number } | null>(null);
  const theme = useTheme();
  const ref = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLUListElement>(null);
  const [dropdownStyles, setDropdownStyles] = useState<React.CSSProperties>({});

  React.useEffect(() => {
    if (!isOpen) return;
    function handleClick(event: MouseEvent) {
      if (
        ref.current && ref.current.contains(event.target as Node)
      ) {
        return;
      }
      if (
        dropdownRef.current && dropdownRef.current.contains(event.target as Node)
      ) {
        return;
      }
      setIsOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [isOpen]);

  const selected = categories.find((cat) => String(cat.id) === String(value));

  useEffect(() => {
    if (isOpen && ref.current) {
      const rect = ref.current.getBoundingClientRect();
      setDropdownStyles({
        position: "absolute",
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX,
        width: rect.width,
        zIndex: 2100,
      });
    }
  }, [isOpen]);

  console.log("categories:", categories);

  return (
    <FormControl isInvalid={isInvalid} isRequired={isRequired}>
      <FormLabel color="white">Category</FormLabel>
      <Box ref={ref} position="relative">
        <Flex
          align="center"
          justify="space-between"
          bg="white"
          color="gray.800"
          zIndex={200}
          borderRadius="md"
          borderWidth="1px"
          borderColor={isInvalid ? theme.colors.red[500] : "whiteAlpha.300"}
          px={4}
          py={2}
          cursor="pointer"
          _hover={{ borderColor: "whiteAlpha.400" }}
          onClick={() => setIsOpen((open) => !open)}
        >
          <>
            {selected ? (
              <HStack justifyContent="space-between" w="full">
                <Text textAlign="left" fontSize={"base"}>
                  {selected.name}
                </Text>
                <VStack w="min" gap={1} align={"right"}>
                  {selected.points ? (
                    <Badge colorScheme="cyan" variant="subtle">
                      Them: +{selected.points} pts
                    </Badge>
                  ) : null}
                  {selected.giverPoints ? (
                    <Badge colorScheme="blue" variant="subtle">
                      You: +{selected.giverPoints} pts
                    </Badge>
                  ) : null}
                </VStack>
              </HStack>
            ) : (
              <Text>Choose a category...</Text>
            )}
          </>
          <Icon as={KeyboardArrowDownIcon} boxSize={5} color="gray.500" />
        </Flex>
        {isOpen && (
          <Portal>
            <List
              ref={dropdownRef}
              style={dropdownStyles}
              bg="white"
              color="gray.800"
              borderRadius="md"
              boxShadow="md"
              maxH="400px"
              overflowY="auto"
            >
              {categories.map((category, idx) => (
                <ListItem
                  key={category.id}
                  px={4}
                  py={2}
                  cursor="pointer"
                  _hover={{ bg: theme.colors.gray[100] }}
                  bg={
                    String(category.id) === String(value)
                      ? theme.colors.gray[200]
                      : ""
                  }
                  borderBottom={
                    idx !== categories.length - 1
                      ? `1px solid ${theme.colors.gray[200]}`
                      : undefined
                  }
                  onClick={() => {
                    onChange(category.id);
                    setIsOpen(false);
                  }}
                >
                  <HStack justifyContent="space-between" w="full">
                    <Text textAlign="left" fontSize={"base"}>
                      {category.name}
                    </Text>
                    <VStack w="min" gap={1} align={"right"}>
                      {category.points ? (
                        <Badge colorScheme="cyan" variant="subtle">
                          Them: +{category.points} pts
                        </Badge>
                      ) : null}
                      {category.giverPoints ? (
                        <Badge colorScheme="blue" variant="subtle">
                          You: +{category.giverPoints} pts
                        </Badge>
                      ) : null}
                    </VStack>
                  </HStack>
                </ListItem>
              ))}
            </List>
          </Portal>
        )}
      </Box>
      <FormErrorMessage>{errorMessage}</FormErrorMessage>
    </FormControl>
  );
};

export default CustomCategoryDropdown;
