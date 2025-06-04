"use client";

import { ColDef } from "ag-grid-community";
import ActionButtonRenderer from "@/components/agGrids/CellRenderers/ActionButtonRenderer";
import CustomerRenderer from "@/components/agGrids/CellRenderers/CustomerRenderer";
import UserRenderer from "@/components/agGrids/CellRenderers/UserRenderer";
import TeamCellRenderer from "@/components/agGrids/CellRenderers/TeamCellRenderer";
import TeamRenderer from "@/components/agGrids/CellRenderers/TeamRenderer";

export const teamFields: ColDef[] | any = [
  {
    field: "id",
    headerName: "ID",
    cellDataType: "number",
    maxWidth: 128,
    minWidth: 64,
    filter: "agNumberColumnFilter",
  },
  {
    field: "name",
    headerName: "Name",
    filter: "agMultiColumnFilter",
    cellRenderer: TeamRenderer,
    cellRendererParams: {
      nameField: "name",
      uniqueIdField: "userTeamUniqueId",
    },
  },
  {
    field: "custName",
    headerName: "Customer",
    cellDataType: "text",
    filter: "agMultiColumnFilter",
    cellRenderer: CustomerRenderer,
    cellRendererParams: {
      nameField: "custName",
      uniqueIdField: "custUniqueId",
      imageUrlField: "custImageUrl",
    },
  },
  {
    field: "parentTeamName",
    headerName: "Parent Department",
    cellDataType: "text",
    filter: "agMultiColumnFilter",
  },
  {
    field: "parentTeamName",
    headerName: "Type",
    cellDataType: "text",
    filter: "agMultiColumnFilter",
    cellRenderer: TeamCellRenderer,
  },
  {
    field: "isService",
    headerName: "Service?",
    filter: "agMultiColumnFilter",
  },
  {
    field: "managerFullName",
    headerName: "Manager",
    cellDataType: "text",
    filter: "agMultiColumnFilter",
    cellRenderer: UserRenderer,
    cellRendererParams: {
      nameField: "managerFullName",
      uniqueIdField: "managerUniqueId",
      imageUrlField: "managerImageUrl",
    },
  },
  {
    field: "isActive",
    headerName: "Actions",
    cellRenderer: ActionButtonRenderer,
    cellRendererParams: {
      redirectUrl: "/teams",
      updateUrl: "/api/userTeam/",
      idField: "userTeamUniqueId",
      rolesCanEdit: ["CA", "PA"],
    },
  },
];
