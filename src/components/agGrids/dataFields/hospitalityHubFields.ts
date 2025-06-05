import { ColDef } from "ag-grid-community";
import HospitalityLinkRenderer from "@/components/agGrids/CellRenderers/HospitalityLinkRenderer";

export const hotelsFields: ColDef[] = [
  { field: "id", headerName: "ID", maxWidth: 128, minWidth: 64 },
  {
    field: "name",
    headerName: "Name",
    filter: "agMultiColumnFilter",
    cellRenderer: HospitalityLinkRenderer,
    cellRendererParams: { category: "hotels", nameField: "name", idField: "id" },
  },
  { field: "location", headerName: "Location", filter: "agMultiColumnFilter" },
  { field: "rating", headerName: "Rating", filter: "agNumberColumnFilter" },
];

export const rewardsFields: ColDef[] = [
  { field: "id", headerName: "ID", maxWidth: 128, minWidth: 64 },
  {
    field: "name",
    headerName: "Name",
    filter: "agMultiColumnFilter",
    cellRenderer: HospitalityLinkRenderer,
    cellRendererParams: { category: "rewards", nameField: "name", idField: "id" },
  },
  { field: "points", headerName: "Points", filter: "agNumberColumnFilter" },
  { field: "expiryDate", headerName: "Expiry", filter: "agDateColumnFilter" },
];

export const eventsFields: ColDef[] = [
  { field: "id", headerName: "ID", maxWidth: 128, minWidth: 64 },
  {
    field: "name",
    headerName: "Name",
    filter: "agMultiColumnFilter",
    cellRenderer: HospitalityLinkRenderer,
    cellRendererParams: { category: "events", nameField: "name", idField: "id" },
  },
  { field: "date", headerName: "Date", filter: "agDateColumnFilter" },
  { field: "location", headerName: "Location", filter: "agMultiColumnFilter" },
];

export const medicalFields: ColDef[] = [
  { field: "id", headerName: "ID", maxWidth: 128, minWidth: 64 },
  {
    field: "provider",
    headerName: "Provider",
    filter: "agMultiColumnFilter",
    cellRenderer: HospitalityLinkRenderer,
    cellRendererParams: { category: "medical", nameField: "provider", idField: "id" },
  },
  { field: "speciality", headerName: "Speciality", filter: "agMultiColumnFilter" },
  { field: "location", headerName: "Location", filter: "agMultiColumnFilter" },
];

export const legalFields: ColDef[] = [
  { field: "id", headerName: "ID", maxWidth: 128, minWidth: 64 },
  {
    field: "provider",
    headerName: "Provider",
    filter: "agMultiColumnFilter",
    cellRenderer: HospitalityLinkRenderer,
    cellRendererParams: { category: "legal", nameField: "provider", idField: "id" },
  },
  { field: "speciality", headerName: "Speciality", filter: "agMultiColumnFilter" },
  { field: "location", headerName: "Location", filter: "agMultiColumnFilter" },
];
