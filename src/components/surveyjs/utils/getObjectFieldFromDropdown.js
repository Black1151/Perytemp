/**
 * Retrieves a specific property from an object that is the original item of a dropdown choice.
 * This function assumes that the dropdown has been configured with "attachOriginalItems: true".
 *
 * @props survey - The SurveyJS model instance.
 * @returns A function that takes an array of strings as arguments.
 *          - props[0]: The name of the dropdown question in the survey.
 *          - props[1]: The property name to retrieve from the original item of the selected dropdown choice.
 * @throws An error if the dropdown or the selected item is not found.
 */
export const getObjectFieldFromDropdown = (survey) => (props) => {
  const dropdown = survey.getQuestionByName(props[0]);

  if (!dropdown) {
    return 0;
  }
  if (!dropdown.selectedItem) {
    return 0;
  }

  if (
    dropdown.selectedItem.originalItem &&
    dropdown.selectedItem.originalItem[props[1]]
  ) {
    return dropdown.selectedItem.originalItem[props[1]];
  }
};
