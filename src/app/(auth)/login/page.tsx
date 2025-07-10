import { Center, VStack, Flex, Image, Link } from "@chakra-ui/react";
import { PerygonContainer } from "@/components/layout/PerygonContainer";
import { LoginForm } from "@/components/forms/LoginForm";
import { LetterFlyIn } from "@/components/animations/text/LetterFlyIn";
import { LoginCard } from "@/components/login/LoginCard";
import { cookies } from "next/headers";
import apiClient from "@/lib/apiClient";
import { redirect } from "next/navigation";
import AppStoreIcons from "./AppStoreIcons";
import { useEffect } from "react";
import ClearLocalStorage from "@/components/utils/ClearLocalStorage";

interface SearchParams {
  l?: string;
  "link-apple-account-sub"?: string;
  appleAccountLinked?: string;
}

export default async function LoginPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const linkAppleAccountSub = searchParams["link-apple-account-sub"] ?? "";
  const appleAccountLinked = searchParams["appleAccountLinked"] ?? "";

  // Check if user is already authenticated and if so redirect based on if l is present
  // Extract query parameter `l`
  const secureLink = searchParams.l;

  // Check if user is already authenticated
  const cookieStore = cookies();
  const authToken = cookieStore.get("auth_token")?.value;
  const token = cookieStore.get("token");
  if (authToken) {
    // Verify token with the backend
    const authCheckResponse = await apiClient(`/authentication/check`, {
      method: "GET",
      headers: { Authorization: `Bearer ${authToken}` },
    });

    if (authCheckResponse.ok) {
      const authCheck = await authCheckResponse.json();

      if (authCheck.resource.Authenticated) {
        // Verify token with the backend
        const isProfileCompleteResponse = await apiClient(
          `/user/isProfileComplete`,
          {
            method: "POST",
            headers: { Authorization: `Bearer ${authToken}` },
          }
        );

        const profileCompleteCheck = await isProfileCompleteResponse.json();

        if (!profileCompleteCheck.resource.isProfileRegistered) {
          redirect("/profile-setup");
        }

        // Redirect to the link processing page if authenticated
        redirect(
          secureLink ? `/link?l=${encodeURIComponent(secureLink)}` : `/`
        );
      }
    }
  }

  const getHeight = () => {
    switch (true) {
      case linkAppleAccountSub !== "":
        return [700, 800];
      case appleAccountLinked !== "":
        return [700, 800];
      default:
        return [700, 800];
    }
  };

  const getOffset = () => {
    switch (true) {
      case linkAppleAccountSub !== "":
        return [-500, -545];
      case appleAccountLinked !== "":
        return [-640, -740];
      default:
        return [-445, -585];
    }
  };
  return (
    <PerygonContainer>
      <ClearLocalStorage />
      <Center flex={1} maxW={["100%"]} flexDirection={"column"}>
        <LoginCard
          height={getHeight()}
          imageOffset={getOffset()}
          backgroundOffset={-605}
          speechBubbleHeight={appleAccountLinked !== "" ? "125%" : "100%"}
          titleComponent={
            <VStack position="absolute" top="75px">
              <LetterFlyIn>Perygon</LetterFlyIn>
            </VStack>
          }
        >
          <LoginForm />
        </LoginCard>
        <AppStoreIcons />
      </Center>
    </PerygonContainer>
  );
}
