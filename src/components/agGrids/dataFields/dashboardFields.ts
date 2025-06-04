import { ColDef } from "ag-grid-community";
import ActionButtonRenderer from "@/components/agGrids/CellRenderers/ActionButtonRenderer";

// Updated AgGrids fields
export const dashboardFields: ColDef[] | any = [
  {
    field: "id",
    headerName: "ID",
    filter: "agNumberColumnFilter",
    maxWidth: 128,
    minWidth: 64,
    sort: "asc",
  },
  {
    field: "name",
    headerName: "Dashboard",
    filter: "agMultiColumnFilter",
  },
  {
    field: "dashboardUrl",
    headerName: "URL",
  },
  {
    field: "isActive",
    headerName: "",
    cellRenderer: ActionButtonRenderer,
    maxWidth: 128,
    minWidth: 64,
    cellRendererParams: {
      redirectUrl: "/dashboards",
      updateUrl: "/api/dashboard",
      idField: "id",
      rolesCanEdit: ["PA"],
    },
  },
];
