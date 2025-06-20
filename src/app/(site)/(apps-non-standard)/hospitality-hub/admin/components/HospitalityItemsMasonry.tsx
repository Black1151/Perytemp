"use client";

import {
  Box,
  HStack,
  IconButton,
  SimpleGrid,
  Tooltip,
  Switch,
} from "@chakra-ui/react";
import HospitalityItemCard from "../../components/HospitalityItemCard";
import { HospitalityItem } from "@/types/hospitalityHub";
import { FiEdit2, FiTrash2 } from "react-icons/fi";
import {
  AnimatedList,
  AnimatedListItem,
} from "@/components/animations/AnimatedList";

interface HospitalityItemsMasonryProps {
  items: HospitalityItem[];
  onEdit?: (item: HospitalityItem) => void;
  onDelete?: (item: HospitalityItem) => void;
  onToggleActive?: (item: HospitalityItem) => void;
}

export default function HospitalityItemsMasonry({
  items,
  onEdit,
  onDelete,
  onToggleActive,
}: HospitalityItemsMasonryProps) {
  return (
    <SimpleGrid
      w="100%"
      gap={4}
      height="500px"
      templateColumns={`repeat(auto-fill, minmax(300px, 1fr))`}
      maxW="2000px"
      mx="auto"
    >
      <AnimatedList>
        {items.map((item: HospitalityItem, index) => (
          <AnimatedListItem key={item.id} index={index}>
            <Box position="relative">
              <HospitalityItemCard item={item} disabled={!item.isActive} />
              {(onEdit || onDelete || onToggleActive) && (
                <HStack position="absolute" top={2} right={2} spacing={1}>
                  {onEdit && (
                    <Tooltip label="Edit Item" openDelay={1000}>
                      <IconButton
                        aria-label="Edit Item"
                        size="sm"
                        icon={<FiEdit2 />}
                        onClick={() => onEdit(item)}
                        bg="blue.400"
                        color="white"
                        border="1px solid"
                        borderColor="blue.400"
                        _hover={{
                          bg: "white",
                          color: "blue.400",
                          borderColor: "blue.400",
                        }}
                      />
                    </Tooltip>
                  )}
                  {onDelete && (
                    <Tooltip label="Delete Item" openDelay={1000}>
                      <IconButton
                        aria-label="Delete Item"
                        size="sm"
                        icon={<FiTrash2 />}
                        onClick={() => onDelete(item)}
                        bg="red.400"
                        color="white"
                        border="1px solid"
                        borderColor="red.400"
                        _hover={{
                          bg: "white",
                          color: "red.400",
                          borderColor: "red.400",
                        }}
                      />
                    </Tooltip>
                  )}
                  {onToggleActive && (
                    <Tooltip
                      label={item.isActive ? "Disable Item" : "Enable Item"}
                      shouldWrapChildren
                      openDelay={1000}
                    >
                      <Switch
                        aria-label={
                          item.isActive ? "Disable Item" : "Enable Item"
                        }
                        size="sm"
                        isChecked={item.isActive}
                        onChange={() => onToggleActive(item)}
                      />
                    </Tooltip>
                  )}
                </HStack>
              )}
            </Box>
          </AnimatedListItem>
        ))}
      </AnimatedList>
    </SimpleGrid>
  );
}
