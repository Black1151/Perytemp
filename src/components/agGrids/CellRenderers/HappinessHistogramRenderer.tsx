import React from "react";
import {
  Box,
  Flex,
  IconButton,
  useBreakpointValue,
  useDisclosure,
  useTheme,
} from "@chakra-ui/react";
import HappinessRagHistogramModal from "@/components/agCharts/HappinessRagHistogramModal";
import HappinessRagBubbleModal from "@/components/agCharts/HappinessRagBubbleModal";
import { Analytics, BubbleChart } from "@mui/icons-material";

interface ScoreDistribution {
  score: number;
  count: number;
  yKey?: number;
}

interface UserScores {
  score: number;
  countOfScore: number;
  dayOfSubmission: string;
}

interface HappinessDifferenceRendererProps {
  node: {
    data: {
      userId: string;
      fullName: string;
      userUniqueId: string;
      userImageUrl?: string;
      currentRagStatus?:
        | "Red"
        | "Amber"
        | "Green"
        | "Purple"
        | "Gray"
        | "N/A"
        | null;
      scoreDistribution?: ScoreDistribution[];
      userScores?: UserScores[];
      [key: string]: any;
    };
  };
}

const HappinessDifferenceRenderer: React.FC<
  HappinessDifferenceRendererProps
> = ({ node }) => {
  const theme = useTheme();
  const histogramDisclosure = useDisclosure();
  const bubbleDisclosure = useDisclosure();
  const isMobile = useBreakpointValue({ base: true, sm: true, md: false });

  const fullName = node.data.fullName;
  const userImageUrl = node.data.userImageUrl;
  const userUniqueId = node.data.userUniqueId;
  const value = node.data.currentRagStatus;

  return (
    <>
      {/* Main Cell Renderer */}
      <Flex
        alignItems="center"
        justifyContent="flex-end"
        h="full"
        w="full"
        gap={2}
      >
        {/* Histogram Icon (Visible on all devices) */}
        <Box height={"full"} onClick={histogramDisclosure.onOpen}>
          <IconButton
            aria-label="View Histogram"
            aspectRatio={1}
            variant="agPrimaryLight"
            icon={<Analytics />}
            sx={{
              height: "80%",
              alignSelf: "center",
            }}
          />
        </Box>

        <Box height={"full"} onClick={bubbleDisclosure.onOpen}>
          <IconButton
            aria-label="View Bubble Chart"
            aspectRatio={1}
            variant="agPrimaryLight"
            icon={<BubbleChart />}
            sx={{
              height: "80%",
              alignSelf: "center",
            }}
          />
        </Box>
      </Flex>

      {/* Histogram Modal */}
      <HappinessRagHistogramModal
        isOpen={histogramDisclosure.isOpen}
        onClose={histogramDisclosure.onClose}
        status={value}
        fullName={fullName}
        userImageUrl={userImageUrl}
        userUniqueId={userUniqueId}
        scoreDistribution={node.data.scoreDistribution}
      />

      {/* Bubble Modal */}
      <HappinessRagBubbleModal
        isOpen={bubbleDisclosure.isOpen}
        onClose={bubbleDisclosure.onClose}
        status={value}
        fullName={fullName}
        userImageUrl={userImageUrl}
        userUniqueId={userUniqueId}
        userScores={node.data.userScores}
      />
    </>
  );
};

export default HappinessDifferenceRenderer;
