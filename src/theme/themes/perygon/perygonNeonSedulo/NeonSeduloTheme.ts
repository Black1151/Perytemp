// perygonLightTheme.ts
import { extendTheme } from "@chakra-ui/react";

import { baseTheme } from "../../base-theme/baseTheme";
import { colorPalette } from "./colorPalette";

export const NeonSedulo = extendTheme(baseTheme, {
  colors: {
    ...baseTheme.colors,
    primary: colorPalette.perygonDarkside,
    secondary: colorPalette.perygonBlack,
    primaryButton: colorPalette.seduloRed,
    elementBG: "rgb(46, 46, 46)",
    elementBG2: "rgb(90, 11, 11)",
    shadowColor: "red",
    premium: colorPalette.premium,
    primaryTextColor: "rgb(165, 165, 165)",
    secondaryTextColor: "rgb(145, 145, 145)",
    themeTextColor: "rgba(255, 0, 0, 0.85)",

    tooltipBodyTextColor: "rgb(165, 165, 165)",
  },

  gradients: {
    ...baseTheme.gradients,
    primaryGradient: "linear(to-br, secondary 20%, primary 100%)",
    secondaryGradient: `linear-gradient(to bottom right, rgba(255, 0, 0, 0.6), rgba(255, 192, 203, 0.6))`,
    secondaryGradientTransparent: `linear-gradient(to bottom right, rgba(255, 0, 0, 0.3), rgba(255, 192, 203, 0.3))`,
  },

  components: {
    ...baseTheme.components,
  },

  borders: {
    primaryBorder: "3px solid rgba(192, 65, 65, 0.6)",
  },

  shadows: {
    primaryShadow: "3px 3px 15px 3px var(--chakra-colors-primary)",
  },
});
