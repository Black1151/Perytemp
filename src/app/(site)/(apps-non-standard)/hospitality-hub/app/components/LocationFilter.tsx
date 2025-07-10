import {
  Box,
  Input,
  HStack,
  List,
  ListItem,
  InputGroup,
  InputLeftElement,
  Flex,
  InputRightElement,
  useBreakpointValue,
  IconButton,
  Portal,
  Stack
} from "@chakra-ui/react";
import SearchIcon from "@mui/icons-material/Search";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import CloseIcon from "@mui/icons-material/Close";
import React, { useState, useRef, useEffect, useCallback, memo } from "react";
import GoogleMapsLoader from "./GoogleMapsLoader";
import RadiusButton from "./RadiusButton";
import { motion } from "framer-motion";

import FilterAltIcon from "@mui/icons-material/FilterAlt";
import { SpringModal } from "@/components/modals/springModal/SpringModal";

/* ------------------------------------------------ */
/*  helpers                                         */
/* ------------------------------------------------ */
const toMeters = (value: number, unit: "km" | "mi") =>
  unit === "km" ? value * 1000 : value * 1609.34;

const fromMeters = (meters: number, unit: "km" | "mi") =>
  unit === "km" ? meters / 1000 : meters / 1609.34;

/* ------------------------------------------------ */
/*  Component                                       */
/* ------------------------------------------------ */
export interface LocationFilterProps {
  location: string;
  radius: number; // metres
  onLocationChange: (loc: string) => void;
  onRadiusChange: (metres: number) => void;
  usePortal?: boolean;
}

/** A flattened, UI-friendly version of a Google Places prediction */
export interface LocationSuggestion {
  /** The stable ID you pass to Places Details etc. */
  placeId: string;
  /** The human-readable label you show in the dropdown */
  description: string;
  /** The full Google object/array in case you need more data later */
  raw: any;
}


