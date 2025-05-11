import type { Columns } from "@vigilio/preact-table";
import { UsersFormSchema } from "../schemas/users-form.schema";
import { formatDateTwo } from "~/libs/helpers";

export type UsersFormIndexSecondaryPaginator = "acciones" | "index";

const usersFormColumns: Columns<
    UsersFormSchema & { createdAt: Date },
    UsersFormIndexSecondaryPaginator
> = [
    { key: "id", cell: (_, i) => i + 1, isSort: true },
    {
        key: "name",
        header: "Nombre",
        isSort: true,
    },
    {
        key: "email",
        header: "Correo Electrónico",
        isSort: true,
    },
    { key: "telephone", header: "Teléfono", isSort: true },
    {
        key: "createdAt",
        header: "Creado",
        isSort: true,
        cell: (props) => (
            <div>
                <span>
                    {formatDateTwo(props.createdAt, "DD-MM-YYYY hh:mmA")}
                </span>
            </div>
        ),
    },
];
export default usersFormColumns;
