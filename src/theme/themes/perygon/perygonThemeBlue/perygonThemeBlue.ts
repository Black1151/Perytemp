// perygonDarkTheme.ts
import { extendTheme } from "@chakra-ui/react";
import { colorPalette } from "./colorPalette";
import { baseTheme } from "../../base-theme/baseTheme";

export const gradients = {
  ...baseTheme.gradients,
  primaryGradient: "linear(to-br, rgb(20, 26, 85) 60%, primary 100%)",
  secondaryGradient: `linear-gradient(to bottom right, rgb(0, 6, 125), rgb(60, 51, 232))`,
  secondaryGradientTransparent: `linear-gradient(to bottom right, rgba(0, 6, 125, 0.8), rgba(60, 51, 232,0.8))`,
};

export const perygonThemeBlue = extendTheme(baseTheme, {
  colors: {
    ...baseTheme.colors,
    primary: colorPalette.perygonBlue,
    secondary: colorPalette.perygonPurple,
    primaryButton: colorPalette.perygonPurple,
    elementBG: "rgb(255, 255, 255)",
    elementBG2: "rgb(191, 211, 255)",
    premium: colorPalette.premium,
    primaryTextColor: "rgb(0, 0, 0)",
    secondaryTextColor: "rgb(83, 83, 83)",
    themeTextColor: colorPalette.perygonBlue,
    bigUpElementBG: "rgb(16, 70, 231)",
  },

  components: {
    ...baseTheme.components,
    navBar: {
      baseStyle: {
        bgGradient: gradients.primaryGradient,
      },
    },
    footer: {
      baseStyle: {
        bgGradient: gradients.primaryGradient,
      },
    },
    perygonContainer: {
      baseStyle: {
        bgGradient: gradients.primaryGradient,
      },
    },
    ////// big up app styles
    bigUpStatsCard: {
      baseStyle: {
        elementBG: "bigUpElementBG",
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
        elementBG: "bigUpElementBG",
        primaryTextColor: "white",
        secondaryTextColor: "white",
      },
    },
    submitScoreModal: {
      baseStyle: {
        elementBG: "bigUpElementBG",
        primaryTextColor: "primaryTextColor",
        secondaryTextColor: "themeTextColor",
      },
    },
    Button: {
      variants: {
        primary: {
          mt: 5,
          w: "full",
          height: 12,
          backgroundColor: "secondary",
          color: "white",
          border: "1px solid",
          borderColor: "white",
          _hover: {
            color: "secondary",
            border: "1px solid",
            backgroundColor: "white",
            _disabled: {
              color: "white",
              border: "none",
              backgroundColor: "primary",
            },
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
