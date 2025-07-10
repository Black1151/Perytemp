import React, { useMemo } from "react";
import {
  Box,
  chakra,
  shouldForwardProp,
  HTMLChakraProps,
} from "@chakra-ui/react";
import { motion } from "framer-motion";

// Chakra‑flavoured motion component that passes both Chakra and Framer props
const MotionSpan = motion(chakra.span, { forwardMotionProps: true });

interface EmojiEmitterProps extends HTMLChakraProps<"span"> {
  /** Element being wrapped by the emitter */
  children: React.ReactNode;
  /** Emojis to burst */
  emojis: string[];
  /** Emojis per burst */
  emojiCount?: number;
  /** Total animation lifetime (s) */
  duration?: number;
  /** How far beyond the component the emojis travel (px) */
  radius?: number;
  /** Font‑size for the emoji (px) */
  size?: number;
  /** Toggle to re‑fire the burst */
  show?: boolean;
}

/**
 * EmojiEmitter fires a shower of emoji "confetti" that *appears to pop from the
 * very edges of the wrapped component* rather than its centre. Emojis now
 * **fade in** during the first 20 % of the timeline, linger fully‑opaque, and
 * then fade out – so they no longer "blink" into view.
 */
const EmojiEmitter: React.FC<EmojiEmitterProps> = ({
  children,
  emojis,
  emojiCount = 40,
  duration = 1.8,
  radius = 300,
  size = 42,
  show = true,
  ...rest
}) => {
  // Build a fresh scatter whenever `show` flips so the burst is random each time.
  const particles = useMemo(() => {
    return Array.from({ length: emojiCount }, (_, i) => {
      const angle = Math.random() * Math.PI * 2; // direction in radians

      // End‑point distance: 70 – 100 % of `radius` so some pieces overshoot.
      const finalDistance = radius * (0.7 + Math.random() * 0.3);

      // Start‑point sits ~30 % of the way along that vector – roughly the edge.
      const startDistance = finalDistance * 0.3;

      // Extra downward drift ("gravity")
      const drop = radius * 0.3 * Math.random();

      const dx = Math.cos(angle);
      const dy = Math.sin(angle);

      return {
        id: i,
        emoji: emojis[Math.floor(Math.random() * emojis.length)],
        startX: dx * startDistance,
        startY: dy * startDistance,
        endX: dx * finalDistance,
        endY: dy * finalDistance + drop,
        rotate: (Math.random() - 0.5) * 720, // –360 → 360°
        scale: 0.5 + Math.random() * 0.7, // 0.5 → 1.2×
      } as const;
    });
  }, [emojiCount, radius, emojis, show]);

  // Ease arrays for opacity — 0 → 1 (20 %), hold (60 %), 1 → 0 (20 %).
  const opacityKeyframes = [0, 1, 1, 0];
  const opacityTimes = [0, 0.2, 0.8, 1];

  return (
    <Box position="relative" display="inline-block" {...rest}>
      {children}

      {show && (
        <Box position="absolute" inset="0" overflow="visible" pointerEvents="none">
          {particles.map((p) => (
            <MotionSpan
              key={p.id}
              position="absolute"
              left="50%"
              top="50%"
              fontSize={`${size}px`}
              userSelect="none"
              style={{ willChange: "transform", transform: "translate(-50%, -50%)" }}
              initial={{
                opacity: 0,
                x: p.startX,
                y: p.startY,
                scale: 0.8, // subtle pop‑zoom
                rotate: 0,
              }}
              animate={{
                opacity: opacityKeyframes,
                x: [p.startX, p.endX],
                y: [p.startY, p.endY],
                scale: p.scale,
                rotate: p.rotate,
              }}
              transition={{
                duration,
                ease: "easeOut",
                opacity: { duration },
                times: opacityTimes,
              }}
            >
              {p.emoji}
            </MotionSpan>
          ))}
        </Box>
      )}
    </Box>
  );
};

export default EmojiEmitter;