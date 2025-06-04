"use client";

import React from "react";
import { ArrowBack } from "@mui/icons-material";
import { Flex, useBreakpointValue, FlexProps } from "@chakra-ui/react";
import { useRouter } from "next/navigation";

interface BackButtonProps extends FlexProps {
  prevRoute?: string;
  iconSize?: "inherit" | "small" | "medium" | "large";
  color?: string;
}

export default function BackButton({
  prevRoute,
  iconSize,
  color,
  ...chakraStyles
}: BackButtonProps) {
  const router = useRouter();
  const isMobile = useBreakpointValue({ base: true, md: false });

  const handleClickBack = () => {
    if (prevRoute) {
      router.push(prevRoute);
    } else {
      router.back();
    }
  };

  return (
    <Flex
      as="button"
      onClick={handleClickBack}
      alignItems="center"
      justifyContent="center"
      cursor="pointer"
      h="full"
      color={color || "gray.300"}
      _hover={{
        color: color || "gray.300",
        transform: "translateX(-5px)",
      }}
      _active={{ color: "gray.500" }}
      transition="all 0.2s ease-in-out"
      {...chakraStyles}
    >
      <ArrowBack fontSize={iconSize ?? (isMobile ? "medium" : "large")} />
    </Flex>
  );
}
