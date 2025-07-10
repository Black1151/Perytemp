import { ColDef } from "ag-grid-community";
import ActionButtonRenderer from "../CellRenderers/ActionButtonRenderer";
import BigupCategoryRenderer from "../CellRenderers/BigupCategroyRenderer";

export const categoryFields: ColDef[] = [
  {
    field: "id",
    headerName: "ID",
    maxWidth: 128,
    minWidth: 64,
  },
  {
    field: "name",
    headerName: "Title",
    filter: "agTextColumnFilter",
    cellRenderer: BigupCategoryRenderer,
    cellRendererParams: {
      nameField: "name",
      uniqueIdField: "id",
    },
  },
  {
    field: "description",
    headerName: "Description",
    filter: "agTextColumnFilter",
  },
  {
    field: "points",
    headerName: "Receiver Points",
    maxWidth: 200,
    minWidth: 100,
    filter: "agNumberColumnFilter",
  },
  {
    field: "giverPoints",
    headerName: "Giver Points",
    maxWidth: 200,
    minWidth: 100,
    filter: "agNumberColumnFilter",
  },
  {
    field: "isActive",
    headerName: "Actions",
    cellRenderer: ActionButtonRenderer,
    cellRendererParams: {
      redirectUrl: "/bigup-categories",
      updateUrl: "/api/bigup/isActiveToggle",
      idField: "id",
    },
    maxWidth: 200,
    minWidth: 100,
  },
]; 