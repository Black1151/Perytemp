"use client";
import React from "react";
import { Grid } from "@chakra-ui/react";
import { LeaderboardCard } from "./LeaderboardCard";
import {
  AnimatedList,
  AnimatedListItem,
} from "@/components/animations/AnimatedList";
import { BigUpLeaderboardEntry } from "../../types";

// Helper function to convert rank number to an ordinal string
export const getOrdinalSuffix = (rank: number): string => {
  const remainder10 = rank % 10;
  const remainder100 = rank % 100;

  if (remainder100 >= 11 && remainder100 <= 13) {
    return `${rank}th`; // 11th, 12th, 13th
  }

  switch (remainder10) {
    case 1:
      return `${rank}st`;
    case 2:
      return `${rank}nd`;
    case 3:
      return `${rank}rd`;
    default:
      return `${rank}th`;
  }
};

// Helper function to get medal color based on rank
export const getMedalColor = (rank: number): string | undefined => {
  if (rank === 1) return "gold";
  if (rank === 2) return "silver";
  if (rank === 3) return "#cd7f32"; // bronze
  return undefined;
};

interface LeaderBoardTabContentProps {
  items: BigUpLeaderboardEntry[];
  onClickProfilePic: (uuid: string) => void;
}

export const LeaderBoardTabContent: React.FC<LeaderBoardTabContentProps> = ({
  items,
  onClickProfilePic,
}) => {
  return (
    <Grid templateColumns={["1fr", null, "1fr 1fr", "1fr", "1fr 1fr"]} gap={6}>
      <AnimatedList>
        {items?.map((item, index) => {
          const rank = index + 1;

          return (
            <AnimatedListItem delay={0.5} key={index} index={index}>
              <LeaderboardCard
                UUID={item.userUniqueId.toString()}
                onClickProfilePic={onClickProfilePic}
                name={item.userName}
                location={item.officeName}
                image={item.userImageUrl}
                received={item.bigUpReceived}
                given={item.bigUpGiven}
                score={item.bigUpTotal}
                rank={getOrdinalSuffix(rank)}
                medalColor={getMedalColor(rank)}
              />
            </AnimatedListItem>
          );
        })}
      </AnimatedList>
    </Grid>
  );
};
