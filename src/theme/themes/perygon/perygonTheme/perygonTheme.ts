// perygonLightTheme.ts
import { extendTheme } from "@chakra-ui/react";

import { colorPalette } from "./colorPalette";
import { baseTheme } from "../../base-theme/baseTheme";

export const perygonTheme = extendTheme(baseTheme, {
  colors: {
    ...baseTheme.colors,
    primary: colorPalette.perygonPink,
    secondary: colorPalette.seduloRed,
    primaryButton: colorPalette.seduloRed,
    elementBG: "white",
    elementBG2: "rgb(255, 223, 251)",
    elementBGTransparent: "rgb(255, 223, 251, 0.3)",
    shadowColor: "red",
    premium: colorPalette.premium,
    primaryTextColor: "rgb(0, 0, 0)",
    secondaryTextColor: "rgb(83, 83, 83)",
    themeTextColor: colorPalette.perygonPink,
    bigUpElementBG: "rgb(255, 10, 116)",
  },

  gradients: {
    ...baseTheme.gradients,
    primaryGradient: "linear(to-br, secondary 60%, primary 100%)",
    secondaryGradient: `linear-gradient(to bottom right, rgba(255, 0, 0, 0.6), rgba(255, 192, 203, 0.6))`,
    secondaryGradientTransparent: `linear-gradient(to bottom right, rgba(202, 5, 5, 0.8), rgba(192, 119, 131, 0.8))`,
  },

  components: {
    ...baseTheme.components,
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
  },

  borders: {
    primaryBorder: "1px solid var(--chakra-colors-primary)",
  },

  shadows: {
    primaryShadow: "1px 2px 5px 1px rgba(68, 68, 68, 0.5)",
  },
});
