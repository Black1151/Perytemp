"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { ReactNode } from "react";
import { Flex } from "@chakra-ui/react";

interface ToolLandingPageProps {
  redirectUrl?: string | null;
  splashScreen?: ReactNode;
}

export const ToolLandingPage = ({
  redirectUrl,
  splashScreen,
}: ToolLandingPageProps) => {
  const router = useRouter();

  useEffect(() => {
    if (redirectUrl) {
      if (!splashScreen) {
        router.push(redirectUrl);
        return;
      }
      const timer = setTimeout(() => {
        router.push(redirectUrl);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [redirectUrl, splashScreen, router]);

  return splashScreen ? (
    <Flex height={"100%"} justify={"center"} align={"center"}>
      {splashScreen}
    </Flex>
  ) : null;
};
