// perygonDarkTheme.ts
import { extendTheme } from "@chakra-ui/react";
import { baseTheme } from "../../base-theme/baseTheme";

const colorPalette = {
  dmrPrimary: "hsla(205, 31%, 26%, 1)",
  dmrSecondary: "hsla( 72, 98%, 64%, 1)",
};

const gradients = {
  primaryGradient: `linear-gradient(to bottom right, ${colorPalette.dmrPrimary}, ${colorPalette.dmrPrimary})`,
  secondaryGradient: `linear-gradient(to bottom right, ${colorPalette.dmrPrimary}, ${colorPalette.dmrPrimary})`,
  secondaryGradientTransparent: `linear-gradient(to bottom right, hsla(205, 31%, 26%, 0.7) 50%, hsla( 72, 98%, 64%, 0.7) 100%)`,
  modalBGGradient: `linear-gradient(to bottom right, ${colorPalette.dmrPrimary}, ${colorPalette.dmrPrimary})`,
};

export const dmrDefaultTheme = extendTheme(baseTheme, {
  colors: {
    ...baseTheme.colors,
    primary: colorPalette.dmrPrimary,
    secondary: colorPalette.dmrSecondary,
    primaryButton: colorPalette.dmrSecondary,
    elementBG: "rgb(255, 255, 255)",
    elementBG2: "hsla( 72, 98%, 64%, 1)",
    primaryTextColor: "rgb(0, 0, 0)",
    secondaryTextColor: "rgb(83, 83, 83)",
    themeTextColor: colorPalette.dmrPrimary,

    tooltipHeaderTextColor: "white",
    tooltipHeaderBGColor: "black",
    tooltipBodyTextColor: "black",
  },
  gradients: gradients,

  fringeCases: {
    recognitionCard: {
      elementBG: "primary",
      textColor: "white",
      primaryTextColor: "white",
      secondaryTextColor: colorPalette.dmrSecondary,
    },
    dashboardHeader: {
      color: "white",
    },
  },

  components: {
    ...baseTheme.components,
    //// layout styles
    navBar: {
      baseStyle: {
        bgGradient: `linear-gradient(to bottom right, primary, primary)`,
      },
    },
    footer: {
      baseStyle: {
        bgGradient: `linear-gradient(to bottom right, primary, primary)`,
      },
    },
    perygonContainer: {
      baseStyle: {
        bgGradient: `linear-gradient(to bottom right, primary, primary)`,
      },
    },
    ////// big up app styles
    bigUpStatsCard: {
      baseStyle: {
        elementBG: "primary",
        primaryTextColor: "white",
        secondaryTextColor: "white",
      },
    },
    recognitionHeader: {
      baseStyle: {
        textcolor: "white",
      },
    },
    masonryCardItem: {
      baseStyle: {
        elementBG: "primary",
        primaryTextColor: "white",
        secondaryTextColor: "secondary",
      },
    },
    submitScoreModal: {
      baseStyle: {
        elementBG: "primary",
        primaryTextColor: "primaryTextColor",
        secondaryTextColor: "themeTextColor",
      },
    },

    Button: {
      variants: {
        primary: {
          height: 12,
          backgroundColor: "secondary",
          color: "primary",
          border: "1px solid",
          borderColor: "secondary",
          _hover: {
            border: "1px solid",
            backgroundColor: "white",
          },
          _disabled: {
            color: "white",
            border: "none",
            backgroundColor: "primary",
          },
        },
        solid: {
          backgroundColor: "secondary",
          color: "primary",
          border: "1px solid",
          borderColor: "secondary",
          _hover: {
            backgroundColor: "elementBG",
            color: "primary",
            borderColor: "primary",
          },
        },
      },
    },
  },

  borders: {
    primaryBorder: "1px solid var(--chakra-colors-primary)",
  },

  shadows: {
    primaryShadow: "1px 2px 5px 1px rgba(68, 68, 68, 0.5)",
  },
});
