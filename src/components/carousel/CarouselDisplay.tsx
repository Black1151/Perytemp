import React, { useEffect, useState } from "react";
import {
  Box,
  Image,
  Text,
  VStack,
  useTheme,
  Button,
  Flex,
} from "@chakra-ui/react";
import Link from "next/link";
import { CarouselItemProps } from "./CarouselItem";
import { useRouter } from "next/navigation";
import Carousel from "./Carousel";
import { useWorkflow } from "@/providers/WorkflowProvider";
import { useUser } from "@/providers/UserProvider";
import { Storefront } from "@mui/icons-material";

export interface CarouselDisplayProps {
  carouselItems: CarouselItemProps[];
}

const CarouselDisplay = ({ carouselItems }: CarouselDisplayProps) => {
  const fallbackImage = "/assets/apps/invoicePro/invoiceProBG.png";

  const [layers, setLayers] = useState([
    {
      id: 0,
      image: carouselItems[0]?.backgroundImage || fallbackImage,
      opacity: 1,
    },
  ]);
  const [nextLayerId, setNextLayerId] = useState(1);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showInfoBox, setShowInfoBox] = useState(true);

  const { setToolId, setWorkflowId } = useWorkflow();
  const router = useRouter();
  const theme = useTheme();

  const { user } = useUser();

  // Determine if we should show the Tool Store button
  const showStoreButton = React.useMemo(() => {
    if (!user?.role) return false;

    if (Array.isArray(user.role)) {
      return user.role.some((r) => r === "CA" || r === "CL");
    }

    return user.role === "CA" || user.role === "CL";
  }, [user?.role]);

  // ---------------------------------------------------------------- helpers
  const currentItem: CarouselItemProps & {
    isUAGLocked?: boolean;
  } = carouselItems[currentIndex] ?? {
    description: "",
    logoImage: "",
    alt: "",
    appUrl: "#",
    toolId: "",
    toolWfId: "",
    isUAGLocked: false,
  };

  const handleStartClick = () => {
    if (!currentItem.appUrl || currentItem.isUAGLocked) return;

    setToolId(currentItem.toolId);
    setWorkflowId(currentItem.toolWfId);

    router.push(
      `${currentItem.appUrl}?toolId=${currentItem.toolId}&wfId=${currentItem.toolWfId}`
    );
  };

  // ----------------------------------------------------------- index change
  const setIndex = (index: number) => {
    setShowInfoBox(false);
    const newLayer = {
      id: nextLayerId,
      image: carouselItems[index]?.backgroundImage || fallbackImage,
      opacity: 0,
    };
    setLayers((prev) => [...prev, newLayer]);
    setNextLayerId((prev) => prev + 1);

    requestAnimationFrame(() => {
      setLayers((prevLayers) =>
        prevLayers.map((layer) =>
          layer.id === newLayer.id
            ? { ...layer, opacity: 1 }
            : { ...layer, opacity: 0 }
        )
      );
    });

    setTimeout(() => {
      setCurrentIndex(index);
      setLayers((prevLayers) => prevLayers.slice(1));
      setShowInfoBox(true);
    }, 500);
  };

  useEffect(() => setShowInfoBox(true), []);

  console.log(user);

  // ---------------------------------------------------------------- render
  return (
    <VStack position="relative" mt={[10, 30]} flex={1} overflow="hidden">
      {/* Shopping Cart Button */}
      {showStoreButton && (
        <Button
          as={Link}
          href="/tool-store"
          leftIcon={<Storefront />}
          position="absolute"
          top={[2, 4]}
          right={[2, 4]}
          zIndex={3}
          mt={[5, 8]}
          size="md"
          color="white"
          bgColor={theme.colors.primary}
          boxShadow="lg"
          _hover={{ bgColor: "white", color: theme.colors.primary }}
        >
          Tool Store
        </Button>
      )}

      {/* background layers */}
      {layers.map((layer) => (
        <Box
          key={layer.id}
          position="absolute"
          top={0}
          left={0}
          w="100%"
          h="100%"
          backgroundImage={layer.image}
          backgroundPosition={["center", "center 30px"]}
          backgroundRepeat="no-repeat"
          backgroundSize="cover"
          opacity={layer.opacity}
          transition="opacity 0.5s ease-in-out"
          zIndex={0}
        />
      ))}

      {/* dark gradient overlay */}
      <Box
        position="absolute"
        top={0}
        left={0}
        w="100%"
        h="100%"
        bgGradient="linear(to-t, rgba(0, 0, 0, 0.9), transparent)"
        pointerEvents="none"
        zIndex={1}
      />

      {/* Content area */}
      <Flex direction="column" flex={1} w="full" zIndex={2}>
        {/* Centering wrapper */}
        <Flex
          flex={1}
          align="center"
          justify="center"
          w="full"
          pointerEvents="none"
        >
          {/* Info box */}
          <Flex
            flexDirection="column"
            gap={[4, 6]}
            width={["95%", "95%", "700px", "800px", "900px"]}
            maxW="800px"
            px={[5, 8]}
            py={[6, 8]}
            bg="rgba(0, 0, 0, 0.75)"
            borderRadius="lg"
            color="white"
            textAlign={"left"}
            opacity={showInfoBox ? 1 : 0}
            transform={showInfoBox ? "translateY(0)" : "translateY(-30px)"}
            transition="opacity 0.5s ease-in-out, transform 0.5s ease-in-out"
            pointerEvents="auto"
          >
            {/* Logo & Text Row */}
            <Flex
              w="full"
              flexDirection={["column", null, "row"]}
              alignItems="center"
              gap={[4, 8]}
              px={[2, 4, 8]}
            >
              {currentItem.logoImage && (
                <Image
                  src={currentItem.logoImage}
                  alt={currentItem.alt}
                  objectFit="contain"
                  flex={["none", "0 0 33%"]}
                  maxW={["100%", null, "33%"]}
                />
              )}
              <Text
                flex={["none", "0 0 67%"]}
                w={["full", null, "67%"]}
                fontSize={[12, 13, 15, null]}
                wordBreak="break-word"
              >
                {currentItem.description}
              </Text>
            </Flex>

            {/* Start Button Row */}
            {!currentItem.isUAGLocked && (
              <Button
                boxShadow="md"
                padding={[3, 4]}
                color="white"
                bgColor={theme.colors.primary}
                _hover={{ bgColor: "white", color: theme.colors.primary }}
                onClick={handleStartClick}
                w="50%"
                alignSelf="center"
              >
                <Text fontFamily="Metropolis" fontSize={[18, 24]}>
                  Start!
                </Text>
              </Button>
            )}
          </Flex>
        </Flex>

        {/* carousel thumbnails / controls */}
        {carouselItems.length > 1 && (
          <VStack zIndex={2} w="100%" pb={[4, 6]} px={[0, null, 55, null, 0]}>
            <Carousel carouselItems={carouselItems} setParentIndex={setIndex} />
          </VStack>
        )}
      </Flex>
    </VStack>
  );
};

export default CarouselDisplay;
