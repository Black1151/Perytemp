"use client";

import React, { useEffect, useState } from "react";
import {
  Box,
  Flex,
  FormControl,
  Heading,
  IconButton,
  Image,
  Input,
  Spinner,
  Text,
  useTheme,
  VStack,
} from "@chakra-ui/react";
import AddAPhotoOutlinedIcon from "@mui/icons-material/AddAPhotoOutlined";
import DomainIcon from "@mui/icons-material/Domain";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import CreateIcon from "@mui/icons-material/Create";
import UpdateIcon from "@mui/icons-material/Update";
import moment from "moment/moment";
import { useRouter } from "next/navigation";
import { useUser } from "@/providers/UserProvider";
import { useMediaUploader } from "@/hooks/useMediaUploader";
import { Person } from "@mui/icons-material";
import { TagsDisplay } from "@/components/tags/TagsDisplay";
import { TagsResponse } from "@/app/api/tags/getTagsForRecord/route";
import { useTags } from "@/providers/TagsProvider";
import { User } from "@/types/types";
import BackButton from "@/components/BackButton";

interface UserDetailsBannerProps {
  surveyUser: User;
}

export const UserDetailsBanner: React.FC<UserDetailsBannerProps> = ({
  surveyUser,
}) => {
  const { user, showDeveloperBoard, updateShowDeveloperBoard } = useUser();
  const [abstractedCount, setAbstractedCount] = useState<number>(0);
  const router = useRouter();
  const { tags, setRecordDetails, setTags } = useTags();
  const [developerCount, setDeveloperCount] = useState<number>(0);
  const theme = useTheme();

  const handleAbstractedCountClick = () => {
    if (user?.email === "oliver.hannam@sedulo.co.uk") {
      setAbstractedCount((prev) => prev + 1);
    }
  };

  const updateCount = () => {
    if (showDeveloperBoard) return;

    if (user?.userId !== surveyUser.id) return;

    setDeveloperCount(developerCount + 1);
    if (developerCount === 9) {
      updateShowDeveloperBoard(true);
      setDeveloperCount(0);
    }
  };

  useEffect(() => {
    setDeveloperCount(0);
  }, [showDeveloperBoard]);

  const isCurrentUser = surveyUser.uniqueId === user?.userUniqueId;
  const allowedToUploadPhoto =
    isCurrentUser ||
    user?.role === "PA" ||
    (user?.role === "CA" && user?.customerId === surveyUser.customerId) ||
    (user?.role === "CA" &&
      user?.customerId === surveyUser?.customer?.parentId);

  // Using the media uploader hook for profile photo
  const { isUploading, handleFileChange } = useMediaUploader(
    `/api/user/uploadPhoto/${surveyUser.uniqueId}`,
    "imageUrl",
    () => {
      router.refresh();
    }
  );

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const response = await fetch(
          `/api/tags/getTagsForRecord?recordTypeId=2&recordId=${surveyUser.id}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Error fetching tags.");
        }

        const tagsResponse: TagsResponse = await response.json();
        setTags(tagsResponse.resource);
      } catch (error) {
        console.error(error);
      }
    };

    fetchTags();
    setRecordDetails(
      {
        recordCustomerId: surveyUser.customerId?.toString() || "",
        recordId: surveyUser.id.toString(),
        recordParentId: surveyUser.customerId?.toString() || "",
      },
      "2"
    );
  }, []);

  return (
    <VStack w={"100%"} flex={1} align={"stretch"}>
      <Flex
        mb={4}
        p={[0, 0, 4]}
        pt={0}
        borderRadius={8}
        color={theme.colors.adminBannerColor}
        overflow={"hidden"}
        gap={2}
      >
        <BackButton />
        {/*Image Upload*/}
        <FormControl
          w={["50px", "125px"]}
          h={["50px", "125px"]}
          aspectRatio={1}
          borderRadius={"full"}
        >
          <Box
            position="relative"
            w={["50px", "125px"]}
            h={["50px", "125px"]}
            borderRadius="full"
            overflow="hidden"
            _hover={{ ".overlay": { opacity: allowedToUploadPhoto ? 1 : 0 } }}
          >
            <Image
              boxSize={["50px", "125px"]}
              borderRadius="full"
              objectFit={"cover"}
              src={surveyUser.imageUrl}
              alt={`${surveyUser.firstName} ${surveyUser.lastName}`}
              cursor={allowedToUploadPhoto ? "pointer" : "default"}
              fallback={
                <Flex
                  alignItems="center"
                  justifyContent="center"
                  w="full"
                  h="full"
                  maxW="full"
                  gap={2}
                >
                  <Box
                    position="relative"
                    w={["50px", "125px"]}
                    h={["50px", "125px"]}
                    borderRadius="full"
                    bg="gray.100"
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                  >
                    <Person
                      fontSize="large"
                      sx={{ color: "var(--chakra-colors-primary)" }}
                    />
                  </Box>
                </Flex>
              }
            />
            {allowedToUploadPhoto && (
              <Box
                className="overlay"
                position="absolute"
                top="0"
                left="0"
                w="100%"
                h="100%"
                bg="rgba(0, 0, 0, 0.5)"
                display="flex"
                justifyContent="center"
                alignItems="center"
                borderRadius="full"
                opacity={0}
                transition="opacity 0.3s ease"
              >
                <IconButton
                  icon={
                    <AddAPhotoOutlinedIcon
                      fontSize="large"
                      sx={{ color: "var(--chakra-colors-primary)" }}
                    />
                  }
                  aria-label="Upload Photo"
                  colorScheme="whiteAlpha"
                  onClick={() =>
                    document.getElementById("photo-upload")?.click()
                  }
                />
              </Box>
            )}
            {isUploading && (
              <Flex
                position="absolute"
                top="0"
                left="0"
                w="100%"
                h="100%"
                justifyContent="center"
                alignItems="center"
                bg="rgba(0, 0, 0, 0.5)"
                borderRadius="full"
              >
                <Spinner size="md" />
              </Flex>
            )}
          </Box>
          {allowedToUploadPhoto && (
            <Input
              id="photo-upload"
              type="file"
              name="imageUrl"
              mb={4}
              onChange={handleFileChange} // Connect the file input to the uploader
              disabled={isUploading}
              display="none"
            />
          )}
        </FormControl>
        {/*User Details*/}
        <VStack align="start" ml={4}>
          <Flex alignItems="center" gap={2}>
            <Box
              w={"1.4rem"}
              h={"1.4rem"}
              borderRadius="full"
              border={"white 1px solid"}
              bg={surveyUser.isActive ? "green.500" : "red.500"}
              onClick={updateCount}
            />
            <Heading fontWeight={100} size={["sm", "md", "lg"]}>
              {surveyUser.firstName ?? "No Name"} {surveyUser.lastName ?? ""}
            </Heading>
          </Flex>

          <Flex direction={"row"} justify={"center"} align={"center"} gap={2}>
            <EmailOutlinedIcon />
            <Text
              fontSize="xs"
              as={"a"}
              href={`mailto:${surveyUser.email}`}
              _hover={{ textDecoration: "underline", cursor: "pointer" }}
            >
              {surveyUser.email}
            </Text>
          </Flex>
          <Flex direction={"row"} justify={"center"} align={"center"} gap={2}>
            <DomainIcon />
            {surveyUser.customer ? (
              <Text
                fontSize="xs"
                _hover={{ textDecoration: "underline", cursor: "pointer" }}
                onClick={() =>
                  router.push(`/customers/${surveyUser.customer?.uniqueId}`)
                }
              >
                {surveyUser.customer.name}
              </Text>
            ) : (
              <Text fontSize="xs"> Platform</Text>
            )}
          </Flex>
          <Flex direction={"row"} justify={"center"} align={"center"} gap={2}>
            <LocationOnOutlinedIcon />
            {surveyUser.site ? (
              <Text
                fontSize="xs"
                _hover={{ textDecoration: "underline", cursor: "pointer" }}
                onClick={() =>
                  router.push(`/sites/${surveyUser.site?.uniqueId}`)
                }
              >
                {surveyUser.site.siteName}
              </Text>
            ) : (
              <Text fontSize="sm">No site</Text>
            )}
          </Flex>
        </VStack>
        {/* User Details*/}
        <VStack
          ml={"auto"}
          alignItems={"end"}
          justifyContent={"flex-start"}
          display={["none", "none", "flex"]}
        >
          <Heading
            size={["md", "md", "lg"]}
            fontWeight={100}
            onClick={handleAbstractedCountClick}
          >
            ID: {surveyUser.id}
          </Heading>
          <Flex direction="row" justify="center" align="center" gap={2}>
            <CreateIcon />
            <Text fontSize="sm">
              {moment(surveyUser.createdAt).format("D/MM/YYYY")}
            </Text>
          </Flex>
          <Flex direction="row" justify="center" align="center" gap={2}>
            <UpdateIcon />
            <Text fontSize="sm">
              {moment(surveyUser.updatedAt).format("D/MM/YYYY")}
            </Text>
          </Flex>
        </VStack>
      </Flex>
      <Flex px={4}>
        <TagsDisplay tags={tags} />
      </Flex>
    </VStack>
  );
};