const LocationFilter: React.FC<LocationFilterProps> = memo(
  ({ location, radius, onLocationChange, onRadiusChange, usePortal = false }) => {
    const [inputValue, setInputValue] = useState(location);
    const [suggestions, setSuggestions] = useState<
      { placeId: string; description: string; raw: any }[]
    >([]);
    const [ui, setUI] = useState({ isFocused: false, showSuggestions: false });
    const [loading, setLoading] = useState(false);
    const [dropdownStyles, setDropdownStyles] = useState<React.CSSProperties>({});
    const inputBoxRef = useRef<HTMLDivElement>(null);

    /* ------------------------------------------------ */
    /*  refs & tokens                                   */
    /* ------------------------------------------------ */
    const inputRef = useRef<HTMLInputElement>(null);
    const sessionTokenRef = useRef<
      google.maps.places.AutocompleteSessionToken | undefined
    >(undefined);
    /** monotonically increasing id to cancel stale responses */
    const requestIdRef = useRef(0);

    /* ------------------------------------------------ */
    /*  session-token lifecycle                         */
    /* ------------------------------------------------ */
    const startSession = () => {
      sessionTokenRef.current =
        new google.maps.places.AutocompleteSessionToken();
    };
    const clearSession = () => {
      sessionTokenRef.current = undefined;
    };

    /* ------------------------------------------------ */
    /*  fetch suggestions (new API)                     */
    /* ------------------------------------------------ */
    const fetchSuggestions = useCallback(async (input: string) => {
      if (!input) {
        setSuggestions([]);
        return;
      }

      if (!sessionTokenRef.current) startSession();

      setLoading(true);
      const thisRequestId = ++requestIdRef.current;

      try {
        const { suggestions: raw } =
        await google.maps.places.AutocompleteSuggestion.fetchAutocompleteSuggestions({
          input,
          sessionToken: sessionTokenRef.current!,
        });
      
      setSuggestions(normaliseSuggestions(raw));
      } catch (e) {
        // swallow – network or quota errors are handled elsewhere
        setSuggestions([]);
      } finally {
        if (thisRequestId === requestIdRef.current) setLoading(false);
      }
    }, []);

    const normaliseSuggestions = (raw: any[]): LocationSuggestion[] => {
      // Handle the correct (object) shape first
      if (raw.length && raw[0]?.placePrediction) {
        return raw.map((s) => ({
          placeId:    s.placePrediction.placeId || s.placePrediction.place,
          description:s.placePrediction.text.text,
          raw:        s,
        }));
      }
    
      // Fallback: legacy nested-array shape (your console output)
      const flat: any[] = raw.flat(Infinity)
                             .filter(Array.isArray)
                             .filter(a => typeof a[1] === "string" && Array.isArray(a[2]));
    
      return flat.map((s) => ({
        placeId:    s[1],          // second string is always the place_id
        description:s[2][0],       // human-readable display string
        raw:        s,
      }));
    };

    /* ------------------------------------------------ */
    /*  input handlers                                  */
    /* ------------------------------------------------ */
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const v = e.target.value;
      setInputValue(v);
      setUI({ isFocused: true, showSuggestions: !!v });
      fetchSuggestions(v);
    };

    const handleFocus = () => {
      setUI({ isFocused: true, showSuggestions: !!inputValue });
      if (!sessionTokenRef.current) startSession();
    };

    const handleBlur = () => {
      // give click handlers time to run before closing
      setTimeout(() => {
        setUI({ isFocused: false, showSuggestions: false });
        clearSession();
      }, 100);
    };

    const selectSuggestion = (s: {
      placeId: string;
      description: string;
      raw: any;
    }) => {
      const desc = s.description;
      setInputValue(desc);
      setSuggestions([]);
      setUI({ isFocused: false, showSuggestions: false });
      onLocationChange(desc);
      clearSession();
      inputRef.current?.blur();
    };

    const isDesktop = useBreakpointValue({ base: false, md: true });
    const inputWidth = isDesktop ? (ui.isFocused ? 350 : 220) : "100%";

    useEffect(() => {
      if (usePortal && ui.showSuggestions && suggestions.length > 0 && inputBoxRef.current) {
        const rect = inputBoxRef.current.getBoundingClientRect();
        setDropdownStyles({
          position: "fixed",
          top: rect.bottom + window.scrollY,
          left: rect.left + window.scrollX,
          width: rect.width,
          zIndex: 2000,
        });
      }
    }, [usePortal, ui.showSuggestions, suggestions.length]);

    /* ------------------------------------------------ */
    /*  render                                          */
    /* ------------------------------------------------ */
    // Log suggestions that will be rendered in the dropdown
    if (ui.showSuggestions && suggestions.length > 0) {
      // eslint-disable-next-line no-console
      console.log('Dropdown suggestions:', suggestions);
    }
    return (
      <GoogleMapsLoader>
        <Stack direction={["column", "column", "row"]} spacing={4} alignItems="flex-end" position="relative">
          <Flex w={["full", "full", "min"]} direction={["column", "column", "row"]} gap={2}>
            <Box flex={1} minW={0} position="relative" ref={inputBoxRef}>
              <motion.div
                animate={{ width: inputWidth }}
                style={{ width: inputWidth, display: "flex" }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              >
                <InputGroup w="100%">
                  <InputLeftElement pointerEvents="none">
                    {ui.isFocused ? (
                      <SearchIcon style={{ color: "#EEE458" }} />
                    ) : (
                      <LocationOnIcon style={{ color: "#EEE458" }} />
                    )}
                  </InputLeftElement>
                  <Input
                    id="location-search"
                    ref={inputRef}
                    placeholder="Search for a location..."
                    value={inputValue}
                    onChange={handleInputChange}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    bg="gray.800"
                    color="hospitalityHubPremium"
                    borderColor="hospitalityHubPremium"
                    borderWidth="1px"
                    w={"100%"}
                    pl={10}
                    _focus={{
                      borderColor: "hospitalityHubPremium",
                      boxShadow: "none",
                    }}
                    _hover={{
                      borderColor: "hospitalityHubPremium",
                      boxShadow: "none",
                    }}
                    autoComplete="off"
                  />
                  {inputValue && (
                    <InputRightElement pr={2}>
                      <CloseIcon
                        fontSize="small"
                        style={{ cursor: "pointer", color: "#EEE458" }}
                        onMouseDown={(e) => {
                          e.preventDefault();
                          setInputValue("");
                          setSuggestions([]);
                          setUI({
                            isFocused: false,
                            showSuggestions: false,
                          });
                          onLocationChange("");
                          clearSession();
                        }}
                      />
                    </InputRightElement>
                  )}
                </InputGroup>
              </motion.div>

              {ui.showSuggestions && suggestions.length > 0 && (
                usePortal ? (
                  <Portal>
                    <List
                      style={dropdownStyles}
                      bg="gray.900"
                      color="hospitalityHubPremium"
                      borderRadius="md"
                      boxShadow="md"
                      border="2px solid red"
                      borderColor="hospitalityHubPremium"
                      mt={1}
                      maxH="350px"
                      overflowY="auto"
                    >
                      {suggestions.map((s) => (
                        <ListItem
                          key={s.placeId}
                          px={3}
                          py={2}
                          cursor="pointer"
                          _hover={{
                            bg: "hospitalityHubPremium",
                            color: "black",
                          }}
                          onMouseDown={(e) => {
                            e.preventDefault();
                            selectSuggestion(s);
                          }}
                        >
                          {s.description}
                        </ListItem>
                      ))}
                    </List>
                  </Portal>
                ) : (
                  <List
                    position="absolute"
                    zIndex={2000}
                    bg="gray.900"
                    color="hospitalityHubPremium"
                    borderRadius="md"
                    boxShadow="md"
                    border="2px solid red"
                    borderColor="hospitalityHubPremium"
                    mt={1}
                    w="300px"
                    maxH="350px"
                    overflowY="auto"
                  >
                    {suggestions.map((s) => (
                      <ListItem
                        key={s.placeId}
                        px={3}
                        py={2}
                        cursor="pointer"
                        _hover={{
                          bg: "hospitalityHubPremium",
                          color: "black",
                        }}
                        onMouseDown={(e) => {
                          e.preventDefault();
                          selectSuggestion(s);
                        }}
                      >
                        {s.description}
                      </ListItem>
                    ))}
                  </List>
                )
              )}
            </Box>

            <Box minW="120px" flexShrink={0}>
              <RadiusButton
                radius={radius}
                onRadiusChange={onRadiusChange}
                toMeters={toMeters}
                fromMeters={fromMeters}
              />
            </Box>
          </Flex>
        </Stack>
      </GoogleMapsLoader>
    );
  }
);

