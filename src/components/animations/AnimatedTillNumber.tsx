"use client";

import React, { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HStack, Box, useTheme, Theme } from "@chakra-ui/react";
import { darken, lighten, rgba } from "polished";

// Use the original motion.div for animation to avoid prop type conflicts
const MotionDivRaw = motion.div;

interface AnimatedTillNumberProps {
  value: number;
  duration?: number;
  fontSize?: string | number;
  fontWeight?: string | number;
  color?: string | null;
  textDecoration?: string;
  isCurrency?: boolean;
  isDiscount?: boolean
}

export const AnimatedTillNumber: React.FC<AnimatedTillNumberProps> = ({
  value,
  duration = 0.05,
  fontSize = "2xl",
  fontWeight = "bold",
  color = null,
  textDecoration = "none",
  isCurrency = true,
  isDiscount = false
}) => {
  const prevValue = usePrevious(value) ?? value;

  // Coerce to a numeric JS type before calling toFixed
  const newNum =
    typeof value === "number" ? value : parseFloat(String(value)) || 0;
  const oldNum =
    typeof prevValue === "number"
      ? prevValue
      : parseFloat(String(prevValue)) || 0;

  // Format both old and new values
  const formattedNew = isCurrency ? newNum.toFixed(2) : String(value);
  const formattedOld = isCurrency ? oldNum.toFixed(2) : String(prevValue);

  const theme = useTheme();

  // Pad the shorter one so they're equal length
  const maxLen = Math.max(formattedNew.length, formattedOld.length);
  const newStr = formattedNew.padStart(maxLen, " ");
  const oldStr = formattedOld.padStart(maxLen, " ");

  const transition = {
    type: "spring",
    stiffness: 1000,
    damping: 100,
    mass: 0.5,
    duration,
  };

  const finalColor = theme.colors.primaryTextMode

  return (
    <HStack
      spacing={0}
      fontSize={fontSize}
      fontWeight={fontWeight}
      overflow="hidden"
      sx={{
        fontVariantNumeric: "tabular-nums",
        WebkitFontVariantNumeric: "tabular-nums",
      }}
      color={isDiscount?("green.500"):(finalColor)}
    >
      {newStr.split("").map((char, idx) => {
        // If it's the decimal point, render it statically
        if (char === ".") {
          return (
            <Box
              key={`dot-${idx}`}
              px="0.1ch"
              textAlign="center"
              lineHeight="1"
            >
              .
            </Box>
          );
        }

        const prevChar = oldStr[idx];
        const hasChanged = char !== prevChar;
        const directionUp = +char > +prevChar;

        return (
          <Box
            key={idx}
            position="relative"
            overflow="hidden"
            height="1em"
            width="1ch"
            px="0.1ch"
            textAlign="center"
            lineHeight="1"
            color={finalColor}
          >
            <AnimatePresence initial={false}>
              {hasChanged && (
                <MotionDivRaw
                  key={`old-${idx}-${prevValue}`}
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: finalColor,
                    textDecoration: textDecoration,
                  }}
                  initial={{ y: 0 }}
                  animate={{ y: directionUp ? "-100%" : "100%" }}
                  exit={{ y: directionUp ? "-100%" : "100%" }}
                  transition={transition}
                >
                  {prevChar}
                </MotionDivRaw>
              )}

              <MotionDivRaw
                key={`new-${idx}-${value}`}
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  willChange: "transform",
                  color: finalColor,
                  textDecoration: textDecoration,
                }}
                initial={{
                  y: hasChanged ? (directionUp ? "100%" : "-100%") : 0,
                }}
                animate={{ y: 0 }}
                transition={transition}
              >
                {char}
              </MotionDivRaw>
            </AnimatePresence>
          </Box>
        );
      })}
    </HStack>
  );
};

function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T>();
  useEffect(() => {
    ref.current = value;
  }, [value]);
  return ref.current;
}

export default AnimatedTillNumber;
