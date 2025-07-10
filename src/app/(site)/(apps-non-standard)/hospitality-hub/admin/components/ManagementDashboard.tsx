"use client";
import {
  VStack,
  Spinner,
  Select,
  IconButton,
  Text,
  Center,
  Flex,
  Box,
  Button,
} from "@chakra-ui/react";
import { FiPlus } from "react-icons/fi";
import PostAddIcon from "@mui/icons-material/PostAdd";
import { useState, useRef, useEffect, useCallback, useTransition } from "react";

import { HospitalityCategory } from "@/types/hospitalityHub";
import useHospitalityCategories from "../../hooks/useHospitalityCategories";
import CategoryTabContent, {
  CategoryTabContentRef,
} from "./CategoryTabContent";
import AddCategoryModal from "./AddCategoryModal";
import DeleteCategoryModal from "./DeleteCategoryModal";
import CategoryCard from "./CategoryCard";
import MobileDrawerSelector from "@/components/modals/MobileDrawerSelector";
import { useBreakpointValue } from "@chakra-ui/react";

/**
 * ManagementDashboard
 * -------------------
 * Optimistic UI with NO visible un‑mount/re‑mount when a category is toggled.
 * We only show a full‑screen spinner for the *first* fetch. Subsequent
 * revalidations keep the current UI visible and (optionally) overlay a small
 * spinner in the corner.
 */
