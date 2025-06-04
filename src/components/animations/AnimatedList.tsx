import React from "react";
import { AnimatePresence, motion, Variants } from "framer-motion";

const baseDelay = 0.1;
const delayIncrement = 0.05;

interface AnimationCustom {
  index: number;
  delay: number;
}

const itemVariants: Variants = {
  hidden: {
    opacity: 0,
    x: -50,
  },

  visible: (custom?: AnimationCustom) => {
    const { index = 0, delay = 0 } = custom || {};
    return {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.3,
        delay: delay + baseDelay + index * delayIncrement,
      },
    };
  },

  exit: {
    opacity: 0,
    x: -50,
    transition: { duration: 0.3 },
  },
};

interface AnimatedListItemProps {
  index: number;
  children: React.ReactNode;
  delay?: number; // optional
}

export const AnimatedListItem: React.FC<AnimatedListItemProps> = ({
  index,
  children,
  delay = 0,
}) => {
  return (
    <motion.div
      variants={itemVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      custom={{ index, delay }}
      style={{ width: "100%" }}
    >
      {children}
    </motion.div>
  );
};

interface AnimatedListProps {
  children: React.ReactNode;
}

export const AnimatedList: React.FC<AnimatedListProps> = ({ children }) => {
  return <AnimatePresence>{children}</AnimatePresence>;
};
