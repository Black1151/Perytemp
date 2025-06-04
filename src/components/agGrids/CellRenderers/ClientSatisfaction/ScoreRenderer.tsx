"use client";

import React from "react";
import { Flex, Text, Box } from "@chakra-ui/react";
import { CustomCellRendererProps } from "ag-grid-react";

const getScoreColor = (score: number) => {
    if (score <= 3) return "#E53E3E"; // Red
    if (score <= 6) return "#DD6B20"; // Orange
    if (score <= 8) return "#D69E2E"; // Yellow
    return "#38A169"; // Green
};

const ScoreRenderer: React.FC<CustomCellRendererProps> = ({ data, colDef }) => {
    if (!data || !colDef) {
        return null;
    }

    const score = data?.[colDef.field!];

    if (score === undefined || score === null) return null;

    const bgColor = getScoreColor(score);

    return (
        <Flex
            alignItems="center"
            justifyContent="flex-start"
            w="full"
            h="full"
            maxW="full"
            maxH="42px"
            gap={4}
        >
            <Box
                borderRadius="20%"
                bgColor={bgColor}
                px={4}
                py={0}
                textAlign="center"
            >
                <Text fontSize="13px" color="white" fontWeight={600}>
                    {score}
                </Text>
            </Box>
        </Flex>
    );
};

export default ScoreRenderer;
