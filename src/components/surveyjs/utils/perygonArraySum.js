/**
 * Sends a request to the Perygon endpoint and processes the response.
 *
 *        - props[0]: The JSON field that belongs inside of a checkbox answer
 *        - props[1]: A key field within the JSON field and returns the number to the associated key in props[0]
 * @returns {number} The transformed data or an empty array in case of an error.
 * @param params
 */
export const perygonArraySum = (params) => {
  const jsonArray = params[0];
  const key = params[1];

  if (!jsonArray || !Array.isArray(jsonArray) || !key) return 0;

  try {
    let sum = 0;

    for (const item of jsonArray) {
      const parsed = typeof item === "string" ? JSON.parse(item) : item;
      const value = parseInt(parsed[key], 10);

      if (!isNaN(value)) {
        sum += value;
      }
    }

    return sum;
  } catch (error) {
    console.warn("perygonArraySum failed: ", error);
    return 0;
  }
};
