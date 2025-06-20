// baseTheme.ts
import {
  background,
  extendTheme,
  Tabs,
  type ThemeConfig,
} from "@chakra-ui/react";

import { scrollBarThemes } from "@/theme/scrollBarThemes";
import { agChartStyles } from "@/theme/agChartStyles";
import { agGridStyles } from "../../agGridStyles";

const config: ThemeConfig = {
  initialColorMode: "light",
  useSystemColorMode: false,
};

const gradients = {
  primaryGradient: "linear(to-br, secondary 60%, primary 100%)",
  secondaryGradient: `linear-gradient(to bottom right, rgba(255, 0, 0, 0.6), rgba(255, 192, 203, 0.6))`,
  secondaryGradientTransparent: `linear-gradient(to bottom right, rgba(255, 0, 0, 0.3), rgba(255, 192, 203, 0.3))`,
  modalBGGradient: "linear(to-br, secondary 60%, primary 100%)",
};

export const baseTheme = extendTheme({
  config,
  colors: {
    primary: "blue",
    secondary: "#fff",
    elementBG: "white",
    primaryButton: "#fff",
    seduloRed: "#B4213D",
    yellow: "#EFC718",
    lightGreen: "#92C01F",
    seduloGreen: "#008000",
    darkGray: "#4A4A4A",
    darkElementBG: "rgb(41, 41, 41, 0.85)",
    primaryTextColor: "rgb(0, 0, 0)",
    secondaryTextColor: "rgb(83, 83, 83)",
    themeTextColor: "rgba(201, 9, 9, 0.85)",
    iconColor: "white",
    adminBannerColor: "white",
    // tooltips
    tooltipHeaderTextColor: "white",
    tooltipHeaderBGColor: "primary",
    tooltipBodyTextColor: "primaryTextColor",
    // tooltipBodyBGColor: "white",

    hospitalityHubPremium: "rgb(238, 228, 88)",

    happinessScale: {
      1: "#b22200",
      2: "#e92300",
      3: "#e74e1c",
      4: "#e74e1c",
      5: "#f8b133",
      6: "#fbd238",
      7: "#aeea92",
      8: "#83e05c",
      9: "#00bf00",
      10: "#00bf00",
    },
  },

  fringeCases: {
    dashboardHeader: {
      textcolor: "white",
    },
    happinessScoreForm: {
      textColor: "white",
    },
  },

  fonts: {
    heading: "Metropolis, sans-serif",
    body: "Metropolis, sans-serif",
    metropolis: "Metropolis, sans-serif",
    bonfire: "Bonfire, sans-serif",
  },

  styles: {
    global: (_props: { colorMode: "light" | "dark" }) => ({
      ...agGridStyles,
      ...scrollBarThemes,
      ...agChartStyles,
      "html, body": {
        backgroundColor: "#ffffff",
        color: "#000000",
      },
    }),
  },

  components: {
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
    companySignUpCard: {
      baseStyle: {
        cardPanel: "darkElementBG",
      },
    },

    //// big up app styles
    bigUpStatsCard: {
      baseStyle: {
        elementBG: "elementBG",
        primaryTextColor: "primaryTextColor",
        secondaryTextColor: "themeTextColor",
      },
    },
    recognitionHeader: {
      baseStyle: {
        textcolor: "primaryTextColor",
      },
    },
    masonryCardItem: {
      baseStyle: {
        elementBG: "elementBG",
        primaryTextColor: "primaryTextColor",
        secondaryTextColor: "themeTextColor",
      },
    },
    submitScoreModal: {
      baseStyle: {
        elementBG: "elementBG",
        primaryTextColor: "primaryTextColor",
        secondaryTextColor: "themeTextColor",
      },
    },
    dataGridComponentLight: {
      baseStyle: {
        alternateRowBG: "elementBG2",
        alternateRowTextColor: "primaryTextColor",
      },
    },

    Button: {
      variants: {
        workflowStart: {
          height: 12,
          backgroundColor: "green.500",
          color: "white",
          _hover: {
            color: "green",
            border: "1px solid",
            borderColor: "primary",
            backgroundColor: "white",
          },
          _disabled: {
            backgroundColor: "gray.100",
            color: "gray",
            cursor: "not-allowed",
            opacity: 0.6,
          },
        },
        primary: {
          w: "full",
          height: 12,
          backgroundColor: "primary",
          color: "white",
          _hover: {
            color: "primary",
            border: "1px solid",
            borderColor: "primary",
            backgroundColor: "white",
          },
          _disabled: {
            backgroundColor: "white",
            color: "primary",
            cursor: "not-allowed",
            opacity: 0.6,
          },
        },

        solid: {
          backgroundColor: "primary",
          color: "primaryTextColor",
          border: "1px solid",
          borderColor: "secondary",
          _hover: {
            backgroundColor: "elementBG",
            color: "primary",
            borderColor: "primary",
          },
        },

        hospitalityHub: {
          bg: "hospitalityHubPremium",
          color: "black",
          _hover: {
            backgroundColor: "white",
            color: "primary",
          },
        },

        agPrimary: {
          bg: "transparent",
          color: "white",
          border: "1px solid rgba(255, 255, 255, 0.2)",
          _hover: {
            color: "primary",
            bg: "white",
            boxShadow: "md",
            _disabled: {
              color: "white",
              bg: "transparent",
              boxShadow: "none",
            },
          },
          _focus: {
            boxShadow: "outline",
          },
        },

        agPrimaryLight: {
          bg: "transparent",
          color: "primary",
          border: "1px solid var(--chakra-colors-primary)",
          _hover: {
            color: "white",
            bg: "primary",
            boxShadow: "md",
            _disabled: {
              color: "white",
              bg: "transparent",
              boxShadow: "none",
            },
          },
          _focus: {
            boxShadow: "outline",
          },
        },

        darkGray: {
          bgColor: "darkGray",
          border: "1px solid",
          borderColor: "darkGray",
          color: "white",
          _hover: {
            color: "darkGray",
            backgroundColor: "white",
            _disabled: {
              color: "white",
              backgroundColor: "darkGray",
            },
          },
        },

        green: {
          bgColor: "seduloGreen",
          border: "1px solid",
          borderColor: "seduloGreen",
          color: "white",
          _hover: {
            color: "green",
            backgroundColor: "white",
            _disabled: {
              color: "white",
              backgroundColor: "seduloGreen",
            },
          },
        },

        red: {
          bgColor: "seduloRed",
          border: "1px solid",
          borderColor: "seduloRed",
          color: "white",
          _hover: {
            color: "seduloRed",
            backgroundColor: "white",
            _disabled: {
              color: "white",
              backgroundColor: "seduloRed",
            },
          },
        },
      },
    },

    Switch: {
      variants: {
        primary: {
          track: {
            _checked: {
              bg: "lightGreen",
            },
            bg: "#ccc",
          },
          thumb: {
            bg: "white",
          },
        },
      },
    },

    Tabs: {
      variants: {
        line: {
          tab: {
            color: "primaryTextColor",
            fontSize: "16px",
            fontWeight: "bold",
            _selected: {
              color: "primary",
              borderBottomColor: "primary",
            },
          },
          tablist: {
            backgroundColor: "elementBG",
            borderBottomColor: "rgba(255, 255, 255, 0.80)",
          },
        },
      },
    },
  },

  gradients,

  // shadows: {
  //   primaryShadow: "0 0 10px 2px var(--chakra-colors-primary)",
  // },
});
