import React, { useEffect, useState } from "react";
import {
  Box,
  Flex,
  HStack,
  Text,
  Tooltip,
  useMediaQuery,
  useTheme,
  VStack,
} from "@chakra-ui/react";
import { keyframes } from "@emotion/react";
import { motion } from "framer-motion";
import useColor from "@/hooks/useColor";
import { perygonTheme } from "@/theme/themes/perygon/perygonTheme/perygonTheme";

interface DataPoint {
  value: number;
  title: string;
  count: number;
}

interface BarProps {
  value: number;
  delay: number;
  onClick?: () => void;
}

const shimmerVertical = keyframes`
  0% {
    background-position: 0 -100%;
  }
  100% {
    background-position: 0 100%;
  }
`;

const Bar: React.FC<BarProps> = ({ value, delay, onClick }) => {
  const { getColor } = useColor();
  const theme = useTheme();

  return (
    <motion.div
      initial={{ height: 0 }}
      animate={{ height: `${value * 10}%` }}
      transition={{ delay, type: "spring", stiffness: 100 }}
      style={{
        width: "100%",
        display: "flex",
        justifyContent: "center",
        cursor: "pointer",
        position: "relative",
      }}
      onClick={onClick}
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: delay + 0.5 }}
        style={{
          position: "absolute",
          top: "-20px",
          fontSize: "10px",
          fontWeight: "bold",
        }}
      >
        <Text display={["none", "block"]} fontSize={[8, null, 10]}>
          {value.toFixed(1)}
        </Text>
      </motion.div>
      <Box
        width="100%"
        maxW={[3, 5, 10]}
        bg={getColor(value)}
        borderTopRadius="md"
      >
        <Box
          top={0}
          left={0}
          height="100%"
          background="linear-gradient(30deg, rgba(255,0,112,0) 40%, rgba(255,0,112,0.1) 50%, rgba(255,0,112,0) 0%)"
          backgroundSize="110% 300%"
          sx={{
            animation: `${shimmerVertical} 2s`,
            animationDelay: `${delay + 1}s`,
            animationFillMode: "forwards",
          }}
          onAnimationEnd={(e) => {
            (e.target as HTMLElement).style.animation = "none";
          }}
        />
      </Box>
    </motion.div>
  );
};

export interface AnimatedBarChartProps {
  DataPoints: DataPoint[];
  onBarClick?: (title: string) => void;
}

export const YAxis = () => {
  const yAxisVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: (index: number) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: index * 0.04 + 0.4,
        type: "ease",
      },
    }),
  };

  return (
    <VStack
      as={motion.div}
      initial="hidden"
      animate="visible"
      height={300}
      justifyContent="space-between"
      width="100%"
    >
      {Array.from({ length: 11 }, (_, index) => (
        <motion.div
          key={index}
          custom={index}
          variants={yAxisVariants}
          style={{ width: "100%" }}
        >
          <HStack width="100%">
            <Text fontSize="xs" lineHeight={0}>
              {10 - index}
            </Text>
            <Box borderBottom="1px solid lightgrey" w="100%" />
          </HStack>
        </motion.div>
      ))}
    </VStack>
  );
};

const AnimatedBarChart: React.FC<AnimatedBarChartProps> = ({
  DataPoints,
  onBarClick,
}) => {
  const [isTouchDevice] = useMediaQuery("(hover: none) and (pointer: coarse)");
  const [activeTooltip, setActiveTooltip] = useState<number | null>(null);
  const theme = useTheme();
  const [animationKey, setAnimationKey] = useState(0);

  useEffect(() => {
    setAnimationKey((prevKey) => prevKey + 1);
  }, [DataPoints]);

  const handleBarClick = (index: number, title: string) => {
    if (!isTouchDevice) {
      setActiveTooltip(activeTooltip === index ? null : index);
    }
    if (onBarClick) {
      onBarClick(title);
    }
  };

  return (
    <Flex flex={1} width="100%" pb={50} bg="elementBG" borderRadius="2xl">
      <VStack
        key={animationKey}
        bg="elementBG"
        width="100%"
        flex={1}
        borderRadius="2xl"
        px={[2, 8]}
        py={10}
        position="relative"
        minH={300}
        height={"100%"}
      >
        <HStack alignItems="center" w="100%" h="100%">
          <YAxis />
          <Flex
            height="100%"
            position="absolute"
            py={10}
            left={[12, "60px"]}
            right={[12, "60px"]}
            justifyContent="space-between"
            alignItems="flex-end"
            gap="2px"
          >
            {DataPoints.map((dataPoint, index) => (
              <Tooltip
                key={index}
                label={
                  <VStack>
                    <Text textAlign="center">{`${dataPoint.title}`}</Text>
                    <Text textAlign="center">
                      {`Score of ${dataPoint.value.toFixed(1)}`}
                    </Text>
                    <Text textAlign="center">
                      {`From count of ${dataPoint.count}`}
                    </Text>
                  </VStack>
                }
                bgColor={perygonTheme.colors.primary}
                color="white"
                placement="top"
                isOpen={isTouchDevice ? activeTooltip === index : undefined}
                borderRadius="md"
              >
                <VStack
                  height="100%"
                  alignItems="center"
                  justifyContent="flex-end"
                  flex={1}
                  position="relative"
                >
                  <Bar
                    value={dataPoint.value}
                    delay={index * 0.1}
                    onClick={() => handleBarClick(index, dataPoint.title)}
                  />
                  <Flex
                    position="absolute"
                    bottom="-50px"
                    height="30px"
                    width="100%"
                    alignItems="center"
                    justifyContent="center"
                    pr="50px"
                  >
                    <Text
                      lineHeight={1}
                      fontSize={12}
                      textAlign="center"
                      transform="rotate(-45deg)"
                      whiteSpace="nowrap"
                      color="primary"
                    >
                      {dataPoint.title.length > 10
                        ? dataPoint.title.slice(0, 10) + "..."
                        : "\u00A0".repeat(10 - dataPoint.title.length) +
                          dataPoint.title}
                    </Text>
                  </Flex>
                </VStack>
              </Tooltip>
            ))}
          </Flex>
        </HStack>
      </VStack>
    </Flex>
  );
};

export default AnimatedBarChart;
