"use client";

import React, { useEffect, useCallback, useState } from "react";
import { Flex, Spinner, Text, Button } from "@chakra-ui/react";
import { useFetchClient } from "@/hooks/useFetchClient";
import { useRouter } from "next/navigation";

interface GuestLoginProps {
  secureLink: string;
}

const GuestLoginClient: React.FC<GuestLoginProps> = ({ secureLink }) => {
  const { fetchClient } = useFetchClient();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const guestLogin = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const endpoint = `/api/auth/sign-in?l=${secureLink}`;

      const result: { redirectUrl: string } | null = await fetchClient(
        endpoint,
        {
          method: "POST",
          body: {
            loginType: "guestUser",
            secureLinkUniqueId: secureLink,
            password: null,
          },
          suppressError: true,
        },
      );

      if (result) {
        router.push(result.redirectUrl);
      } else {
        throw new Error("Login failed. Please check your secure link.");
      }
    } catch (err) {
      setError(
        (err as Error).message || "Something went wrong. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  }, [fetchClient, secureLink, router]);

  useEffect(() => {
    guestLogin();
  }, []);

  return (
    <Flex
      height="100svh"
      width="100svw"
      align="center"
      justify="center"
      direction="column"
    >
      {loading ? (
        <Spinner color="white" />
      ) : error ? (
        <>
          <Text color="red.400" mb={4}>
            {error}
          </Text>
        </>
      ) : null}
    </Flex>
  );
};

export default GuestLoginClient;
