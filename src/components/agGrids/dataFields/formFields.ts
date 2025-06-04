import { ColDef } from "ag-grid-community";
import ActionButtonRenderer from "@/components/agGrids/CellRenderers/ActionButtonRenderer";
import FormRenderer from "@/components/agGrids/CellRenderers/FormRenderer";

export const formFields: ColDef[] | any = [
  {
    field: "id",
    headerName: "ID",
    filter: "agNumberColumnFilter",
    maxWidth: 128,
    minWidth: 64,
  },
  {
    field: "name",
    headerName: "Form Name",
    filter: "agMultiColumnFilter",
    cellRenderer: FormRenderer,
    cellRendererParams: {
      nameField: "name",
      uniqueIdField: "id",
    },
  },
  {
    field: "description",
    headerName: "Description",
    filter: "agMultiColumnFilter",
  },
  {
    field: "noTimesUsedInBusProc",
    headerName: "# BPs",
    filter: "agNumberColumnFilter",
  },
  {
    field: "isActive",
    headerName: "Actions",
    cellRenderer: ActionButtonRenderer, // Renderer for actions (edit/delete)
    cellRendererParams: {
      redirectUrl: "/forms",
      updateUrl: "/api/form/",
      idField: "id",
    },
    maxWidth: 128,
  },
];
