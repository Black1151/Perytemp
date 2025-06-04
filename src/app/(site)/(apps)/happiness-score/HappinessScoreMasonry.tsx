import { ScaleClickable } from "@/components/animations/ScaleClickable";
import { SpringScale } from "@/components/animations/SpringScale";
import { StatBox } from "@/components/Masonry/StatsMasonry/StatBox";

import { Box, GridItem, SimpleGrid, useTheme, VStack } from "@chakra-ui/react";
import React from "react";

interface HappinessScoreMasonryProps {
  masonryValues: string[] | number[];
  // masonryValues: { category: string; count: number }[];
  onStatClick: (title: string) => void;
}

export const HappinessScoreMasonry: React.FC<HappinessScoreMasonryProps> = ({
  masonryValues,
  onStatClick,
}) => {
  const theme = useTheme();

  return (
    <VStack flex={1}>
      <SimpleGrid gap={[2, 5]} columns={[2]} flex={1} w="100%">
        <SpringScale delay={0}>
          <ScaleClickable onClick={() => onStatClick("1-2")}>
            <StatBox
              bgColor={"red"}
              data={masonryValues[0]?.toString()}
              title={"1-2"}
              titleImage="/faces/happiness_score_2.png"
            />
          </ScaleClickable>
        </SpringScale>
        <SpringScale delay={0.5}>
          <ScaleClickable onClick={() => onStatClick("3-5")}>
            <StatBox
              bgColor={theme.colors.yellow}
              data={masonryValues[1]?.toString()}
              title={"3-5"}
              titleImage="/faces/happiness_score_6.png"
            />
          </ScaleClickable>
        </SpringScale>
        <SpringScale delay={0.7}>
          <ScaleClickable onClick={() => onStatClick("6-8")}>
            <StatBox
              bgColor={theme.colors.lightGreen}
              data={masonryValues[2]?.toString()}
              title={"6-8"}
              titleImage="/faces/happiness_score_8.png"
            />
          </ScaleClickable>
        </SpringScale>
        <SpringScale delay={1.2}>
          <ScaleClickable onClick={() => onStatClick("9-10")}>
            <StatBox
              bgColor={theme.colors.seduloGreen}
              data={masonryValues[3]?.toString()}
              title={"9-10"}
              titleImage="/faces/happiness_score_9.png"
            />
          </ScaleClickable>
        </SpringScale>
        <GridItem colSpan={2}>
          <SpringScale delay={0.3}>
            <ScaleClickable onClick={() => onStatClick("Did not participate")}>
              <StatBox
                bgColor="lightGray"
                data={masonryValues[4]?.toString()}
                title={"Did not participate"}
                counterColor={"lightGray"}
              />
            </ScaleClickable>
          </SpringScale>
        </GridItem>
      </SimpleGrid>
    </VStack>
  );
};
