"use client";

import { ColDef } from "ag-grid-community";
import ActionButtonRenderer from "@/components/agGrids/CellRenderers/ActionButtonRenderer";
import WorkflowRenderer from "@/components/agGrids/CellRenderers/WorkflowRenderer";

export const workflowFields: ColDef[] = [
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
    headerName: "Workflow Name",
    filter: "agTextColumnFilter",
    minWidth: 200,
    cellRenderer: WorkflowRenderer,
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
    field: "noTimesUsedInTool",
    headerName: "# Tools",
    filter: "agNumberColumnFilter",
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
      redirectUrl: "/workflows",
      updateUrl: "/api/workflow/",
      idField: "id",
    },
    maxWidth: 150,
  },
];
