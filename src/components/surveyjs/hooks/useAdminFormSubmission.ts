import { useToast } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { UseAdminFormSubmissionProps } from "@/types/form";
import { buildFilteredSurveyData } from "@/components/surveyjs/lib/utils";
import { SurveyModel } from "survey-core";

const useAdminFormSubmission = ({
  surveyJSModel,
  isNew,
  excludeKeys,
  endpoint,
  formSuccessMessage,
  reloadPageOnSuccess,
  redirectUrl,
  formNavigation,
  onSurveySuccess,
  onSurveyFailure,
}: UseAdminFormSubmissionProps) => {
  const toast = useToast();
  const router = useRouter();

  const handleAdminFormSubmission = async (surveyJSModel: SurveyModel) => {
    const filteredData = buildFilteredSurveyData(surveyJSModel, excludeKeys);
    try {
      const requestType = isNew ? "POST" : "PUT";

      const apiUrl =
        requestType === "POST"
          ? `/api/surveyjs${endpoint}`
          : `/api/surveyjs/${endpoint.split("/")[1]}`;

      const payload =
        requestType === "PUT"
          ? {
              uniqueId: endpoint.split("/")[2],
              data: filteredData,
            }
          : filteredData;

      const response = await fetch(apiUrl, {
        method: requestType,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.status === 401) {
        toast({
          title: "Unauthorised",
          description: "Your session has timed out, you need to log in again.",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom-right",
        });
        router.push("/login");
        return null;
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to submit data");
      }

      const result = await response.json();

      toast({
        title: "Submitted successfully.",
        description: formSuccessMessage,
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom-right",
      });

      surveyJSModel.data = result.data || filteredData;

      surveyJSModel.clear(false, false);
      surveyJSModel.render();

      formNavigation.switchToDisplayMode();

      onSurveySuccess?.();

      //// commented out for testing purposes
      // if (reloadPageOnSuccess) {
      //   router.refresh();
      // }

      if (redirectUrl) {
        setTimeout(() => router.push(redirectUrl), 1000);
      }

      return result;
    } catch (error) {
      toast({
        title: "An error occurred",
        description: "Something went wrong, please try again.",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-right",
      });

      surveyJSModel.data = filteredData;
      surveyJSModel.clear(false, false);
      surveyJSModel.render();

      formNavigation.switchToEditMode();
    }
  };

  useEffect(() => {
    surveyJSModel.onComplete.add(handleAdminFormSubmission);

    return () => {
      surveyJSModel.onComplete.remove(handleAdminFormSubmission);
    };
  }, []);

  return {};
};

export default useAdminFormSubmission;
