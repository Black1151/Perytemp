import React, { useEffect, useState } from "react";
import { Box, BoxProps } from "@chakra-ui/react";
import { motion, AnimatePresence } from "framer-motion";

interface CounterProps extends BoxProps {
  value: number;
}

const Counter: React.FC<CounterProps> = ({ value, ...rest }) => {
  const [displayValue, setDisplayValue] = useState(value);
  const [previousValue, setPreviousValue] = useState(value);
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    if (hasMounted && value !== displayValue) {
      setPreviousValue(displayValue);
      setDisplayValue(value);
    }
  }, [value, displayValue, hasMounted]);

  return (
    <Box
      position="relative"
      display="flex"
      flexDirection="row"
      alignItems="center"
      justifyContent="center"
      fontSize="2xl"
      lineHeight="1"
      overflow="visible"
      height="2rem"
      whiteSpace="nowrap"
      {...rest}
    >
      <AnimatePresence initial={false}>
        <motion.div
          key={`previous-${previousValue}`}
          initial={{ opacity: 1, y: "0%", scale: 1 }}
          animate={{ opacity: 0, y: "110%", scale: 0 }}
          exit={{ opacity: 0, y: "110%", scale: 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          style={{
            position: "absolute",
            width: "100%",
            textAlign: "center",
          }}
        >
          {previousValue.toString()}
        </motion.div>

        <motion.div
          key={`current-${displayValue}`}
          initial={{ opacity: 0, y: "-110%", scale: 0 }}
          animate={{ opacity: 1, y: "0%", scale: 1 }}
          exit={{ opacity: 0, y: "110%", scale: 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          style={{
            position: "absolute",
            width: "100%",
            textAlign: "center",
          }}
        >
          {displayValue.toString()}
        </motion.div>
      </AnimatePresence>
    </Box>
  );
};

export default Counter;
