import { SystemStyleObject } from "@chakra-ui/react";
import { keyframes } from "@emotion/react";
export function usePulseGlow({
  color = "rgba(255, 20, 147, 0.8)",
  duration = 4,
  delay = 0,
  minSpread = 5,
  maxSpread = 10,
}: {
  color?: string;
  duration?: number;
  delay?: number;
  minSpread?: number;
  maxSpread?: number;
} = {}): SystemStyleObject {
  /**
   * By adding extra steps (e.g. 6.25%, 12.5%, 18.75%, 25%, 31.25%, 37.5%, 43.75%, 50%, 56.25%, 62.5%, 68.75%, 75%, 81.25%, 87.5%, 93.75%) and using a slightly larger blur at 50%,
   * the glow transitions more gradually between states. This creates a smoother effect
   * than a direct 0% -> 50% -> 100%.
   */
  const pulseGlowKeyframes = keyframes`
    0% {
      box-shadow: 0 0 ${minSpread}px 2px ${color};
    }
    6.25% {
      box-shadow: 0 0 ${Math.round(minSpread + (maxSpread - minSpread) * 0.125)}px 2.25px ${color};
    }
    12.5% {
      box-shadow: 0 0 ${Math.round(minSpread + (maxSpread - minSpread) * 0.25)}px 2.5px ${color};
    }
    18.75% {
      box-shadow: 0 0 ${Math.round(minSpread + (maxSpread - minSpread) * 0.375)}px 2.75px ${color};
    }
    25% {
      box-shadow: 0 0 ${Math.round(maxSpread * 0.75)}px 3px ${color};
    }
    31.25% {
      box-shadow: 0 0 ${Math.round(minSpread + (maxSpread - minSpread) * 0.625)}px 3.5px ${color};
    }
    37.5% {
      box-shadow: 0 0 ${Math.round(minSpread + (maxSpread - minSpread) * 0.75)}px 4.5px ${color};
    }
    43.75% {
      box-shadow: 0 0 ${Math.round(minSpread + (maxSpread - minSpread) * 0.875)}px 5.25px ${color};
    }
    50% {
      box-shadow: 0 0 ${maxSpread}px 6px ${color};
    }
    56.25% {
      box-shadow: 0 0 ${Math.round(minSpread + (maxSpread - minSpread) * 0.875)}px 5.25px ${color};
    }
    62.5% {
      box-shadow: 0 0 ${Math.round(minSpread + (maxSpread - minSpread) * 0.75)}px 4.5px ${color};
    }
    68.75% {
      box-shadow: 0 0 ${Math.round(minSpread + (maxSpread - minSpread) * 0.625)}px 3.5px ${color};
    }
    75% {
      box-shadow: 0 0 ${Math.round(maxSpread * 0.75)}px 3px ${color};
    }
    81.25% {
      box-shadow: 0 0 ${Math.round(minSpread + (maxSpread - minSpread) * 0.375)}px 2.75px ${color};
    }
    87.5% {
      box-shadow: 0 0 ${Math.round(minSpread + (maxSpread - minSpread) * 0.25)}px 2.5px ${color};
    }
    93.75% {
      box-shadow: 0 0 ${Math.round(minSpread + (maxSpread - minSpread) * 0.125)}px 2.25px ${color};
    }
    100% {
      box-shadow: 0 0 ${minSpread}px 2px ${color};
    }
  `;

  return {
    animation: `${pulseGlowKeyframes} ${duration}s cubic-bezier(0.4, 0, 0.2, 1) infinite`,
    animationDelay: `${delay}s`,
  };
}
