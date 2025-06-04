import React from "react";
import { Flex, Avatar, Text, Divider, BoxProps } from "@chakra-ui/react";
import { EmojiEvents } from "@mui/icons-material";
import PerygonCard from "@/components/layout/PerygonCard";

export interface LeaderboardCardProps extends BoxProps {
  name: string;
  location: string;
  received: number;
  given: number;
  score: number;
  image: string;
  rank: string;
  medalColor?: string;
  onClickProfilePic: (UUID: string) => void;
  UUID: string;
}

export const LeaderboardCard: React.FC<LeaderboardCardProps> = ({
  name,
  UUID,
  location,
  received,
  given,
  score,
  image,
  rank,
  medalColor,
  onClickProfilePic,
  ...props
}) => {
  return (
    <PerygonCard width="100%" boxShadow="primaryShadow" {...props}>
      <Flex align="center" mb={3}>
        <Avatar
          size="lg"
          name={name}
          src={image}
          onClick={() => onClickProfilePic(UUID)}
          _hover={{ cursor: "pointer" }}
        />
        <Flex direction="column" ml={4} flex="1">
          <Text color="themeTextColor" fontWeight="bold" fontSize="xl">
            {name}
          </Text>
          <Text color="primaryTextColor" fontSize="sm">
            {location}
          </Text>
        </Flex>
      </Flex>
      <Flex
        alignItems="center"
        mb={2}
        width="100%"
        justifyContent="flex-end"
        minHeight="40px"
      >
        {medalColor && (
          <EmojiEvents
            style={{ color: medalColor, marginRight: "0.5rem" }}
            fontSize="large"
          />
        )}
        <Text fontWeight="bold" color="themeTextColor" fontSize="lg" mr={2}>
          {rank}
        </Text>
        <Text
          fontWeight="bold"
          color="themeTextColor"
          fontSize="lg"
          whiteSpace="nowrap"
        >
          {score.toLocaleString()} Points!
        </Text>
      </Flex>

      <Divider mb={3} />
      <Flex justify="space-between">
        <Text color="primaryTextColor" fontSize="sm" fontWeight="bold">
          Received:
        </Text>
        <Text color="primaryTextColor" fontWeight="bold" fontSize="lg">
          {received.toLocaleString()}
        </Text>
      </Flex>
      <Flex justify="space-between" mt={1}>
        <Text color="primaryTextColor" fontSize="sm" fontWeight="bold">
          Given:
        </Text>
        <Text color="primaryTextColor" fontWeight="bold" fontSize="lg">
          {given.toLocaleString()}
        </Text>
      </Flex>
    </PerygonCard>
  );
};
