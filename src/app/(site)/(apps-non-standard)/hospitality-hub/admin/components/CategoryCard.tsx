import {
  useBreakpointValue,
  Box,
  Flex,
  Text,
  Image,
  Button,
  VStack,
  Badge,
  Switch,
  FormControl,
  useTheme,
  useToast,
} from "@chakra-ui/react";
import { FiEdit2, FiTrash2 } from "react-icons/fi";
import { HospitalityCategory } from "@/types/hospitalityHub";
import React, { useState, useEffect } from "react";
import { transparentize } from "@chakra-ui/theme-tools";

interface CategoryCardProps {
  category: HospitalityCategory | null;
  onEdit: (category: HospitalityCategory) => void;
  onDelete: (category: HospitalityCategory) => void;
  onToggleActive?: (category: HospitalityCategory) => void;
}

const CategoryCard: React.FC<CategoryCardProps> = ({
  category,
  onEdit,
  onDelete,
  onToggleActive,
}) => {
  const theme = useTheme();
  const toast = useToast();
  const isMobile = useBreakpointValue({ base: true, md: false });

  /* keep local active state in sync when parent changes selection */
  const [isActive, setIsActive] = useState(category?.isActive ?? false);
  useEffect(() => {
    setIsActive(category?.isActive ?? false);
  }, [category]);

  const [loading, setLoading] = useState(false);

  if (!category) return null;

  const handleActiveToggle = async (checked: boolean) => {
    if (!category.id) return;

    const previous = isActive;
    setIsActive(checked); // ⭐ flick immediately (optimistic)
    setLoading(true);

    try {
      const res = await fetch("/api/hospitality-hub/categories", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: category.id, isActive: checked }),
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data?.error || "Failed to update category");

      toast({
        title: checked ? "Category activated" : "Category deactivated",
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "bottom-right",
      });
      onToggleActive?.({ ...category, isActive: checked });
    } catch (err: any) {
      // rollback on failure
      setIsActive(previous);
      toast({
        title: "Error updating category",
        description: err.message,
        status: "error",
        duration: 4000,
        isClosable: true,
        position: "bottom-right",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Flex
      direction={["column", "column", "column", "column", "row"]}
      borderRadius="md"
      boxShadow="lg"
      bg={theme.colors.elementBG}
      border="2px solid"
      borderColor={theme.colors.elementBG}
      p={0}
      minW={["220px", "340px"]}
      align="stretch"
      position="relative"
      h={["auto", "auto", "auto", "auto", "100%"]}
      flexGrow={1}
      overflow="hidden"
    >
      {/* Image section */}
      {category.coverImageUrl && (
        <Box
          w={["100%", "100%", "100%", "100%", "220px"]}
          h={["160px", "180px", "200px", "220px", "100%"]}
          flexShrink={0}
          position="relative"
          minH={["160px", "180px", "200px", "220px", "100%"]}
        >
          {/* Active toggle over top left of image */}
          <Box position="absolute" top={2} left={2} zIndex={2}>
            <FormControl display="flex" alignItems="center" gap={1}>
              <Badge
                colorScheme={isActive ? "green" : "red"}
                px={2}
                borderRadius="md"
              >
                {isActive ? "Active" : "Inactive"}
              </Badge>
              <Switch
                size="lg"
                isChecked={isActive}
                onChange={(e) => handleActiveToggle(e.target.checked)}
                isDisabled={loading}
              />
            </FormControl>
          </Box>
          <Image
            src={category.coverImageUrl}
            alt={category.name}
            objectFit="cover"
            w="100%"
            h="100%"
          />
        </Box>
      )}
      {/* Content section */}
      <Flex
        direction="column"
        flex={1}
        p={[3, 4]}
        justify="space-between"
        position="relative"
        h={["auto", "auto", "auto", "auto", "100%"]}
      >
        {/* Name and description */}
        <VStack align="start" spacing={1} mt={0} mb={4} w="100%">
          <Text
            fontWeight="extrabold"
            fontSize={["lg", "xl"]}
            w="100%"
            color={theme.colors.primaryTextColor}
          >
            {category.name}
          </Text>
          <Text
            fontSize={["sm", "md"]}
            w="100%"
            color={theme.colors.primaryTextColor}
          >
            {category.description}
          </Text>
        </VStack>
        {/* Action buttons always stacked vertically */}
        <Flex mt={2} gap={2} direction="column" w="100%">
          <Button
            leftIcon={<FiEdit2 />}
            onClick={() => onEdit(category)}
            bg="blue.400"
            color="white"
            border={"none"}
            _hover={{ bg: "white", color: "blue.400", borderColor: "blue.400" }}
            w="100%"
          >
            Edit Category
          </Button>
          <Button
            leftIcon={<FiTrash2 />}
            onClick={() => onDelete(category)}
            bg="red.400"
            border={"none"}
            color="white"
            _hover={{ bg: "white", color: "red.400", borderColor: "red.400" }}
            w="100%"
          >
            Delete Category
          </Button>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default CategoryCard;
