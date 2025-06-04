import React, { useEffect, useRef, useState, useMemo } from "react";
import { Box, HStack, Text, theme, useTheme, VStack } from "@chakra-ui/react";
import { motion, AnimatePresence } from "framer-motion";

interface SpeechBubbleSVGProps {
  fill?: string;
}

const SpeechBubbleSVG: React.FC<SpeechBubbleSVGProps> = ({ fill = "#fff" }) => {
  const theme = useTheme();
  const dropShadow = `drop-shadow(${theme.shadows.primaryShadow})`;

  return (
    <svg
      style={{
        filter: `drop-shadow(10px 10px 15px var(--chakra-colors-primary))`,
      }}
      xmlns="http://www.w3.org/2000/svg"
      width="100%"
      height="100%"
      viewBox="0 0 1600 1600"
      preserveAspectRatio="xMidYMid meet"
    >
      <path
        d="M1460.77,1163.87c65.27-117.74,97.75-251.52,93.93-386.89-5.47-193.84-85.16-376.45-224.42-514.2C1191.04,125.03,1007.56,47.3,813.65,43.88c-4.54-.08-9.13-.12-13.64-.12C387.16,43.76,48.48,379.55,45.03,792.3c-3.4,406.91,324.37,748.33,730.65,761.08,8.14.26,16.25.38,24.33.38,99.52,0,196.22-19.06,287.42-56.66,26.56-10.95,54.8-16.5,83.94-16.5,20.68,0,41.36,2.85,61.45,8.46l240.63,67.19-39.28-244.89c-7.98-49.76,1.47-102.14,26.6-147.48Z"
        fill={fill}
      />
    </svg>
  );
};

interface SpeechBubbleProps {
  score: number;
  positiveChange?: boolean;
  fill?: string;
  textColor?: string;
  change: number;
}

const SpeechBubble: React.FC<SpeechBubbleProps> = ({
  score,
  positiveChange,
  change,
  fill,
  // textColor,
}) => {
  const theme = useTheme();
  const defaultTextColor = theme.colors.primary;
  // const finalTextColor = textColor || defaultTextColor;

  const containerRef = useRef<HTMLDivElement>(null);
  const [fontSize, setFontSize] = useState(12);

  useEffect(() => {
    const element = containerRef.current;
    if (!element) return;

    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const { width, height } = entry.contentRect;
        const newFontSize = Math.min(width / 2, height / 2);
        setFontSize(newFontSize);
      }
    });

    resizeObserver.observe(element);

    return () => {
      resizeObserver.unobserve(element);
    };
  }, []);

  const [wholePart, decimalPart] = useMemo(
    () => score.toFixed(2).split("."),
    [score]
  );

  // Resolve the text based on the score
  const getText = (score: number): string => {
    if (score === 0) return "No scores...";
    if (score >= 9) return "World Class!";
    if (score >= 7) return "Great!";
    if (score >= 5) return "Not Bad";
    if (score >= 3) return "Not Good";
    return "Needs Attention";
  };

  const resolvedText = useMemo(() => getText(score), [score]);

  return (
    <Box position="relative" width="100%" height="100%" maxHeight={600}>
      <SpeechBubbleSVG fill={fill ? fill : theme.colors.elementBG} />
      <Box
        ref={containerRef}
        position="absolute"
        top="50%"
        left="50%"
        transform="translate(-50%, -50%)"
        textAlign="center"
        width="80%"
        height="80%"
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
      >
        <HStack>
          <AnimatePresence mode="wait">
            <motion.div
              key={score}
              initial={{
                transform: "translateY(10%)",
                scale: 0.1,
                opacity: 0,
              }}
              animate={{ transform: "translateY(0%)", scale: 1, opacity: 1 }}
              exit={{ transform: "translateY(-100)", scale: 0.1, opacity: 0 }}
              transition={{ duration: 0.4 }}
            >
              <Text
                fontSize={`${fontSize}px`}
                fontWeight="bold"
                color={theme.colors.themeTextColor}
                lineHeight="1"
              >
                {wholePart}
              </Text>
            </motion.div>
          </AnimatePresence>
          <VStack>
            <motion.div
              key={`${score}-${decimalPart}`}
              initial={{ scale: 0.1, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.1, opacity: 0 }}
              transition={{ duration: 0.8 }}
            >
              <Text
                fontSize={`${fontSize * 0.4}px`}
                fontWeight="bold"
                color={theme.colors.themeTextColor}
                lineHeight="1"
                ml={1}
              >
                .{decimalPart}
              </Text>
            </motion.div>
            {change !== 0 && (
              <motion.div
                key={`change-${change}`}
                initial={{ transform: "translateX(40%)", opacity: 0 }}
                animate={{ transform: "translateX(0%)", opacity: 1 }}
                exit={{ transform: "translateX(-40%)", opacity: 0 }}
                transition={{ duration: 0.4 }}
              >
                <Text
                  fontSize={`${fontSize * 0.13}px`}
                  color={positiveChange ? "seduloGreen" : "seduloRed"}
                  mt={2}
                >
                  {positiveChange ? "\u25B2" : "\u25BC"}
                  {change.toFixed(2)}
                </Text>
              </motion.div>
            )}
          </VStack>
        </HStack>

        <motion.div
          key={resolvedText}
          initial={{ transform: "translateX(-20%)", scale: 0.3, opacity: 0 }}
          animate={{ transform: "translateX(0%)", scale: 1, opacity: 1 }}
          exit={{ transform: "translateX(20%)", scale: 0.3, opacity: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Text
            fontSize={`${fontSize * 0.3}px`}
            fontWeight="bold"
            color={theme.colors.themeTextColor}
            mt={3}
            fontFamily="Bonfire"
          >
            {resolvedText}
          </Text>
        </motion.div>
      </Box>
    </Box>
  );
};

export default SpeechBubble;
