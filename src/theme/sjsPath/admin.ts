export const baseSurveyCssVariablesTheme = {
  // Padding and Corners
  "--sjs-base-unit": "8px",
  "--sjs-corner-radius": "8px",

  // Font Family
  "--sjs-font-family": "Metropolis",
  "--sjs-font-questiontitle-family": "Metropolis",
  "--sjs-default-font-family": "Metropolis",
  "--font-family": "Metropolis",

  // Panels
  "--sjs-questionpanel-cornerRadius": "12px",

  // Question Titles
  "--sjs-font-questiontitle-weight": "500",
  "--sjs-font-questiontitle-size": "14px",

  // Question Description
  "--sjs-font-questiondescription-size": "10px",

  // Header
  "--sjs-header-backcolor": "transparent",

  // Header Title
  "--sjs-font-headertitle-size": "20px",

  // Header description
  "--sjs-font-headerdescription-size": "10px",
  "--sjs-font-headerdescription-weight": "600",

  // Editor Panel - This looks like the background of a field
  "--sjs-editorpanel-cornerRadius": "0px", // Corner radius of the input fields

  // Font Editor
  "--sjs-font-editorfont-size": "14px",

  // Article Font ??
  "--sjs-article-font-xx-large-textDecoration": "none",
  "--sjs-article-font-xx-large-fontWeight": "700",
  "--sjs-article-font-xx-large-fontStyle": "normal",
  "--sjs-article-font-xx-large-fontStretch": "normal",
  "--sjs-article-font-xx-large-letterSpacing": "0",
  "--sjs-article-font-xx-large-lineHeight": "64px",
  "--sjs-article-font-xx-large-paragraphIndent": "0px",
  "--sjs-article-font-xx-large-textCase": "none",
  "--sjs-article-font-x-large-textDecoration": "none",
  "--sjs-article-font-x-large-fontWeight": "700",
  "--sjs-article-font-x-large-fontStyle": "normal",
  "--sjs-article-font-x-large-fontStretch": "normal",
  "--sjs-article-font-x-large-letterSpacing": "0",
  "--sjs-article-font-x-large-lineHeight": "56px",
  "--sjs-article-font-x-large-paragraphIndent": "0px",
  "--sjs-article-font-x-large-textCase": "none",
  "--sjs-article-font-large-textDecoration": "none",
  "--sjs-article-font-large-fontWeight": "700",
  "--sjs-article-font-large-fontStyle": "normal",
  "--sjs-article-font-large-fontStretch": "normal",
  "--sjs-article-font-large-letterSpacing": "0",
  "--sjs-article-font-large-lineHeight": "40px",
  "--sjs-article-font-large-paragraphIndent": "0px",
  "--sjs-article-font-large-textCase": "none",
  "--sjs-article-font-medium-textDecoration": "none",
  "--sjs-article-font-medium-fontWeight": "700",
  "--sjs-article-font-medium-fontStyle": "normal",
  "--sjs-article-font-medium-fontStretch": "normal",
  "--sjs-article-font-medium-letterSpacing": "0",
  "--sjs-article-font-medium-lineHeight": "32px",
  "--sjs-article-font-medium-paragraphIndent": "0px",
  "--sjs-article-font-medium-textCase": "none",
  "--sjs-article-font-default-textDecoration": "none",
  "--sjs-article-font-default-fontWeight": "400",
  "--sjs-article-font-default-fontStyle": "normal",
  "--sjs-article-font-default-fontStretch": "normal",
  "--sjs-article-font-default-letterSpacing": "0",
  "--sjs-article-font-default-lineHeight": "28px",
  "--sjs-article-font-default-paragraphIndent": "0px",
  "--sjs-article-font-default-textCase": "none",
  "--sjs-article-font-xx-large-fontSize": "64px",
  "--sjs-article-font-x-large-fontSize": "48px",
  "--sjs-article-font-large-fontSize": "32px",
  "--sjs-article-font-medium-fontSize": "24px",
  "--sjs-article-font-default-fontSize": "16px",
};

