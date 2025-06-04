"use client";

import React, { useState, useEffect } from "react";
import { Box, Progress } from "@chakra-ui/react";
import { css, keyframes } from "@emotion/react";

const pulse = keyframes`
  0% { background-color: #ff6699; }
  50% { background-color: #ff3366; }
  100% { background-color: #ff6699; }
`;

const fade = keyframes`
  0% { opacity: 0; }
  100% { opacity: 1; }
`;

const flyIn = keyframes`
  0% { transform: translateY(300%); }
  50% { transform: translateY(300%); }
  100% { transform: translateY(0); }
`;

const LoadingBar = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prevProgress) => {
        if (prevProgress >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prevProgress + 1;
      });
    }, 30);
    return () => clearInterval(interval);
  }, []);

  return (
    <Box textAlign="center" px={6} animation={`${flyIn} 1s ease-in-out`}>
      <Box my={5} w="200px" borderRadius="2xl" overflow="hidden" h={2}>
        <Progress
          size="lg"
          value={progress}
          css={css`
            animation:
              ${fade} 1s ease-in-out,
              ${pulse} 1.5s infinite;
            & > div {
              background-color: #ff6699;
            }
          `}
        />
      </Box>
    </Box>
  );
};

export default LoadingBar;
