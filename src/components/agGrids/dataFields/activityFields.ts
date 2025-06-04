"use client";

import { ColDef, ValueFormatterParams } from "ag-grid-community";
import ActivityButtonRenderer from "@/components/agGrids/CellRenderers/ActivityButtonRenderer";
import ToolConfigRenderer from "@/components/agGrids/CellRenderers/ToolConfigRenderer";
import StatusBadgeRenderer from "@/components/agGrids/CellRenderers/StatusBadgeRenderer";
import UserRenderer from "@/components/agGrids/CellRenderers/UserRenderer";
import { dateValueFormatter } from "@/components/agGrids/ValueFormatters/dateValueFormatter";

export const activityFields: ColDef[] = [
  {
    field: "wfInstId",
    headerName: "ID",
    filter: "agNumberColumnFilter",
    maxWidth: 98,
    minWidth: 64,
    sort: "desc",
  },
  {
    field: "toolName",
    headerName: "Tool Name",
    filter: "agTextColumnFilter",
    minWidth: 200,
    cellRenderer: ToolConfigRenderer,
    cellRendererParams: {
      imageUrlField: "toolIconUrl",
      nameField: "toolName",
    },
  },
  {
    field: "wfStarterFullname",
    headerName: "User",
    filter: "agMultiColumnFilter",
    cellRenderer: UserRenderer,
    cellRendererParams: {
      uniqueIdField: "wfStarterUniqueId",
      nameField: "wfStarterFullname",
      imageUrlField: "wfStarterImageUrl",
    },
  },
  {
    field: "wfStarterTeamName",
    headerName: "Department",
    filter: "agMultiColumnFilter",
  },
  {
    field: "wfInstStatusName",
    headerName: "Status",
    filter: "agMultiColumnFilter",
    cellRenderer: StatusBadgeRenderer,
  },
  {
    field: "wfInstStartDate",
    headerName: "Start Date",
    filter: "agMultiColumnFilter",
    valueFormatter: (params: ValueFormatterParams) => {
      return dateValueFormatter(params.value);
    },
  },
  {
    field: "wfInstCompDate",
    headerName: "Complete Date",
    filter: "agMultiColumnFilter",
    valueFormatter: (params: ValueFormatterParams) => {
      return dateValueFormatter(params.value);
    },
  },
  {
    field: "noStagesPossible",
    headerName: "Possible Stages",
    filter: "agMultiColumnFilter",
    hide: true,
  },
  {
    field: "noStagesPending",
    headerName: "Pending Stages",
    filter: "agMultiColumnFilter",
    hide: true,
  },
  {
    field: "noStagesStarted",
    headerName: "Started Stages",
    filter: "agMultiColumnFilter",
    hide: true,
  },
  {
    field: "noStagesCompleted",
    headerName: "Completed Stages",
    filter: "agMultiColumnFilter",
  },

  {
    field: "isActive",
    headerName: "Actions",
    cellRenderer: ActivityButtonRenderer,
    maxWidth: 150,
  },
];
