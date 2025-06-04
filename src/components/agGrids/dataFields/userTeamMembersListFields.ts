import { ColDef } from "ag-grid-community";
import UserRenderer from "@/components/agGrids/CellRenderers/UserRenderer";
import SiteLinkRenderer from "@/components/agGrids/CellRenderers/SiteLinkRenderer"; // Updated AgGrids fields

// Updated AgGrids fields
export const userTeamMembersListFields: ColDef[] | any = [
  {
    field: "userId",
    headerName: "ID",
    filter: "agMultiColumnFilter",
    maxWidth: 128,
    minWidth: 64,
  },
  {
    field: "userFullname",
    headerName: "Name",
    filter: "agMultiColumnFilter",
    cellRenderer: UserRenderer,
    cellRendererParams: {
      uniqueIdField: "userUniqueId",
      nameField: "userFullname",
      imageUrlField: "userImageUrl",
    },
  },
  {
    field: "userTeamName",
    headerName: "Team",
    filter: "agMultiColumnFilter",
  },
  {
    field: "userEmail",
    headerName: "Email",
    filter: "agMultiColumnFilter",
  },
  {
    field: "siteName",
    headerName: "Site",
    filter: "agMultiColumnFilter",
    cellRenderer: SiteLinkRenderer,
    cellRendererParams: {
      nameField: "siteName",
      uniqueIdField: "siteUniqueId",
    },
  },
];
