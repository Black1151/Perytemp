export const scrollBarThemes = {
  /* Apply scrollbar styles globally */
  ".ag-body-vertical-scroll": {
    width: "10px",
  },

  "::-webkit-scrollbar": {
    width: "10px",
    backgroundColor: "var(--chakra-colors-gray-200)",
  },
  "::-webkit-scrollbar-track": {
    WebkitBoxShadow: "inset 0 0 10px rgba(0, 0, 0, 0.3)",
    borderRadius: "10px",
    backgroundColor: "var(--chakra-colors-gray-200)",
  },
  "::-webkit-scrollbar-thumb": {
    borderRadius: "10px",
    WebkitBoxShadow: "inset 0 0 6px rgba(0, 0, 0, 0.3)",
    backgroundColor: "var(--chakra-colors-primary)",
  },
  "::-webkit-scrollbar-thumb:hover": {
    backgroundColor: "var(--chakra-colors-secondary)",
  },

  ".sv-scroll__scrollbar": {
    overflowY: "auto !important",
  },
};
