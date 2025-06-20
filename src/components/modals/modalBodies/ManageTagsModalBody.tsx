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
    <VStack align="stretch" pb={4}>
      <Tabs
        index={selectedTabIndex}
        onChange={(index) => {
          resetFormState();
          setSelectedTabIndex(index);
        }}
      >
        <TabList borderBottom="none">
          <Tab
            _selected={{
              color: "white",
              bg: "green.500",
              borderTopRadius: "md",
            }}
            _focus={{
              boxShadow: "none",
            }}
            _active={{
              background: "none",
            }}
            width="50%"
            color="green.500"
            border="1px solid"
            borderColor="green.500"
            borderTopRadius="md"
          >
            Add
          </Tab>
          <Tab
            _selected={{
              color: "white",
              bg: "red.500",
              borderTopRadius: "md",
            }}
            _focus={{
              boxShadow: "none",
            }}
            _active={{
              background: "none",
            }}
            width="50%"
            color="red.500"
            border="1px solid"
            borderColor="red.500"
            borderTopRadius="md"
          >
            Remove
          </Tab>
        </TabList>

        <TabPanels>
          <TabPanel pb={0}>
            {/* Add Tab Content */}
            <VStack spacing={4} align="stretch">
              <Box>
                <Select
                  placeholder="Select a tag to add"
                  value={selectedTagId}
                  color="primaryTextColor"
                  sx={{
                    option: {
                      backgroundColor: theme.colors.elementBG,
                    },
                    "&:focus": {
                      borderColor: "primary",
                      boxShadow: `0 0 0 1px ${theme.colors.primary}`,
                    },
                  }}
                  onChange={(e) => {
                    setSelectedTagId(e.target.value);
                  }}
                  py={5}
                >
                  {availableTags && availableTags[1] ? (
                    availableTags.map((tag: Tag) => {
                      return (
                        <option
                          style={{
                            backgroundColor: theme.colors.elementBG,
                          }}
                          key={tag.id}
                          value={String(tag.id)}
                        >
                          {tag.name}
                        </option>
                      );
                    })
                  ) : (
                    <Text>No tags available</Text>
                  )}
                </Select>
              </Box>

              <Button
                variant="green"
                onClick={handleAddTag}
                isDisabled={!selectedTagId}
                display="flex"
                alignItems="center"
                gap={[0, 0, 2]}
                lineHeight={0}
                _hover={
                  !selectedTagId
                    ? {}
                    : {
                        backgroundColor: "transparent",
                        color: "green.900",
                      }
                }
              >
                <Add />
                Add Tag
              </Button>
            </VStack>
          </TabPanel>

          <TabPanel pb={0}>
            {/* Remove Tab Content */}
            <VStack spacing={4} align="stretch">
              <Box>
                <Select
                  color="primaryTextColor"
                  placeholder="Select a tag to remove"
                  value={selectedTagToRemoveId}
                  onChange={(e) => {
                    setSelectedTagToRemoveId(e.target.value);
                  }}
                  py={5}
                  sx={{
                    option: {
                      backgroundColor: theme.colors.elementBG,
                      color: "primaryTextColor",
                    },
                    "&:focus": {
                      borderColor: "primary",
                      boxShadow: `0 0 0 1px ${theme.colors.primary}`,
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
                variant="red"
                onClick={handleRemoveTag}
                isDisabled={!selectedTagToRemoveId}
                display="flex"
                alignItems="center"
                gap={[0, 0, 2]}
                lineHeight={0}
                _hover={
                  !selectedTagToRemoveId
                    ? {}
                    : {
                        backgroundColor: "transparent",
                        color: "red.900",
                      }
                }
              >
                <Add />
                Remove Tag
              </Button>
            </VStack>
          </TabPanel>
        </TabPanels>
      </Tabs>

      <Button
        mx={4}
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
