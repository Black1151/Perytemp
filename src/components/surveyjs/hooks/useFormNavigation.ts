import { useEffect, useState } from "react";
import { PageModel, SurveyModel } from "survey-core";
import { FormNavigationProps, useFormNavigationProps } from "@/types/form";

const useFormNavigation = ({
  surveyJSModel,
  data,
  canEdit,
}: useFormNavigationProps): FormNavigationProps => {
  const [pageNo, setPageNo] = useState<number>(0);
  const [isFirstPage, setIsFirstPage] = useState<boolean>(
    surveyJSModel.isFirstPage
  );
  const [isLastPage, setIsLastPage] = useState<boolean>(
    surveyJSModel.isLastPage
  );
  const [isEditMode, setIsEditMode] = useState<boolean>(canEdit);
  const [pageListOptions, setPageListOptions] = useState<
    { page: PageModel; title: string; index: number }[]
  >([]);

  useEffect(() => {
    setPageListOptions(getPageListOptions());
    setPageNo(surveyJSModel.currentPageNo);
    setIsFirstPage(surveyJSModel.isFirstPage);
    setIsLastPage(surveyJSModel.isLastPage);
    if (canEdit) {
      surveyJSModel.mode = "edit";
      setIsEditMode(true);
    } else {
      switchToDisplayMode();
    }
  }, [surveyJSModel, canEdit]);

  useEffect(() => {
    surveyJSModel.onCurrentPageChanged.add((_, options) => {
      setPageNo(options.newCurrentPage.visibleIndex);
      setIsFirstPage(surveyJSModel.isFirstPage);
      setIsLastPage(surveyJSModel.isLastPage);
    });

    surveyJSModel.onPageVisibleChanged.add((sender, options) => {
      setPageListOptions(getPageListOptions());
      setIsFirstPage(surveyJSModel.isFirstPage);
      setIsLastPage(surveyJSModel.isLastPage);
    });

    return () => {
      surveyJSModel.onCurrentPageChanged.remove((_, options) => {
        setPageNo(options.newCurrentPage.visibleIndex);
        setIsFirstPage(surveyJSModel.isFirstPage);
        setIsLastPage(surveyJSModel.isLastPage);
      });
      surveyJSModel.onPageVisibleChanged.remove((sender, options) => {
        setPageListOptions(getPageListOptions());
        setIsFirstPage(surveyJSModel.isFirstPage);
        setIsLastPage(surveyJSModel.isLastPage);
      });
    };
  }, [surveyJSModel]);

  const prevPage = () => {
    surveyJSModel.prevPage();
  };
  const nextPage = () => {
    surveyJSModel.nextPage();
  };
  const jumpToPage = (page: PageModel) => {
    const targetPageIndex = surveyJSModel.visiblePages.indexOf(page);
    const currentPageIndex = surveyJSModel.currentPageNo;

    const isGoingBackwards = targetPageIndex < currentPageIndex;

    if (isGoingBackwards || surveyJSModel.currentPage.validate()) {
      surveyJSModel.tryNavigateToPage(page);
    }
  };

  const resetSurvey = () => {
    surveyJSModel.data = data;
    switchToDisplayMode();
  };

  const saveSurvey = () => {
    if (!canEdit) return;
    surveyJSModel.seduloState.isSave = true;
    // TODO: Check if we need to validate everything on the save survey

    // Validate the entire survey before submitting
    if (!surveyJSModel.validate(true, true)) {
      surveyJSModel.autoFocusFirstError;
      return;
    }

    if (!surveyJSModel.isCurrentPageHasErrors) {
      if (!surveyJSModel.completeLastPage()) {
        surveyJSModel.autoFocusFirstError;
        return;
      } else {
        surveyJSModel.clear(false, false);
        surveyJSModel.render();
        switchToDisplayMode();
      }
    } else {
      // If there are errors, focus on the first page with an error
      surveyJSModel.autoFocusFirstError;
    }
  };

  const submitSurvey = () => {
    if (!canEdit) return;

    // Validate the entire survey before submitting
    if (!surveyJSModel.validate(true, true)) {
      surveyJSModel.autoFocusFirstError;
      return;
    }

    if (!surveyJSModel.isCurrentPageHasErrors) {
      if (!surveyJSModel.completeLastPage()) {
        surveyJSModel.autoFocusFirstError;
        return;
      } else {
        surveyJSModel.clear(false, false);
        surveyJSModel.render();
        switchToDisplayMode();
      }
    } else {
      // If there are errors, focus on the first page with an error
      surveyJSModel.autoFocusFirstError;
    }
  };

  const switchToDisplayMode = () => {
    surveyJSModel.mode = "display";
    setIsEditMode(false);
  };

  const switchToEditMode = () => {
    if (!canEdit) return;

    surveyJSModel.mode = "edit";
    setIsEditMode(true);
    const firstIncompletePage = findFirstIncompletePage();
    if (
      firstIncompletePage &&
      surveyJSModel.visiblePages.indexOf(firstIncompletePage) <= pageNo
    ) {
      jumpToPage(firstIncompletePage);
    }
  };

  // Function to find the first page with incomplete or invalid data
  const findFirstIncompletePage = (): PageModel | null => {
    for (const page of surveyJSModel.visiblePages) {
      // If the page is not valid or has errors, return it
      if (!page.validate(true)) {
        return page;
      }
    }

    return null;
  };

  const getPageListOptions = () => {
    return surveyJSModel.visiblePages.map((page: PageModel, index: number) => {
      let title = page.title || `Page ${index + 1}`;
      if (title) {
        title = replaceVariables(title, surveyJSModel);
      }

      return { page, title, index };
    });
  };

  const replaceVariables = (title: string, model: SurveyModel) => {
    return title.replace(/\{([^}]+)\}/g, (match, variableName) => {
      const value = model.getVariable(variableName) || model.data[variableName];
      return value !== undefined ? value : match;
    });
  };

  return {
    pageNo,
    isFirstPage,
    isLastPage,
    pageListOptions,
    nextPage,
    prevPage,
    jumpToPage,
    resetSurvey,
    submitSurvey,
    saveSurvey,
    switchToEditMode,
    switchToDisplayMode,
    isEditMode,
  };
};
export default useFormNavigation;
