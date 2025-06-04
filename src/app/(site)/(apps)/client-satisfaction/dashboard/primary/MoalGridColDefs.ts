import {ColDef} from "ag-grid-community";
import UserRenderer from "@/components/agGrids/CellRenderers/UserRenderer";
import ScoreRenderer from "@/components/agGrids/CellRenderers/ClientSatisfaction/ScoreRenderer";
import { dateValueFormatter } from "@/components/agGrids/ValueFormatters/dateValueFormatter";
import CommentRenderer from "@/components/agGrids/CellRenderers/CommentsCellRenderer";

export const ModalGridColumnDefs: ColDef[] = [
    {
        field: "clientName",
        headerName: "Client Name",
        filter: "agMultiColumnFilter",
        cellRenderer: UserRenderer,
        cellRendererParams: {
            nameField: "clientName",
            uniqueIdField: "clientId",
        },
    },
    {
        field: "date",
        headerName: "Date",
        filter: "agDateColumnFilter",
        valueFormatter: (params) => dateValueFormatter(params.value),
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
    },
];