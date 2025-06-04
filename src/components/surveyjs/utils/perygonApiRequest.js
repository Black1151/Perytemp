/**
 * Sends a request to the Perygon endpoint and processes the response.
 *
 *        - props[0]: API endpoint resource, used to determine the correct endpoint for data population.
 *        - props[1]: Filter query, appended to the end of the API call.
 *        - props[2]: Optional field mapping string, allows renaming fields from the API to more meaningful names in SurveyJS.
 * @returns {Promise<*>} The transformed data or an empty array in case of an error.
 * @param params
 */
export async function perygonApiRequest(params) {
  const endpoint = params[0];
  const query = params[1];
  const mappings = params[2];

  // Early return for invalid input
  if (!endpoint || query == null) {
    return 0;
  }

  try {
    // Construct the URL using the base URL and props
    const url = `/api/surveyjs/forms${endpoint}?${query}`;

    // Make the GET request
    const response = await fetch(url);

    let data = await response.json();

    // Apply key mappings if provided
    if (mappings) {
      data = applyKeyMappings(data, mappings);
    }
    // Return the function result via the callback
    return this.returnResult(data);
  } catch (error) {
    return this.returnResult([]);
  }
}

/**
 * Applies key mappings to each object in the data array.
 *
 * @param {Array} data - Array of objects to transform.
 * @param {String} mappingString - Mapping string in the format "originalKey:newKey|originalKey2:newKey2".
 * @returns {Array} The transformed data array with keys replaced.
 */
function applyKeyMappings(data, mappingString) {
  const mappings = mappingString
    .split("|")
    .map((mapping) => mapping.split(":").map((str) => str.trim()));

  return data.map((item) => {
    const newItem = {};
    for (const key in item) {
      const newKey =
        mappings.find(([originalKey]) => originalKey === key)?.[1] || key;
      newItem[newKey] = item[key];
    }
    return newItem;
  });
}
