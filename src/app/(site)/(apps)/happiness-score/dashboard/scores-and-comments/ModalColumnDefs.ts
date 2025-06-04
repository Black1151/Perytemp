import {ColDef} from "ag-grid-community";
import HappinessScoreRenderer from "@/components/agGrids/CellRenderers/HappinessScoreRenderer";
import CommentsCellRenderer from "@/components/agGrids/CellRenderers/CommentsCellRenderer";
import StaffHappinessDetailsRenderer
    from "@/components/agGrids/CellRenderers/HappinessScore/StaffHappinessDetailsRenderer";

export const modalColDef: ColDef[] = [
    {
        headerName: "Name",
        field: "fullName",
        sortable: true,
        filter: true,
        resizable: true,
        cellRenderer: StaffHappinessDetailsRenderer,
    },
    {
        field: "deptName",
        headerName: "Department",
        filter: "agMultiColumnFilter",
        chartDataType: "category",
    },
    {
        field: "siteName",
        headerName: "Site",
        filter: "agMultiColumnFilter",
        chartDataType: "category",
    },
    {
        field: "eowDate",
        headerName: "Week",
        sort: "asc",
        chartDataType: "category",
    },
    {
        field: "monthYear",
        headerName: "Month - Year",
        chartDataType: "category",
    },
    {
        field: "happinessScore",
        headerName: "Happiness Score",
        chartDataType: "series",
        cellRenderer: HappinessScoreRenderer,
    },
    {
        field: "comments",
        headerName: "Comments",
        cellRenderer: CommentsCellRenderer,
    },
];