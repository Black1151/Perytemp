"use client";

import React, { useState, useEffect } from "react";
import { Box, Grid, Avatar, Text, Flex, GridProps } from "@chakra-ui/react";
import {
  AnimatedList,
  AnimatedListItem,
} from "@/components/animations/AnimatedList";
import { BigUpWallEntry } from "../../types";
import PerygonCard from "@/components/layout/PerygonCard";

interface RecognitionListProps extends GridProps {
  items: BigUpWallEntry[];
  reverseRecognition?: boolean;
  onClickProfilePic: (uuid: string) => void;
}

const getPersonDetails = (
  item: BigUpWallEntry,
  reverseRecognition: boolean
) => {
  if (reverseRecognition) {
    return {
      fullName: item.userNameFrom,
      userImageUrl: item.userImageUrlFrom,
      recognizedBy: item.userNameTo,
    };
  } else {
    return {
      fullName: item.userNameTo,
      userImageUrl: item.userImageUrlTo,
      recognizedBy: item.userNameFrom,
    };
  }
};

export const RecognitionList: React.FC<RecognitionListProps> = ({
  items,
  reverseRecognition = false,
  onClickProfilePic,
  ...props
}) => {
  const [itemsList, setItemsList] = useState<BigUpWallEntry[]>([]);

  useEffect(() => {
    setItemsList(items);
  }, [items]);

  return (
    <Grid
      templateColumns={["1fr", null, "1fr 1fr", null, null, "1fr 1fr"]}
      gap={6}
      {...props}
    >
      <AnimatedList>
        {itemsList &&
          itemsList.map((item, index) => {
            const personDetails = getPersonDetails(item, reverseRecognition);

            return (
              <AnimatedListItem key={index} index={index}>
                <PerygonCard p={4}>
                  <Flex alignItems="center" justify="space-between">
                    <Flex flexDirection="column" flex="1" textAlign={"left"}>
                      <Text fontSize="xl" color="primary" fontWeight="bold">
                        {personDetails.fullName}
                      </Text>
                      <Text fontSize="xs" color="primaryTextColor">
                        {reverseRecognition
                          ? "recognised me"
                          : `recognised by ${personDetails.recognizedBy}`}
                      </Text>
                      <Text fontSize="xs" color="secondaryTextColor" pt={1}>
                        {item.createdAt.split(" ")[0]}
                      </Text>
                      <Text
                        mt={1}
                        fontSize="lg"
                        color="primary"
                        fontWeight="bold"
                      >
                        {item.bigUpCategory}
                      </Text>
                    </Flex>
                    <Avatar
                      size="lg"
                      name={personDetails.fullName}
                      src={personDetails.userImageUrl}
                      onClick={() => {
                        onClickProfilePic(
                          reverseRecognition
                            ? item.userIdUrlFrom.toString()
                            : item.userIdUrlTo.toString()
                        );
                      }}
                      _hover={{ cursor: "pointer" }}
                    />
                  </Flex>
                  <Box mt={4} minHeight={30} textAlign={"left"}>
                    <Text fontSize="sm" color="primaryTextColor">
                      {item.bigUpMessage}
                    </Text>
                  </Box>
                </PerygonCard>
              </AnimatedListItem>
            );
          })}
      </AnimatedList>
    </Grid>
  );
};
