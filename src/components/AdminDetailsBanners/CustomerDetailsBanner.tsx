"use client";

import React, { useEffect } from "react";
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
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import LanguageIcon from "@mui/icons-material/Language";
import moment from "moment/moment";
import CreateIcon from "@mui/icons-material/Create";
import UpdateIcon from "@mui/icons-material/Update";
import { useUser } from "@/providers/UserProvider";
import { useMediaUploader } from "@/hooks/useMediaUploader";
import { useRouter } from "next/navigation";
import { BusinessOutlined } from "@mui/icons-material";
import { TagsDisplay } from "@/components/tags/TagsDisplay";
import { TagsResponse } from "@/app/api/tags/getTagsForRecord/route";
import { useTags } from "@/providers/TagsProvider";
import BackButton from "@/components/BackButton";

interface Customer {
  id: number;
  name: string;
  address1: string;
  address2?: string;
  address3?: string;
  address4?: string;
  postcode: string;
  country?: string;
  customerCode?: string | null;
  webAddress?: string;
  singleSignOn: false;
  primaryContactId?: number | null;
  businessTypeId: number;
  sectorId: number;
  regionId: number;
  companySizeId: number;
  companyNo?: string | null;
  sicCode?: string | null;
  numberOfEmployees?: number;
  parentId?: number | null;
  licensedUsers?: number;
  contactLevelId?: number | null;
  imageUrl?: string;
  uniqueId: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy: number;
  updatedBy: number;
  multiSite?: boolean;
}

interface CustomerDetailsBannerProps {
  customer: Customer;
}

export const CustomerDetailsBanner: React.FC<CustomerDetailsBannerProps> = ({
  customer,
}) => {
  const { user } = useUser();
  const router = useRouter();
  const theme = useTheme();

  const { tags, setRecordDetails, setTags } = useTags();

  const allowedToUploadPhoto =
    user?.role === "PA" ||
    (user?.role === "CA" && user?.customerId === customer.id) ||
    (user?.role === "CA" && user?.customerId === customer.parentId);

  const { isUploading, handleFileChange } = useMediaUploader(
    `/api/customer/uploadPhoto/${customer.uniqueId}`,
    "imageUrl",
    () => {
      router.refresh();
    }
  );

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const response = await fetch(
          `/api/tags/getTagsForRecord?recordTypeId=1&recordId=${customer.id}`,
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
        recordCustomerId: customer.id.toString(),
        recordId: customer.id.toString(),
        recordParentId: customer.parentId?.toString() || "",
      },
      "1"
    );
  }, []);

  return (
    <VStack w={"100%"} flex={1} align={"stretch"}>
      <Flex
        mb={4}
        p={[0, 0, 4]}
        borderRadius={8}
        color={theme.colors.adminBannerColor}
        overflow={"hidden"}
        align={"flex-start"}
        gap={2}
        // direction={['column', 'column', 'row']}
      >
        <BackButton />
        {/* Customer Logo Upload */}
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
            overflow="hidden"
            _hover={{ ".overlay": { opacity: allowedToUploadPhoto ? 1 : 0 } }} // Only show overlay if upload is allowed
          >
            <Image
              w={["50px", "125px"]}
              h={["50px", "125px"]}
              objectFit={"scale-down"}
              src={customer.imageUrl}
              alt={customer.name}
              borderRadius={"lg"}
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
                    <BusinessOutlined
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
                bg="rgba(0, 0, 0, 0.5)" // Optional: Add a background overlay during uploading
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
              onChange={handleFileChange}
              disabled={isUploading}
              display="none"
            />
          )}
        </FormControl>

        {/* Customer Details */}
        <VStack align="start" ml={4}>
          <Flex alignItems="center" gap={2}>
            <Box
              w={"1.4rem"}
              h={"1.4rem"}
              borderRadius="full"
              border={"white 1px solid"}
              bg={customer.isActive ? "green.500" : "red.500"}
            />
            <Heading fontWeight={300} size={["sm", "md", "lg"]}>
              {customer.name}
            </Heading>
          </Flex>
          {customer.webAddress && (
            <Flex
              direction={"row"}
              justify={"center"}
              align={"flex-start"}
              gap={2}
            >
              <LanguageIcon />
              <Text
                as="a"
                fontSize="xs"
                target="_blank"
                rel="noopener noreferrer"
                href={
                  customer.webAddress.startsWith("http")
                    ? customer.webAddress
                    : `https://${customer.webAddress}`
                }
                _hover={{ textDecoration: "underline" }}
              >
                {customer.webAddress}
              </Text>
            </Flex>
          )}
          {customer.address1 && (
            <Flex
              direction={"row"}
              justify={"center"}
              align={"flex-start"}
              gap={2}
            >
              <LocationOnOutlinedIcon />
              <Text fontSize="xs">
                {customer.address1}, {customer.address2}, {customer.address3},{" "}
                {customer.address4}, {customer.postcode}
              </Text>
            </Flex>
          )}
        </VStack>

        {/* Customer ID */}
        <VStack
          ml={"auto"}
          alignItems={"end"}
          justifyContent={"flex-start"}
          display={["none", "none", "flex"]}
        >
          <Heading size={["md", "md", "lg"]} fontWeight={100}>
            ID: {customer.id}
          </Heading>

          <Flex direction={"row"} justify={"center"} align={"center"} gap={2}>
            <CreateIcon />
            <Text fontSize="sm">
              {moment(customer.createdAt).format("D/MM/YYYY")}
            </Text>
          </Flex>
          <Flex direction={"row"} justify={"center"} align={"center"} gap={2}>
            <UpdateIcon />
            <Text fontSize="sm">
              {moment(customer.updatedAt).format("D/MM/YYYY")}
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
