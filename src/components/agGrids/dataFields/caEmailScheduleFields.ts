import { ColDef } from "ag-grid-community";
import ActionButtonRenderer from "@/components/agGrids/CellRenderers/ActionButtonRenderer";
import EmailScheduleRenderer from "@/components/agGrids/CellRenderers/EmailScheduleRenderer";
import ToolConfigRenderer from "@/components/agGrids/CellRenderers/ToolConfigRenderer";

// Updated AgGrids fields
export const caEmailScheduleFields: ColDef[] | any = [
  {
    field: "id",
    headerName: "ID",
    filter: "agNumberColumnFilter",
    maxWidth: 128,
    minWidth: 64,
  },
  {
    field: "name",
    headerName: "Name",
    filter: "agMultiColumnFilter",
    cellRenderer: EmailScheduleRenderer,
    cellRendererParams: {
      uniqueIdField: "id",
      nameField: "name",
    },
  },
  {
    field: "toolName",
    headerName: "Tool",
    filter: "agMultiColumnFilter",
    cellRenderer: ToolConfigRenderer,
    cellRendererParams: {
      uniqueIdField: "toolId",
      imageUrlField: "toolIconImageUrl",
      nameField: "toolName",
    },
  },
  {
    field: "startDate",
    headerName: "Start Date",
    filter: "agMultiColumnFilter",
  },
  {
    field: "endDate",
    headerName: "End Date",
    filter: "agMultiColumnFilter",
  },
  {
    field: "sendTime",
    headerName: "Send Time",
    filter: "agMultiColumnFilter",
  },
  {
    field: "frequency",
    headerName: "Frequency",
    filter: "agMultiColumnFilter",
  },
  {
    field: "nextSendTime",
    headerName: "Sent Next",
    filter: "agMultiColumnFilter",
  },
  {
    field: "lastSentTime",
    headerName: "Sent Last",
    filter: "agMultiColumnFilter",
  },
  {
    field: "isActive",
    headerName: "Actions",
    cellRenderer: ActionButtonRenderer,
    cellRendererParams: {
      redirectUrl: "/email-schedule",
      updateUrl: "/api/emailScheduleCustomerOpt/",
      idField: "id",
    },
  },
];
