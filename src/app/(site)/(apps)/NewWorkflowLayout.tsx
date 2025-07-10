"use client";

// React & Next
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

// Global State
import { UserContextProps, useUser } from "@/providers/UserProvider";
import { useWorkflow } from "@/providers/WorkflowProvider";

// Logic
import {
  Form,
  FormDataResponse,
  Variables,
  WorkflowLayoutProps,
} from "@/types/workflowEngine";
import { useFetchClient } from "@/hooks/useFetchClient";

// Components
import WorkflowSidebar, {
  WorkflowStage,
} from "@/components/Sidebars/WorkflowSidebar/WorkflowSidebar";
import WorkflowFormWrapper from "@/components/surveyjs/WorkflowFormWrapper";
import WorkflowEngineDebugger from "@/app/(site)/(apps)/WorkflowEngineDebugger";
import { Check, ViewTimeline, Error as ErrorIcon, Done as SuccessIcon } from "@mui/icons-material";

//Types
import { SubmissionResponse } from "@/types/form";
import SurveyModal from "@/components/surveyjs/layout/default/SurveyModal";
import { Flex, Icon, Spinner, Text } from "@chakra-ui/react";
import LockIcon from "@mui/icons-material/Lock";
import { signOut } from "next-auth/react";

const REDIRECT_PATHS: Record<string, string> = {
  happiness: "/happiness-score",
  enps: "/enps",
  cnps: "/cnps",
  "client-satisfaction": "/client-satisfaction",
  default: "/",
  tester: "/tester",
  businessScore: "/business-score",
};

interface WorkflowResponse {
  access: boolean;
}

