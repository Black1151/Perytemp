import { ColDef } from "ag-grid-community";
import ActionButtonRenderer from "@/components/agGrids/CellRenderers/ActionButtonRenderer";
import UserRenderer from "@/components/agGrids/CellRenderers/UserRenderer";
import CustomerRenderer from "@/components/agGrids/CellRenderers/CustomerRenderer";
import SiteLinkRenderer from "@/components/agGrids/CellRenderers/SiteLinkRenderer";
import UserVerifiedRenderer from "../CellRenderers/UserVerifiedRenderer";

// Updated AgGrids fields
export const userFields: ColDef[] | any = [
  {
    field: "id",
    headerName: "ID",
    filter: "agMultiColumnFilter",
    maxWidth: 128,
    minWidth: 64,
  },
  {
    field: "fullName",
    headerName: "Name",
    filter: "agMultiColumnFilter",
    cellRenderer: UserRenderer,
    cellRendererParams: {
      uniqueIdField: "userUniqueId",
      nameField: "fullName",
      imageUrlField: "imageUrl",
    },
  },
  {
    field: "email",
    headerName: "Email",
    filter: "agMultiColumnFilter",
  },
  {
    field: "role",
    headerName: "Role",
    filter: "agMultiColumnFilter",
  },
  {
    field: "jobTitle",
    headerName: "Job Title",
    filter: "agMultiColumnFilter",
  },
  {
    field: "custName",
    headerName: "Customer",
    filter: "agMultiColumnFilter",
    cellRenderer: CustomerRenderer,
    cellRendererParams: {
      nameField: "custName",
      imageUrlField: "custImageUrl",
      uniqueIdField: "custUniqueId",
    },
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
  {
    field: "isVerified",
    headerName: "Verified",
    filter: "agMultiColumnFilter",
    cellRenderer: UserVerifiedRenderer,
  },
  {
    field: "isActive",
    headerName: "Actions",
    cellRenderer: ActionButtonRenderer,
    cellRendererParams: {
      redirectUrl: "/users",
      updateUrl: "/api/user/",
      idField: "userUniqueId",
      rolesCanEdit: ["CA", "PA"],
    },
  },
];
