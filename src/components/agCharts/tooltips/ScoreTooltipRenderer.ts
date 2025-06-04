// ScoreTooltipRenderer.ts
import { AgCartesianSeriesTooltipRendererParams } from "ag-charts-enterprise";
import {
  createTooltipRenderer,
  ThemeColors,
} from "./factory/createTooltipRenderer";

export function ScoreTooltipRenderer(themeColors: ThemeColors) {
  return createTooltipRenderer<AgCartesianSeriesTooltipRendererParams>(
    themeColors,
    (params) => {
      const { datum, xKey, yKey, color } = params;
      const xValue = datum[xKey] ?? "N/A";
      const rawY = datum[yKey];
      const yValue = typeof rawY === "number" ? rawY.toFixed(2) : "N/A";

      return {
        title: String(xValue),
        body: `Score: ${yValue}`,
        topBarColor: color,
      };
    }
  );
}