const ManagementDashboard = () => {
  /* ------------------------------------------------------------------ */
  /* data fetching + local cache                                         */
  /* ------------------------------------------------------------------ */
  const {
    categories: remoteCategories,
    loading: remoteLoading,
    refresh,
  } = useHospitalityCategories([], true);

  // Local copy that we mutate optimistically.
  const [categories, setCategories] =
    useState<HospitalityCategory[]>(remoteCategories);

  // Keep local list in sync when the server sends new data
  useEffect(() => {
    setCategories(remoteCategories);
  }, [remoteCategories]);

  /* ------------------------------------------------------------------ */
  /* "initial" vs "subsequent" loading states                           */
  /* ------------------------------------------------------------------ */
  const [initialLoaded, setInitialLoaded] = useState(false);
  useEffect(() => {
    if (!remoteLoading) setInitialLoaded(true);
  }, [remoteLoading]);

  const isRefreshing = remoteLoading && initialLoaded; // true only after first load

  /* ------------------------------------------------------------------ */
  /* other state / refs                                                 */
  /* ------------------------------------------------------------------ */
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] =
    useState<HospitalityCategory | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] =
    useState<HospitalityCategory | null>(null);

  const itemTabRef = useRef<CategoryTabContentRef>(null);
  const isMobile = useBreakpointValue({ base: true, md: false });

  /* ------------------------------------------------------------------ */
  /* optimistic toggle handler                                          */
  /* ------------------------------------------------------------------ */
  const [_, startTransition] = useTransition();

  const handleAfterToggle = useCallback(
    (updated: HospitalityCategory) => {
      // 1 — update local cache + current selection instantly
      setCategories((prev) =>
        prev.map((c) => (c.id === updated.id ? updated : c))
      );
      setSelectedCategory(updated);

      // 2 — silent background re‑fetch (does not trigger spinner swap)
      startTransition(() => {
        refresh();
      });
    },
    [refresh]
  );

  /* ------------------------------------------------------------------ */
  /* helper for the mobile selector                                     */
  /* ------------------------------------------------------------------ */
  const categoryItems = categories.map((c) => ({
    id: String(c.id),
    label: c.name,
    content: c.name,
  }));

  /* ------------------------------------------------------------------ */
  /* render                                                             */
  /* ------------------------------------------------------------------ */
  if (!initialLoaded) {
    // FIRST ever load → show full‑screen spinner once.
    return (
      <Center flex={1} w="100%">
        <Spinner size="xl" color="themeTextColor" thickness="4px" />
      </Center>
    );
  }

  return (
    <Flex
      w="100%"
      align="stretch"
      gap={6}
      direction={{ base: "column", xl: "row" }}
      position="relative"
      flexWrap="nowrap"
    >
      {/* small corner spinner during background refresh */}
      {isRefreshing && (
        <Spinner
          position="absolute"
          top={2}
          right={2}
          size="md"
          thickness="3px"
          color="themeTextColor"
        />
      )}

      {/* ---------------- LEFT COLUMN ---------------- */}
      <Box
        w={{ base: "100%", xl: "40%", "2xl": "33%" }}
        display="flex"
        flexDirection="column"
        flexShrink={0}
        mb={{ base: 6, md: 0 }}
        minW={0}
        minH={0}
      >
        {/* dropdown + add-category button */}
        <Flex mb={4} w="100%" align="center" gap={2}>
          {isMobile ? (
            <MobileDrawerSelector
              items={categoryItems}
              selectedId={selectedCategory?.id}
              onSelect={(id) => {
                const cat = categories.find((c) => String(c.id) === id);
                setSelectedCategory(cat || null);
              }}
              triggerLabel={selectedCategory?.name || "Select Category"}
            />
          ) : (
            <Select
              placeholder="Select Category"
              value={selectedCategory?.id?.toString() || ""}
              onChange={(e) => {
                const cat = categories.find(
                  (c) => String(c.id) === e.target.value
                );
                setSelectedCategory(cat || null);
              }}
              color="primaryTextColor"
              bg="elementBG"
              sx={{
                option: {
                  backgroundColor: "var(--chakra-colors-elementBG)",
                },
              }}
            >
              {categories.map((c) => (
                <option key={c.id} value={String(c.id)}>
                  {c.name}
                </option>
              ))}
            </Select>
          )}

          <IconButton
            aria-label="Create Category"
            icon={<FiPlus />}
            onClick={() => {
              setEditingCategory(null);
              setCategoryModalOpen(true);
            }}
            size="md"
            minW="40px"
            h="40px"
            bg="green.400"
            color="white"
            border="1px solid"
            borderColor="green.400"
            _hover={{
              bg: "white",
              color: "green.400",
              borderColor: "green.400",
            }}
          />
        </Flex>

        {/* category card */}
        <Box flexGrow={1} display="flex" flexDirection="column" minW={0} minH={0}>
          <CategoryCard
            category={selectedCategory}
            onEdit={(cat) => {
              setEditingCategory(cat);
              setCategoryModalOpen(true);
            }}
            onDelete={(cat) => {
              setSelectedCategory(cat);
              setDeleteModalOpen(true);
            }}
            onToggleActive={handleAfterToggle}
          />
        </Box>
      </Box>

      {/* ---------------- RIGHT COLUMN ---------------- */}
      <Box flex={1} display="flex" flexDirection="column" minW={0} minH={0}>
        {selectedCategory && (
          <Button
            alignSelf="flex-end"
            colorScheme="green"
            bg="green.400"
            color="white"
            border="1px solid"
            borderColor="green.400"
            _hover={{
              bg: "white",
              color: "green.400",
              borderColor: "green.400",
            }}
            leftIcon={<PostAddIcon fontSize="small" />}
            mb={4}
            onClick={() => itemTabRef.current?.openAddModal()}
          >
            New Item
          </Button>
        )}

        <Box flex={1} overflowY="auto" minH={0} minW={0}>
          {selectedCategory ? (
            <CategoryTabContent ref={itemTabRef} category={selectedCategory} />
          ) : (
            <Center flex={1}>
              <Text fontSize="xl" textAlign="center" color="white" w="250px">
                Select a category or create a new one to start!
              </Text>
            </Center>
          )}
        </Box>
      </Box>

      {/* ---------------- MODALS ---------------- */}
      <AddCategoryModal
        isOpen={categoryModalOpen}
        onClose={() => setCategoryModalOpen(false)}
        onCreated={(cat) => {
          setSelectedCategory(cat);
          startTransition(refresh);
        }}
        category={editingCategory}
      />

      <DeleteCategoryModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        category={selectedCategory}
        onDeleted={() => {
          setSelectedCategory(null);
          startTransition(refresh);
        }}
      />
    </Flex>
  );
};

export default ManagementDashboard;
