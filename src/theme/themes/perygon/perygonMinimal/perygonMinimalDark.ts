import { extendTheme } from "@chakra-ui/react";

import { baseTheme } from "../../base-theme/baseTheme";
import { colorPalette } from "./colorPalette";

export const MinimalDark = extendTheme(baseTheme, {
  colors: {
    ...baseTheme.colors,
    primary: colorPalette.silver,
    secondary: "black",
    primaryButton: colorPalette.seduloRed,
    elementBG: "rgb(48, 48, 48)",
    elementBG2: "rgb(78, 78, 78)",
    shadowColor: "red",
    premium: colorPalette.premium,
    primaryTextColor: "rgb(255, 255, 255)",
    secondaryTextColor: "rgb(255, 255, 255)",
    themeTextColor: "rgb(255, 255, 255)",

    tooltipHeaderTextColor: "white",
    tooltipHeaderBGColor: "primary",
    tooltipBodyTextColor: "white",
  },

  gradients: {
    ...baseTheme.gradients,
    primaryGradient: "linear(to-br, secondary 20%, secondary 100%)",
    secondaryGradient: `linear-gradient(to bottom right, rgba(255, 0, 0, 0.6), rgba(255, 192, 203, 0.6))`,
    secondaryGradientTransparent: `linear-gradient(to bottom right, rgba(255, 0, 0, 0.3), rgba(255, 192, 203, 0.3))`,
  },

  components: {
    ...baseTheme.components,
  },

  borders: {
    primaryBorder: "1px solid var(--chakra-colors-primary)",
  },
});
