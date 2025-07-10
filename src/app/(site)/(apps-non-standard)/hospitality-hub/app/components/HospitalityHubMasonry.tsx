"use client";

import {
  Box,
  Image,
  SimpleGrid,
  Text,
  Spinner,
  Center,
  Select,
  HStack,
  Flex,
  Divider,
  Badge,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  IconButton,
} from "@chakra-ui/react";
import { keyframes } from "@emotion/react";
import {
  AnimatedList,
  AnimatedListItem,
} from "@/components/animations/AnimatedList";
import { useState, useEffect } from "react";
import { Site } from "@/types/types";
import {
  ArrowBack,
  LocationOn,
  LocationOff,
  Map as MapIcon,
} from "@mui/icons-material";
import MasonryItemCard from "./MasonryItemCard";
import ItemDetailModal from "./ItemDetailModal/ItemDetailModal";
import HospitalityHubHeader from "./HospitalityHubHeader";
import { HospitalityItem } from "@/types/hospitalityHub";
import useHospitalityItems from "../../hooks/useHospitalityItems";
import useHospitalityCategories from "../../hooks/useHospitalityCategories";
import { HospitalityCategory } from "@/types/hospitalityHub";
import HospitalityHubCategoriesGrid from "./HospitalityHubCategoriesGrid";
import GoogleMapsLoader from "./GoogleMapsLoader";
import { GoogleMap, Marker } from "@react-google-maps/api";
import { useDisclosure } from "@chakra-ui/react";
import { useUser } from "@/providers/UserProvider";

const preloadImage = (url: string) =>
  new Promise<void>((resolve) => {
    const img = new window.Image();
    img.onload = () => resolve();
    img.onerror = () => resolve();
    img.src = url;
  });

const preloadImages = (urls: string[]) =>
  Promise.all(urls.filter(Boolean).map(preloadImage));

const shimmer = keyframes`
  0% {
    transform: translateX(-100%) skewX(-20deg);
    opacity: 0;
  }
  10% {
    opacity: 1;
  }MasonryItemCard
  90% {
    opacity: 1;
  }
  100% {
    transform: translateX(100%) skewX(-20deg);
    opacity: 0;
  }
`;

interface HospitalityHubMasonryProps {
  initialCategories?: HospitalityCategory[];
}

