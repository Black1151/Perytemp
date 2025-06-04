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

import { SectionHeader } from "@/components/sectionHeader/SectionHeader";
import { AgCharts } from "ag-charts-react";
import { useRouter } from "next/navigation";
import useColor from "@/hooks/useColor";

import {
  AgBubbleSeriesTooltipRendererParams,
  AgCartesianChartOptions,
  AgCartesianSeriesOptions,
  BubbleSeriesItemStylerParams,
} from "ag-charts-enterprise";
import { BubbleScoresTooltipRenderer } from "@/components/agCharts/tooltips/BubbleScoresTooltipRenderer";

interface UserScores {
  score: number;
  countOfScore: number;
  dayOfSubmission: string;
}

interface HappinessRagBubbleModal {
  isOpen: boolean;
  onClose: () => void;
  fullName: string;
  status?: "Red" | "Amber" | "Green" | "Purple" | "Gray" | "N/A" | null;
  userImageUrl?: string;
  userUniqueId: string;
  userScores?: UserScores[];
}

const HappinessRagHistogramModal: React.FC<HappinessRagBubbleModal> = ({
  isOpen,
  onClose,
  fullName,
  status,
  userImageUrl,
  userUniqueId,
  userScores,
}) => {
  const router = useRouter();
  const theme = useTheme();
  const { getColor } = useColor();
  const isMobile = useBreakpointValue({ base: true, sm: false });

  // Parse the scores array safely and add `yKey` with a default value of 5
  const validScoresArray = (() => {
    try {
      return Array.isArray(userScores)
        ? userScores
        : JSON.parse(userScores || "[]");
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

  const renderer = ({
    datum,
    xKey,
    yKey,
    sizeKey,
  }: AgBubbleSeriesTooltipRendererParams) => {
    return {
      title: `Score of: ${datum[xKey]}`,
      content: `Submissions: ${datum[sizeKey].toFixed(0)}`,
    };
  };

  const days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  const globalMaxCount = Math.max(
    ...validScoresArray.map((d: UserScores) => d.countOfScore)
  );

  const series: AgCartesianSeriesOptions[] = days.map((day) => {
    // Filter the scores for the current day
    const dayData = validScoresArray.filter(
      (d: UserScores) => d.dayOfSubmission === day
    );

    // Find the maximum countOfScore for the current day's data
    const localMaxCount = Math.max(
      ...dayData.map((d: UserScores) => d.countOfScore),
      0
    ); // Default to 0 if dayData is empty

    // Calculate the maxSize for this day based on the global maximum
    const maxSize = (localMaxCount / globalMaxCount) * 40;

    return {
      data: dayData,
      type: "bubble",
      xKey: "score",
      yKey: "dayOfSubmission",
      xName: "Score",
      yName: day,
      sizeKey: "countOfScore",
      sizeName: "Submissions",
      size: 0,
      maxSize: maxSize,
      tooltip: { renderer: BubbleScoresTooltipRenderer(theme.colors) },
      itemStyler: (params: BubbleSeriesItemStylerParams<any>) => {
        const { datum, xKey } = params;
        const score = parseInt(datum[xKey], 10); // Retrieve the score value
        return { fill: getColor(score) }; // Color based on score
      },
    };
  });

  const [options, setOptions] = useState<AgCartesianChartOptions>({
    data: validScoresArray,
    seriesArea: {
      padding: {
        left: 5,
        right: 20,
      },
    },
    series: series,
    axes: [
      {
        type: "category",
        position: "bottom",
        label: {
          fontSize: 12,
          fontFamily: "Metropolis",
          fontWeight: "bold",
          color: theme.colors.primary,
        },
        title: {
          text: "Score",
          fontSize: 12,
          fontFamily: "Metropolis",
          color: "black",
        },
      },
      {
        type: "category",
        position: "left",
        label: {
          fontSize: 10,
          fontFamily: "Metropolis",
          padding: 0,
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
    annotations: {
      enabled: false,
    },
  });

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="6xl">
      <ModalOverlay />
      <ModalContent bgGradient={theme.gradients.modalBGGradient} pb={3}>
        <ModalHeader color="white" fontWeight="bold">
          Happiness Punch Card
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
                <Box
                  borderRadius={"2xl"}
                  shadow={"xl"}
                  overflow={"hidden"}
                  height={"500px"}
                >
                  <AgCharts
                    options={options as any}
                    style={{ width: "100%", height: "100%" }}
                  />
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
