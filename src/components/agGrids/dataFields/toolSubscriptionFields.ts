"use client";

import { ColDef, ValueFormatterParams } from "ag-grid-community";
import ActionButtonRenderer from "@/components/agGrids/CellRenderers/ActionButtonRenderer";
import ToolConfigRenderer from "@/components/agGrids/CellRenderers/ToolConfigRenderer";
import CustomerRenderer from "@/components/agGrids/CellRenderers/CustomerRenderer";
import { currencyFormatter } from "@/components/agGrids/ValueFormatters/currencyFormatter";

export const toolSubscriptionFields: ColDef[] = [
  {
    field: "id",
    headerName: "ID",
    filter: "agNumberColumnFilter",
    maxWidth: 128,
    minWidth: 64,
    sortable: true,
  },
  {
    field: "toolName",
    headerName: "Tool Name",
    filter: "agMultiColumnFilter",
    cellRenderer: ToolConfigRenderer,
    cellRendererParams: {
      uniqueIdField: "toolId",
      imageUrlField: "toolIconImageUrl",
      nameField: "toolName",
    },
  },
  {
    field: "custName",
    headerName: "Customer",
    filter: "agMultiColumnFilter",
    cellRenderer: CustomerRenderer,
    cellRendererParams: {
      uniqueIdField: "custUniqueId",
      imageUrlField: "custImageUrl",
      nameField: "custName",
    },
  },
  {
    field: "subTypeName",
    headerName: "Subscription Type",
    filter: "agMultiColumnFilter",
  },
  {
    field: "subStartDate",
    headerName: "Subscription Start Date",
    filter: "agDateColumnFilter",
  },
  {
    field: "price",
    headerName: "Price (£)",
    filter: "agNumberColumnFilter",
    type: "rightAligned",
    valueFormatter: (params: ValueFormatterParams) => {
      return currencyFormatter(params.value);
    },
  },
  {
    field: "isActive",
    headerName: "Actions",
    cellRenderer: ActionButtonRenderer,
    cellRendererParams: {
      redirectUrl: "/tool-subscriptions",
      updateUrl: "/api/toolCustomer/",
      idField: "id",
    },
  },
];
