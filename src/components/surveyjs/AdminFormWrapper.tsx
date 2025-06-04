"use client";

// React
import React, { useEffect, useMemo } from "react";

// Survey JS
import "survey-core/survey-core.min.css";
import { Model } from "survey-core";

// Admin Form
import { AdminFormWrapperProps } from "@/types/form";

// Logic
import useInitialiseForm from "@/components/surveyjs/hooks/useInitialiseForm";
import useFormNavigation from "@/components/surveyjs/hooks/useFormNavigation";
import { FormComponent } from "@/components/surveyjs/FormComponent";
import useAdminFormSubmission from "@/components/surveyjs/hooks/useAdminFormSubmission";

// -----------------------------------------------------------------------------
// Configuration shared by all admin surveys
// -----------------------------------------------------------------------------
const adminSurveyOptions = {
  widthMode: "responsive",
  fitToContainer: true,
  showQuestionNumbers: false,
  questionErrorLocation: "bottom",
  focusOnFirstError: true,
  checkErrorsMode: "onValueChanged",
  backgroundOpacity: 0,
  showNavigationButtons: false,
  showCompletedPage: false,
  showPageTitles: false,
};

const AdminFormWrapper: React.FC<AdminFormWrapperProps> = ({
  formJson,
  data = {},
  layoutConfig = { layoutKey: "default", layoutProps: {} },
  globalVariables = [],
  stylingConfig = { sjsFilePath: "", cssFilePath: "" },
  jsImport = "",
  excludeKeys = [],
  endpoint,
  formSuccessMessage,
  reloadPageOnSuccess,
  redirectUrl,
  isNew,
  isAllowedToEdit,
  onSurveySuccess,
  onSurveyFailure,
}) => {
  // ---------------------------------------------------------------------------
  // 1. Build *a real SurveyModel every render*.
  //    If formJson hasn't arrived yet, we start with an empty survey skeleton.
  // ---------------------------------------------------------------------------
  const surveyJSModel = useMemo<Model>(() => {
    const json = formJson ?? { pages: [] }; // minimal placeholder
    const model = new Model({ ...json, ...adminSurveyOptions });

    if (!isAllowedToEdit) {
      model.mode = "display";
    }

    return model;
  }, [formJson, isAllowedToEdit]);

  // ---------------------------------------------------------------------------
  // 2. Initialise SurveyJS once the model exists.
  //    (The hook just runs; internally it can wait for assets to load.)
  // ---------------------------------------------------------------------------
  const isInitialised = useInitialiseForm({
    surveyJSModel,
    data,
    globalVariables,
    sjsFilePath: stylingConfig.sjsFilePath,
    cssFilePath: stylingConfig.cssFilePath,
    jsImport,
    isNew,
  });

  // ---------------------------------------------------------------------------
  // 3. Navigation & submission logic
  // ---------------------------------------------------------------------------
  const formNavigation = useFormNavigation({
    surveyJSModel,
    data,
    canEdit: isAllowedToEdit,
  });

  useAdminFormSubmission({
    surveyJSModel,
    isNew,
    formSuccessMessage,
    excludeKeys,
    endpoint,
    reloadPageOnSuccess,
    redirectUrl,
    formNavigation,
    onSurveySuccess,
    onSurveyFailure,
  });

  // ---------------------------------------------------------------------------
  // 4. Render
  //    Wait until both the JSON and the async init have finished.
  // ---------------------------------------------------------------------------
  const stillLoading = !formJson || !isInitialised;

  if (stillLoading) {
    return (
      <div className="flex items-center justify-center p-8">Loading form…</div>
    );
  }

  return (
    <FormComponent
      surveyJSModel={surveyJSModel}
      layoutKey={layoutConfig.layoutKey}
      layoutProps={layoutConfig.layoutProps}
      formNavigation={formNavigation}
    />
  );
};

export default AdminFormWrapper;
