/**
 * Get data from a specific resource API call.
 *
 * @param {Array} props - Array containing [postcode, resultField].
 * @returns {Promise<any>} - Returns a promise that resolves with the field's value or an error message.
 */
export async function fetchPostcodeData(props) {
  const [postcode, resultField] = props;

  // Check if both postcode and resultField are provided
  if (!postcode || !resultField) {
    return Promise.reject("Both postcode and resultField are required");
  }

  try {
    // Fetch data from the API
    const response = await fetch(`/api/surveyjs/postcode?postcode=${postcode}`);

    // Check if response is OK (status code 200-299)
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    // Parse the response as JSON
    const data = await response.json();

    // Function to dynamically access nested properties using dot notation
    const getNestedField = (obj, path) => {
      return path.split(".").reduce((acc, part) => acc && acc[part], obj);
    };

    // Get the nested field's value using the dot-separated field string
    const result = getNestedField(data, resultField);

    // If the result is undefined, return an error
    if (result === undefined) {
      throw new Error(`Field "${resultField}" not found in the API response`);
    }

    // Return the field's value
    return this.returnResult(String(result));
  } catch (error) {
    // Handle any errors that occurred during the fetch
    console.error("Error fetching postcode data:", error.message);
    return this.returnResult(0.0);
  }
}
