// perygonLightTheme.ts
import { extendTheme } from "@chakra-ui/react";

import { baseTheme } from "../../base-theme/baseTheme";
import { colorPalette } from "./colorPalette";

export const Moonlight = extendTheme(baseTheme, {
  colors: {
    ...baseTheme.colors,
    primary: colorPalette.silver,
    secondary: colorPalette.darkSilver,
    primaryButton: colorPalette.seduloRed,
    elementBG: "rgb(48, 48, 48)",
    elementBG2: "rgb(78, 78, 78)",
    shadowColor: "red",
    primaryTextColor: "rgb(212, 212, 212)",
    secondaryTextColor: "rgb(230, 230, 230)",
    themeTextColor: "rgb(155, 155, 155)",

    tooltipHeaderTextColor: "white",
    tooltipHeaderBGColor: "primary",
    tooltipBodyTextColor: "white",
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

  shadows: {
    primaryShadow: "3px 3px 5px 3px rgb(128, 128, 128, 0.5)",
  },

  borders: {
    primaryBorder: "1px solid var(--chakra-colors-primary)",
  },
});
