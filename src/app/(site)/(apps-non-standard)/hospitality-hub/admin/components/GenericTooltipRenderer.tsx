// GenericTooltipRenderer.ts
import {
  createTooltipRenderer,
  ThemeColors,
} from "@/components/agCharts/tooltips/factory/createTooltipRenderer";
import {
  AgSeriesTooltipRendererParams, // root base type
} from "ag-charts-types";

/**
 * Re-usable tooltip renderer.
 * Call-site decides what param-shape (`P`) it needs
 *    e.g. P = AgBarSeriesTooltipRendererParams<any>
 */
export function GenericTooltipRenderer<
  P extends AgSeriesTooltipRendererParams<any>,
>(
  themeColors: ThemeColors,
  opts: {
    title?: string | ((p: P) => string);
    body: (p: P) => string;
  }
) {
  return createTooltipRenderer<P>(themeColors, (p) => ({
    title:
      typeof opts.title === "function" ? opts.title(p) : (opts.title ?? ""),
    body: opts.body(p),
    topBarColor: (p as any).color,
  }));
}
