"use client";

// React
import React, { useEffect, useState } from "react";

// Survey JS
import "survey-core/survey-core.min.css";
// import "survey-core/defaultV2.css";
import { Model } from "survey-core";

// Admin Form
import { WorkflowFormWrapperProps } from "@/types/form";

// Logic
import useInitialiseForm from "@/components/surveyjs/hooks/useInitialiseForm";
import useFormNavigation from "@/components/surveyjs/hooks/useFormNavigation";
import { FormComponent } from "@/components/surveyjs/FormComponent";
import useWorkflowFormSubmission from "@/components/surveyjs/hooks/useWorkflowFormSubmission";

const WorkflowFormWrapper: React.FC<WorkflowFormWrapperProps> = ({
  formJson,
  data = null,
  layoutConfig = {
    layoutKey: "default",
    layoutProps: {},
  },
  globalVariables = [],
  stylingConfig = {
    sjsFilePath: "",
    cssFilePath: "",
  },
  jsImport = "",
  excludeKeys,
  formSuccessMessage,
  endpoint,
  onSubmissionResponse,
  redirectUrl,
  isAllowedToEdit,
  isNew,
}) => {
  const [surveyJSModel, setSurveyJSModel] = useState(
    new Model({ ...formJson }),
  );

  useEffect(() => {
    setSurveyJSModel(new Model({ ...formJson }));
  }, [formJson]);

  const [canEdit, setCanEdit] = useState<boolean>(isAllowedToEdit);

  useEffect(() => {
    setCanEdit(isAllowedToEdit);
  }, [isAllowedToEdit]);

  const isInitialised = useInitialiseForm({
    surveyJSModel,
    data,
    globalVariables,
    sjsFilePath: stylingConfig.sjsFilePath,
    cssFilePath: stylingConfig.cssFilePath,
    jsImport,
    isNew,
  });

  useEffect(() => {
      console.log("isInitialised state changed:", isInitialised);
    }, [isInitialised]);

  const formNavigation = useFormNavigation({ surveyJSModel, data, canEdit });

  useWorkflowFormSubmission({
    surveyJSModel,
    formSuccessMessage,
    excludeKeys,
    endpoint,
    onSubmissionResponse,
    redirectUrl,
    formNavigation,
  });

  return (
    <>
      {isInitialised && (
        <FormComponent
          surveyJSModel={surveyJSModel}
          layoutKey={layoutConfig.layoutKey}
          layoutProps={layoutConfig.layoutProps}
          formNavigation={formNavigation}
        />
      )}
    </>
  );
};

export default WorkflowFormWrapper;
