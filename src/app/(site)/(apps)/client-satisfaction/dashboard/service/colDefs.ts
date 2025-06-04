import {ColDef} from "ag-grid-community";
import UserRenderer from "@/components/agGrids/CellRenderers/UserRenderer";
import ScoreRenderer from "@/components/agGrids/CellRenderers/ClientSatisfaction/ScoreRenderer";
import { dateValueFormatter } from "@/components/agGrids/ValueFormatters/dateValueFormatter";
import CommentsCellRenderer from "@/components/agGrids/CellRenderers/CommentsCellRenderer";

export const servicesCommentsColumnDefs: ColDef[] = [
    {
        headerName: "Service",
        field: "serviceName",
        sortable: true,
        filter: true,
        resizable: true,
        rowGroup: true,
    },
    {
        field: "date",
        headerName: "Date",
        valueFormatter: (params) => dateValueFormatter(params.value),
    },
    {
        field: "clientName",
        headerName: "Client Name",
        filter: "agMultiColumnFilter",
        chartDataType: "category",
        cellRenderer: UserRenderer,
        cellRendererParams: {
            uniqueIdField: "clientId",
            nameField: "clientName",
          },
    },
    {
        field: "rating",
        headerName: "Rating",
        chartDataType: "category",
        cellRenderer: ScoreRenderer,
        cellRendererParams: {
            score: "rating",
          },
    },
    {
        field: "comment",
        headerName: "Comment",
        chartDataType: "category",
        cellRenderer: CommentsCellRenderer,
        cellRendererParams: {
            comments: "comment",
            fullName: "clientName",
          },
    },
];

export const singleServiceCommentsColumnDefs: ColDef[] = [
    {
        field: "date",
        headerName: "Date",
        valueFormatter: (params) => dateValueFormatter(params.value),
    },
    {
        field: "clientName",
        headerName: "Client Name",
        filter: "agMultiColumnFilter",
        chartDataType: "category",
        cellRenderer: UserRenderer,
        cellRendererParams: {
            uniqueIdField: "clientId",
            nameField: "clientName",
          },
    },
    {
        field: "rating",
        headerName: "Rating",
        chartDataType: "category",
        cellRenderer: ScoreRenderer,
        cellRendererParams: {
            score: "rating",
          },
    },
    {
        field: "comment",
        headerName: "Comment",
        chartDataType: "category",
        cellRenderer: CommentsCellRenderer,
        cellRendererParams: {
            comments: "comment",
            fullName: "clientName",
          },
    },
];