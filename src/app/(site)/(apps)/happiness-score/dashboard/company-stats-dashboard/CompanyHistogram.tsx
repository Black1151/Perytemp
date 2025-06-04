"use client";

import React from "react";
import { useTheme } from "@chakra-ui/react";
import { AgCharts } from "ag-charts-react";
import useColor from "@/hooks/useColor";

import {
  AgBarSeriesItemStylerParams,
  AgCartesianChartOptions,
} from "ag-charts-enterprise";
import { SubmissionsTooltipRenderer } from "@/components/agCharts/tooltips/SubmissionsTooltipRenderer";

interface ScoreDistribution {
  score: number;
  count: number;
}

interface CompanyHistogramProps {
  scoreDistribution?: ScoreDistribution[] | string;
}

export const CompanyHistogram: React.FC<CompanyHistogramProps> = ({
  scoreDistribution,
}) => {
  const theme = useTheme();
  const { getColor } = useColor();

  // Prepare the score data in a sorted array
  const validScoresArray = (() => {
    try {
      const parsedData = Array.isArray(scoreDistribution)
        ? scoreDistribution
        : JSON.parse(scoreDistribution || "[]");
      return parsedData.sort(
        (a: ScoreDistribution, b: ScoreDistribution) => a.score - b.score
      );
    } catch (error) {
      return [];
    }
  })();

  const options: AgCartesianChartOptions = {
    data: validScoresArray,
    padding: {
      top: 20,
      left: 20,
      right: 20,
      bottom: 20,
    },
    background: {
      fill: theme.colors.elementBG,
    },
    series: [
      {
        type: "bar",
        xKey: "score",
        yKey: "count",
        xName: "Score",
        yName: "Count",
        cornerRadius: 10,
        shadow: {
          enabled: true,
          color: "#191919",
          xOffset: 1,
          yOffset: 1,
          blur: 4,
        },
        tooltip: {
          renderer: SubmissionsTooltipRenderer(theme.colors),
        },
        itemStyler: (params: AgBarSeriesItemStylerParams<any>) => {
          const { datum, xKey } = params;
          const score = parseInt(datum[xKey], 10);
          return { fill: getColor(score) };
        },
      },
    ],
    axes: [
      {
        type: "category",
        position: "bottom",
        title: {
          text: "Score",
          fontSize: 12,
          fontFamily: "Metropolis",
          color: theme.colors.primaryTextColor,
        },
        label: {
          fontSize: 12,
          fontFamily: "Metropolis",
          color: theme.colors.primaryTextColor,
        },
        gridLine: {
          width: 0,
        },
      },
      {
        type: "number",
        position: "left",
        title: {
          text: "Number of times",
          fontSize: 12,
          fontFamily: "Metropolis",
          color: theme.colors.primaryTextColor,
        },
        label: {
          fontSize: 12,
          fontFamily: "Metropolis",
          color: theme.colors.primaryTextColor,
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
  };

  return <AgCharts options={options} />;
};
