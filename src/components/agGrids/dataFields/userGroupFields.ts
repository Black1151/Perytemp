import { ColDef } from "ag-grid-community";
import ActionButtonRenderer from "@/components/agGrids/CellRenderers/ActionButtonRenderer";
import CustomerRenderer from "@/components/agGrids/CellRenderers/CustomerRenderer";
import UserGroupRenderer from "@/components/agGrids/CellRenderers/UserGroupRenderer";

export const groupFields: ColDef[] | any = [
  {
    field: "id",
    headerName: "ID",
    cellDataType: "number",
    filter: "agNumberColumnFilter",
    maxWidth: 128,
    minWidth: 64,
  },
  {
    field: "name",
    headerName: "Group Name",
    filter: "agMultiColumnFilter",
    cellRenderer: UserGroupRenderer,
    cellRendererParams: {
      nameField: "name",
      uniqueIdField: "uniqueId",
    },
  },
  {
    field: "description",
    headerName: "Description",
    filter: "agMultiColumnFilter",
  },
  {
    field: "custName",
    headerName: "Customer",
    filter: "agMultiColumnFilter",
    cellRenderer: CustomerRenderer,
    cellRendererParams: {
      nameField: "custName",
      uniqueIdField: "custUniqueId",
      imageUrlField: "custImageUrl",
    },
  },
  {
    field: "isActive",
    headerName: "Actions",
    cellRenderer: ActionButtonRenderer,
    cellRendererParams: {
      redirectUrl: "/user-groups",
      updateUrl: "/api/userGroup/",
      idField: "uniqueId",
    },
  },
];