const NewWorkflowLayout = ({
  stages,
  layout,
  workflowInstanceId,
}: WorkflowLayoutProps) => {
  const { user } = useUser();
  const { fetchClient } = useFetchClient();
  const router = useRouter();
  const {
    toolId,
    setToolId,
    workflowId,
    setWorkflowId,
    toolPath,
    currentWorkflowInstanceId,
    setCurrentWorkflowInstanceId,
    currentBusinessProcessInstanceId,
    setCurrentBusinessProcessInstanceId,
    currentStage,
    setCurrentStage,
  } = useWorkflow();

  const [isReady, setIsReady] = useState<boolean>(false);
  const [formJson, setFormJson] = useState<Form | null>(null);
  const [data, setData] = useState<any | null>(null);
  const [userHasAccess, setUserHasAccess] = useState<boolean | null>(null);
  const [isAllowedToEdit, setIsAllowedToEdit] = useState<boolean>(true);
  const [formVariables, setFormVariables] = useState<
    | Array<{
        [key: string]: { [nestedKey: string]: any };
      }>
    | undefined
  >(undefined);
  const [isAuthorisedToViewPage, setIsAuthorisedToViewPage] =
    useState<boolean>(false);
  const [lastSubmissionResponse, setLastSubmissionResponse] =
    useState<SubmissionResponse | null>(null);
  const [isCompleteModalOpen, setIsCompleteModalOpen] = useState(false);
  const [isNotAuthorisedModalOpen, setIsNotAuthorisedModalOpen] =
    useState(false);

  const handleLogout = async () => {
    await fetch("/api/auth/sign-out", { method: "POST" });
    await signOut({ redirect: false });
    router.push("/login");
  };

  const handleStageChange = (newStage: WorkflowStage) => {
    setCurrentStage(newStage);
  };

  const handleLastSubmissionResponse = (
    submissionResponse: SubmissionResponse
  ) => {
    setLastSubmissionResponse(submissionResponse);
  };

  const redirectUrl = `${REDIRECT_PATHS[layout] || REDIRECT_PATHS.default}?wfId=${workflowId}&toolId=${toolId}`;

  const userHasWorkflowAccess = async () => {
    try {
      const response: WorkflowResponse | null = await fetchClient(
        "/api/workflows/workflowAccess",
        {
          method: "POST",
          body: {
            workflowInstanceId,
          },
        }
      );

      if (response) {
        setUserHasAccess(true);
        return;
      }

      setUserHasAccess(false);
      return;
    } catch (e) {
      setUserHasAccess(false);
    }
  };

  useEffect(() => {
    if (!user || !workflowInstanceId) return;
    userHasWorkflowAccess();
  }, [workflowInstanceId]);

  useEffect(() => {
    if (!user || !stages) return;

    if (isEUAndComplete(user, stages)) {
      setIsCompleteModalOpen(true);
      setCurrentStage(null);
      return;
    }

    if (stages.length === 1) {
      setCurrentStage(stages[0]);
      setCurrentBusinessProcessInstanceId(String(stages[0].bpInstId));
      setCurrentWorkflowInstanceId(String(stages[0].wfInstId));
    }

    if (stages.length > 1) {
      const orderedStages = stages.sort((a, b) => a.bpOrder - b.bpOrder);
      const newCurrentStage =
        orderedStages.find((stage) => stage.stageStatus === "Next") ||
        orderedStages.find((stage) => stage.stageStatus === "In Progress") ||
        orderedStages[0];

      setCurrentStage(newCurrentStage);
      setCurrentBusinessProcessInstanceId(String(newCurrentStage.bpInstId));
      setCurrentWorkflowInstanceId(String(newCurrentStage.wfInstId));
    }
  }, [stages, user]);

  useEffect(() => {
    if (!user || !currentStage) return;

    try {
      setIsReady(false);

      setCurrentBusinessProcessInstanceId(String(currentStage.bpInstId));
      setToolId(String(currentStage.wfInstTool));
      setWorkflowId(String(currentStage.wfId));

      fetchCurrentStageData(user, currentStage);

      setIsAllowedToEdit(
        user?.role === "CA" ||
          currentStage.allowAlwaysEdit ||
          ![3, 4].includes(currentStage.bpInstStatus)
      );
    } finally {
      setIsReady(true);
    }
  }, [currentStage]);

  const fetchCurrentStageData = async (
    user: UserContextProps,
    currentStage: WorkflowStage
  ) => {
    const formResponse = currentStage.formId
      ? fetchClient<Form>(`/api/workflows/getForm`, {
          method: "POST",
          body: { formId: currentStage.formId },
          redirectOnError: false,
        })
      : Promise.resolve(null);

    const formDataResponse = currentStage.bpInstId
      ? fetchClient<FormDataResponse>(`/api/workflows/getFormData`, {
          method: "POST",
          body: { businessProcessInstanceId: currentStage.bpInstId },
          redirectOnError: false,
        })
      : Promise.resolve(null);

    const formVariablesResponse = workflowInstanceId
      ? fetchClient<Variables[]>("/api/workflows/getVariables", {
          method: "POST",
          body: {
            workflowInstanceId: workflowInstanceId,
          },
          redirectOnError: false,
        })
      : Promise.resolve(null);

    const [form, formDataset, formVariables] = await Promise.all([
      formResponse,
      formDataResponse,
      formVariablesResponse,
    ]);

    if (form) setFormJson(parseFormJson(form));
    if (formDataset) {
      const parsedData =
        typeof formDataset?.jsonResponse === "string"
          ? JSON.parse(formDataset.jsonResponse)
          : formDataset?.jsonResponse;
      setData(parsedData);

      const stageMetaPlain = Object.fromEntries(
        requiredWorkflowVariables.map((key) => [
          key,
          currentStage[key as keyof WorkflowStage],
        ])
      );
      const workflowMetaObject = {
        currentStageMeta: stageMetaPlain,
      };

      if (formVariables) {
        const parsedVariables = parseFormVariables(formVariables);
        setFormVariables([workflowMetaObject, ...parsedVariables]);
      } else {
        setFormVariables([workflowMetaObject]);
      }

      const isAuthorised = checkIsUserAuthorisedForCurrentStage(
        user,
        currentStage,
        formDataset
      );
      setIsAuthorisedToViewPage(isAuthorised);
      if (!isAuthorised) {
        setIsNotAuthorisedModalOpen(true);
      }
    }
  };

  useEffect(() => {
    if (!user || !lastSubmissionResponse || !currentStage) return;

    const code = lastSubmissionResponse?.data?.code;
    const isSave = lastSubmissionResponse.isSave;

    if (user.role === "EU") {
      if (code === 4) {
        setIsCompleteModalOpen(true);
      }

      if (code === 3) {
        router.refresh();
      }
    } else {
      // Code 4 - Workflow is now complete
      if (code === 4) {
        router.refresh();
        if (stages.length === 1) {
          if (currentStage.alwaysShowStageComplete) {
            setIsCompleteModalOpen(true);
          } else {
            router.push(redirectUrl);
          }
        }

        if (stages.length > 1) {
          setIsCompleteModalOpen(true);
        }
      }

      // Code 3 - Business Process has been updated
      if (code === 3) {
        if (stages.length === 1) {
          if (!isSave) {
            router.refresh();
            router.push(redirectUrl);
          }
        }

        if (stages.length > 1) {
          router.refresh();
        }
      }

      // Code 2 - Already Completed and now can't update it
      if (code === 2) {
        if (process.env.NODE_ENV === "development")
          window.alert("Returned with code 2 - this has already been done");
      }
    }

    setLastSubmissionResponse(null);
  }, [lastSubmissionResponse]);

  useEffect(() => {
    return () => {
      setCurrentStage(null);
      setCurrentBusinessProcessInstanceId(null);
      setCurrentWorkflowInstanceId(null);
    };
  }, []);

  const handleIsCompleteClose = () => {
    router.refresh();
    setIsCompleteModalOpen(false);
  };

  return (
    <>
      {!isReady && (
        <Flex align="center" justify="center" height="100%">
          <Spinner size="xl" color="primary" />
        </Flex>
      )}

      {userHasAccess !== null && !userHasAccess && isReady && (
        <SurveyModal
          isOpen={!userHasAccess}
          onConfirm={() => router.push(toolPath ?? "/")}
          onClose={() => router.push("/")}
          showButtons={{
            close: false,
            confirm: false,
          }}
          type="warning"
          title={
            <>Unauthorised Access</>
          }
          bodyContent={
            <Flex align="center" flexDirection={"column"} gap={3}>
              <Text>You are not authorized to view this Workflow.</Text>
              <Text>Please contact support if you believe this is a mistake.</Text>
            </Flex>
          }
        />
      )}

      {currentStage &&
        isAuthorisedToViewPage &&
        isReady &&
        userHasAccess === true && (
          <WorkflowFormWrapper
            formJson={formJson}
            layoutConfig={{
              layoutKey: currentStage.layout ?? layout,
              layoutProps: {
                showTitle: true,
                saveAllowed: currentStage.saveAllowed,
                allowAlwaysEdit: currentStage.allowAlwaysEdit,
              },
            }}
            stylingConfig={{
              cssFilePath: currentStage.cssThemeFileUrl ?? "",
              sjsFilePath: currentStage.sjsThemeFileUrl ?? "",
            }}
            jsImport={currentStage.jsAdditionalFileUrl ?? ""}
            data={data ?? null}
            excludeKeys={[]}
            formSuccessMessage={""}
            redirectUrl={null}
            isAllowedToEdit={isAllowedToEdit}
            globalVariables={formVariables}
            endpoint={`/api/workflows/saveWorkflow/${currentStage.bpInstId}`}
            isNew={true}
            onSubmissionResponse={handleLastSubmissionResponse}
          />
        )}

      {/*Unauthorised Access*/}
      <SurveyModal
        isOpen={isNotAuthorisedModalOpen && !isCompleteModalOpen}
        onConfirm={() => setIsNotAuthorisedModalOpen(false)}
        onClose={() => router.push("/")}
        showButtons={{
          close: false,
          confirm: true,
        }}
        title={
          <Flex
            justify={"space-between"}
            align={"center"}
            flexDirection={"column"}
            gap={2}
          >
            <Icon as={LockIcon} boxSize={8} color={"red.500"} />
            <Text textAlign={"center"}>Unauthorised Access</Text>
          </Flex>
        }
        bodyContent={
          <Flex align="center" flexDirection={"column"} gap={3}>
            <Text>You are not authorized to view this stage.</Text>
            <Text>Please select one in the sidebar to the left</Text>
          </Flex>
        }
        confirmLabel={"OK"}
        cancelLabel="Cancel"
      />

      <SurveyModal
        isOpen={isCompleteModalOpen}
        onConfirm={() =>
          user?.role === "EU" ? handleLogout() : router.push(redirectUrl)
        }
        onClose={() =>
          user?.role === "EU" ? handleLogout() : handleIsCompleteClose()
        }
        showButtons={{
          close: user?.role !== "EU",
          confirm: true,
        }}
        title={
          user?.role === "EU" ? (
            <Flex
              justify={"space-between"}
              align={"center"}
              flexDirection={"column"}
              gap={2}
            >
              <Icon as={Check} boxSize={8} color={"green.500"} />
              <Text textAlign={"center"}>
                Thank you for completing everything{" "}
              </Text>
            </Flex>
          ) : (
            <Flex
              justify={"space-between"}
              align={"center"}
              flexDirection={"column"}
              gap={2}
            >
              <Text textAlign={"center"}>All Done!</Text>
            </Flex>
          )
        }
        bodyContent={
          user?.role === "EU" ? (
            <Flex align="center" flexDirection={"column"} gap={3}>
              <Text>You've completed all required steps.</Text>
              <Text>You will now be logged out.</Text>
            </Flex>
          ) : (
            <Flex align="center" flexDirection={"column"} gap={3}>
              <Text>You've completed all required steps.</Text>
              <Text>Finish will return you to your dashboards</Text>
            </Flex>
          )
        }
        confirmLabel={user?.role === "EU" ? "Logout" : "Finish"}
        cancelLabel="Cancel"
        type="success"
      />

      <WorkflowSidebar
        workflowStages={stages}
        title={"Stages"}
        side={"left"}
        openButtonIcon={ViewTimeline}
        onStageChange={handleStageChange}
        drawerState={"fully-open"}
      />

      <WorkflowEngineDebugger
        data={[
          { label: "User", value: user },
          {
            label: "Tool & Workflow",
            value: {
              toolId,
              workflowId,
              workflowInstanceId,
              currentWorkflowInstanceId,
              currentBusinessProcessInstanceId,
            },
          },
          { label: "Current Stage", value: currentStage },
          { label: "Form", value: formJson },
          { label: "Form Data", value: data },
          { label: "Form Variables", value: formVariables },
          { label: "User Authorised", value: isAuthorisedToViewPage },
          {
            label: "Last Submission Response",
            value: lastSubmissionResponse,
          },
        ]}
      />
    </>
  );
};