LocationFilter.displayName = "LocationFilter";
/* ------------------------------------------------ */
/*  Mobile sheet wrapper (unchanged)                */
/* ------------------------------------------------ */
export interface LocationFilterMenuProps extends LocationFilterProps {
  bottomOffset?: string | number;
  usePortal?: boolean;
}

export const LocationFilterMenu: React.FC<LocationFilterMenuProps> = ({
  bottomOffset = "70px",
  usePortal = true,
  location: parentLocation,
  radius: parentRadius,
  onLocationChange,
  onRadiusChange,
  ...filterProps
}) => {
  const isMobile = useBreakpointValue({ base: true, md: false });
  const [isFilterMenuOpen, setFilterMenuOpen] = useState(false);

  // Local state for mobile filter values
  const [localLocation, setLocalLocation] = useState(parentLocation);
  const [localRadius, setLocalRadius] = useState(parentRadius);

  // Keep local state in sync with parent when menu is opened
  useEffect(() => {
    if (isFilterMenuOpen) {
      setLocalLocation(parentLocation);
      setLocalRadius(parentRadius);
    }
  }, [isFilterMenuOpen, parentLocation, parentRadius]);

  if (!isMobile) return null;

  const handleSubmit = () => {
    onLocationChange(localLocation);
    onRadiusChange(localRadius);
    setFilterMenuOpen(false);
  };

  const handleCancel = () => {
    setFilterMenuOpen(false);
  };

  return (
    <>
      <Box
        position="fixed"
        right="12px"
        bottom={bottomOffset}
        zIndex={100}
        display="flex"
        flexDirection="column-reverse"
        alignItems="flex-end"
      >
        <IconButton
          aria-label="Open filters"
          icon={<FilterAltIcon fontSize="medium" />}
          onClick={() => setFilterMenuOpen(true)}
          color="hospitalityHubPremium"
          bg="rgba(66, 66, 66, 0.6)"
          borderRadius="full"
          w="40px"
          h="40px"
          border="1px solid #EEE458"
          p={0}
          _hover={{ bg: "rgba(66, 66, 66, 0.75)" }}
        />
      </Box>

      <SpringModal
        isOpen={isFilterMenuOpen}
        onClose={handleCancel}
        showClose
        header="Location Filter"
        body={
          <LocationFilter
            {...filterProps}
            location={localLocation}
            radius={localRadius}
            onLocationChange={setLocalLocation}
            onRadiusChange={setLocalRadius}
            usePortal={usePortal}
          />
        }
        bg="rgba(66, 66, 66, 0.8)"
        color="white"
        border="1px solid rgba(238, 228, 88, 0.5)"
        headerColor="hospitalityHubPremium"
        modalContentProps={{ maxW: "95vw", mx: 2, p: 0 }}
        footer={
          <Box display="flex" gap={2} w="full" px={6} mt={6}>
            <Box flex={1}>
              <button
                style={{ width: "100%", padding: 8, borderRadius: 8, background: "#444", color: "#EEE458", border: "none", fontWeight: 600 }}
                onClick={handleCancel}
              >
                Cancel
              </button>
            </Box>
            <Box flex={1}>
              <button
                style={{ width: "100%", padding: 8, borderRadius: 8, background: "white", color: "black", border: "none", fontWeight: 600 }}
                onClick={handleSubmit}
              >
                Apply
              </button>
            </Box>
          </Box>
        }
      />
    </>
  );
};

export default LocationFilter;
