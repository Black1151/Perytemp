import { ColDef } from "ag-grid-community";
import ActionButtonRenderer from "@/components/agGrids/CellRenderers/ActionButtonRenderer";

export const optionListItemsFields: ColDef[] | any = [
  {
    headerName: "ID",
    field: "id",
    sortable: true,
    filter: true,
    maxWidth: 128,
    minWidth: 64,
  },
  {
    headerName: "Option List ID",
    field: "optionListId",
    sortable: true,
    filter: true,
  },
  {
    headerName: "Value 1",
    field: "value1",
    sortable: true,
    filter: true,
  },
  {
    headerName: "Value 2",
    field: "value2",
    sortable: true,
    filter: true,
  },
  {
    headerName: "Value 3",
    field: "value3",
    sortable: true,
    filter: true,
  },
  {
    headerName: "Value 4",
    field: "value4",
    sortable: true,
    filter: true,
  },
  {
    headerName: "Value 5",
    field: "value5",
    sortable: true,
    filter: true,
  },
  {
    headerName: "Sort Order",
    field: "sortOrder",
    sortable: true,
    filter: true,
  },
  {
    field: "isActive",
    headerName: "",
    cellRenderer: ActionButtonRenderer,
    cellRendererParams: {
      redirectUrl: "/option-lists/items",
      updateUrl: "/api/optionListItem",
      idField: "id",
    },
  },
];
