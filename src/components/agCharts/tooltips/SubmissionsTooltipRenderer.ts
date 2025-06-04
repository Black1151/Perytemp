// SubmissionsTooltipRenderer.ts
import { AgBarSeriesTooltipRendererParams } from "ag-charts-types";
import {
  createTooltipRenderer,
  ThemeColors,
} from "./factory/createTooltipRenderer";

export function SubmissionsTooltipRenderer(themeColors: ThemeColors) {
  return createTooltipRenderer<AgBarSeriesTooltipRendererParams<any>>(
    themeColors,
    (params) => {
      const { datum, xKey, yKey, color } = params;
      const xValue = datum[xKey] ?? "N/A";
      const rawY = datum[yKey];
      const yValue = typeof rawY === "number" ? rawY.toFixed(2) : "N/A";

      return {
        title: String(xValue),
        body: `Submissions: ${yValue}`,
        topBarColor: color,
      };
    }
  );
}
