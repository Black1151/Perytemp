import {ColDef} from "ag-grid-community";
import ActionButtonRenderer from "@/components/agGrids/CellRenderers/ActionButtonRenderer";

// Updated AgGrids fields
export const dashboardWorkflowFields: ColDef[] | any = [
    {
        field: "id",
        headerName: "ID",
        filter: "agNumberColumnFilter",
        maxWidth: 128,
        minWidth: 64,
        sort: "asc",
    },
    {
        field: "dashboard.name",
        headerName: "Dashboard",
        filter: "agSetColumnFilter",
    },
    {
        field: "workflow.name",
        headerName: "Workfow",
        filter: "agSetColumnFilter",
    },
    {
        field: "dashboardOrder",
        headerName: "Order",
        filter: "agNumberColumnFilter",
    },
    {
        field: "isActive",
        headerName: "",
        cellRenderer: ActionButtonRenderer,
        maxWidth: 128,
        minWidth: 64,
        cellRendererParams: {
            redirectUrl: "/dashboard-workflows",
            idField: "id",
        },
    },
];
