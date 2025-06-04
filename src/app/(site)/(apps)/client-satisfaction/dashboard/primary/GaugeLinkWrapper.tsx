import { motion } from "framer-motion";
import Link from "next/link";
import { ReactNode, CSSProperties } from "react";

const MotionDiv = motion.div;

type GaugeLinkWrapperProps = {
  href: string;
  children: ReactNode;
  style?: CSSProperties;
  className?: string;
};

const GaugeLinkWrapper = ({ href, children, style, className }: GaugeLinkWrapperProps) => {
  return (
    <Link href={href} passHref legacyBehavior>
      <a style={{ display: "block", height: "100%", width: "100%" }}>
        <MotionDiv
          whileHover={{ scale: 0.98 }}
          transition={{ duration: 0.2 }}
          style={{
            height: "100%",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            cursor: "pointer",
            zIndex: 1,
            ...style,
          }}
          className={className}
        >
          {children}
        </MotionDiv>
      </a>
    </Link>
  );
};

export default GaugeLinkWrapper;
