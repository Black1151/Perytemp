"use client";

import { Box, Image, ResponsiveValue, VStack } from "@chakra-ui/react";
import { ReactNode } from "react";
import { SpringScale } from "../animations/SpringScale";

interface LoginCardProps {
  titleComponent: ReactNode;
  children: ReactNode;
  height?: ResponsiveValue<number | string>;
  imageOffset?: ResponsiveValue<number | string>;
  backgroundOffset?: number;
  speechBubbleHeight?: string;
}

export function LoginCard({
  titleComponent,
  children,
  height = 700,
  imageOffset = -350,
  speechBubbleHeight = "100%",
}: LoginCardProps) {

  return (
    <SpringScale style={{ width: "100%" }}>
      <VStack
        bg="white"
        spacing={4}
        align="center"
        p={[8, 8]}
        overflow="hidden"
        borderRadius="md"
        boxShadow="md"
        position="relative"
        height={height}
        justifyContent="flex-end"
        width={["100%", null, 480]}
        maxW={"100%"}
        zIndex={10}
      >
        <Image
          src="/perygonSpeechBubble.png"
          alt="Perygon"
          position="absolute"
          boxSize="100%"
          objectFit="cover"
          top={imageOffset}
          objectPosition="bottom"
          height={speechBubbleHeight}
        />
        {titleComponent}
        <Box width="100%">{children}</Box>
      </VStack>
    </SpringScale>
  );
}
