import {ColDef} from "ag-grid-community";
import UserRenderer from "@/components/agGrids/CellRenderers/UserRenderer";
import ScoreRenderer from "@/components/agGrids/CellRenderers/ClientSatisfaction/ScoreRenderer";
import { dateValueFormatter } from "@/components/agGrids/ValueFormatters/dateValueFormatter";
import CommentsCellRenderer from "@/components/agGrids/CellRenderers/CommentsCellRenderer";
import { uniqueId } from "lodash";

export const serviceCommentsColumnDefs: ColDef[] = [
    {
        headerName: "Service Name",
        field: "serviceName",
        sortable: true,
        filter: true,
        resizable: true,
        rowGroup: true,
    },
    {
        headerName: "Client Name",
        field: "clientName",
        sortable: true,
        filter: true,
        resizable: true,
        cellRenderer: UserRenderer,
        cellRendererParams: {
            nameField: "clientName",
            uniqueIdField: "clientId",
        },
    },
    {
        field: "date",
        headerName: "Date",
        sortable: true,
        filter: true,
        valueFormatter: (params) => dateValueFormatter(params.value),
    },
    {
        field: "rating",
        headerName: "Rating",
        chartDataType: "category",
        cellRenderer: ScoreRenderer,
    },    
    {
        field: "comment",
        headerName: "Comment",
        chartDataType: "category",
        cellRenderer: CommentsCellRenderer,
        cellRendererParams: {
            comments: "comment",
          },
    },
];