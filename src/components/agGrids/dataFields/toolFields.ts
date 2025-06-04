import { ColDef } from "ag-grid-community";
import ActionButtonRenderer from "@/components/agGrids/CellRenderers/ActionButtonRenderer";
import ToolConfigRenderer from "@/components/agGrids/CellRenderers/ToolConfigRenderer";

export const toolFields: ColDef[] = [
  {
    field: "id",
    headerName: "ID",
    filter: "agNumberColumnFilter",
    maxWidth: 128,
    minWidth: 64,
    sortable: true,
  },
  {
    field: "name",
    headerName: "Tool Name",
    filter: "agTextColumnFilter",
    cellRenderer: ToolConfigRenderer,
    cellRendererParams: {
      uniqueIdField: "id",
      imageUrlField: "iconImageUrl",
      nameField: "name",
    },
  },
  {
    field: "description",
    headerName: "Description",
    filter: "agTextColumnFilter",
  },
  {
    field: "categoryName",
    headerName: "Category ID",
    filter: "agNumberColumnFilter",
  },
  {
    field: "noTimesUsedInSubs",
    headerName: "# Subscriptions",
    filter: "agNumberColumnFilter",
  },
  {
    field: "noTimesUsedInToolWorkflow",
    headerName: "# WFs",
    filter: "agNumberColumnFilter",
  },
  {
    field: "isActive",
    headerName: "Actions",
    cellRenderer: ActionButtonRenderer,
    cellRendererParams: {
      redirectUrl: "/tools",
      updateUrl: "/api/toolConfig/",
      idField: "id",
    },
  },
];