export function HospitalityHubMasonry({
  initialCategories = [],
}: HospitalityHubMasonryProps) {
  const [selected, setSelected] = useState<string | null>(null);
  const { categories, loading: categoriesLoading } =
    useHospitalityCategories(initialCategories);
  const [sites, setSites] = useState<Site[]>([]);
  const [selectedSiteId, setSelectedSiteId] = useState<number | "">("");
  const [location, setLocation] = useState("");
  const [radius, setRadius] = useState(8000);
  const [locationLatLng, setLocationLatLng] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [radiusUnit, setRadiusUnit] = useState<"km" | "mi">("km");

  const { items, loading, lastApiResult } = useHospitalityItems(
    selected,
    locationLatLng,
    radius
  );
  const selectedCategoryData = categories.find((cat) => cat.id === selected);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [loadingItemId, setLoadingItemId] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<HospitalityItem | null>(
    null
  );
  const [selectedItemSiteNames, setSelectedItemSiteNames] = useState<string[]>(
    []
  );

  const {
    isOpen: isMapOpen,
    onOpen: openMap,
    onClose: closeMap,
  } = useDisclosure();
  const { user } = useUser();

  // Geocode location string to lat/lng when location changes
  useEffect(() => {
    if (!location) {
      setLocationLatLng(null);
      return;
    }
    // Only geocode if location is not empty
    const geocode = async () => {
      if (
        typeof window !== "undefined" &&
        window.google &&
        window.google.maps
      ) {
        const geocoder = new window.google.maps.Geocoder();
        geocoder.geocode({ address: location }, (results, status) => {
          if (status === "OK" && results && results[0]) {
            setLocationLatLng({
              lat: results[0].geometry.location.lat(),
              lng: results[0].geometry.location.lng(),
            });
          } else {
            setLocationLatLng(null);
          }
        });
      }
    };
    geocode();
  }, [location]);

  const handleItemClick = async (itemId: string) => {
    if (!selected) return;
    setLoadingItemId(itemId);
    setModalLoading(true);
    try {
      const res = await fetch(`/api/hospitality-hub/items?id=${itemId}`);
      const data = await res.json();
      if (res.ok) {
        const item = data.resource;
        setSelectedItem(item);
        const urls: string[] = [];
        if (item.coverImageUrl) urls.push(item.coverImageUrl);
        if (item.logoImageUrl) urls.push(item.logoImageUrl);
        const additional = Array.isArray(item.additionalImageUrlList)
          ? item.additionalImageUrlList
          : typeof item.additionalImageUrlList === "string"
            ? item.additionalImageUrlList
                .split(",")
                .map((u: string) => u.trim())
                .filter(Boolean)
            : [];
        urls.push(...additional);
        await preloadImages(urls);

        // Log engagement: offerOpened
        if (user?.userId && user?.customerId) {
          try {
            await fetch("/api/hospitality-hub/engagement", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                userId: user.userId,
                customerId: user.customerId,
                hospitalityItemId: itemId,
                engagementType: "offerOpened",
              }),
            });
          } catch (err) {
            // Optionally log error, but do not block UI
            console.error("Failed to log engagement", err);
          }
        }

        // Fetch site names before opening modal
        if (item.siteIds && item.siteIds.length > 0) {
          const query = item.siteIds.map((id: number) => `id=${id}`).join("&");
          try {
            const siteRes = await fetch(
              `/api/site/allBy?selectColumns=id,siteName&${query}`
            );
            const siteData = await siteRes.json();
            if (siteRes.ok) {
              setSelectedItemSiteNames(
                (siteData.resource || []).map((s: any) => s.siteName)
              );
            } else {
              setSelectedItemSiteNames([]);
            }
          } catch (err) {
            console.error(err);
            setSelectedItemSiteNames([]);
          }
        } else {
          setSelectedItemSiteNames([]);
        }

        setModalOpen(true);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setModalLoading(false);
      setLoadingItemId(null);
    }
  };

  if (selected) {
    if (loading) {
      return <Spinner />;
    }

    const displayedItems = items.filter((item) => {
      if (!selectedSiteId) return true; // nothing selected – show all

      // ---------- normalise item.siteIds to number[] ----------
      let ids: number[] = [];

      if (Array.isArray(item.siteIds)) {
        // siteIds: number[] | string[]  --> cast each to number
        ids = item.siteIds.map((id: number | string) => Number(id));
      } else if (typeof item.siteIds === "string") {
        // siteIds: "1,2,3"
        ids = (item.siteIds as string)
          .split(",")
          .map((s: string) => Number(s.trim()))
          .filter((n: number) => !isNaN(n));
      }

      return ids.includes(Number(selectedSiteId));
    });

    // Split items if searching by location
    let itemsWithLocation: typeof displayedItems = [];
    let itemsWithoutLocation: typeof displayedItems = [];
    if (locationLatLng) {
      itemsWithLocation = displayedItems.filter(
        (item) => typeof item.distance_from_m === "number"
      );
      itemsWithoutLocation = displayedItems.filter(
        (item) => typeof item.distance_from_m !== "number"
      );
    }

    // Prepare marker positions for all items with location (shown in grid)
    const mapMarkers = (itemsWithLocation || [])
      .map((item: HospitalityItem) => {
        if (
          typeof item.latitude === "number" &&
          typeof item.longitude === "number"
        ) {
          return {
            id: item.id,
            lat: item.latitude,
            lng: item.longitude,
            name: item.name,
          };
        }
        return null;
      })
      .filter(
        (m: any): m is { id: string; lat: number; lng: number; name: string } =>
          !!m
      );

    return (
      <>
        <HStack w="100%" align={"start"} mt={14} px={[4, 4, 4]} py={2}>
          <Box w="100%" maxW="2000px" mx="auto">
            <HospitalityHubHeader
              selectedCategoryData={selectedCategoryData}
              onBack={() => setSelected(null)}
              sites={sites}
              selectedSiteId={selectedSiteId}
              onSiteChange={setSelectedSiteId}
              location={location}
              radius={radius}
              onLocationChange={setLocation}
              onRadiusChange={setRadius}
            />
            {locationLatLng ? (
              <>
                <Box mb={8}>
                  <Text
                    fontSize="lg"
                    fontWeight="bold"
                    color="white"
                    mb={3}
                    display="flex"
                    alignItems="center"
                    gap={2}
                  >
                    <Badge
                      color="hospitalityHubPremium"
                      bg="transparent"
                      fontSize={["0.75em", "0.85em", "1em"]}
                      px={[2, 3]}
                      py={[0.5, 1]}
                      borderRadius="md"
                      border="1px solid rgba(238, 228, 88, 0.5)"
                      display="flex"
                      alignItems="center"
                      gap={1}
                      maxW="90vw"
                    >
                      <LocationOn style={{ marginRight: 4, fontSize: "1em" }} />
                      <Box
                        as="span"
                        overflow="hidden"
                        textOverflow="ellipsis"
                        whiteSpace="nowrap"
                        minW={0}
                        maxW="100%"
                        flex="1"
                        display="block"
                      >
                        {`Items within ${radiusUnit === "mi" ? (radius / 1609.34).toFixed(1) : (radius / 1000).toFixed(1)} ${radiusUnit === "mi" ? "miles" : "km"} of ${location}`}
                      </Box>
                    </Badge>
                  </Text>
                  {itemsWithLocation.length === 0 ? (
                    <Center flex={1} w="100%" minH={"10vh"}>
                      <Text fontSize="md" textAlign="center" color="white">
                        No items with location found...
                      </Text>
                    </Center>
                  ) : (
                    <SimpleGrid
                      columns={[1, null, 2, 3, 4]}
                      gap={8}
                      w="100%"
                      p={0}
                    >
                      <AnimatedList>
                        {itemsWithLocation.map((item, index) => (
                          <AnimatedListItem key={item.id} index={index}>
                            <MasonryItemCard
                              item={item}
                              onClick={() => handleItemClick(item.id)}
                              loading={loadingItemId === item.id}
                            />
                          </AnimatedListItem>
                        ))}
                      </AnimatedList>
                    </SimpleGrid>
                  )}
                </Box>
                <Divider my={4} borderColor="rgba(238, 228, 88, 0.5)" />
                <Box mb={8}>
                  <Text
                    fontSize="lg"
                    fontWeight="bold"
                    color="white"
                    mb={3}
                    display="flex"
                    alignItems="center"
                    gap={2}
                  >
                    <Badge
                      color="hospitalityHubPremium"
                      bg="transparent"
                      fontSize={["0.75em", "0.85em", "1em"]}
                      px={[2, 3]}
                      py={[0.5, 1]}
                      borderRadius="md"
                      border="1px solid rgba(238, 228, 88, 0.5)"
                      display="flex"
                      alignItems="center"
                      gap={1}
                      maxW="100%"
                      overflow="hidden"
                      textOverflow="ellipsis"
                      whiteSpace="nowrap"
                    >
                      <LocationOff
                        style={{ marginRight: 4, fontSize: "1em" }}
                      />
                      Other Offers
                    </Badge>
                  </Text>
                  {itemsWithoutLocation.length === 0 ? (
                    <Center flex={1} w="100%" minH={"10vh"}>
                      <Text fontSize="md" textAlign="center" color="white">
                        No items without location found...
                      </Text>
                    </Center>
                  ) : (
                    <SimpleGrid
                      columns={[1, null, 2, 3, 4]}
                      gap={8}
                      w="100%"
                      p={0}
                    >
                      <AnimatedList>
                        {itemsWithoutLocation.map((item, index) => (
                          <AnimatedListItem key={item.id} index={index}>
                            <MasonryItemCard
                              item={item}
                              onClick={() => handleItemClick(item.id)}
                              loading={loadingItemId === item.id}
                            />
                          </AnimatedListItem>
                        ))}
                      </AnimatedList>
                    </SimpleGrid>
                  )}
                </Box>
              </>
            ) : displayedItems.length === 0 ? (
              <Center flex={1} w="100%" minH={"30vh"}>
                <Text fontSize="xl" textAlign="center" color="white">
                  No results...
                </Text>
              </Center>
            ) : (
              <SimpleGrid columns={[1, null, 2, 3, 4]} gap={6} w="100%" p={0}>
                <AnimatedList>
                  {displayedItems.map((item, index) => (
                    <AnimatedListItem key={item.id} index={index}>
                      <MasonryItemCard
                        item={item}
                        onClick={() => handleItemClick(item.id)}
                        loading={loadingItemId === item.id}
                      />
                    </AnimatedListItem>
                  ))}
                </AnimatedList>
              </SimpleGrid>
            )}
          </Box>
          <ItemDetailModal
            isOpen={modalOpen}
            onClose={() => {
              setModalOpen(false);
              setSelectedItem(null);
              setSelectedItemSiteNames([]);
            }}
            item={selectedItem}
            loading={modalLoading}
            siteNames={selectedItemSiteNames}
          />
        </HStack>
      </>
    );
  }

  if (categoriesLoading) {
    return <Spinner />;
  }
  return (
    <Box mt={14}>
      {/* <HospitalityHubHeader
        onBack={() => setSelected(null)}
        sites={sites}
        selectedSiteId={selectedSiteId}
        onSiteChange={setSelectedSiteId}
        location={location}
        radius={radius}
        onLocationChange={setLocation}
        onRadiusChange={setRadius}
      /> */}
      <HospitalityHubCategoriesGrid
        categories={categories}
        onSelectCategory={setSelected}
        visibleSkinnies={10}
      />
    </Box>
  );
}
