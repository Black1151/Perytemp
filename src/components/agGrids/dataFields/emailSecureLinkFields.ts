import { ColDef } from "ag-grid-community";
import ActionButtonRenderer from "@/components/agGrids/CellRenderers/ActionButtonRenderer";
import CustomerRenderer from "@/components/agGrids/CellRenderers/CustomerRenderer";
import UserRenderer from "@/components/agGrids/CellRenderers/UserRenderer";
import EmailSecureLinkRenderer from "@/components/agGrids/CellRenderers/EmailSecureLinkRenderer";
import ToolConfigRenderer from "@/components/agGrids/CellRenderers/ToolConfigRenderer";
import WorkflowRenderer from "@/components/agGrids/CellRenderers/WorkflowRenderer";
import BusinessProcessRenderer from "@/components/agGrids/CellRenderers/BusinessProcessRenderer";

// Updated AgGrids fields
export const emailSecureLinkFields: ColDef[] | any = [
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
    cellRenderer: EmailSecureLinkRenderer,
    cellRendererParams: {
      uniqueIdField: "id",
      nameField: "name",
    },
  },
  {
    field: "toolName",
    headerName: "Tool Name",
    filter: "agMultiColumnFilter",
    cellRenderer: ToolConfigRenderer,
    cellRendererParams: {
      uniqueIdField: "toolId",
      nameField: "toolName",
    },
  },
  {
    field: "wfName",
    headerName: "Workflow",
    filter: "agMultiColumnFilter",
    cellRenderer: WorkflowRenderer,
    cellRendererParams: {
      uniqueIdField: "workflowId",
      nameField: "wfName",
    },
  },
  {
    field: "bpName",
    headerName: "Business Process",
    filter: "agMultiColumnFilter",
    cellRenderer: BusinessProcessRenderer,
    cellRendererParams: {
      uniqueIdField: "businessProcessId",
      nameField: "bpName",
    },
  },
  {
    field: "actionType",
    headerName: "Action Type",
    filter: "agMultiColumnFilter",
  },
  {
    field: "expirationDate",
    headerName: "Expiration",
    filter: "agMultiColumnFilter",
  },
  {
    field: "toUserId",
    headerName: "User",
    filter: "agMultiColumnFilter",
    cellRenderer: UserRenderer,
    cellRendererParams: {
      uniqueIdField: "userUniqueId",
      nameField: "userFullName",
      imageUrlField: "userImageUrl",
    },
  },
  {
    field: "toCustomerId",
    headerName: "Customer",
    filter: "agMultiColumnFilter",
    cellRenderer: CustomerRenderer,
    cellRendererParams: {
      uniqueIdField: "custUniqueId",
      nameField: "custName",
      imageUrlField: "custImageUrl",
    },
  },
  {
    field: "isActive",
    headerName: "",
    cellRenderer: ActionButtonRenderer,
    cellRendererParams: {
      redirectUrl: "/email-secure-link",
      updateUrl: "/api/emailSecureLink/",
      idField: "id",
    },
  },
];
