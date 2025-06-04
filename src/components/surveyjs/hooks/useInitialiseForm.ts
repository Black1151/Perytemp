"use client";

import { UseSurveyProps } from "@/types/form";
import { useUser } from "@/providers/UserProvider";
import {
  handleGlobalSettings,
  importJSFile,
  importSJSFile,
  initializeSurvey,
} from "@/components/surveyjs/lib/utils";
import { useEffect, useState } from "react";

const useInitialiseForm = ({
  surveyJSModel,
  data,
  globalVariables,
  sjsFilePath,
  cssFilePath,
  jsImport,
  isNew,
}: UseSurveyProps) => {
  const { user } = useUser();
  const [isInitialised, setIsInitialised] = useState<boolean>(false);

  handleGlobalSettings();

  useEffect(() => {
    let linkElement: HTMLLinkElement | null = null;

    const loadAssetsAndInit = async () => {
      try {
        const dynamicImports = [];

        if (jsImport) {
          dynamicImports.push(importJSFile(surveyJSModel, jsImport));
        }

        if (sjsFilePath) {
          dynamicImports.push(importSJSFile(surveyJSModel, sjsFilePath));
        }

        await Promise.all(dynamicImports);

        if (cssFilePath) {
          const cssHref = `/cssPath/${cssFilePath}.css`;

          // Check if the stylesheet is already included
          const isAlreadyIncluded = Array.from(document.styleSheets).some(
            (sheet) => sheet.href && sheet.href.includes(cssHref),
          );

          if (!isAlreadyIncluded) {
            const linkElement = document.createElement("link");
            linkElement.rel = "stylesheet";
            linkElement.href = cssHref;
            document.head.appendChild(linkElement);
          }
        }

        initializeSurvey(surveyJSModel, user, globalVariables, data, isNew);
        setIsInitialised(true);
      } catch (err) {
        console.error("Error loading JS or SJS files:", err);
      }
    };

    loadAssetsAndInit();

    return () => {
      if (linkElement) {
        document.head.removeChild(linkElement);
      }
    };
  }, [cssFilePath, surveyJSModel, jsImport, sjsFilePath]);

  return isInitialised;
};

export default useInitialiseForm;
