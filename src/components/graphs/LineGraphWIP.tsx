import React, { useEffect, useRef } from "react";
import { Box, Text, useBreakpointValue } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { perygonTheme } from "@/theme/themes/perygon/perygonTheme/perygonTheme";
import { YAxis } from "./BarGraph";

interface DataPoint {
  value: number;
  title: string;
}

interface LineGraphProps {
  DataPoints: DataPoint[];
}

const LineGraph: React.FC<LineGraphProps> = ({ DataPoints = [] }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = React.useState(0);

  useEffect(() => {
    if (containerRef.current) {
      setContainerWidth(containerRef.current.offsetWidth);
    }

    const handleResize = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const maxValue = Math.max(...DataPoints.map((point) => point.value), 0);

  // Responsive paddings and sizes
  const leftPadding = useBreakpointValue({ base: 20, md: 40 }) ?? 40;
  const rightPadding = useBreakpointValue({ base: 20, md: 40 }) ?? 40;
  const topPadding = useBreakpointValue({ base: 10, md: 20 }) ?? 20;
  const bottomPadding = useBreakpointValue({ base: 20, md: 40 }) ?? 40;
  const xAxisPadding = useBreakpointValue({ base: 20, md: 50 }) ?? 50;
  const imageSize = useBreakpointValue({ base: 20, md: 30 }) ?? 30;
  const strokeWidth = useBreakpointValue({ base: 2, md: 3 }) ?? 3;
  const fontSize = useBreakpointValue({ base: "xs", md: "sm" });

  const graphWidth =
    containerWidth - leftPadding - rightPadding - 2 * xAxisPadding;
  const graphHeight = useBreakpointValue({ base: 200, md: 300 }) ?? 300;
  const totalHeight = graphHeight + topPadding + bottomPadding;

  const yAxisTicks = Array.from({ length: maxValue + 1 }, (_, i) => i);

  const mapIndexToX = (index: number) => {
    return (
      leftPadding +
      xAxisPadding +
      (index * graphWidth) / (DataPoints.length - 1)
    );
  };

  const mapValueToY = (value: number) => {
    return topPadding + ((maxValue - value) / maxValue) * graphHeight;
  };

  const getFaceImage = (value: number) => {
    return `/faces/happiness_score_${value}.png`;
  };

  const getHappinessColor = (value: number) => {
    return perygonTheme.colors.happinessScale[
      value as keyof typeof perygonTheme.colors.happinessScale
    ];
  };

  return (
    <Box height={`100%`} position="relative">
      <Box
        ref={containerRef}
        width="100%"
        height="100%"
        position="relative"
        bg="white"
        borderRadius={{ base: "8px", md: "16px" }}
        overflow="hidden"
        boxShadow="lg"
        top={10}
        bottom={10}
        pb={10}
        pt={10}
        px={[2, 8]}
      >
        <YAxis />
        {/* X-axis labels */}
        {DataPoints.map((point, index) => (
          <Text
            key={index}
            fontSize={fontSize}
            color="gray.500"
            position="absolute"
            left={`${mapIndexToX(index)}px`}
            bottom={`${bottomPadding - 20}px`}
            transform="translateX(-50%)"
          >
            {point.title}
          </Text>
        ))}

        {/* Line with gradient */}
        <svg
          width="100%"
          height="100%"
          viewBox={`0 0 ${containerWidth} ${totalHeight}`}
          preserveAspectRatio="none"
          style={{ position: "absolute", top: 0, left: 0 }}
        >
          <defs>
            {DataPoints.slice(0, -1).map((point, index) => (
              <linearGradient
                key={index}
                id={`gradient-${index}`}
                x1="0%"
                y1="0%"
                x2="100%"
                y2="0%"
              >
                <stop offset="0%" stopColor={getHappinessColor(point.value)} />
                <stop
                  offset="100%"
                  stopColor={getHappinessColor(DataPoints[index + 1].value)}
                />
              </linearGradient>
            ))}
          </defs>
          {DataPoints.slice(0, -1).map((point, index) => {
            const x1 = mapIndexToX(index);
            const y1 = mapValueToY(point.value);
            const x2 = mapIndexToX(index + 1);
            const y2 = mapValueToY(DataPoints[index + 1].value);

            return (
              <motion.path
                key={index}
                d={`M ${x1} ${y1} L ${x2} ${y2}`}
                stroke={`url(#gradient-${index})`}
                strokeWidth={strokeWidth}
                fill="none"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{
                  duration: 0.3,
                  ease: "easeInOut",
                  delay: index * 0.2,
                }}
              />
            );
          })}
        </svg>

        {/* Data point images */}
        {DataPoints.map((point, index) => {
          const x = mapIndexToX(index);
          const y = mapValueToY(point.value);

          return (
            <Box
              key={index}
              position="absolute"
              left={`${x - imageSize / 2}px`}
              top={`${y - imageSize / 2}px`}
              width={`${imageSize}px`}
              height={`${imageSize}px`}
            >
              <motion.img
                src={getFaceImage(point.value)}
                alt={`Happiness score ${point.value}`}
                style={{
                  width: "100%",
                  height: "100%",
                }}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: index * 0.2, duration: 0.1 }}
              />
            </Box>
          );
        })}
      </Box>
    </Box>
  );
};

export default LineGraph;