export default NewWorkflowLayout;

const isEUAndComplete = (user: UserContextProps, stages: WorkflowStage[]) => {
  return (
    user.role === "EU" &&
    stages
      .filter((s) => s.isExternalBusinessProcess)
      .every((s) => s.stageStatus === "Complete")
  );
};

const parseFormVariables = (
  formVariables: Variables[]
): Array<{ [key: string]: { [nestedKey: string]: any } }> => {
  const processedVariables: Array<{ [key: string]: any }> = [];

  formVariables.forEach((variable) => {
    let parsedValue: any = variable.fieldValue;

    try {
      switch (variable.dataType.toLowerCase()) {
        case "number":
          parsedValue = parseFloat(variable.fieldValue);
          if (isNaN(parsedValue)) {
            parsedValue = variable.fieldValue;
          }
          break;
        case "boolean":
          parsedValue =
            variable.fieldValue.toLowerCase() === "true"
              ? true
              : variable.fieldValue.toLowerCase() === "false"
                ? false
                : variable.fieldValue;
          break;
        case "json":
          parsedValue = JSON.parse(variable.fieldValue);
          break;
        case "date":
          parsedValue = new Date(variable.fieldValue);
          if (isNaN(parsedValue.getTime())) {
            parsedValue = variable.fieldValue;
          }
          break;
        default:
          break;
      }
    } catch (error) {
      console.error(`Error parsing value for ${variable.fieldName}:`, error);
      parsedValue = variable.fieldValue;
    }

    processedVariables.push({ [variable.fieldName]: parsedValue });
  });

  return processedVariables;
};

