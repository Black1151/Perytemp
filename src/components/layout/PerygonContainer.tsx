"use client";

import { useWorkflow } from "@/providers/WorkflowProvider";
import { useTheme, VStack } from "@chakra-ui/react";
import { ReactNode, useMemo } from "react";
import { usePathname } from "next/navigation";

interface PerygonContainerProps {
  children: ReactNode;
}

export const PerygonContainer: React.FC<PerygonContainerProps> = ({
  children,
}) => {
  const theme = useTheme();
  const { headerBackgroundImageUrl } = useWorkflow();
  const pathname = usePathname();

  const hospitalityHubGradient = useMemo(
    () => `linear(to-br, black 60%, ${theme.colors.primary} 100%)`,
    [theme]
  );

  const displayBackgroundImage =
    headerBackgroundImageUrl && pathname.includes("workflow")
      ? headerBackgroundImageUrl
      : undefined;

  return (
    <VStack
      minH="100svh"
      w="100%"
      flex={1}
      bgGradient={
        pathname.startsWith("/hospitality-hub/app")
          ? hospitalityHubGradient
          : (theme.components.perygonContainer?.baseStyle?.bgGradient ??
            "linear(to-br, gray.800, gray.900)")
      }
      bgImage={displayBackgroundImage}
    >
      {children}
    </VStack>
  );
};
