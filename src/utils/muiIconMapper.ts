import {
  Widgets,
  CheckCircle,
  Lock,
  HelpOutline,
  ArrowCircleRightOutlined,
  OutlinedFlagOutlined,
  CheckCircleOutline,
  BarChart,
  Analytics,
  Insights,
  Timeline,
  BubbleChart,
} from "@mui/icons-material";

import { SvgIconComponent } from "@mui/icons-material"; // more strict than IconTypeMap

export const iconMap: Record<string, SvgIconComponent> = {
  Widgets: Widgets,
  CheckCircle: CheckCircle,
  CheckCircleOutline: CheckCircleOutline,
  Lock: Lock,
  HelpOutline: HelpOutline,
  ArrowCircleRightOutlined: ArrowCircleRightOutlined,
  OutlinedFlagOutlined: OutlinedFlagOutlined,
  BarChart: BarChart,
  Analytics: Analytics,
  Insights: Insights,
  Timeline: Timeline,
  BubbleChart: BubbleChart,
};

export function getMuiIconByName(name: string): SvgIconComponent {
  return iconMap[name] || null;
}
