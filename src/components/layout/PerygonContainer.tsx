"use client";

import { useWorkflow } from "@/providers/WorkflowProvider";
import { useTheme, VStack } from "@chakra-ui/react";
import { ReactNode } from "react";
import { usePathname } from "next/navigation";

interface PerygonContatinerProps {
  children: ReactNode;
}

export const PerygonContainer: React.FC<PerygonContatinerProps> = ({
  children,
}) => {
  const theme = useTheme();

  const { headerBackgroundImageUrl } = useWorkflow();

  const pathname = usePathname();

  const hospitalityHubGradient = "linear(to-br, black 60%, gray 100%)";

  const displayBackgroundImage = () => {
    if (headerBackgroundImageUrl && pathname.includes("workflow")) {
      return headerBackgroundImageUrl;
    }
  };

  return (
    <VStack
      minH="100svh"
      width="100%"
      flex={1}
      bgGradient={
        pathname.startsWith("/hospitality-hub/app")
          ? hospitalityHubGradient
          : theme.components.perygonContainer.baseStyle.bgGradient
      }
      bgImage={displayBackgroundImage()}
    >
      {children}
    </VStack>
  );
};
