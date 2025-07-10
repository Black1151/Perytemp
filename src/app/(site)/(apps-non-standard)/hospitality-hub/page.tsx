import { ToolLandingPage } from "@/app/(site)/(apps)/ToolLandingPageInner";
import { HospitalityHubSplashScreen } from "./HospitalityHubSplashScreen";
import apiClient from "@/lib/apiClient";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function Home() {
  const redirectUrl = "/hospitality-hub/app";
  const cookieStore = cookies();
  const uniqueId = cookieStore.get("user_uuid")?.value;
  const res = await apiClient(`/getUserMetadata`, {
    method: "POST",
    body: JSON.stringify({ p_userUniqueId: uniqueId }),
    cache: "no-store",
  });
  const userMetadataData = await res.json();
  const userMetadata = userMetadataData.resource;
  if (!userMetadata?.subscribedTools?.includes("101")) {
    redirect("/");
  }

  return (
    <ToolLandingPage
      redirectUrl={redirectUrl}
      splashScreen={<HospitalityHubSplashScreen />}
    />
  );
}
