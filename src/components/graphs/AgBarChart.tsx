"use client";

import React, { useMemo } from "react";
import { Flex, useTheme } from "@chakra-ui/react";
import { AgCharts } from "ag-charts-react";
import useColor from "@/hooks/useColor";

import {
  AgBarSeriesItemStylerParams,
  AgCartesianChartOptions,
} from "ag-charts-enterprise";
import { NoDataOverlayPink } from "../agGrids/DataGrid/DataGridComponentLight";
import LoadingOverlayPink from "../agGrids/LoadingOverlayPink";
import PerygonCard from "../layout/PerygonCard";
import { SubmissionsTooltipRenderer } from "../agCharts/tooltips/SubmissionsTooltipRenderer";

interface DataPoint {
  title: string;
  value: number;
  count: number;
}

interface AgBarChartProps {
  data: DataPoint[] | null;
  loading?: boolean;
  onBarClick?: (title: string) => void;
}

export const AgBarChart: React.FC<AgBarChartProps> = ({
  data,
  loading = false,
  onBarClick,
}) => {
  const theme = useTheme();
  const { getColor } = useColor();

  const isMobile = useMemo(() => {
    const isTouchDevice =
      "ontouchstart" in window || navigator.maxTouchPoints > 0;
    const isSmallScreen = window.innerWidth <= 768;
    return isTouchDevice && isSmallScreen;
  }, []);

  const validData = useMemo(
    () =>
      Array.isArray(data) ? [...data].sort((a, b) => a.value - b.value) : [],
    [data],
  );

  const chartOptions: AgCartesianChartOptions = useMemo(
    () => ({
      data: validData,
      background: {
        fill: theme.colors.elementBG,
      },
      padding: {
        top: 40,
        left: 10,
        right: 20,
        bottom: 20,
      },
      series: [
        {
          type: "bar",
          xKey: "title",
          yKey: "value",
          xName: "Score",
          cornerRadius: 10,
          shadow: {
            enabled: true,
            color: "#191919",
            xOffset: 1,
            yOffset: 1,
            blur: 4,
          },
          itemStyler: (params: AgBarSeriesItemStylerParams<any>) => {
            const { datum } = params;
            const score = datum.value;
            return { fill: getColor(score) };
          },
          highlightStyle: {
            item: {
              strokeWidth: 0,
              fillOpacity: 1,
            },
          },
          label: undefined,
          tooltip: {
            renderer: SubmissionsTooltipRenderer(theme.colors),
          },
          listeners: {
            nodeClick: (event: any) => {
              if (onBarClick) {
                onBarClick(event.datum.title);
              }
            },
          },
        },
      ],
      axes: [
        {
          type: "category",
          position: "bottom",
          label: {
            fontSize: 12,
            rotation: -65,
            color: theme.colors.primaryTextColor,
            formatter: ({ value }: { value: string }) => value,
          },
        },
        {
          type: "number",
          position: "left",
          label: {
            fontSize: 12,
            color: theme.colors.primaryTextColor,
          },
          interval: { step: 2 },
          min: 0,
          max: 10,
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
      tooltip: {
        enabled: !isMobile,
      },
    }),
    [validData, getColor, onBarClick, theme.colors.primary, isMobile],
  );

  if (loading) {
    return (
      <Flex
        justifyContent="center"
        alignItems="center"
        height="100%"
        dropShadow="primaryShadow"
      >
        <LoadingOverlayPink />
      </Flex>
    );
  }

  if (!data || data.length === 0) {
    return (
      <PerygonCard display="flex" width="100%" height="100%">
        <NoDataOverlayPink />
      </PerygonCard>
    );
  }

  return (
    <PerygonCard display="flex" width="100%" height="100%">
      <style jsx global>{`
        .ag-charts-container rect:hover {
          transition: filter 0.3s ease-in-out;
          filter: drop-shadow(0 0 10px ${theme.colors.pink[400]});
        }
        .ag-chart-tooltip-title {
          font-weight: bold;
          padding: 4px 8px;
          color: #fff;
        }
        .ag-chart-tooltip-content {
          padding: 4px 8px;
          background: var(--chakra-colors-elementBG);
          color: #000;
        }
      `}</style>
      <AgCharts
        options={chartOptions as any}
        style={{ width: "100%", height: "600px" }}
      />
    </PerygonCard>
  );
};
