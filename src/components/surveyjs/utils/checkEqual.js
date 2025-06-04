export const checkEqual = (survey) => (props) => {
  // Start with basic validation of the props
  if (!props || props.length < 2) {
    console.warn(
      "checkEqual: Invalid props provided. Expected at least two arguments.",
    );
    return false;
  }

  const [variableName, valueName] = props;

  // Validate that variableName and valueName are not null or undefined
  if (!variableName || !valueName) {
    return false;
  }

  try {
    // Retrieve the value from the survey model
    const val2 = survey.getValue(valueName);

    // Handle cases where val2 might be undefined or null
    if (val2 === null || val2 === undefined) {
      return false;
    }

    // Perform the comparison
    const isEqual = String(variableName).trim() === String(val2).trim();

    // Log the comparison result
    return isEqual;
  } catch (error) {
    // Catch and log any unexpected errors
    return false;
  }
};
