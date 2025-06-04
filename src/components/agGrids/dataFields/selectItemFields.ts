import { ColDef } from "ag-grid-community";
import ActionButtonRenderer from "@/components/agGrids/CellRenderers/ActionButtonRenderer";
import SelectItemRenderer from "@/components/agGrids/CellRenderers/SelectItemRenderer";

export const selectItemFields: ColDef[] | any = [
  {
    field: "id",
    headerName: "ID",
    cellDataType: "number",
    maxWidth: 128,
    minWidth: 64,
    filter: "agNumberColumnFilter",
  },
  {
    field: "label",
    filter: "agMultiColumnFilter",
    headerName: "Label",
    cellRenderer: SelectItemRenderer,
    cellRendererParams: {
      nameField: "label",
      uniqueIdField: "id",
    },
  },
  {
    field: "value",
    filter: "agMultiColumnFilter",
    headerName: "Value",
  },
  {
    field: "type",
    filter: "agMultiColumnFilter",
    headerName: "Type",
  },
  {
    field: "sortOrder",
    filter: "agNumberColumnFilter",
    headerName: "Order",
  },
  {
    field: "isActive",
    headerName: "Actions",
    cellRenderer: ActionButtonRenderer,
    filter: false,
    cellRendererParams: {
      redirectUrl: "/select-items",
      idField: "id",
    },
    maxWidth: 128,
  },
];
