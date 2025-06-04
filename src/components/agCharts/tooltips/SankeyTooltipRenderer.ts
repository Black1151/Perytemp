// SankeyTooltipRenderer.ts
import { AgSankeySeriesTooltipRendererParams } from "ag-charts-enterprise";
import {
  createTooltipRenderer,
  ThemeColors,
} from "./factory/createTooltipRenderer";

export function SankeyTooltipRenderer(themeColors: ThemeColors) {
  return createTooltipRenderer<AgSankeySeriesTooltipRendererParams<any>>(
    themeColors,
    (params) => {
      const { color, datum } = params;
      const isNode = (datum as any)?.isNode === true;

      if (isNode) {
        const nodeLabel = (datum as any)?.label ?? "N/A";
        return {
          title: "Sankey Node",
          body: nodeLabel,
          topBarColor: color,
        };
      } else {
        const fromValue = (datum as any)?.from ?? "N/A";
        const toValue = (datum as any)?.to ?? "N/A";
        const weightValue = (datum as any)?.value ?? "N/A";
        const linkText = `${fromValue} → ${toValue}: ${weightValue}`;
        return {
          title: "Sankey Link",
          body: linkText,
          topBarColor: color,
        };
      }
    }
  );
}
