// PieChartTooltipRenderer.ts
import { AgPieSeriesTooltipRendererParams } from "ag-charts-enterprise";
import {
  createTooltipRenderer,
  ThemeColors,
} from "./factory/createTooltipRenderer";

export function PieChartTooltipRenderer(themeColors: ThemeColors) {
  return createTooltipRenderer<AgPieSeriesTooltipRendererParams<any>>(
    themeColors,
    (params) => {
      const { datum, color } = params;
      const category = datum?.category ?? "N/A";
      const value = datum?.value ?? "N/A";

      return {
        title: String(category),
        body: `Value: ${value}`,
        topBarColor: color,
      };
    }
  );
}
