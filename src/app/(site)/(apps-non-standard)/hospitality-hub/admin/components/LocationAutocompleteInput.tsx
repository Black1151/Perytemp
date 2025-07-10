import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  Box,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  List,
  ListItem,
  useTheme,
  CircularProgress,
  Portal,
} from "@chakra-ui/react";
import SearchIcon from "@mui/icons-material/Search";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import CloseIcon from "@mui/icons-material/Close";
import { useFormContext } from "react-hook-form";
import GoogleMapsLoader from "../../app/components/GoogleMapsLoader";
import { GoogleMap, Marker } from "@react-google-maps/api";

/* ————————————————————  helpers & types ———————————————————— */
const containerStyle = {
  width: "100%",
  height: "250px",
  borderRadius: "8px",
  marginTop: "8px",
};

/** A flattened, UI-friendly version of a Google Places prediction */
export interface LocationSuggestion {
  placeId: string;
  description: string;
  raw: any;
}

interface LocationAutocompleteInputInnerProps {
  usePortal?: boolean;
}

/* ————————————————————  component ———————————————————— */
function LocationAutocompleteInputInner({ usePortal = false }: LocationAutocompleteInputInnerProps) {
  const { setValue, watch } = useFormContext();
  const theme = useTheme();

  /* controlled state */
  const [inputValue, setInputValue] = useState("");
  const [suggestions, setSuggestions] = useState<LocationSuggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [ui, setUI] = useState({ isFocused: false, showSuggestions: false });
  const [dropdownStyles, setDropdownStyles] = useState<React.CSSProperties>({});
  const inputBoxRef = useRef<HTMLDivElement>(null);

  /* refs */
  const inputRef = useRef<HTMLInputElement>(null);
  const sessionTokenRef = useRef<
    google.maps.places.AutocompleteSessionToken | undefined
  >(undefined);
  const requestIdRef = useRef(0); // guards race conditions

  /* form values */
  const fullAddress = watch("fullAddress");
  const lat = watch("lat");
  const lng = watch("lng");

  /* ----------------------------------------------------- */
  /*  session-token helpers                                */
  /* ----------------------------------------------------- */
  const startSession = () => {
    sessionTokenRef.current =
      new window.google.maps.places.AutocompleteSessionToken();
  };
  const clearSession = () => {
    sessionTokenRef.current = undefined;
  };

  /* ----------------------------------------------------- */
  /*  utils: normalise Google response                     */
  /* ----------------------------------------------------- */
  const normaliseSuggestions = (raw: any[]): LocationSuggestion[] => {
    // modern object shape
    if (raw?.length && raw[0]?.placePrediction) {
      return raw.map((s) => ({
        placeId: s.placePrediction.placeId || s.placePrediction.place,
        description: s.placePrediction.text.text,
        raw: s,
      }));
    }
    // legacy nested-array fallback (for older browsers/tests)
    const flat = raw
      .flat(Infinity)
      .filter(Array.isArray)
      .filter((a) => typeof a[1] === "string" && Array.isArray(a[2]));
    return flat.map((s) => ({
      placeId: s[1],
      description: s[2][0],
      raw: s,
    }));
  };

  /* ----------------------------------------------------- */
  /*  fetch predictions                                    */
  /* ----------------------------------------------------- */
  const fetchSuggestions = useCallback(
    async (input: string) => {
      if (!input) {
        setSuggestions([]);
        return;
      }

      if (!sessionTokenRef.current) startSession();

      setLoading(true);
      const thisRequest = ++requestIdRef.current;

      try {
        const { suggestions: raw } =
          await window.google.maps.places.AutocompleteSuggestion.fetchAutocompleteSuggestions(
            {
              input,
              sessionToken: sessionTokenRef.current!,
            }
          );

        // ignore out-of-order responses
        if (thisRequest !== requestIdRef.current) return;

        setSuggestions(normaliseSuggestions(raw || []));
      } catch {
        setSuggestions([]);
      } finally {
        if (thisRequest === requestIdRef.current) setLoading(false);
      }
    },
    []
  );

  /* ----------------------------------------------------- */
  /*  input handlers                                       */
  /* ----------------------------------------------------- */
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
    setTimeout(() => {
      setUI({ isFocused: false, showSuggestions: false });
      clearSession();
    }, 100); // let click events finish
  };

  const selectSuggestion = useCallback(
    (s: LocationSuggestion) => {
      setInputValue(s.description);
      setSuggestions([]);
      setUI({ isFocused: false, showSuggestions: false });

      /* look up lat/lng so we can show the map preview */
      const placesService = new window.google.maps.places.PlacesService(
        document.createElement("div")
      );

      placesService.getDetails(
        { placeId: s.placeId },
        (place, status) => {
          if (
            status === window.google.maps.places.PlacesServiceStatus.OK &&
            place
          ) {
            const address =
              place.name && place.formatted_address
                ? `${place.name}, ${place.formatted_address}`
                : place.formatted_address || place.name || "";

            setValue("fullAddress", address, { shouldValidate: true });
            if (place.geometry && place.geometry.location) {
              setValue("lat", place.geometry.location.lat(), {
                shouldValidate: true,
              });
              setValue("lng", place.geometry.location.lng(), {
                shouldValidate: true,
              });
            }
          }
        }
      );
    },
    [setValue]
  );

  /* ----------------------------------------------------- */
  /*  keep inputValue in sync when editing an existing row */
  /* ----------------------------------------------------- */
  useEffect(() => {
    if (fullAddress && !inputValue) setInputValue(fullAddress);
  }, [fullAddress, inputValue]);

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

  /* ----------------------------------------------------- */
  /*  render                                               */
  /* ----------------------------------------------------- */
  return (
    <Box position="relative" ref={inputBoxRef}>
      {/* ——— search field ——— */}
      <InputGroup>
        <InputLeftElement pointerEvents="none">
          {ui.isFocused ? (
            <SearchIcon style={{ color: theme.colors.primary }} />
          ) : (
            <LocationOnIcon style={{ color: theme.colors.primary }} />
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
          color={theme.colors.primaryTextColor}
          bg={theme.colors.elementBG}
          w="100%"
          autoComplete="off"
          pl={10}
          isDisabled={!!lat && !!lng}
        />

        {loading && (
          <InputRightElement pr={2}>
            <CircularProgress
              size={4}
              color={theme.colors.primary}
              thickness="12px"
            />
          </InputRightElement>
        )}

        {!!inputValue && (
          <InputRightElement pr={2}>
            <CloseIcon
              fontSize="small"
              style={{ cursor: "pointer", color: theme.colors.primary }}
              onMouseDown={(e) => {
                e.preventDefault();
                setInputValue("");
                setSuggestions([]);
                setUI({ isFocused: false, showSuggestions: false });
                setValue("fullAddress", "");
                setValue("lat", undefined);
                setValue("lng", undefined);
                clearSession();
              }}
            />
          </InputRightElement>
        )}
      </InputGroup>

      {/* ——— dropdown ——— */}
      {ui.showSuggestions && suggestions.length > 0 && (
        usePortal ? (
          <Portal>
            <List
              style={dropdownStyles}
              bg={theme.colors.elementBG}
              color={theme.colors.primaryTextColor}
              borderRadius="md"
              boxShadow="md"
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
                    bg: theme.colors.primary,
                    color: theme.colors.elementBG,
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
            zIndex={10}
            bg={theme.colors.elementBG}
            color={theme.colors.primaryTextColor}
            borderRadius="md"
            boxShadow="md"
            mt={1}
            w="100%"
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
                  bg: theme.colors.primary,
                  color: theme.colors.elementBG,
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

      {/* ——— static map preview ——— */}
      {!isNaN(Number(lat)) && !isNaN(Number(lng)) && (
        <>
          <Box mt={2} borderRadius="md" overflow="hidden">
            <GoogleMap
              mapContainerStyle={containerStyle}
              center={{ lat: Number(lat), lng: Number(lng) }}
              zoom={15}
              options={{ disableDefaultUI: true }}
            >
              <Marker position={{ lat: Number(lat), lng: Number(lng) }} />
            </GoogleMap>
          </Box>
          <Box
            mt={1}
            fontSize="sm"
            color={theme.colors.primaryTextColor}
            opacity={0.6}
            textAlign="center"
          >
            Lat: {lat}, Lng: {lng}
          </Box>
        </>
      )}
    </Box>
  );
}

/* ————————————————————  wrapper (unchanged) ———————————————————— */
export default function LocationAutocompleteInput({ usePortal = false }: { usePortal?: boolean }) {
  return (
    <GoogleMapsLoader>
      <LocationAutocompleteInputInner usePortal={usePortal} />
    </GoogleMapsLoader>
  );
}
