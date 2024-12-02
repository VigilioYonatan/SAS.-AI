import type { Columns } from "@vigilio/preact-table";
import type { ComplaintsSchemaFromServer } from "../schemas/complaints.schema";
import { formatDateTwo } from "~/libs/helpers";

export type ComplaintsIndexSecondaryPaginator = "acciones" | "index";

const complaintsColumns: Columns<
    ComplaintsSchemaFromServer,
    ComplaintsIndexSecondaryPaginator
> = [
    {
        key: "id",
        cell: (_, i) => i + 1,
        isSort: true,
    },
    {
        key: "email",
        header: "Correo",
        cell: (props) => <span class="line-clamp-2 ">{props.email}</span>,
    },
    {
        key: "detailsOfComplaint",
        header: "Detalle",
        cell: (props) => `${props.detailsOfComplaint.slice(0, 20)}...`,
    },
    {
        key: "createdAt",
        header: "Fecha",
        cell: (props) => formatDateTwo(props.createdAt!, "MM-DD-YYYY hh:mm A"),
        isSort: true,
    },
];
export default complaintsColumns;
