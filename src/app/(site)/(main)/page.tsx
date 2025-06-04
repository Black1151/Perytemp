import apiClient from "@/lib/apiClient";
import { CarouselItemProps } from "@/components/carousel/CarouselItem";
import { cookies } from "next/headers";
import { PerygonMainClient } from "../../PerygonMainClient";
import { redirect } from "next/navigation";
import { verifySession } from "@/lib/dal";
import ExternalUserMainClient from "./ExternalUserMainClient";

export const dynamic = "force-dynamic";

type CarouselItemWithoutIsSelected = Omit<CarouselItemProps, "isSelected">;

function transformCarouselItems(data: any[]): CarouselItemWithoutIsSelected[] {
  return data.map((item) => ({
    toolId: item.toolId,
    logoImage: item.logoImageUrl,
    iconImage: item.iconImageUrl,
    thumbNailImage: item.thumbnailImageUrl,
    backgroundImage: item.previewImageUrl,
    alt: item.displayName,
    name: item.displayName,
    description: item.previewText,
    appUrl: item.appUrl,
    toolWfId: item.toolWfId,
    isUAGLocked: item.isUAGLocked,
  }));
}

export default async function PerygonMain() {
  const session = await verifySession();

  if (!session) {
    redirect("/login");
  }

  const cookieStore = cookies();
  const authToken = cookieStore.get("auth_token")?.value;
  const uniqueId = cookieStore.get("user_uuid")?.value;

  let userRole;
  let carouselItems: CarouselItemWithoutIsSelected[] = [];
  let isProfileRegistered = false;

  if (authToken) {
    try {
      const [fetchLoggedInUserData, fetchCarouselItems, fetchProfileStatus] =
        await Promise.all([
          apiClient(
            `/getView?view=vwLoggedInUserIdentity&selectColumns=role&userUniqueId=${uniqueId}`,
            {
              method: "GET",
              cache: "no-store",
            }
          ),
          apiClient(`/getAllView?view=vwToolsCarouselList`, {
            method: "GET",
          }),
          apiClient(`/user/isProfileComplete`, {
            method: "POST",
            body: JSON.stringify({ uniqueId }),
          }),
        ]);

      const loggedInUserData = await fetchLoggedInUserData.json();
      const carouselItemsData = await fetchCarouselItems.json();
      const profileStatusData = await fetchProfileStatus.json();

      userRole = loggedInUserData?.resource.role;
      carouselItems = transformCarouselItems(carouselItemsData.resource ?? []);
      isProfileRegistered = profileStatusData.resource.isProfileRegistered;
    } catch (error: any) {
      console.error("Error details:", error);
      redirect("/error");
    }
  } else {
    redirect("/login");
  }

  if (userRole === "EU") {
    return <ExternalUserMainClient />;
  }

  if (userRole === "PA") {
    return redirect("/customers");
  }

  if (!isProfileRegistered) {
    return redirect("/profile-setup");
  }

  return (
    <PerygonMainClient
      carouselItems={carouselItems}
      showNoToolsModal={carouselItems.length === 0}
    />
  );
}
