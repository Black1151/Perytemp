import React from "react";
import { Button, Spinner, useTheme, Theme } from "@chakra-ui/react";
import { darken, lighten, rgba } from "polished";

interface RaisedButtonProps {
  handleIncrease: () => void;
  increaseLoading: boolean;
  decreaseLoading: boolean;
  text: string
  color: "green" | "red"
}

export const RaisedButton: React.FC<RaisedButtonProps> = ({
  handleIncrease,
  increaseLoading,
  decreaseLoading,
  text,
  color
}): JSX.Element => {
  // 1. Grab the “fill” color from the Chakra theme.
  //    We assert that theme.colors.green[100] is a string.
  const theme = useTheme<Theme>();
  let fill
  if (color == "green" ) {
   fill = theme.colors.green?.[100] as string;
  } else {
     fill = theme.colors.red?.[100] as string;
  }

  const outerStroke = darken(0.01, fill);

  const dropShadowColor = rgba(fill, 0.2);

  const innerShadowColor = lighten(0.8, fill);

  const gradient = `linear-gradient(
    to bottom,
    ${lighten(0.07, fill)},
    ${lighten(0.04, fill)},
    ${lighten(0.02, fill)},
    ${lighten(0.00, fill)},
    ${darken(0.12, fill)}
  )`;

  return (
    <Button
      variant="outline"
      size="lg"
      h="auto"
      maxH="80px"
      onClick={handleIncrease}
      isLoading={increaseLoading}
      disabled={increaseLoading || decreaseLoading}
      spinner={<Spinner thickness="2px" speed="0.65s" size="sm" />}
      // -------------------------
      // “Raised” styles:
      bg={gradient}
      border="1px solid"
      borderColor={outerStroke}
      boxShadow={
        // (a) drop shadow, (b) inset shadow
        `0px 2px 4px ${dropShadowColor}, inset 0px 1px 2px ${innerShadowColor}`
      }
      _hover={{
        borderColor: darken(0.05, fill),
        boxShadow: `
          0px 4px 6px ${rgba(fill, 0.25)},       /* deeper drop shadow */
          inset 0px 1px 2px ${lighten(0.1, fill)} /* same inset */
        `,
        transform: "translateY(1px)",
      }}
      _active={{
        boxShadow: `
          0px 1px 2px ${rgba(fill, 0.15)},       /* smaller drop shadow */
          inset 0px 1px 2px ${lighten(0.1, fill)} /* same inset */
        `,
        transform: "translateY(1px)",
      }}
    >
      {text}
    </Button>
  );
};
