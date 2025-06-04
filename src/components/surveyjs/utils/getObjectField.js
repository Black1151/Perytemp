/**
 * Retrieves a specific property from a question in the survey that holds an object.
 *
 * @props survey - The SurveyJS model instance.
 * @returns A function that takes an array of strings as arguments.
 *          - props[0]: The name of the key in the survey data.
 *          - props[1]: The property name to retrieve from the object.
 * @throws An error if the question is not found or does not contain the specified property.
 */
export const getObjectField = (survey) => (props) => {
  const [questionKey, propertyName] = props;

  // Validate the questionKey
  if (!questionKey) {
    return 0;
  }

  // Validate the propertyName
  if (!propertyName) {
    return 0;
  }

  // Retrieve the question data from the survey
  const questionData = survey.data[questionKey];

  // Validate the question data
  if (!questionData || typeof questionData !== "object") {
    return 0;
    throw new Error(
      `The question with key '${questionKey}' does not exist or is not an object.`,
    );
  }

  // Retrieve the property from the question data
  const propertyValue = questionData[propertyName];

  // Validate the property
  if (propertyValue === undefined) {
    return 0;
    throw new Error(
      `The property '${propertyName}' does not exist in the question with key '${questionKey}'.`,
    );
  }

  // Return the retrieved property value
  return propertyValue;
};
