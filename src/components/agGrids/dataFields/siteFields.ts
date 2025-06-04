import { ColDef } from "ag-grid-community";
import ActionButtonRenderer from "@/components/agGrids/CellRenderers/ActionButtonRenderer";
import CustomerRenderer from "@/components/agGrids/CellRenderers/CustomerRenderer";
import UserRenderer from "@/components/agGrids/CellRenderers/UserRenderer";
import SiteLinkRenderer from "@/components/agGrids/CellRenderers/SiteLinkRenderer";

// Updated AgGrids fields for Sites
export const siteFields: ColDef[] | any = [
  {
    field: "id",
    headerName: "ID",
    cellDataType: "number",
    filter: "agNumberColumnFilter",
    maxWidth: 128,
    minWidth: 64,
  },
  {
    field: "siteName",
    headerName: "Site Name",
    filter: "agMultiColumnFilter",
    cellRenderer: SiteLinkRenderer,
    cellRendererParams: {
      uniqueIdField: "siteUniqueId",
      nameField: "siteName",
    },
  },
  {
    field: "siteTypeName",
    headerName: "Type",
    filter: "agMultiColumnFilter",
  },
  {
    field: "address1",
    headerName: "St. Name",
    filter: "agMultiColumnFilter",
  },
  {
    field: "address3",
    headerName: "City",
    filter: "agMultiColumnFilter",
  },
  {
    field: "postcode",
    headerName: "Postcode",
    filter: "agMultiColumnFilter",
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
    field: "primaryContactFullName",
    headerName: "Primary Contact",
    filter: "agMultiColumnFilter",
    cellRenderer: UserRenderer,
    cellRendererParams: {
      uniqueIdField: "primaryContactUniqueId",
      nameField: "primaryContactFullName",
      imageUrlField: "primaryContactImageUrl",
    },
  },
  {
    field: "isActive",
    headerName: "Actions",
    cellRenderer: ActionButtonRenderer,
    cellRendererParams: {
      redirectUrl: "/sites",
      updateUrl: "/api/site/",
      idField: "siteUniqueId",
      rolesCanEdit: ["CA", "PA"],
    },
  },
];
