import { ColDef } from "ag-grid-community";
import ActionButtonRenderer from "@/components/agGrids/CellRenderers/ActionButtonRenderer";
import EmailTemplateRenderer from "@/components/agGrids/CellRenderers/EmailTemplateRenderer";
import EmailSecureLinkRenderer from "@/components/agGrids/CellRenderers/EmailSecureLinkRenderer";

// Updated AgGrids fields
export const emailTemplateFields: ColDef[] | any = [
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
    cellRenderer: EmailTemplateRenderer,
    cellRendererParams: {
      uniqueIdField: "id",
      nameField: "name",
    },
  },
  {
    field: "subject",
    headerName: "Subject",
    filter: "agMultiColumnFilter",
  },
  {
    field: "isActionable",
    headerName: "Actionable",
    filter: "agMultiColumnFilter",
  },
  {
    field: "actionType",
    headerName: "Action Type",
    filter: "agMultiColumnFilter",
  },
  {
    field: "secureLinkName",
    headerName: "Secure Link",
    filter: "agMultiColumnFilter",
    cellRenderer: EmailSecureLinkRenderer,
    cellRendererParams: {
      uniqueIdField: "secureLinkId",
      nameField: "secureLinkName",
    },
  },
  {
    field: "noTimesUsedInShedule",
    headerName: "# Schedules",
    filter: "agNumberColumnFilter",
  },
  {
    field: "isActive",
    headerName: "",
    cellRenderer: ActionButtonRenderer,
    cellRendererParams: {
      redirectUrl: "/email-template",
      updateUrl: "/api/emailTemplate/",
      idField: "id",
    },
  },
];
