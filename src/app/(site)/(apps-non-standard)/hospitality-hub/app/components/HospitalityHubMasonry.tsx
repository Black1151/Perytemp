"use client";

import {
  Box,
  Image,
  SimpleGrid,
  Text,
  Spinner,
  Center,
  Select,
} from "@chakra-ui/react";
import { keyframes } from "@emotion/react";
import {
  AnimatedList,
  AnimatedListItem,
} from "@/components/animations/AnimatedList";
import { useState, useEffect } from "react";
import { Site } from "@/types/types";

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
  }
  90% {
    opacity: 1;
  }
  100% {
    transform: translateX(100%) skewX(-20deg);
    opacity: 0;
  }
`;
import MasonryItemCard from "./MasonryItemCard";
import ItemDetailModal from "./ItemDetailModal";
import { HospitalityItem } from "@/types/hospitalityHub";
import useHospitalityItems from "../../hooks/useHospitalityItems";
import useHospitalityCategories from "../../hooks/useHospitalityCategories";

import { HospitalityCategory } from "@/types/hospitalityHub";

interface HospitalityHubMasonryProps {
  initialCategories?: HospitalityCategory[];
}

export function HospitalityHubMasonry({
  initialCategories = [],
}: HospitalityHubMasonryProps) {
  const [selected, setSelected] = useState<string | null>(null);
  const { categories, loading: categoriesLoading } =
    useHospitalityCategories(initialCategories);
  const { items, loading } = useHospitalityItems(selected);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [loadingItemId, setLoadingItemId] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<HospitalityItem | null>(
    null
  );
  const [sites, setSites] = useState<Site[]>([]);
  const [selectedSiteId, setSelectedSiteId] = useState<number | "">("");

  useEffect(() => {
    const fetchSites = async () => {
      try {
        const res = await fetch("/api/site/allBy?selectColumns=id,siteName");
        const data = await res.json();
        if (res.ok) {
          setSites(data.resource || []);
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchSites();
  }, []);

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
        setModalOpen(true);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setModalLoading(false);
      setLoadingItemId(null);
    }
  };

  // Items are fetched via useHospitalityItems when a category is selected

  if (selected) {
    if (loading) {
      return <Spinner />;
    }

    const displayedItems = items.filter((item) => {
      if (!selectedSiteId) return true;
      const ids = Array.isArray(item.siteIds)
        ? item.siteIds
        : typeof item.siteIds === "string"
          ? item.siteIds
              .split(",")
              .map((s) => Number(s.trim()))
              .filter((n) => !isNaN(n))
          : [];
      return ids.includes(Number(selectedSiteId));
    });

    return (
      <Center mt={20} mb={10} flexDirection="column">
        <Box
          position="fixed"
          top={71}
          left={10}
          cursor="pointer"
          onClick={() => {
            setSelected(null);
          }}
          p={2}
          zIndex={1}
          _hover={{ transform: "scale(1.05)" }}
          transition="transform 0.2s"
          mb={10}
        >
          <Text
            bgColor="rgba(0, 0, 0, 0.57)"
            fontWeight="bold"
            fontSize="2xl"
            color="hospitalityHubPremium"
            p={3}
            borderRadius="lg"
            fontFamily="Metropolis"
          >
            &larr; Back
          </Text>
        </Box>
        <Select
          position="fixed"
          top={150}
          left={10}
          w="200px"
          zIndex={1}
          bg="gray.700"
          color="hospitalityHubPremium"
          borderColor="hospitalityHubPremium"
          borderWidth="1px"
          value={selectedSiteId}
          onChange={(e) =>
            setSelectedSiteId(e.target.value ? Number(e.target.value) : "")
          }
        >
          <option style={{ backgroundColor: "black" }} value="">
            All Sites
          </option>
          {sites.map((site) => (
            <option
              key={site.id}
              value={site.id}
              style={{ backgroundColor: "black" }}
            >
              {site.siteName}
            </option>
          ))}
        </Select>
        {displayedItems.length === 0 ? (
          <Center flex={1} w="100%">
            <Text
              fontFamily="bonfire"
              fontSize="5xl"
              textAlign="center"
              color="hospitalityHubPremium"
            >
              No results to show...
            </Text>
          </Center>
        ) : (
          <SimpleGrid
            columns={[1, null, 2, 3]}
            gap={6}
            w="100%"
            maxW="2000px"
            mx="auto"
          >
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
        <ItemDetailModal
          isOpen={modalOpen}
          onClose={() => {
            setModalOpen(false);
            setSelectedItem(null);
          }}
          item={selectedItem}
          loading={modalLoading}
        />
      </Center>
    );
  }

  if (categoriesLoading) {
    return <Spinner />;
  }

  return (
    <SimpleGrid columns={[2, 3, 4]} gap={4} w="100%" maxW="1440px" mx="auto">
      <AnimatedList>
        {categories.map((category, index) => (
          <AnimatedListItem key={category.id} index={index}>
            <Box
              onClick={() => setSelected(category.id)}
              cursor="pointer"
              position="relative"
              h="600px"
              borderRadius="lg"
              overflow="hidden"
              role="group"
              transition="transform 0.3s, box-shadow 0.3s"
              border="3px solid rgb(238, 228, 88)"
              _hover={{ transform: "scale(1.05)", boxShadow: "4xl" }}
            >
              <Image
                src={category.coverImageUrl || (category as any).image}
                alt={category.name}
                objectFit="cover"
                w="100%"
                h="100%"
              />
              {/* Shimmer overlay */}
              <Box
                position="absolute"
                top={0}
                left={0}
                w="150%"
                h="100%"
                pointerEvents="none"
                bgGradient="linear(120deg, transparent 0%, rgba(255,215,0,0.3) 45%, rgba(255,255,224,0.9) 50%, rgba(255,215,0,0.3) 55%, transparent 100%)"
                transform="translateX(-100%) skewX(-20deg)"
                opacity={0}
                _groupHover={{ animation: `${shimmer} 0.8s` }}
              />
              <Box
                position="absolute"
                bottom={0}
                left={0}
                w="100%"
                p={4}
                pointerEvents="none"
                bgGradient="linear(to-t, rgba(0,0,0,0.8), rgba(0,0,0,0))"
                display="flex"
                justifyContent="center"
              >
                <Text
                  fontWeight="bold"
                  color="hospitalityHubPremium"
                  textAlign="center"
                >
                  {category.name}
                </Text>
              </Box>
            </Box>
          </AnimatedListItem>
        ))}
      </AnimatedList>
    </SimpleGrid>
  );
}
