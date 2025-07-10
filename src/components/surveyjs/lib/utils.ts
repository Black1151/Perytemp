import {
  ITheme,
  Model,
  Question,
  QuestionHtmlModel,
  Serializer,
  settings,
  SurveyModel,
} from "survey-core";
import { UserContextProps } from "@/providers/UserProvider";
import {
  registerSurveyFunctionsWithoutSurvey,
  registerSurveyFunctionsWithSurvey,
} from "@/components/surveyjs/utils/registerFunction";
import { Role } from "@/types/user";

interface JavascriptSurveyModule {
  applyJsWithoutSurvey?: () => void;
  applyJsWithSurvey?: (survey: SurveyModel) => void;
}

interface SJSThemeModule {
  themeJson: ITheme;
}

export const handleGlobalSettings = () => {
  settings.web.onBeforeRequestChoices = (sender, options) => {
    if (options.request) {
      options.request.withCredentials = true;
      options.request.setRequestHeader("Accept", "application/json");
    }
  };

  // Allow ChoicesByUrl answers to be empty
  Serializer.findProperty("choicesByUrl", "allowEmptyResponse").defaultValue =
    true;
};

export const importJSFile = async (
  surveyJSModel: Model,
  jsImport: string
): Promise<void> => {
  if (jsImport.length === 0) return;

  try {
    const jsModule: JavascriptSurveyModule = await import(
      `@/components/surveyjs/jsPath/${jsImport}`
    );

    if (jsModule?.applyJsWithoutSurvey) {
      jsModule.applyJsWithoutSurvey();
    }

    if (jsModule?.applyJsWithSurvey) {
      jsModule.applyJsWithSurvey(surveyJSModel);
    }
  } catch (error) {
    console.error("Error loading Javascript functions for Survey Model");
  }
};

export const importSJSFile = async (
  surveyJSModel: Model,
  sjsFilePath: string
) => {
  if (!sjsFilePath) return;

  try {
    const themeModule: SJSThemeModule = await import(
      `@/theme/sjsPath/${sjsFilePath}`
    );

    if (themeModule.themeJson) {
      surveyJSModel.applyTheme(themeModule.themeJson);
    }
  } catch (error) {
    console.error("Error loading SJS Theme module for Survey Model");
  }
};

const insertGlobalVariables = (
  surveyJSModel: Model,
  globalVariables: Array<{ [key: string]: { [nestedKey: string]: any } }>
) => {
  globalVariables.forEach((variableObject) => {
    Object.keys(variableObject).forEach((key: any) => {
      const value = variableObject[key];
      surveyJSModel.setVariable(`wgv_${key}`, value);
    });
  });
};

const insertData = (surveyJSModel: Model, data: any) => {
  surveyJSModel.data = data;
};

export const initializeSurvey = async (
  surveyJSModel: Model,
  user: UserContextProps | null,
  globalVariables: Array<{
    [key: string]: { [nestedKey: string]: any };
  }>,
  data: any,
  isNew: boolean
) => {
  // Controls menu type based on device type, screen height, width ect.
  // surveyJSModel.onOpenDropdownMenu.add((_, options) => {
  //   options.menuType = "dropdown";
  // });

  surveyJSModel.setVariable("pgv_formMode", isNew ? "new" : "edit");
  surveyJSModel.setVariable("pgv_currentUser", user);

  if (globalVariables && Array.isArray(globalVariables)) {
    insertGlobalVariables(surveyJSModel, globalVariables);
  }

  // Allow the Model to have the data if it exists
  if (data) {
    insertData(surveyJSModel, data);
  }

  // Survey dataset to include fields that are hidden (not default)
  surveyJSModel.clearInvisibleValues = false;

  // THIS MIGHT NEED TO CHANGE TO A SET VARIABLE
  surveyJSModel.seduloState = {
    isSave: false,
  };

  await registerSurveyFunctionsWithoutSurvey();
  await registerSurveyFunctionsWithSurvey(surveyJSModel);
};

export const buildFilteredSurveyData = (
  surveyJSModel: SurveyModel,
  excludeKeys: string[]
) => {
  const allQuestions = surveyJSModel.getAllQuestions();
  const surveyData = { ...surveyJSModel.data };

  // Fill in missing question answers with null (excluding HTML questions)
  allQuestions.forEach((question: Question) => {
    if (question instanceof QuestionHtmlModel) return;
    if (!(question.name in surveyData)) {
      surveyData[question.name] = null;
    }
  });

  // Exclude specific keys
  return Object.keys(surveyData).reduce(
    (acc, key) => {
      if (!excludeKeys.includes(key)) {
        acc[key] = surveyData[key];
      }
      return acc;
    },
    {} as Record<string, any>
  );
};

export const checkUserRoleAccess = (userRole: Role, roles: Role[]) => {
  return roles.includes(userRole);
};
