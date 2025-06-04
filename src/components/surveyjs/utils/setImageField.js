/**
 * Sets the image link for an image question based on a property from a selected dropdown item.
 * This assumes the dropdown question has "attachOriginalItems: true" set and the selected item has an image URL.
 *
 * @props survey - The SurveyJS model instance.
 * @returns A function that takes an array of strings as arguments.
 *          - props[0]: The name of the dropdown question in the survey.
 *          - props[1]: The name of the image question in the survey.
 *          - props[2]: The property name of the image URL in the original item of the selected dropdown choice.
 * @throws An error if the dropdown or image field is not found, or if the selected item does not have the specified image URL.
 */
export const setImageField = (survey) => (props) => {
  const dropdown = survey.getQuestionByName(props[0]);
  const imageField = survey.getQuestionByName(props[1]);
  if (!dropdown) {
    throw new Error(`Dropdown with name "${props[0]}" not found.`);
  }
  if (!dropdown.selectedItem) {
    throw new Error(`No item is selected in the dropdown "${props[0]}".`);
  }
  if (!imageField) {
    throw new Error(`Image field with name "${props[1]}" not found.`);
  }
  if (imageField.jsonObj.type !== "image") {
    throw new Error(`Question "${props[1]}" is not of type 'image'.`);
  }
  const imageUrl = dropdown.selectedItem.originalItem[props[2]];
  if (!imageUrl) {
    throw new Error(
      `Property "${props[2]}" not found in the selected dropdown item.`,
    );
  }
  imageField.imageLink = imageUrl;
};
