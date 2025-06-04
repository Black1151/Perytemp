import { ToastPosition, useToast } from "@chakra-ui/react";
import { useState } from "react";
import { useRouter } from "next/navigation";

type FetchOptions = {
  method?: "GET" | "POST" | "PUT" | "DELETE";
  headers?: HeadersInit;
  body?: any;
  successMessage?: string;
  errorMessage?: string;
  redirectOnError?: boolean;
  toastPosition?: ToastPosition;
  onUnauthorised?: () => void;
  suppressError?: boolean;
};

export const useFetchClient = () => {
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const fetchClient = async <T>(
    url: string,
    {
      method = "GET",
      headers = {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body,
      successMessage,
      errorMessage = "An unexpected error occurred.",
      redirectOnError = true,
      toastPosition = "bottom",
      onUnauthorised,
      suppressError = false,
    }: FetchOptions = {}
  ): Promise<T | null> => {
    setLoading(true);

    try {
      const response = await fetch(url, {
        method,
        headers,
        ...(body ? { body: JSON.stringify(body) } : {}),
      });

      if (response.status === 401) {
        if (onUnauthorised) {
          onUnauthorised();
        } else {
          toast({
            title: "Unauthorised",
            description:
              "Your session has timed out, you need to log in again.",
            status: "error",
            duration: 5000,
            isClosable: true,
            position: toastPosition,
          });
          router.push("/login");
        }
        return null;
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData?.error || errorMessage);
      }

      const data = await response.json();
      if (successMessage) {
        toast({
          title: successMessage,
          status: "success",
          duration: 5000,
          isClosable: true,
          position: toastPosition,
        });
      }

      return data;
    } catch (error: any) {
      if (suppressError) {
        toast.closeAll();
      }
      toast({
        title: "Error",
        description: error.message || errorMessage,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: toastPosition,
      });

      if (redirectOnError && !suppressError) {
        router.push("/error");
      }

      return null;
    } finally {
      setLoading(false);
    }
  };

  return { fetchClient, loading };
};
