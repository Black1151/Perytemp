export interface ThemeColors {
  primaryTextColor: string;
  primary: string;
  elementBG: string;
  tooltipHeaderBGColor: string;
  tooltipHeaderTextColor: string;
  tooltipBodyTextColor: string;
}

interface TooltipData {
  title: string;
  body: string;
  topBarColor?: string;
}

export function createTooltipRenderer<TParams>(
  themeColors: ThemeColors,
  getTooltipData: (params: TParams) => TooltipData
) {
  return (params: TParams & { color?: string }): string => {
    const { title, body, topBarColor } = getTooltipData(params);
    const actualTopBarColor =
      topBarColor || params.color || themeColors.tooltipHeaderBGColor;

    return `
      <div style="
        position: relative; /* allows absolutely positioned arrow inside */
        border: 4px solid ${actualTopBarColor};
        overflow: visible; /* ensures the arrow can extend beyond the container */
        border-radius: 8px;
        background-color: ${themeColors.elementBG};
        font-family: Arial, sans-serif;
        font-size: 12px;
      ">
        <div style="
          background-color: ${themeColors.primary};
          padding: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: ${themeColors.tooltipHeaderTextColor};
        ">
          <strong>${title}</strong>
        </div>
    
        <div style="
          padding: 12px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          border-radius: 0 0 8px 8px;
          color: ${themeColors.tooltipBodyTextColor};
        ">
          ${body}
        </div>

        <div style="
          position: absolute;
          bottom: -15px;    
          left: 50%;
          transform: translateX(-50%);
          width: 0;
          height: 0;
          z-index: 1000;

          border-left: 15px solid transparent;
          border-right: 15px solid transparent;
          border-top: 15px solid ${actualTopBarColor};
        "></div>
      </div>
    `;
  };
}
