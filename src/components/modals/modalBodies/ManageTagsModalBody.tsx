"use client";

import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Select,
  Spinner,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  useTheme,
  VStack,
} from "@chakra-ui/react";
import { Tag } from "@/components/AdminDetailsBanners/TagDetailsBanner";
import { useFetchClient } from "@/hooks/useFetchClient";
import { useTags } from "@/providers/TagsProvider";
import { Add, Check, Remove } from "@mui/icons-material";

interface ManageTagsModalBodyProps {
  customerId: number;
  onClose: () => void;
}

export function ManageTagsModalBody({
  customerId,
  onClose,
}: ManageTagsModalBodyProps) {
  const [availableTags, setAvailableTags] = useState<Tag[]>([]);
  const [selectedTagId, setSelectedTagId] = useState<string>("");
  const [selectedTagToRemoveId, setSelectedTagToRemoveId] =
    useState<string>("");
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTabIndex, setSelectedTabIndex] = useState(0);
  const { fetchClient } = useFetchClient();
  const { tags, setTags } = useTags();
  const { recordIds, recordTypeId } = useTags();
  const recordId = recordIds?.recordId;

  const theme = useTheme();

  const resetFormState = () => {
    setSelectedTagId("");
    setSelectedTagToRemoveId("");
    setError("");
  };

  const fetchAvailableTags = async () => {
    setIsLoading(true);
    setError("");

    const data = await fetchClient<{ resource: Tag[] }>(
      "/api/tags/getTagsAvailableToAddToRecord",
      {
        method: "POST",
        body: { customerId, recordTypeId, recordId },
        errorMessage: "Failed to fetch available tags",
        redirectOnError: false,
      }
    );

    if (data) {
      setAvailableTags(data.resource);
    }

    setIsLoading(false);
  };

  useEffect(() => {
    fetchAvailableTags();
  }, []);

  const handleAddTag = async () => {
    if (!selectedTagId) {
      setError("Please select a tag");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/tags/addTagToRecord/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          recordId,
          recordTypeId,
          tagId: selectedTagId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to add tag to record");
      }
      const newTagsResponse = await fetchClient<{ resource: Tag[] }>(
        `/api/tags/getTagsForRecord?recordTypeId=${recordTypeId}&recordId=${recordId}`,
        {
          method: "GET",
          redirectOnError: false,
        }
      );

      if (newTagsResponse) {
        setTags(newTagsResponse.resource);
      }
      await fetchAvailableTags();
      resetFormState();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveTag = async () => {
    if (!selectedTagToRemoveId) {
      setError("Please select a tag to remove");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await fetch(
        `/api/tags/removeTagFromRecord/${selectedTagToRemoveId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to remove tag from record");
      }

      // Fetch the new tags after successful removal
      const newTagsResponse = await fetchClient<{ resource: Tag[] }>(
        `/api/tags/getTagsForRecord?recordTypeId=${recordTypeId}&recordId=${recordId}`,
        {
          method: "GET",
          redirectOnError: false,
        }
      );

      if (newTagsResponse) {
        setTags(newTagsResponse.resource);
      }
      await fetchAvailableTags();
      resetFormState();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <Box
        height={170}
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Spinner />
      </Box>
    );
  }

  if (error) {
    return <Text color="red.500">{error}</Text>;
  }

  return (
    <VStack align="stretch" pb={4} px={0}>
      <Tabs
        index={selectedTabIndex}
        onChange={(index) => {
          resetFormState();
          setSelectedTabIndex(index);
        }}
      >
        <TabList borderBottom="none" bg="transparent" gap={2}>
          <Tab
            bg="rgb(255,255,255,0.6)"
            transition="all 0.2s ease-in-out"
            _selected={{
              bgGradient: "linear(to-r, green.400, green.600)",
              color: "white",
              borderColor: "green.600",
              borderTop: "4px solid",
              borderTopColor: "green.300",
              transform: "scaleY(1.05) translateY(-2px)",
              boxShadow: "md",
              fontWeight: "bold",
            }}
            _focus={{ boxShadow: "none" }}
            _active={{ background: "green.700" }}
            color="green.600"
            border="3px solid"
            borderBottom="none"
            borderColor="green.200"
            borderTopRadius="md"
            width="50%"
          >
            Add
          </Tab>

          <Tab
            bg="rgb(255,255,255,0.6)"
            transition="all 0.2s ease-in-out"
            _selected={{
              bgGradient: "linear(to-r, red.400, red.600)",
              color: "white",
              borderColor: "red.600",
              borderTop: "4px solid",
              borderTopColor: "red.300",
              transform: "scaleY(1.05) translateY(-2px)",
              boxShadow: "md",
              fontWeight: "bold",
            }}
            _focus={{ boxShadow: "none" }}
            _active={{ background: "red.700" }}
            color="red.600"
            border="3px solid"
            borderBottom="none"
            borderColor="red.200"
            borderTopRadius="md"
            width="50%"
          >
            Remove
          </Tab>
        </TabList>

        <TabPanels>
          <TabPanel
            p={4} // Add padding all around
            position="relative"
            zIndex={1}
            border="3px solid"
            borderTop="none" // Remove the top border
            borderRadius="0 0 0.5rem 0.5rem"
            bg="white"
            borderColor="green.200"
          >
            {/* Add Tab Content */}
            <VStack spacing={4} align="stretch">
              <Box>
                <Select
                  placeholder="Select a tag to add"
                  value={selectedTagId}
                  onChange={(e) => setSelectedTagId(e.target.value)}
                  borderRadius="md"
                  py={3}
                  fontSize="md"
                  bg="white"
                  color="gray.800"
                  border="1px solid"
                  borderColor="gray.300"
                  _hover={{ borderColor: "gray.400" }}
                  _focus={{
                    borderColor: "green.500",
                    boxShadow: "0 0 0 1px green.500",
                    bg: "white",
                  }}
                  sx={{
                    option: {
                      backgroundColor: "white",
                      color: "gray.800",
                    },
                  }}
                >
                  {availableTags && availableTags.length > 0 ? (
                    availableTags.map((tag: Tag) => (
                      <option key={tag.id} value={String(tag.id)}>
                        {tag.name}
                      </option>
                    ))
                  ) : (
                    <option disabled>No tags available</option>
                  )}
                </Select>
              </Box>

              <Button
                bg="green.500"
                color="white"
                _hover={{ bg: "green.600" }}
                _disabled={{ opacity: 0.6 }}
                onClick={handleAddTag}
                isDisabled={!selectedTagId}
                display="flex"
                alignItems="center"
                gap={2}
              >
                <Add />
                Add Tag
              </Button>
            </VStack>
          </TabPanel>

          <TabPanel
            p={4}
            position="relative"
            zIndex={1}
            border="3px solid"
            borderTop="none"
            borderRadius="0 0 0.5rem 0.5rem"
            bg="white"
            borderColor="red.200"
          >
            {/* Remove Tab Content */}
            <VStack spacing={4} align="stretch">
              <Box>
                <Select
                  placeholder="Select a tag to remove"
                  value={selectedTagToRemoveId}
                  onChange={(e) => setSelectedTagToRemoveId(e.target.value)}
                  borderRadius="md"
                  py={3}
                  fontSize="md"
                  bg="white"
                  color="gray.800"
                  border="1px solid"
                  borderColor="gray.300"
                  _hover={{ borderColor: "gray.400" }}
                  _focus={{
                    borderColor: "red.500",
                    boxShadow: "0 0 0 1px red.500",
                    bg: "white",
                  }}
                  sx={{
                    option: {
                      backgroundColor: "white",
                      color: "gray.800",
                    },
                  }}
                >
                  {tags.map((tag: any) => (
                    <option key={tag.id} value={tag.tagAssocId}>
                      {tag.name}
                    </option>
                  ))}
                </Select>
              </Box>

              <Button
                bg="red.500"
                color="white"
                _hover={{ bg: "red.600" }}
                _disabled={{ opacity: 0.6 }}
                onClick={handleRemoveTag}
                isDisabled={!selectedTagToRemoveId}
                display="flex"
                alignItems="center"
                gap={2}
              >
                <Remove />
                Remove Tag
              </Button>
            </VStack>
          </TabPanel>
        </TabPanels>
      </Tabs>

      <Button
        mx={0}
        variant="darkGray"
        border="none"
        onClick={onClose}
        display="flex"
        alignItems="center"
        gap={[0, 0, 2]}
        lineHeight={0}
        _hover={{
          backgroundColor: theme.colors.primary,
        }}
      >
        <Check />
        Done
      </Button>
    </VStack>
  );
}