export const themeJson = {
  isPanelless: true,
  cssVariables: {
    ...baseSurveyCssVariablesTheme,
    // Background of SurveyJS colors
    "--sjs-general-backcolor": "#E5E5E500", // Unsure what this one is doing
    "--sjs-general-backcolor-dark": "#FFFFFF00", // Unsure what this one is doing
    "--sjs-general-backcolor-dim": "var(--chakra-colors-elementBG)", // Background of SurveyJS if no image / Also used for background of the dropdown selections
    "--sjs-general-backcolor-dim-light": "#FFFFFF00", // Unsure what this one is doing
    "--sjs-general-backcolor-dim-dark": "#FFFFFF00", // Unsure what this one is doing

    // Unsure for this Forecolor
    "--sjs-general-forecolor": "#000000",
    "--sjs-general-forecolor-light": "#000000",
    "--sjs-general-dim-forecolor": "#000000",
    "--sjs-general-dim-forecolor-light": "#000000",

    // Primary Backcolour
    "--sjs-primary-backcolor": "var(--chakra-colors-primary)", // Main Accent Colour of things
    "--sjs-primary-backcolor-light": "#3182CE1A",
    "--sjs-primary-backcolor-dark": "#3182CE1A",
    "--sjs-primary-forecolor": "#E5E5E5",
    "--sjs-primary-forecolor-light": "rgba(255, 255, 255, 0.25)",

    // Secondary Backcolour
    "--sjs-secondary-backcolor": "#E5E5E5",
    "--sjs-secondary-backcolor-light": "rgba(45, 55, 72, 0.1)",
    "--sjs-secondary-backcolor-semi-light": "rgba(45, 55, 72, 0.25)",
    "--sjs-secondary-forecolor": "#FFFFFF",
    "--sjs-secondary-forecolor-light": "rgba(255, 255, 255, 0.25)",

    // Shadows
    "--sjs-shadow-small": "0px 0px 0px 0px rgba(0, 0, 0, 0.35)",
    "--sjs-shadow-small-reset": "0px 0px 0px 0px rgba(0, 0, 0, 0.35)",
    "--sjs-shadow-medium": "0px 2px 6px 0px rgba(0, 0, 0, 0.2)",
    "--sjs-shadow-large": "0px 8px 16px 0px rgba(0, 0, 0, 0.2)",
    "--sjs-shadow-inner": "0px 1px 0px 0px var(--chakra-colors-gray-400)",
    "--sjs-shadow-inner-reset": "0 1px 0 0 var(--sjs-primary-backcolor)",

    // Borders
    "--sjs-border-default": "#B6203B00",
    "--sjs-border-light": "#B6203B00",
    "--sjs-border-inside": "#B6203B00",

    //
    "--sjs-question-background": "#a2ffc6", // Unsure what this one does

    // Page Title
    "--sjs-font-pagetitle-color": "var(--chakra-colors-primary)",

    // Panels
    "--sjs-questionpanel-backcolor": "#FFFFFF",
    "--sjs-questionpanel-hovercolor": "rgba(235, 235, 235, 0.50)",

    // Question Description
    "--sjs-font-questiondescription-color": "var(--chakra-colors-primary)",

    // Header Title
    "--sjs-font-headertitle-color": "rgba(255, 255, 255, 1)",

    // Header description
    "--sjs-font-headerdescription-color": "rgba(255, 255, 255, 1)",

    // Editor Panel - This looks like the background of a field
    "--sjs-editor-background": "rgba(255,255,255,0)", // Background of the question input field
    "--sjs-editorpanel-backcolor": "rgba(255, 255, 255, 0)", // Background of the question input field
    "--sjs-editorpanel-hovercolor": "#E5E5E5", // Hover over boolean switch

    // Font Editor
    "--sjs-font-editorfont-color": "var(--chakra-colors-primaryTextColor)",
    "--sjs-font-questiontitle-color": "var(--chakra-colors-primaryTextColor)",
    // "--sjs-font-editorfont-placeholdercolor": "#191919cc",
    "--sjs-font-editorfont-placeholdercolor":
      "var(--chakra-colors-primaryTextColor)",

    // Special colours
    // Red
    "--sjs-special-red": "#E53E3E",
    "--sjs-special-red-light": "rgba(229, 62, 62, 0.1)",
    "--sjs-special-red-forecolor": "#FFFFFF",

    // Green
    "--sjs-special-green": "#38A169",
    "--sjs-special-green-light": "rgba(56, 161, 105, 0.1)",
    "--sjs-special-green-forecolor": "#FFFFFF",

    // Blue
    "--sjs-special-blue": "#3182CE",
    "--sjs-special-blue-light": "rgba(49, 130, 206, 0.1)",
    "--sjs-special-blue-forecolor": "#FFFFFF",

    // Yellow
    "--sjs-special-yellow": "#ECC94B",
    "--sjs-special-yellow-light": "rgba(236, 201, 75, 0.1)",
    "--sjs-special-yellow-forecolor": "#FFFFFF",
  },
};
