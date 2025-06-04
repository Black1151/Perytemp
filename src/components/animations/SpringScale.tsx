// ScaleInView.tsx
import { ReactNode } from "react";
import { motion } from "framer-motion";

interface SpringScaleProps {
  children: ReactNode;
  delay?: number;
  style?: any;
}

export const SpringScale = ({
  children,
  delay = 0,
  style,
  ...rest
}: SpringScaleProps) => {
  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ type: "spring", stiffness: 95, damping: 12, delay }}
      {...rest}
      style={style}
    >
      {children}
    </motion.div>
  );
};
