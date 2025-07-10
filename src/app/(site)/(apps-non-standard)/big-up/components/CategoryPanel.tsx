import {
  Box,
  Text,
  VStack,
  HStack,
  Switch,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Button,
  useToast,
  Badge,
  useTheme,
  Stack,
} from "@chakra-ui/react";
import { transparentize } from "@chakra-ui/theme-tools";
import { useEffect, useState } from "react";
import { Category } from "./CategoriesModal";

type Props = {
  category: Category;
  onUpdateCategory: (updated: Category) => void;
  customerId: number | null;
  toolId: number;
  isCreating?: boolean;
  onCancelCreate?: () => void;
};

export default function CategoryPanel({
  category,
  onUpdateCategory,
  isCreating = false,
  onCancelCreate,
}: Props) {
  const theme = useTheme();
  const [editable, setEditable] = useState<Category>(category);
  const [hasChanges, setHasChanges] = useState(false);
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ name?: string; description?: string; points?: string; giverPoints?: string }>({});
  const [touched, setTouched] = useState<{ name?: boolean; description?: boolean; points?: boolean; giverPoints?: boolean }>({});

  // Validation logic
  const validate = (cat: Category) => {
    const errs: { name?: string; description?: string; points?: string; giverPoints?: string } = {};
    if (!cat.name || cat.name.length < 4 || cat.name.length > 30) {
      errs.name = "Name must be 4-30 characters.";
    }
    if (!cat.description || cat.description.length < 4 || cat.description.length > 100) {
      errs.description = "Description must be 4-100 characters.";
    }
    if (cat.points === undefined || cat.points === null || isNaN(Number(cat.points))) {
      errs.points = "Receiver Points is required and must be a number.";
    } else if (Number(cat.points) < 0) {
      errs.points = "Receiver Points cannot be negative.";
    }
    if (cat.giverPoints === undefined || cat.giverPoints === null || isNaN(Number(cat.giverPoints))) {
      errs.giverPoints = "Giver Points is required and must be a number.";
    } else if (Number(cat.giverPoints) < 0) {
      errs.giverPoints = "Giver Points cannot be negative.";
    }
    if (
      typeof cat.points === "number" &&
      typeof cat.giverPoints === "number" &&
      !errs.points && !errs.giverPoints &&
      cat.points < cat.giverPoints
    ) {
      errs.points = "Receiver Points must be greater than or equal to Giver Points.";
    }
    return errs;
  };

  // Validate on editable change
  useEffect(() => {
    setErrors(validate(editable));
  }, [editable]);

  /* reset local copy whenever parent changes */
  useEffect(() => {
    setEditable(category);
    setHasChanges(false);
  }, [category]);

  /* tiny helper */
  const patch = <K extends keyof Category>(key: K, val: Category[K]) => {
    setEditable((p) => ({ ...p, [key]: val }));
    setHasChanges(true);
  };

  /* save -------------------------------------------------------------- */
  const save = async (payload: Category, toastTitle?: string) => {
    setLoading(true);
    try {
      const resp = await fetch("/api/bigup", {
        method: isCreating ? "POST" : "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!resp.ok) throw new Error("Save failed");
      const data = await resp.json();
      onUpdateCategory(
        isCreating ? { ...payload, uniqueId: data.resource.id } : payload
      );
      setHasChanges(false);

      toast({
        title:
          toastTitle ?? // 👈 use custom title if provided
          (isCreating ? "Category created" : "Changes saved"),
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (err: any) {
      toast({
        title: err.message ?? "Error",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  /* toggle ------------------------------------------------------------- */
  const toggle = (checked: boolean) => {
    const updated = { ...editable, isActive: checked };

    setEditable(updated); // pure state update
    setHasChanges(true); // another pure update

    // single side-effect, executed exactly once
    save(updated, checked ? "Category activated" : "Category deactivated");
  };

  return (
    <Box
      p={4}
      border="1px solid"
      borderColor={transparentize(theme.colors.primaryTextColor, 0.15)(theme)}
      borderRadius="md"
      bg={theme.colors.elementBG}
    >
      {/* header row */}
      <Stack
        mb={6}
        justify="space-between"
        w="full"
        direction={["column", "row"]}
      >
        <Text
          fontSize={["lg", "xl"]}
          fontWeight="bold"
          color={theme.colors.primaryTextColor}
        >
          {isCreating ? "Create New Category" : editable.name}
        </Text>
        {!isCreating && (
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
                colorScheme={editable.isActive ? "green" : "red"}
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
                opacity={editable.isActive ? 1 : 0}
                transform={editable.isActive ? "scale(1)" : "scale(0.90)"}
                zIndex={editable.isActive ? 2 : 1}
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
                opacity={editable.isActive ? 0 : 1}
                transform={editable.isActive ? "scale(0.90)" : "scale(1)"}
                zIndex={editable.isActive ? 1 : 2}
              >
                Inactive
              </Box>
            </Box>
            <Switch
              size="lg"
              isChecked={editable.isActive}
              onChange={(e) => toggle(e.target.checked)}
            />
          </FormControl>
        )}
      </Stack>

      <VStack align="stretch" spacing={4}>
        <FormControl isInvalid={!!errors.name && touched.name}>
          <FormLabel color={theme.colors.primaryTextColor}>Name</FormLabel>
          <Input
            value={editable.name}
            onChange={(e) => patch("name", e.target.value)}
            onBlur={() => setTouched((t) => ({ ...t, name: true }))}
            isDisabled={!editable.isActive}
            borderColor={transparentize(
              theme.colors.primaryTextColor,
              0.15
            )(theme)}
            _hover={{ borderColor: theme.colors.primary }}
            _focus={{
              borderColor: theme.colors.primary,
              boxShadow: `0 0 0 1px ${theme.colors.primary}`,
            }}
            color={theme.colors.primaryTextColor}
          />
          {errors.name && touched.name && (
            <Text color="red.400" fontSize="sm" mt={1}>
              {errors.name}
            </Text>
          )}
        </FormControl>

        <FormControl isInvalid={!!errors.description && touched.description}>
          <FormLabel color={theme.colors.primaryTextColor}>
            Description (internal use only)
          </FormLabel>
          <Textarea
            value={editable.description}
            onChange={(e) => patch("description", e.target.value)}
            onBlur={() => setTouched((t) => ({ ...t, description: true }))}
            isDisabled={!editable.isActive}
            rows={3}
            borderColor={transparentize(
              theme.colors.primaryTextColor,
              0.15
            )(theme)}
            _hover={{ borderColor: theme.colors.primary }}
            _focus={{
              borderColor: theme.colors.primary,
              boxShadow: `0 0 0 1px ${theme.colors.primary}`,
            }}
            color={theme.colors.primaryTextColor}
          />
          {errors.description && touched.description && (
            <Text color="red.400" fontSize="sm" mt={1}>
              {errors.description}
            </Text>
          )}
        </FormControl>

        <Stack direction={["column", "row", "row"]}>
          <FormControl>
            <FormLabel color={theme.colors.primaryTextColor}>
              Receiver Points
            </FormLabel>
            <Input
              type="number"
              value={editable.points}
              onChange={(e) => patch("points", parseInt(e.target.value))}
              onBlur={() => setTouched((t) => ({ ...t, points: true }))}
              isDisabled={!editable.isActive}
              borderColor={transparentize(
                theme.colors.primaryTextColor,
                0.15
              )(theme)}
              _hover={{ borderColor: theme.colors.primary }}
              _focus={{
                borderColor: theme.colors.primary,
                boxShadow: `0 0 0 1px ${theme.colors.primary}`,
              }}
              color={theme.colors.primaryTextColor}
            />
            {errors.points && touched.points && (
              <Text color="red.400" fontSize="sm" mt={1}>
                {errors.points}
              </Text>
            )}
          </FormControl>

          <FormControl>
            <FormLabel color={theme.colors.primaryTextColor}>
              Giver Points
            </FormLabel>
            <Input
              type="number"
              value={editable.giverPoints}
              onChange={(e) => patch("giverPoints", parseInt(e.target.value))}
              onBlur={() => setTouched((t) => ({ ...t, giverPoints: true }))}
              isDisabled={!editable.isActive}
              borderColor={transparentize(
                theme.colors.primaryTextColor,
                0.15
              )(theme)}
              _hover={{ borderColor: theme.colors.primary }}
              _focus={{
                borderColor: theme.colors.primary,
                boxShadow: `0 0 0 1px ${theme.colors.primary}`,
              }}
              color={theme.colors.primaryTextColor}
            />
            {errors.giverPoints && touched.giverPoints && (
              <Text color="red.400" fontSize="sm" mt={1}>
                {errors.giverPoints}
              </Text>
            )}
          </FormControl>
        </Stack>
      </VStack>

      <HStack justify="flex-end" mt={6} spacing={4}>
        {isCreating && onCancelCreate && (
          <Button
            variant="outline"
            onClick={onCancelCreate}
            color={theme.colors.primaryTextColor}
            _hover={{
              bg: "transparent",
              borderColor: theme.colors.primary,
              color: theme.colors.primary,
            }}
          >
            Cancel
          </Button>
        )}
        <Button
          bg={theme.colors.primary}
          color={theme.colors.white}
          _hover={{ bg: transparentize(theme.colors.primary, 0.8)(theme) }}
          isDisabled={!hasChanges || !editable.isActive || loading || !!errors.name || !!errors.description || !!errors.points || !!errors.giverPoints}
          isLoading={loading}
          onClick={() => save(editable)}
        >
          {isCreating ? "Create" : "Save"}
        </Button>
      </HStack>
    </Box>
  );
}
