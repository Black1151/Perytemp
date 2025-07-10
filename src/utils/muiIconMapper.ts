import * as MuiIcons from "@mui/icons-material";
import { SvgIconComponent } from "@mui/icons-material";

/**
 * A map for explicit icon overrides or aliases.
 * Add any custom mappings here to override or alias icon names to specific MUI icons.
 * If a name is not found here, getMuiIconByName will fallback to the MUI icon with the same name.
 */
export const iconMap: Record<string, SvgIconComponent> = {
  //Add overwrites here...
};

/**
 * Returns a MUI SvgIconComponent for a given icon name.
 *
 * 1. Checks the explicit iconMap for overrides/aliases.
 * 2. Falls back to the equivalently named MUI icon if present.
 * 3. Defaults to HelpOutline if no match is found.
 *
 * @param {string} name - The icon name (usually from the database or API)
 * @returns {SvgIconComponent} - The corresponding MUI icon component
 */
export function getMuiIconByName(name: string): SvgIconComponent {
  if (iconMap[name]) return iconMap[name];
  if (name in MuiIcons) return MuiIcons[name as keyof typeof MuiIcons] as SvgIconComponent;
  return MuiIcons.HelpOutline as SvgIconComponent;
}
