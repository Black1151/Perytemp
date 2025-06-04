import React, { useState } from "react";
import {
  Avatar,
  Box,
  Flex,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
  useBreakpointValue,
  useTheme,
} from "@chakra-ui/react";
// import { perygonTheme } from "@/theme/themes/perygon/perygonTheme/perygonTheme";
import { SectionHeader } from "@/components/sectionHeader/SectionHeader";
import { AgCharts } from "ag-charts-react";
import { useRouter } from "next/navigation";
import useColor from "@/hooks/useColor";

import {
  AgBarSeriesItemStylerParams,
  AgCartesianChartOptions,
} from "ag-charts-enterprise";
import { SubmissionsTooltipRenderer } from "./tooltips/SubmissionsTooltipRenderer";

interface ScoreDistribution {
  score: number;
  count: number;
}

interface HappinessRagHistogramModalProps {
  isOpen: boolean;
  onClose: () => void;
  fullName: string;
  status?: "Red" | "Amber" | "Green" | "Purple" | "Gray" | "N/A" | null;
  userImageUrl?: string;
  userUniqueId: string;
  scoreDistribution?: ScoreDistribution[];
}

const HappinessRagHistogramModal: React.FC<HappinessRagHistogramModalProps> = ({
  isOpen,
  onClose,
  fullName,
  status,
  userImageUrl,
  userUniqueId,
  scoreDistribution,
}) => {
  const router = useRouter();
  const theme = useTheme();
  const { getColor } = useColor();
  const isMobile = useBreakpointValue({ base: true, sm: false });

  // Parse the scores array safely
  const validScoresArray = (() => {
    try {
      return Array.isArray(scoreDistribution)
        ? scoreDistribution
        : JSON.parse(scoreDistribution || "[]");
    } catch (error) {
      return [];
    }
  })();

  const backgroundColorMap: { [key: string]: string } = {
    Red: "red",
    Amber: theme.colors.yellow,
    Green: theme.colors.seduloGreen,
    Purple: theme.colors.purple[500],
    Gray: "gray",
  };

  const backgroundColor = status ? backgroundColorMap[status] : "gray.500";

  const backgroundColorText: { [key: string]: string } = {
    Purple: "A lot higher than their average happiness",
    Green: "Slightly above their average happiness",
    Amber: "Slightly lower than their average happiness",
    Red: "A lot lower than their average happiness",
    Gray: "Has not submitted a score in the last month",
  };

  const statusText =
    status && backgroundColorText[status]
      ? backgroundColorText[status]
      : "Not enough submissions"; // Fallback for undefined statuses

  const [options, setOptions] = useState<AgCartesianChartOptions>({
    data: validScoresArray,
    padding: {
      top: 20,
      left: 20,
      right: 20,
      bottom: 20,
    },
    seriesArea: {
      padding: {
        left: 10,
        right: 10,
      },
    },
    series: [
      {
        type: "bar",
        xKey: "score",
        yKey: "count",
        xName: "Score",
        yName: "Count",
        cornerRadius: 10,
        shadow: {
          enabled: true,
          color: "#191919",
          xOffset: 1,
          yOffset: 1,
          blur: 4,
        },
        tooltip: {
          renderer: SubmissionsTooltipRenderer(theme.colors),
        },
        itemStyler: (params: AgBarSeriesItemStylerParams<any>) => {
          const { datum, xKey } = params;
          const score = parseInt(datum[xKey], 10); // Retrieve the score value
          return { fill: getColor(score) }; // Color based on score
        },
      },
    ],
    axes: [
      {
        type: "category",
        position: "bottom",
        title: {
          text: "Score",
          fontSize: 12,
          fontFamily: "Metropolis",
          color: "black",
        },
        label: {
          fontSize: 12,
          fontFamily: "Metropolis",
          color: theme.colors.primary,
        },
        gridLine: {
          width: 0,
        },
      },
      {
        type: "number",
        position: "left",
        title: {
          text: "Number of times",
          fontSize: 12,
          fontFamily: "Metropolis",
          color: "black",
        },
        label: {
          fontSize: 12,
          fontFamily: "Metropolis",
          color: theme.colors.primary,
        },
      },
    ],
    legend: {
      enabled: false,
    },
    zoom: {
      enabled: false,
    },
    navigator: {
      enabled: false,
    },
  });

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="6xl">
      <ModalOverlay />
      <ModalContent bgGradient={theme.gradients.modalBGGradient} pb={3}>
        <ModalHeader color="white" fontWeight="bold">
          Happiness Histogram
        </ModalHeader>
        <ModalCloseButton color="white" />
        <ModalBody>
          <Flex direction={["column"]} alignItems="flex-start" gap={6}>
            {/* User Image Section */}
            <Flex
              w={"full"}
              cursor={"pointer"}
              justifyContent={"flex-start"}
              alignItems={"center"}
              gap={4}
              onClick={() => router.push(`/users/${userUniqueId}`)}
            >
              <Avatar
                src={userImageUrl}
                name={fullName}
                borderRadius="full"
                boxSize={["60px", "120px"]}
                objectFit="cover"
                boxShadow="lg"
              />
              <Flex direction={"column"} gap={2}>
                <Text fontSize={["2xl", "3xl"]} fontWeight="bold" color="white">
                  {fullName}
                </Text>
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  backgroundColor={backgroundColor}
                  color="white"
                  fontSize={["sm", "2xl"]}
                  fontWeight="bold"
                  borderRadius="md"
                  textAlign="center"
                  p={1}
                >
                  <Text fontWeight="bold">Status: {status ?? "N/A"}</Text>
                </Box>
              </Flex>
            </Flex>

            <Text color={"white"} fontSize={"xs"}>
              {statusText}
            </Text>

            {/* User Info and Chart */}
            <Flex flex="1" direction="column" gap={4} width={"full"}>
              <Box
                minW={["100%", "100%", "48%"]}
                flex={1}
                textAlign="center"
                borderRadius="lg"
              >
                <Flex width="100%" justifyContent="flex-start" mb={2}>
                  <SectionHeader>Previous 12 month submissions</SectionHeader>
                </Flex>
                <Box borderRadius={"2xl"} shadow={"xl"} overflow={"hidden"}>
                  <AgCharts options={options as any} />
                </Box>
              </Box>
            </Flex>
          </Flex>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default HappinessRagHistogramModal;
