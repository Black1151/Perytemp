import React from "react";
import { Box, Spinner } from "@chakra-ui/react";
import apiClient from "@/lib/apiClient";
import { redirect } from "next/navigation";
import { verifySession } from "@/lib/dal";
import ErrorBox from "@/components/layout/ErrorBox";

interface SearchParams {
  l?: string;
}

const LinkPage = async ({ searchParams }: { searchParams: SearchParams }) => {
  const session = await verifySession();

  // If there's no session, redirect to login
  if (!session) {
    redirect("/login");
  }

  let responseData = null;
  let error = null;

  if (!searchParams.l) {
    error = "No secure link provided.";
  } else {
    try {
      // Make the API call on the server side
      const response = await apiClient(`/emailSecureLinkRedirect`, {
        method: "POST",
        body: JSON.stringify({
          secureLink: searchParams.l,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        error = errorData?.message || "Your link may have expired.";
      } else {
        const data = await response.json();
        responseData = data.resource || "No redirect URL returned.";
      }
    } catch (err) {
      console.error("Error fetching data:", err);
      error = "An error occurred while fetching the data.";
    }
  }

  if (responseData) {
    try {
      const url = new URL(responseData, process.env.NEXTAUTH_URL);
      const params = url.searchParams;

      if (params.get("a") === "3") {
        params.delete("a");
        responseData = url.pathname + url.search;
      }
    } catch (parseError) {
      error = "Error processing the redirect URL.";
    }
    redirect(responseData);
  }

  return (
    <>
      <Box
        pt="65px"
        pb="65px"
        height="100svh"
        width="100svw"
        display="flex"
        alignItems="center"
        justifyContent="center"
        color="white"
      >
        {error && (
          <ErrorBox
            supportingText={
              error ?? "An unexpected error occurred. Please try again later."
            }
            buttonText={"Go Home"}
            buttonLink={"/"}
          />
        )}
        {!error && <Spinner color="white" />}
      </Box>
    </>
  );
};
export default LinkPage;
