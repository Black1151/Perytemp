import { ColDef } from "ag-grid-community";
import ActionButtonRenderer from "@/components/agGrids/CellRenderers/ActionButtonRenderer";
import EmailScheduleRenderer from "@/components/agGrids/CellRenderers/EmailScheduleRenderer";
import WorkflowRenderer from "@/components/agGrids/CellRenderers/WorkflowRenderer";
import BusinessProcessRenderer from "@/components/agGrids/CellRenderers/BusinessProcessRenderer";
import DuplicateSchedule from "@/app/(site)/(admin)/email-schedule/AssignSchedule";
import ToolConfigRenderer from "@/components/agGrids/CellRenderers/ToolConfigRenderer";

// Updated AgGrids fields
export const emailScheduleFields: ColDef[] | any = [
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
    field: "toolName",
    headerName: "Tool Name",
    filter: "agMultiColumnFilter",
    cellRenderer: ToolConfigRenderer,
    cellRendererParams: {
      uniqueIdField: "toolId",
      imageUrlField: "toolIconImageUrl",
      nameField: "toolName",
    },
  },
  {
    field: "wfName",
    headerName: "Workflow",
    filter: "agMultiColumnFilter",
    cellRenderer: WorkflowRenderer,
    cellRendererParams: {
      nameField: "wfName",
      uniqueIdField: "workflowId",
    },
  },
  {
    field: "bpName",
    headerName: "Business Process",
    filter: "agMultiColumnFilter",
    cellRenderer: BusinessProcessRenderer,
    cellRendererParams: {
      nameField: "bpName",
      uniqueIdField: "businessProcessId",
    },
  },
  {
    field: "isActive",
    headerName: "",
    cellRenderer: ActionButtonRenderer,
    cellRendererParams: {
      redirectUrl: "/email-schedule",
      DuplicateComponent: DuplicateSchedule,
      updateUrl: "/api/emailSchedule/",
      idField: "id",
    },
  },
];
