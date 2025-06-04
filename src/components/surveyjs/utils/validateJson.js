// Function to validate Json on a JSON MASK INPUT
export const validateJson = (props) => {
  const jsonInput = props[0];

  // Check if the input is empty
  if (!jsonInput) {
    return true; // Allow empty input
  }

  // Validate if the input is a valid JSON
  try {
    JSON.parse(jsonInput);
    return true; // It's valid JSON
  } catch (e) {
    return false; // Invalid JSON
  }
};
