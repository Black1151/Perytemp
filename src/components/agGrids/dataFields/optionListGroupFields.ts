import { ColDef } from "ag-grid-community";
import ActionButtonRenderer from "@/components/agGrids/CellRenderers/ActionButtonRenderer";
import OptionListGroupsRenderer from "@/components/agGrids/CellRenderers/OptionListGroupsRenderer";

export const optionListGroupsFields: ColDef[] | any = [
  {
    headerName: "ID",
    field: "id",
    sortable: true,
    filter: true,
    maxWidth: 128,
    minWidth: 64,
  },
  {
    headerName: "Name",
    field: "name",
    sortable: true,
    filter: true,
    cellRenderer: OptionListGroupsRenderer,
    cellRendererParams: {
      nameField: "name",
      uniqueIdField: "id",
    },
  },
  {
    headerName: "Description",
    field: "description",
    sortable: true,
    filter: true,
  },
  {
    headerName: "Customer ID",
    field: "customerId",
    sortable: true,
    filter: true,
  },
  {
    field: "isActive",
    headerName: "",
    cellRenderer: ActionButtonRenderer,
    cellRendererParams: {
      redirectUrl: "/option-lists/groups",
      updateUrl: "/api/optionListGroup",
      idField: "id",
    },
  },
];
