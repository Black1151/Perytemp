// Function to decode a single JSON object and return as a string
export const decodeJson = (props) => {
  if (!props[0]) {
    return "";
  } else {
    return JSON.stringify(props[0], null, 2);
  }
};
