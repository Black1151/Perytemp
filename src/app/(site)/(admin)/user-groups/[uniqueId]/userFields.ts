import { ColDef } from "ag-grid-community";
import UserRenderer from "@/components/agGrids/CellRenderers/UserRenderer";
import CustomerRenderer from "@/components/agGrids/CellRenderers/CustomerRenderer";

export const userFieldDefs: ColDef[] = [
  {
    headerName: "ID",
    field: "id",
    maxWidth: 100,
    hide: true,
    minWidth: 64,
  },
  {
    headerName: "Name",
    field: "fullName",
    cellRenderer: UserRenderer,
    rowDrag: true,
    cellRendererParams: {
      nameField: "fullName",
      imageUrlField: "imageUrl",
    },
  },
  {
    headerName: "Company",
    field: "custName",
    cellRenderer: CustomerRenderer,
    cellRendererParams: {
      nameField: "custName",
      imageUrlField: "custImageUrl",
    },
  },
  {
    headerName: "Email",
    field: "email",
  },
];
