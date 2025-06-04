"use client";

import { ColDef } from "ag-grid-community";
import ActionButtonRenderer from "@/components/agGrids/CellRenderers/ActionButtonRenderer";
import CustomerRenderer from "@/components/agGrids/CellRenderers/CustomerRenderer";
import ColourCellRenderer from "@/components/agGrids/CellRenderers/ColourCellRenderer";
import TagRenderer from "@/components/agGrids/CellRenderers/TagRenderer";

export const tagFields: ColDef[] | any = [
  {
    field: "id",
    headerName: "ID",
    filter: "agNumberColumnFilter",
    maxWidth: 128,
    minWidth: 64,
  },
  {
    field: "name",
    headerName: "Tag Name",
    filter: "agMultiColumnFilter",
    cellRenderer: TagRenderer,
    cellRendererParams: {
      nameField: "name",
      uniqueIdField: "id",
    },
  },
  {
    field: "colour",
    headerName: "Colour",
    filter: "agMultiColumnFilter",
    maxWidth: 128,
    cellRenderer: ColourCellRenderer,
  },
  {
    field: "score",
    headerName: "Score",
    filter: "agNumberColumnFilter",
  },
  {
    field: "weight",
    headerName: "Weight",
    filter: "agNumberColumnFilter",
  },
  {
    field: "custName",
    headerName: "Customer",
    filter: "agMultiColumnFilter",
    cellRenderer: CustomerRenderer,
    cellRendererParams: {
      uniqueIdField: "custUniqueId",
      nameField: "custName",
      imageUrlField: "custImageUrl",
    },
  },
  {
    field: "isActive",
    headerName: "Actions",
    cellRenderer: ActionButtonRenderer, // Renderer for actions (edit/delete)
    cellRendererParams: {
      redirectUrl: "/tags",
      updateUrl: "/api/tag/",
      idField: "id",
    },
    maxWidth: 128,
  },
];
