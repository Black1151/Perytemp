import { ColDef } from "ag-grid-community";
import ActionButtonRenderer from "@/components/agGrids/CellRenderers/ActionButtonRenderer";
import OptionListsRenderer from "@/components/agGrids/CellRenderers/OptionListsRenderer";

export const optionListFields: ColDef[] | any = [
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
    cellRenderer: OptionListsRenderer,
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
    headerName: "Editable by Customer",
    field: "isEditableByCustomer",
    sortable: true,
    filter: true,
    cellRenderer: "booleanCellRenderer",
  },
  {
    headerName: "Group ID",
    field: "optionListGroupId",
    sortable: true,
    filter: true,
  },
  {
    field: "isActive",
    headerName: "",
    cellRenderer: ActionButtonRenderer,
    cellRendererParams: {
      redirectUrl: "/option-lists/lists",
      updateUrl: "/api/optionList",
      idField: "id",
    },
  },
];
