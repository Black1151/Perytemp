"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  HStack,
  Icon,
  Textarea,
} from "@chakra-ui/react";
import { FaStar } from "react-icons/fa";

export const ScoreForm = () => {
  const [score, setScore] = useState<number>(0);
  const [comment, setComment] = useState<string>("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Simulate score submission
    router.push("/scores");
  };

  const handleScoreChange = (newScore: number) => {
    setScore(newScore);
  };

  return (
    <Box>
      <form onSubmit={handleSubmit}>
        <FormControl id="score" mb="4">
          <FormLabel>Score out of 10</FormLabel>
          <HStack spacing={1}>
            {Array.from({ length: 10 }, (_, i) => (
              <Icon
                as={FaStar}
                key={i}
                boxSize={8}
                cursor="pointer"
                color={i < score ? "teal.500" : "gray.300"}
                onClick={() => handleScoreChange(i + 1)}
              />
            ))}
          </HStack>
        </FormControl>
        <FormControl id="comment" mb="4">
          <FormLabel>Comment (optional)</FormLabel>
          <Textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Enter your comment"
          />
        </FormControl>
        <Button type="submit" colorScheme="teal">
          Submit
        </Button>
      </form>
    </Box>
  );
};
