"use client";

import React, { useEffect } from "react";
import {
  Box,
  Flex,
  FormControl,
  Heading,
  Text,
  useTheme,
  VStack,
} from "@chakra-ui/react";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";
import { LocationOn } from "@mui/icons-material";
import moment from "moment/moment";
import CreateIcon from "@mui/icons-material/Create";
import UpdateIcon from "@mui/icons-material/Update";
import DomainIcon from "@mui/icons-material/Domain";
import { useRouter } from "next/navigation";
import { TagsDisplay } from "@/components/tags/TagsDisplay";
import { useTags } from "@/providers/TagsProvider";
import { TagsResponse } from "@/app/api/tags/getTagsForRecord/route";
import { Site } from "@/types/types";
import BackButton from "@/components/BackButton";

interface SiteDetailsBannerProps {
  site: Site;
}

export const SiteDetailsBanner: React.FC<SiteDetailsBannerProps> = ({
  site,
}) => {
  const router = useRouter();
  const { tags, setRecordDetails, setTags } = useTags();
  const theme = useTheme();

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const response = await fetch(
          `/api/tags/getTagsForRecord?recordTypeId=3&recordId=${site.id}`,
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
        recordCustomerId: site.customerId?.toString() || "",
        recordId: site.id.toString(),
        recordParentId: site.customer?.uniqueId || "",
      },
      "3"
    );
  }, []);

  return (
    <VStack w={"100%"} flex={1} align={"stretch"}>
      <Flex
        mb={4}
        p={[0, 0, 4]}
        color={theme.colors.adminBannerColor}
        overflow={"hidden"}
        gap={2}
      >
        <BackButton />
        {/* Site Icon and Name */}
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
            bg="gray.100"
            display="flex"
            justifyContent="center"
            alignItems="center"
          >
            <LocationOn
              fontSize="large"
              sx={{ color: "var(--chakra-colors-primary)" }}
            />
          </Box>
        </FormControl>

        {/* Site Information */}
        <VStack align="start" ml={4}>
          <Flex justify={"center"} align={"center"} gap={2}>
            <Box
              w={"1.4rem"}
              h={"1.4rem"}
              borderRadius="full"
              border={"white 1px solid"}
              bg={site.isActive ? "green.500" : "red.500"}
            />
            <Heading fontWeight={300} size={["sm", "md", "lg"]}>
              {site.siteName}
            </Heading>
          </Flex>
          <Flex direction={"row"} justify={"center"} align={"center"} gap={2}>
            <LocationOnOutlinedIcon />
            <Text fontSize="xs">
              {site.address1}, {site.address2}, {site.address3}, {site.postcode}
              , {site.country}
            </Text>
          </Flex>

          <Flex direction={"row"} justify={"center"} align={"center"} gap={2}>
            <DomainIcon />
            <Text
              fontSize="xs"
              _hover={{ textDecoration: "underline", cursor: "pointer" }}
              onClick={() =>
                router.push(`/customers/${site.customer?.uniqueId}`)
              }
            >
              {site.customer && site?.customer?.name}
            </Text>
          </Flex>

          <Flex direction={"row"} justify={"center"} align={"center"} gap={2}>
            <PhoneOutlinedIcon />
            <Text fontSize="xs">{site.siteTel}</Text>
          </Flex>
        </VStack>

        {/* Site ID on the right */}
        <VStack
          ml={"auto"}
          justify={"center"}
          align={"center"}
          display={["none", "none", "flex"]}
        >
          <Heading size={["sm", "md", "lg"]} fontWeight={100}>
            ID: {site.id}
          </Heading>
          <Flex direction={"row"} justify={"center"} align={"center"} gap={2}>
            <CreateIcon />
            <Text fontSize="xs">
              {moment(site.createdAt).format("D/MM/YYYY")}
            </Text>
          </Flex>
          <Flex direction={"row"} justify={"center"} align={"center"} gap={2}>
            <UpdateIcon />
            <Text fontSize="xs">
              {moment(site.updatedAt).format("D/MM/YYYY")}
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
