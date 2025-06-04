import React from "react";
import {
  Box,
  Flex,
  useBreakpointValue,
  useDisclosure,
  useTheme,
} from "@chakra-ui/react";
import HappinessRagHistogramModal from "@/components/agCharts/HappinessRagHistogramModal";
import HappinessRagBubbleModal from "@/components/agCharts/HappinessRagBubbleModal";

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
      scoreDistribution?: { score: number; count: number }[];
      userScores: Scores[];
      [key: string]: any;
    };
  };
}

interface Scores {
  score: number;
  countOfScore: number;
  dayOfSubmission: string;
}

const HappinessDifferenceRenderer: React.FC<
  HappinessDifferenceRendererProps
> = ({ node }) => {
  const theme = useTheme();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const fullName = node.data.fullName;
  const userImageUrl = node.data.userImageUrl;
  const userUniqueId = node.data.userUniqueId;
  const value = node.data.currentRagStatus;
  const isMobile = useBreakpointValue({ base: true, sm: true, md: false });

  const backgroundColorMap: { [key: string]: string } = {
    Red: "red",
    Amber: theme.colors.yellow,
    Green: theme.colors.seduloGreen,
    Purple: theme.colors.purple[500],
    Gray: "gray",
  };

  const backgroundColor = value ? backgroundColorMap[value] : "gray.500";

  return (
    <>
      {/* Main Cell Renderer */}
      <Flex
        alignItems="center"
        justifyContent="center"
        h="full"
        w="full"
        onClick={onOpen}
        cursor="pointer"
      >
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          backgroundColor={backgroundColor}
          _hover={{
            transform: "scale(1.2)",
            backgroundColor: "white",
            border: `1px solid ${backgroundColor}`,
            color: `${backgroundColor}`,
          }}
          transition="transform 0.5s ease-in-out, background-color 0.5s ease-in-out, color 0.5s ease-in-out"
          color="white"
          fontWeight="bold"
          borderRadius="md"
          textAlign="center"
          h="80%"
          p={2}
        >
          {value || "N/A"}
        </Box>
      </Flex>
      {isMobile ? (
        <HappinessRagHistogramModal
          isOpen={isOpen}
          onClose={onClose}
          status={value}
          fullName={fullName}
          userImageUrl={userImageUrl}
          userUniqueId={userUniqueId}
          scoreDistribution={node.data.scoreDistribution}
        />
      ) : (
        <HappinessRagBubbleModal
          isOpen={isOpen}
          onClose={onClose}
          status={value}
          fullName={fullName}
          userImageUrl={userImageUrl}
          userUniqueId={userUniqueId}
          userScores={node.data.userScores}
        />
      )}
    </>
  );
};

export default HappinessDifferenceRenderer;
