import {
    Button,
    Flex,
    Text,
    Slider,
    SliderTrack,
    SliderFilledTrack,
    SliderThumb,
    ButtonGroup,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    IconButton,
    Box,
    useTheme,
  } from "@chakra-ui/react";
  import { FaRegDotCircle } from "react-icons/fa";
  import React, { useState, useMemo, useCallback, memo } from "react";
  import { SpringModal } from "@/components/modals/springModal/SpringModal";
  import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
  
  interface RadiusButtonProps {
    radius: number; // metres
    onRadiusChange: (metres: number) => void;
    toMeters: (v: number, u: "km" | "mi") => number;
    fromMeters: (m: number, u: "km" | "mi") => number;
  }
  
  const RadiusButton: React.FC<RadiusButtonProps> = ({
    radius,
    onRadiusChange,
    toMeters,
    fromMeters,
  }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [unit, setUnit] = useState<"km" | "mi">("km");
    const [tempRadius, setTempRadius] = useState(fromMeters(radius, unit));
  
    const radiusLabel = useMemo(
      () => `${fromMeters(radius, unit).toFixed(2)} ${unit}`,
      [radius, unit, fromMeters]
    );
  
    const open = useCallback(() => {
      setTempRadius(fromMeters(radius, unit));
      setIsOpen(true);
    }, [radius, unit, fromMeters]);
  
    const confirm = useCallback(() => {
      onRadiusChange(toMeters(tempRadius, unit));
      setIsOpen(false);
    }, [tempRadius, unit, onRadiusChange, toMeters]);
  
    return (
      <>
        <Button
          leftIcon={<FaRegDotCircle color="#EEE458" />}
          variant="outline"
          colorScheme="yellow"
          borderColor="hospitalityHubPremium"
          color="hospitalityHubPremium"
          borderWidth="1px"
          borderRadius="md"
          justifyContent={["left", "left", "center"]}
          px={4}
          h="40px"
          w={"full"}
          onClick={open}
          bg="gray.800"
        >
          {radiusLabel}
        </Button>
  
        <SpringModal
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          showClose
          bg="rgba(66, 66, 66, 0.8)"
          color="white"
          border="1px solid rgba(238, 228, 88, 0.5)"
          headerColor="hospitalityHubPremium"
          header="Set Radius"
          body={
            <Flex direction="column" align={{ base: "flex-start", md: "center" }} gap={4} w="100%">
              {/* Unit switcher row */}
              <Flex w="100%" justify="space-between" align="center" mb={1}>
                <Text fontWeight="bold">Unit</Text>
                <ButtonGroup isAttached size="sm">
                  <Button
                    onClick={() => setUnit("km")}
                    bg={unit === "km" ? "hospitalityHubPremium" : "transparent"}
                    color={unit === "km" ? "black" : "hospitalityHubPremium"}
                    borderColor="hospitalityHubPremium"
                    borderWidth={unit === "km" ? "2px" : "1px"}
                    _hover={{ bg: unit === "km" ? "hospitalityHubPremium" : "gray.700" }}
                    _active={{ bg: "hospitalityHubPremium", color: "black" }}
                  >
                    KM
                  </Button>
                  <Button
                    onClick={() => setUnit("mi")}
                    bg={unit === "mi" ? "hospitalityHubPremium" : "transparent"}
                    color={unit === "mi" ? "black" : "hospitalityHubPremium"}
                    borderColor="hospitalityHubPremium"
                    borderWidth={unit === "mi" ? "2px" : "1px"}
                    _hover={{ bg: unit === "mi" ? "hospitalityHubPremium" : "gray.700" }}
                    _active={{ bg: "hospitalityHubPremium", color: "black" }}
                  >
                    Mi
                  </Button>
                </ButtonGroup>
              </Flex>
              {/* Distance row */}
              <Flex w="100%" justify="space-between" align="center" mb={1}>
                <Text fontWeight="bold">Distance</Text>
                <Flex align="center" gap={2}>
                  <Text fontSize="sm" color="gray.500" mr={1}>Max.</Text>
                  <Text fontWeight="bold" fontSize="md">
                    {tempRadius.toFixed(2)} {unit}
                  </Text>
                </Flex>
              </Flex>
              <MaterialSlider
                min={1}
                max={unit === "km" ? 48.3 : 30}
                step={0.01}
                value={parseFloat(tempRadius.toFixed(2))}
                onChange={setTempRadius}
                w="100%"
                colorScheme="blue"
              />
            </Flex>
          }
          primaryLabel={
            <span style={{ color: "black", fontWeight: 600 }}>Set Radius</span>
          }
          onPrimaryClick={confirm}
          primaryDisabled={tempRadius < 1}
        />
      </>
    );
  };
  
  // Material Design Slider with value label and ripple
  function MaterialSlider(props: React.ComponentProps<typeof Slider>) {
    const [isActive, setIsActive] = useState(false);
    const theme = useTheme();
    const premiumColor = theme.colors.hospitalityHubPremium ?? '#EEE458';
    return (
      <Slider
        {...props}
        onMouseDown={e => { setIsActive(true); props.onMouseDown && props.onMouseDown(e); }}
        onMouseUp={e => { setIsActive(false); props.onMouseUp && props.onMouseUp(e); }}
        onMouseLeave={e => { setIsActive(false); props.onMouseLeave && props.onMouseLeave(e); }}
        onFocus={e => { setIsActive(true); props.onFocus && props.onFocus(e); }}
        onBlur={e => { setIsActive(false); props.onBlur && props.onBlur(e); }}
      >
        <SliderTrack h="2">
          <SliderFilledTrack bg={premiumColor} />
        </SliderTrack>
        <SliderThumb
          boxSize={6}
          position="relative"
          bg={premiumColor}
        >
          {/* Ripple effect */}
          {isActive && (
          <>
            <Box
              position="absolute"
              top="50%"
              left="50%"
              transform="translate(-50%, -50%)"
              w="40px"
              h="40px"
              borderRadius="full"
              bg={`${premiumColor}`}
              opacity={0.5}
              zIndex={-1}
            />
            <Box
              position="absolute"
              top="50%"
              left="50%"
              transform="translate(-50%, -50%)"
              w="52px"
              h="52px"
              borderRadius="full"
              bg={`${premiumColor}`}
              opacity={0.35}
              zIndex={-1}
            />
            </>
          )}
          {/* Value label */}
          {isActive && (
            <Box
              position="absolute"
              bottom="150%"
              left="50%"
              transform="translateX(-50%)"
              bg={premiumColor}
              color="black"
              px={2}
              py={1}
              borderRadius="md"
              fontWeight="bold"
              fontSize="sm"
              whiteSpace="nowrap"
              pointerEvents="none"
            >
              {Number(props.value ?? 0).toFixed(2)}
            </Box>
          )}
        </SliderThumb>
      </Slider>
    );
  }
  
  export default memo(RadiusButton);
  