import React from "react";
import { SurveyModel, PageModel } from "survey-core";

export type LayoutMap = {
  [key: string]: React.FC<BaseLayoutProps>;
};

export type LayoutKeys =
  | "default"
  | "company-registration"
  | "happiness"
  | "enps"
  | "client-satisfaction"
  | "tester"
  | "business-score";

type StylingConfig = {
  cssFilePath: string;
  sjsFilePath: string;
};

type LayoutConfig = {
  layoutKey: LayoutKeys;
  layoutProps: Record<string, any> | {};
};

export interface FormComponentProps {
  surveyJSModel: SurveyModel;
  layoutKey: LayoutKeys;
  layoutProps: Record<string, any> | {};
  formNavigation: FormNavigationProps;
}

export interface BaseFormComponentProps {
  formJson: any;
  data: Record<string, any> | null;
  layoutConfig: LayoutConfig;
  globalVariables?: Array<{ [key: string]: { [nestedKey: string]: any } }>;
  stylingConfig?: StylingConfig;
  jsImport?: string;
  excludeKeys: string[];
  formSuccessMessage: string | null;
  endpoint: string;
  redirectUrl: string | null;
  isAllowedToEdit: boolean;
  isNew: boolean;
}

type Role = "CU" | "CL" | "CS" | "CA" | "PA" | "EU";

export interface AdminFormWrapperProps extends BaseFormComponentProps {
  reloadPageOnSuccess: boolean;
  onSurveySuccess?: () => void;
  onSurveyFailure?: () => void;
}

export interface WorkflowFormWrapperProps extends BaseFormComponentProps {
  onSubmissionResponse?: (response: SubmissionResponse) => void;
}

export type SubmissionResponse = {
  success: boolean;
  message?: string;
  isSave: boolean;
  data?: Record<string, any>;
};

export interface BaseLayoutProps {
  surveyJSModel: SurveyModel;
  formNavigation: FormNavigationProps;
}

export interface DefaultLayoutProps extends BaseLayoutProps {
  showTopNavigation?: boolean;
  showBottomNavigation?: boolean;
}

export interface HappinessLayoutProps extends BaseLayoutProps {
  showTitle?: boolean;
}

export interface eNPSLayoutProps extends BaseLayoutProps {}

export interface ClientSatisfactionLayoutProps extends BaseLayoutProps {
  saveAllowed?: boolean;
  allowAlwaysEdit?: boolean;
}

export interface BusinessScoreLayoutProps extends BaseLayoutProps {
  saveAllowed?: boolean;
  allowAlwaysEdit?: boolean;
}

export interface UseSurveyProps {
  surveyJSModel: SurveyModel;
  data: any;
  globalVariables: Array<{ [key: string]: { [nestedKey: string]: any } }>;
  sjsFilePath: string;
  cssFilePath: string;
  jsImport: string;
  isNew: boolean;
}

export interface useFormNavigationProps {
  surveyJSModel: SurveyModel;
  data: any;
  canEdit: boolean;
}

export interface FormNavigationProps {
  pageNo: number;
  nextPage: () => void;
  prevPage: () => void;
  jumpToPage: (page: PageModel) => void;
  resetSurvey: () => void;
  submitSurvey: () => void;
  saveSurvey: () => void;
  switchToEditMode: () => void;
  switchToDisplayMode: () => void;
  pageListOptions: PageListOption[];
  isFirstPage: boolean;
  isLastPage: boolean;
  isEditMode: boolean;
}

export interface PageListOption {
  page: PageModel;
  title: string;
  index: number;
}

export interface UseAdminFormSubmissionProps {
  surveyJSModel: SurveyModel;
  isNew: boolean;
  excludeKeys: string[];
  endpoint: string;
  formSuccessMessage: string | null;
  reloadPageOnSuccess: boolean;
  redirectUrl: string | null;
  formNavigation: FormNavigationProps;
  onSurveySuccess?: () => void;
  onSurveyFailure?: () => void;
}

export interface UseWorkflowFormSubmissionProps {
  surveyJSModel: SurveyModel;
  excludeKeys: string[];
  formSuccessMessage: string | null;
  endpoint: string;
  onSubmissionResponse?: (response: SubmissionResponse) => void;
  redirectUrl: string | null;
  formNavigation: FormNavigationProps;
}
