// BubbleScoresTooltipRenderer.ts
import { AgBubbleSeriesTooltipRendererParams } from "ag-charts-enterprise";
import {
  createTooltipRenderer,
  ThemeColors,
} from "./factory/createTooltipRenderer";

export function BubbleScoresTooltipRenderer(themeColors: ThemeColors) {
  return createTooltipRenderer<AgBubbleSeriesTooltipRendererParams<any>>(
    themeColors,
    (params) => {
      const { datum, xKey, yKey, sizeKey, color } = params;

      const xValue = datum?.[xKey] ?? "N/A";
      const yValue = datum?.[yKey] ?? "N/A";
      const sizeValue =
        datum?.[sizeKey] !== undefined
          ? Number(datum[sizeKey]).toFixed(0)
          : "N/A";

      const body = `
        <strong>Score:</strong> ${xValue}<br/>
        <strong>Submissions:</strong> ${sizeValue}
      `;

      return {
        title: String(yValue),
        body,
        topBarColor: color,
      };
    }
  );
}
