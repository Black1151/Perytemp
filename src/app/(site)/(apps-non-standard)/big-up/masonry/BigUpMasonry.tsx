"use client";
import { Grid, GridItem } from "@chakra-ui/react";
import { ReactNode } from "react";

import { MasonryCard } from "./MasonryCardItem";
import { SpringScale } from "@/components/animations/SpringScale";
import { BigUpStats } from "../types";
import { useRouter } from "next/navigation";
import { BigUpStatsCard } from "./BigUpStatsCard";

export interface BigUpMasonryProps {
  items: { title: string; content: ReactNode }[];
  userStats: BigUpStats;
}

export const BigUpMasonry: React.FC<BigUpMasonryProps> = ({
  items,
  userStats,
}) => {
  const router = useRouter();
  return (
    <Grid
      w="100%"
      templateColumns={["1fr", "repeat(2, 1fr)"]}
      gap={[3, null, null, 5]}
    >
      <GridItem colSpan={[1, 2]}>
        <SpringScale
          delay={Math.random() * 0.5}
          style={{ flex: 1, height: "100%" }}
        >
          <BigUpStatsCard
            name={userStats.userName}
            location={userStats.userLocation}
            received={userStats.bigUpReceivedPoints}
            given={userStats.bigUpGivenPoints}
            score={userStats.bigUpTotal}
            userImage={userStats.userImage}
            ranking={userStats.bigUpRanking}
            handleProfilePicClick={() => {
              router.push(`/my-profile?userUniqueId=${userStats.userUniqueId}`);
            }}
            UUID={userStats.userUniqueId}
          />
        </SpringScale>
      </GridItem>

      {items &&
        items.map((item, index) => (
          <GridItem key={index} height="100%">
            <SpringScale
              delay={Math.random() * 0.5}
              style={{ flex: 1, height: "100%" }}
            >
              <MasonryCard title={item.title} content={item.content} />
            </SpringScale>
          </GridItem>
        ))}
    </Grid>
  );
};
