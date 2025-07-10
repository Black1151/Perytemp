"use client";
/*
This is a dumb renderer, its only job is to handle layout selection and initialise the SurveyJS Model
 */

import React, { useEffect, useState } from "react";

// SurveyJS
import "survey-core/survey-core.min.css";
// import "survey-core/defaultV2.css";

// Form Layout Types
import DefaultLayout from "@/components/surveyjs/layout/default/Layout";
import HappinessLayout from "@/components/surveyjs/layout/happiness/Layout";
import eNPSLayout from "@/components/surveyjs/layout/enps/Layout";
import ClientSatisfactionLayout from "@/components/surveyjs/layout/client-satisfaction/Layout";
import CompanyRegistrationLayout from "@/components/surveyjs/layout/companyRegistration/Layout";
import CNPSLayout from "@/components/surveyjs/layout/cnps/Layout";

// Logic
import { FormComponentProps, LayoutMap } from "@/types/form";
import BusinessScoreLayout from "./layout/business-score/Layout";

const layoutMap: LayoutMap = {
  default: DefaultLayout,
  "company-registration": CompanyRegistrationLayout,
  happiness: HappinessLayout,
  enps: eNPSLayout,
  cnps: CNPSLayout,
  "client-satisfaction": ClientSatisfactionLayout,
  tester: ClientSatisfactionLayout,
  "business-score": BusinessScoreLayout,
};

export const FormComponent: React.FC<FormComponentProps> = ({
  surveyJSModel,
  layoutKey,
  layoutProps = {},
  formNavigation,
}) => {
  const Layout = layoutMap[layoutKey] || layoutMap["default"];

  return (
    <>
      <Layout
        surveyJSModel={surveyJSModel}
        formNavigation={formNavigation}
        {...layoutProps}
      />
    </>
  );
};
