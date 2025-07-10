import { useCallback, useEffect, useState, useMemo } from "react";
import { Category as CategoryIcon, Lock, Add } from "@mui/icons-material";
import {
  Box,
  VStack,
  Text,
  Spinner,
  Alert,
  AlertIcon,
  Badge,
  useTheme,
  Button,
  HStack,
  Stack,
  IconButton,
} from "@chakra-ui/react";
import { transparentize } from "@chakra-ui/theme-tools";
import CategoryPanel from "./CategoryPanel";
import SplitPaneModal from "@/components/modals/SplitPaneModal";

export type Category = {
  uniqueId: number;
  name: string;
  description: string;
  points: number;
  isActive: boolean;
  giverPoints: number;
};

const emptyCategory: Category = {
  uniqueId: -1,
  name: "",
  description: "",
  points: 0,
  giverPoints: 0,
  isActive: true,
};

export default function CategoriesModal(props: {
  isOpen: boolean;
  onClose: () => void;
  customerId: number | null;
  isFree: boolean;
  toolId: number;
}) {
  const { isOpen, onClose, customerId, isFree, toolId } = props;
  const theme = useTheme();

  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selId, setSelId] = useState<number | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const selected = isCreating
    ? emptyCategory
    : (categories.find((c) => c.uniqueId === selId) ?? null);
  const borderColor = transparentize(
    theme.colors.primaryTextColor,
    0.15
  )(theme);

  const fetchCats = useCallback(async () => {
    if (!customerId) return;
    setLoading(true);
    setError(null);
    try {
      const r = await fetch(`/api/bigup?customerId=${customerId}`);
      if (!r.ok) throw new Error("fetch failed");
      const j = await r.json();
      console.log(j);
      const mapped: Category[] = (j.resource ?? []).map((i: any) => ({
        uniqueId: i.id,
        name: i.name,
        description: i.description,
        points: i.points,
        giverPoints: i.giverPoints,
        isActive: i.isActive,
      }));
      setCategories(mapped);
      if (mapped.length > 0) {
        setSelId(mapped[0].uniqueId);
        setIsCreating(false);
      }
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [customerId]);

  useEffect(() => {
    if (isOpen) {
      setIsCreating(false);
      fetchCats();
    }
  }, [isOpen, fetchCats]);

  const handleCreateNew = () => {
    setIsCreating(true);
    setSelId(null);
  };

  const handleCancelCreate = () => {
    setIsCreating(false);
    setSelId(categories[0]?.uniqueId ?? null);
  };

  const handleCategorySelect = (id: number) => {
    if (isCreating) {
      setIsCreating(false);
    }
    setSelId(id);
  };

  const Sidebar = useMemo(() => {
    if (loading) return <Spinner size="lg" color={theme.colors.primary} />;
    if (error)
      return (
        <Alert
          status="error"
          bg={theme.colors.red[50]}
          color={theme.colors.red[700]}
        >
          <AlertIcon color={theme.colors.red[500]} />
          {error}
        </Alert>
      );

    return (
      <VStack align="stretch" spacing={4}>
        {/* Create New Category Item */}
        <Box
          border="1px solid"
          borderColor={isCreating ? theme.colors.primary : borderColor}
          p={3}
          borderRadius={theme.radii.md}
          transition="all 0.2s ease"
          _hover={{
            cursor: "pointer",
            bg: isCreating
              ? transparentize(theme.colors.primary, 0.1)(theme)
              : transparentize(theme.colors.elementBG, 0.8)(theme),
            transform: "translateY(-1px)",
            boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
            borderColor: theme.colors.primary,
          }}
          onClick={handleCreateNew}
          bg={
            isCreating
              ? transparentize(theme.colors.primary, 0.1)(theme)
              : "rgb(33, 112, 36, 0.15)"
          }
          position="relative"
          _before={
            isCreating
              ? {
                  content: '""',
                  position: "absolute",
                  left: 0,
                  top: 0,
                  bottom: 0,
                  width: "3px",
                  bg: theme.colors.primary,
                  borderTopLeftRadius: theme.radii.md,
                  borderBottomLeftRadius: theme.radii.md,
                }
              : undefined
          }
        >
          <HStack spacing={2} color={theme.colors.primaryTextColor}>
            <Add fontSize="medium" />
            <Text fontWeight="semibold">Create New Category</Text>
          </HStack>
        </Box>

        {!categories.length && !isCreating ? (
          <Text
            textAlign="center"
            mt={10}
            color={theme.colors.primaryTextColor}
          >
            No categories.
          </Text>
        ) : (
          categories.map((c) => {
            const locked = props.isFree && !c.isActive;
            return (
              <Box
                key={c.uniqueId}
                border="1px solid"
                borderColor={
                  selId === c.uniqueId ? theme.colors.primary : borderColor
                }
                p={3}
                borderRadius={theme.radii.md}
                opacity={locked ? 0.5 : 1}
                transition="all 0.2s ease"
                _hover={{
                  cursor: locked ? "not-allowed" : "pointer",
                  bg:
                    selId === c.uniqueId
                      ? transparentize(theme.colors.primary, 0.1)(theme)
                      : transparentize(theme.colors.elementBG, 0.8)(theme),
                  transform: locked ? "none" : "translateY(-1px)",
                  boxShadow: locked ? "none" : "0 2px 4px rgba(0,0,0,0.05)",
                  borderColor: locked ? borderColor : theme.colors.primary,
                }}
                onClick={() => !locked && handleCategorySelect(c.uniqueId)}
                bg={
                  selId === c.uniqueId
                    ? transparentize(theme.colors.primary, 0.1)(theme)
                    : theme.colors.elementBG
                }
                position="relative"
                _before={
                  selId === c.uniqueId
                    ? {
                        content: '""',
                        position: "absolute",
                        left: 0,
                        top: 0,
                        bottom: 0,
                        width: "3px",
                        bg: theme.colors.primary,
                        borderTopLeftRadius: theme.radii.md,
                        borderBottomLeftRadius: theme.radii.md,
                      }
                    : undefined
                }
              >
                {locked && (
                  <Lock
                    fontSize="small"
                    color={theme.colors.primaryTextColor}
                  />
                )}
                <Box
                  w="10px"
                  h="10px"
                  borderRadius="full"
                  bg={c.isActive ? "green.400" : "red.300"}
                  position="absolute"
                  top="8px"
                  right="8px"
                  sx={
                    c.isActive
                      ? {
                          animation: "pulseGreen 1.2s infinite",
                          "@keyframes pulseGreen": {
                            "0%": { boxShadow: "0 0 0 0 rgba(72,187,120,.7)" },
                            "70%": {
                              boxShadow: "0 0 0 8px rgba(72,187,120,0)",
                            },
                            "100%": { boxShadow: "0 0 0 0 rgba(72,187,120,0)" },
                          },
                        }
                      : {}
                  }
                />
                <Text
                  fontWeight="semibold"
                  mb={1}
                  color={theme.colors.primaryTextColor}
                >
                  {c.name}
                </Text>
                <Text
                  fontSize="sm"
                  noOfLines={2}
                  color={theme.colors.secondaryTextColor}
                >
                  {c.description}
                </Text>
                <Stack
                  direction={["column", "column", "column", "row"]}
                  gap={0}
                >
                  <Badge
                    mt={1}
                    colorScheme="blackAlpha"
                    color={theme.colors.primaryTextColor}
                    w="min"
                  >
                    {c.points} Receiver pts
                  </Badge>
                  <Badge
                    mt={1}
                    colorScheme="blackAlpha"
                    color={theme.colors.primaryTextColor}
                    w="min"
                  >
                    {c.giverPoints} Giver pts
                  </Badge>
                </Stack>
              </Box>
            );
          })
        )}
      </VStack>
    );
  }, [categories, selId, loading, error, props.isFree, theme, isCreating]);

  const Panel = selected ? (
    <CategoryPanel
      category={selected}
      onUpdateCategory={(u) => {
        if (isCreating) {
          setCategories((p) => [...p, u]);
          setIsCreating(false);
          setSelId(u.uniqueId);
        } else {
          setCategories((p) =>
            p.map((c) => (c.uniqueId === u.uniqueId ? u : c))
          );
        }
      }}
      customerId={customerId}
      toolId={toolId}
      isCreating={isCreating}
      onCancelCreate={handleCancelCreate}
    />
  ) : (
    <Text textAlign="center" mt={10} color={theme.colors.primaryTextColor}>
      No category selected
    </Text>
  );

  /* mobile selector items ---------------------------------------------- */
  const mobileItems = categories.map((c) => ({
    id: c.uniqueId,
    label: c.name,
    isActive: c.isActive,
    content: <>{c.name}</>,
  }));

  return (
    <>
      <SplitPaneModal
        isOpen={isOpen}
        onClose={onClose}
        icon={
          <CategoryIcon fontSize="inherit" htmlColor={theme.colors.primary} />
        }
        title="Manage Categories"
        total={categories.length}
        sidebar={Sidebar}
        panel={Panel}
        sidebarLoading={loading}
        sidebarSkeletonCount={4}
        mobileItems={mobileItems}
        mobileSelectedId={selId ?? undefined}
        onMobileSelect={(id) => setSelId(id as number)}
      />

      {isOpen && (
        <Button
          leftIcon={<Add />}
          aria-label="Create new category"
          position="fixed"
          bottom={5}
          right={5}
          zIndex="9999"
          colorScheme="primary"
          rounded="full"
          size="md"
          boxShadow="lg"
          border={0}
          display={{ base: "inline-flex", md: "none" }} // only on mobile
          onClick={handleCreateNew}
          bg={"rgb(33, 112, 36, 0.85)"}
          color={"white"}
        >
          New Category
        </Button>
      )}
    </>
  );
}