const parseFormJson = (form: Form) => {
  return typeof form.jsonFile === "string"
    ? JSON.parse(form.jsonFile)
    : form.jsonFile;
};

const checkIsUserAuthorisedForCurrentStage = (
  user: UserContextProps,
  currentStage: WorkflowStage,
  formDataset: FormDataResponse
) => {
  // Definitive order of events

  // You should never be able to click a stage if it is pending
  if (currentStage.stageStatus === "Pending") {
    return false;
  }

  // A CA should be able to click into everything regardless if it has been completed or next
  if (
    user &&
    ["CA"].includes(user.role) &&
    (currentStage.stageStatus === "Next" ||
      currentStage.stageStatus === "Complete")
  ) {
    return true;
  }

  // An EU should only be allowed if the stage isExternalBusinessProcess = true
  if (user && user.role === "EU") {
    return currentStage.isExternalBusinessProcess;
  }

  // Optional order of events
  const internalIsUserAuthorised = true;

  // Checking the logic around the Global Variables
  if (
    // If stage is locked (bound by the GV as not startByDefault) and there is no isGlobalVariableBlocking
    currentStage.stageStatus === "Locked"
  ) {
    return false;
  }

  // If there is a UAG a user should be part of that group to be able to access it
  if (
    currentStage.userAccessGroupNames &&
    currentStage.userAccessGroupNames.length > 0
  ) {
    if (!user) {
      return false;
    }

    if (!user?.groupNames?.length) {
      return false;
    }

    const hasAccess = currentStage.userAccessGroupNames.some(
      (groupName) => user?.groupNames?.includes(groupName) ?? false
    );

    if (!hasAccess) {
      return false;
    }
  }

  if (
    user &&
    ["CS", "CL"].includes(user.role) &&
    (currentStage.stageStatus === "Next" ||
      currentStage.stageStatus === "Complete")
  ) {
    return true;
  }

  // Check if the user is the creator or started the process
  if (
    formDataset.createdBy === user?.userId ||
    formDataset.startedBy === user?.userId ||
    formDataset.createdBy === 0 || // 0 may indicate public access
    formDataset.startedBy === 0
  ) {
    return true;
  }

  return true;
};

const requiredWorkflowVariables = [
  "wfInstId",
  "wfInstCustomer",
  "wfInstCreatedBy",
  "wfInstStatus",
  "wfInstTool",
  "wfId",
  "wfName",
  "bpId",
  "bpName",
  "bpOrder",
  "anonSubmission",
  "bpInstId",
  "bpInstBpId",
  "bpInstCustomer",
  "bpInstCreatedBy",
  "bpInstStartdDate",
  "bpInstStatus",
  "stageStatus",
  "isExternalBusinessProcess",
  "wfInstStartDate",
  "wfInstCompleteDate",
  "bpInstCompleteDate",
  "bpInstStartedBy",
];
