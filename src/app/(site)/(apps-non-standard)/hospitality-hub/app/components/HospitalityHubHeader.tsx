import { Flex, Box, Text, useBreakpointValue, Divider, IconButton, Portal, ScaleFade } from "@chakra-ui/react";
import { Site } from "@/types/types";
import { HospitalityCategory } from "@/types/hospitalityHub";
import React from "react";
import LocationFilter, { LocationFilterMenu } from "./LocationFilter";
import BackButton from "@/components/BackButton";
import ContextualMenu from "@/components/Sidebars/ContextualMenu";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import FilterAltIcon from "@mui/icons-material/FilterAlt";

interface HospitalityHubHeaderProps {
  title?: string;
  selectedCategoryData?: HospitalityCategory;
  onBack: () => void;
  sites?: Site[];
  selectedSiteId?: number | "";
  onSiteChange?: (siteId: number | "") => void;
  location?: string;
  radius?: number;
  onLocationChange?: (location: string) => void;
  onRadiusChange?: (radius: number) => void;
}

const HospitalityHubHeader: React.FC<HospitalityHubHeaderProps> = ({
  title,
  selectedCategoryData,
  onBack,
  sites,
  selectedSiteId,
  onSiteChange,
  location,
  radius,
  onLocationChange,
  onRadiusChange,
}) => {
  const arrowSize = useBreakpointValue({ base: "4xl", sm: "4xl", md: "4xl" });
  const titleSize = useBreakpointValue({ base: "3xl", sm: "3xl", md: "4xl" });
  const backButtonIconSize:
    | "medium"
    | "large"
    | "small"
    | "inherit"
    | undefined = useBreakpointValue({ base: "medium", md: "large" });
  const isMobile = useBreakpointValue({ base: true, md: false });
  const [isFilterMenuOpen, setFilterMenuOpen] = React.useState(false);

  const showFilters =
    typeof location === "string" &&
    typeof radius === "number" &&
    typeof onLocationChange === "function" &&
    typeof onRadiusChange === "function";

  return (
    <Flex
      w="full"
      direction={["row", "row", "row"]}
      align={["stretch", "stretch", "center"]}
      justify={"space-between"}
      gap={0}
      wrap="wrap"
      pt={["0","0","4"]}
      pb={[4,4,0]}
    >
      {/* Top section: back arrow + category title or custom title */}
      <Flex align="center" gap={4} flexShrink={0}>
        <BackButton
          onClick={onBack}
          color="hospitalityHubPremium"
          iconSize={backButtonIconSize}
        />
        {(title || selectedCategoryData) && (
          <Text
            fontFamily="bonfire"
            fontSize={titleSize}
            color="hospitalityHubPremium"
            textAlign="left"
            mb={[-2, -2, -4]}
          >
            {title || selectedCategoryData?.name}
          </Text>
        )}
      </Flex>

      {/* Responsive filter section: always full width on mobile/tablet, right on desktop */}
      {(showFilters || true) && (
        <Box
          w={["full", "auto", "auto", "auto"]}
          mt={{ base: 0, md: 0 }}
          px={[3, 2, 2]}
          display="flex"
          alignItems="center"
          gap={3}
          flexShrink={0}
        >
          {/* Desktop: show LocationFilter inline */}
          {!isMobile && showFilters && (
            <LocationFilter
              location={location!}
              radius={radius!}
              onLocationChange={onLocationChange!}
              onRadiusChange={onRadiusChange!}
            />
          )}
          {/* Mobile: show filter menu button */}
          {isMobile && showFilters && (
            <LocationFilterMenu
              location={location!}
              radius={radius!}
              onLocationChange={onLocationChange!}
              onRadiusChange={onRadiusChange!}
              bottomOffset={"10px"}
            />
          )}
          <ContextualMenu toolId={101} bottomOffset={["10px", "45px"]} />
        </Box>
      )}
      <Divider my={4} borderColor="rgba(238, 228, 88, 0.5)" display={{ base: "none", md: "block" }} />
    </Flex>
  );
};

export default HospitalityHubHeader;
