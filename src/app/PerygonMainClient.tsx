"use client";

import { useEffect, useLayoutEffect } from "react";
import CarouselDisplay from "@/components/carousel/CarouselDisplay";
import { CarouselItemProps } from "@/components/carousel/CarouselItem";
import {
  Flex,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
  Button,
  HStack,
} from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { useUser } from "@/providers/UserProvider";
import { Warning } from "@mui/icons-material";

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

      <Modal
        isOpen={!!showNoToolsModal}
        onClose={() => {}}
        closeOnOverlayClick={false}
        closeOnEsc={false}
      >
        <ModalOverlay />
        <ModalContent alignContent={"center"}>
          <ModalBody
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            textAlign="center"
            p={4}
          >
            <Warning fontSize="large" style={{ marginBottom: 12 }} />
            <Text fontSize="2xl" fontWeight="semibold" mb={2}>
              No Tools Subscribed
            </Text>
            <Text mb={4}>
              Your have no tools. Please visit our tool store to continue.
            </Text>
            <HStack spacing={2} width="100%" justifyContent="center">
              <Button
                onClick={() => router.push("/tool-store")}
                loadingText="Going to tool store..."
              >
                Tool Store
              </Button>
              <Button onClick={logoutUser} loadingText="Logging out...">
                Logout
              </Button>
            </HStack>
          </ModalBody>
        </ModalContent>
      </Modal>

      <Modal
        isOpen={!!showTrialEndedModal}
        onClose={() => {}}
        closeOnOverlayClick={false}
        closeOnEsc={false}
      >
        <ModalOverlay />
        <ModalContent alignContent={"center"}>
          <ModalBody
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            textAlign="center"
            p={4}
          >
            <Warning fontSize="large" style={{ marginBottom: 12 }} />
            <Text fontSize="xl" fontWeight="semibold" mb={2}>
              Your Trial Ended On{" "}
              {user?.customerIsFreeUntilDate
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
                : ""}
            </Text>
            {user?.role == "CA" || "CL" ? (
              <Text mb={4}>
                Your free trial has ended. Please visit our tool store to
                continue.
              </Text>
            ) : (
              <Text mb={4}>
                Your companies free trial has ended. Please contact your IT
                admin.
              </Text>
            )}
            <HStack spacing={2} width="100%" justifyContent="center">
               {(user?.role == "CA" || "CL") && (
              <Button
                onClick={() => router.push("/tool-store")}
                loadingText="Going to tool store..."
              >
                Tool Store
              </Button>
              )}
              <Button onClick={logoutUser} loadingText="Logging out...">
                Logout
              </Button>
            </HStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Flex>
  );
};
