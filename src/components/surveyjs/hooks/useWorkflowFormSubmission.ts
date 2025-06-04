import { useToast } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { UseWorkflowFormSubmissionProps } from "@/types/form";
import { buildFilteredSurveyData } from "@/components/surveyjs/lib/utils";
import { SurveyModel } from "survey-core";
import { applyJsWithSurvey } from "@/components/surveyjs/jsPath/registerSvgIcons";

const useWorkflowFormSubmission = ({
  surveyJSModel,
  excludeKeys,
  formSuccessMessage,
  endpoint,
  onSubmissionResponse,
  redirectUrl,
  formNavigation,
}: UseWorkflowFormSubmissionProps) => {
  const toast = useToast();
  const router = useRouter();

  const handleWorkflowFormSubmission = async (surveyJSModel: SurveyModel) => {
    const filteredData = buildFilteredSurveyData(surveyJSModel, excludeKeys);
    try {
      const apiUrl = endpoint;
      const isSaveMode = surveyJSModel.seduloState.isSave === true;
      const payload = {
        jsonResponse: filteredData,
        isComplete: !isSaveMode,
      };

      if (surveyJSModel.seduloState) {
        surveyJSModel.seduloState.isSave = false;
      }

      const response = await fetch(apiUrl, {
        method: "POST",
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

      if (onSubmissionResponse) {
        onSubmissionResponse({
          success: result.success,
          message: result.message,
          isSave: isSaveMode,
          data: {
            code: result.code, // -1, 0, 1, 2, 3, 4 (READS THE SUBMISSION RESPONSE)
            ...result.data, // in case you need other info too
          },
        });
      }

      toast({
        title: "Submitted successfully.",
        description: isSaveMode ? "Saved Successfully" : formSuccessMessage,
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom-right",
      });

      surveyJSModel.data = filteredData;

      if (isSaveMode) {
        formNavigation.switchToEditMode();
      }

      if (redirectUrl) {
        setTimeout(() => router.push(redirectUrl), 1000);
      }

      return result;
    } catch (error) {
      toast({
        title: "Submission failed.",
        description:
          error instanceof Error ? error.message : "An error occurred.",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-right",
      });

      formNavigation.switchToEditMode();
    }
  };

  useEffect(() => {
    surveyJSModel.onComplete.add(handleWorkflowFormSubmission);

    return () => {
      surveyJSModel.onComplete.remove(handleWorkflowFormSubmission);
    };
  }, [surveyJSModel]);

  return {};
};

export default useWorkflowFormSubmission;
