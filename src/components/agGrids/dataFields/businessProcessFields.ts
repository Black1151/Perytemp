"use client";

import { ColDef } from "ag-grid-community";
import ActionButtonRenderer from "@/components/agGrids/CellRenderers/ActionButtonRenderer";
import BusinessProcessRenderer from "@/components/agGrids/CellRenderers/BusinessProcessRenderer";

export const businessProcessFields: ColDef[] = [
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
    headerName: "Business Process Name",
    filter: "agTextColumnFilter",
    minWidth: 200,
    cellRenderer: BusinessProcessRenderer,
    cellRendererParams: {
      nameField: "name",
      uniqueIdField: "id",
    },
  },
  {
    field: "description",
    headerName: "Description",
    filter: "agTextColumnFilter",
    minWidth: 300,
  },
  {
    field: "noTimesUsedInWorkflow",
    headerName: "# WFs",
    filter: "agNumberColumnFilter",
  },
  {
    field: "isActive",
    headerName: "Actions",
    cellRenderer: ActionButtonRenderer, // A custom renderer for edit/delete actions
    cellRendererParams: {
      redirectUrl: "/business-processes",
      updateUrl: "/api/businessProcess/",
      idField: "id",
    },
    maxWidth: 150,
  },
];
