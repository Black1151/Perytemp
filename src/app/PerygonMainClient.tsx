"use client";

import { useEffect, useLayoutEffect } from "react";
import CarouselDisplay from "@/components/carousel/CarouselDisplay";
import { CarouselItemProps } from "@/components/carousel/CarouselItem";
import { Flex, Text } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { useUser } from "@/providers/UserProvider";
import { Logout, Storefront, Warning } from "@mui/icons-material";
import { SpringModal } from "@/components/modals/springModal/SpringModal";

interface PerygonMainClientProps {
  carouselItems: CarouselItemProps[];
  showNoToolsModal: boolean;
}

export const PerygonMainClient: React.FC<PerygonMainClientProps> = ({
  carouselItems,
  showNoToolsModal,
}) => {
  const { user } = useUser();
  const router = useRouter();

  const showTrialEndedModal =
    !!user?.customerIsFreeUntilDate &&
    user.customerIsFree &&
    new Date(user.customerIsFreeUntilDate) < new Date();

  /**
   * IMPORTANT: CA users with no parentId are users who need to set up a company.
   */
  const newCompanyRegistration =
    user?.role === "CA" && user.customerId === null;

  useLayoutEffect(() => {
    if (newCompanyRegistration) {
      router.replace("/register-company");
    }
  }, [newCompanyRegistration, router]);

  useEffect(() => {
    localStorage.removeItem("toolId");
    localStorage.removeItem("workflowId");
    localStorage.removeItem("currentBusinessProcessInstanceId");
    localStorage.removeItem("currentWorkflowInstanceId");
  }, []);

  if (newCompanyRegistration) {
    return null;
  }

  const logoutUser = async () => {
    try {
      const response = await fetch("/api/auth/sign-out", { method: "POST" });
      if (response.ok) {
        router.push("/login");
        router.refresh();
      } else {
        console.error("Logout failed");
      }
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  return (
    <Flex flex={1} overflow="hidden" width="100%">
      {!showNoToolsModal && !showTrialEndedModal && (
        <CarouselDisplay carouselItems={carouselItems} />
      )}

      <SpringModal
        isOpen={!!showNoToolsModal}
        onClose={() => {}}
        showClose={false}
        frontIcon={<Warning fontSize="inherit" />}
        bgIcon={<Warning fontSize="inherit" />}
        header="No Tools Subscribed"
        body={
          <Text mb={4}>
            Your have no tools. Please visit our tool store to continue.
          </Text>
        }
        bg="orange.500"
        color="white"
        primaryLabel="Tool Store"
        primaryIcon={<Storefront />}
        onPrimaryClick={() => router.push("/tool-store")}
        secondaryLabel="Logout"
        onSecondaryClick={logoutUser}
        secondaryIcon={<Logout />}
      />

      <SpringModal
        isOpen={!!showTrialEndedModal}
        onClose={() => {}}
        showClose={false}
        frontIcon={<Warning fontSize="inherit" />}
        bgIcon={<Warning fontSize="inherit" />}
        header={`Your Trial Ended On ${
          user?.customerIsFreeUntilDate
            ? new Date(user.customerIsFreeUntilDate)
                .toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })
                .replace(
                  /^(\d{1,2})/,
                  (d) =>
                    d +
                    (["1", "21", "31"].includes(d)
                      ? "st"
                      : ["2", "22"].includes(d)
                        ? "nd"
                        : ["3", "23"].includes(d)
                          ? "rd"
                          : "th")
                )
            : ""
        }`}
        body={
          <Text mb={4}>
            {user?.role == "CA" || "CL"
              ? "Your free trial has ended. Please visit our tool store to continue."
              : "Your companies free trial has ended. Please contact your IT admin."}
          </Text>
        }
        bg="orange.500"
        color="white"
        primaryLabel={user?.role == "CA" || "CL" ? "Tool Store" : undefined}
        primaryIcon={<Storefront />}
        onPrimaryClick={
          user?.role == "CA" || "CL"
            ? () => router.push("/tool-store")
            : undefined
        }
        secondaryLabel="Logout"
        onSecondaryClick={logoutUser}
        secondaryIcon={<Logout />}
      />
    </Flex>
  );
};
