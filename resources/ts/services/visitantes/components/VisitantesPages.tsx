import {
    type Columns,
    type UseTable,
    type UseTableMethods,
    useTable,
} from "@vigilio/preact-table";
import type { VisitantesSchema } from "../schemas/visitantes.schema";

import { formatDateTwo } from "~/libs/helpers";
import VisitantesPagesByVisitanteTable from "./VisitantesPagesByVisitante";
import { useSignal } from "@preact/signals";
import { useEffect, type ReactNode } from "preact/compat";
import usePaginatorTimer from "~/hooks/usePaginatorTimer";
import LoaderSubmit from "~/components/LoaderSubmit";
import VigilioTable from "~/components/table";
import { visitantesApiTable } from "@/common/paginator/visitantes_page.paginator.api";

export type VisitantesIndexSecondaryPaginator =
    | "index"
    | "interaccion"
    | "detail"
    | "fecha";
export type VisitantesIndexMethods = {
    refetch: (clean?: boolean) => Promise<void>;
} & UseTableMethods<VisitantesSchema, VisitantesIndexSecondaryPaginator>;

export type VisitantesColumnsPaginator = Columns<
    VisitantesSchema & { createdAt: Date },
    VisitantesIndexSecondaryPaginator,
    VisitantesIndexMethods
>;
export type VisitantesIndexTable = UseTable<
    VisitantesSchema & { createdAt: Date },
    VisitantesIndexSecondaryPaginator,
    VisitantesIndexMethods
>;
function VisitantesTable() {
    const { time, SelectTimer } = usePaginatorTimer();
    const visitante_id = useSignal<null | number>(null);
    const columns: Columns<
        VisitantesSchema & { createdAt: string; updatedAt: string },
        VisitantesIndexSecondaryPaginator
    > = [
        { key: "id", header: "N°", cell: (_, i) => i + 1, isSort: true },
        {
            key: "ip",
            header: "IP",
            isSort: true,
        },
        {
            key: "detail",
            header: "Detalles",
            cell: (props) => {
                return (
                    <div className="flex flex-col gap-1">
                        <span>
                            <b className="font-bold">Sistema Operativo:</b>{" "}
                            {props.os}
                        </span>
                        <span>
                            <b className="font-bold">Navegador Web:</b>{" "}
                            {props.browser}
                        </span>
                        <span>
                            <b className="font-bold">Ubicación:</b>{" "}
                            {props.ubicacion}
                        </span>
                    </div>
                );
            },
        },
        {
            key: "fecha",
            header: "SESIONES",
            cell: (props) => (
                <div>
                    <b className="font-bold">Ultima Sesión:</b>
                    {formatDateTwo(props.updatedAt) as ReactNode} <br />
                    <b className="font-bold">Primera Sesión:</b>{" "}
                    {formatDateTwo(props.createdAt) as ReactNode}
                </div>
            ),
        },
    ];
    const table = useTable({
        columns,
        pagination: { limit: 10 },
    });

    const blogsPaginatorQuery = visitantesApiTable(table, time);

    useEffect(() => {
        blogsPaginatorQuery.refetch(false);
    }, [
        table.search.debounceTerm,
        table.pagination.page,
        table.pagination.value.limit,
        table.search.debounceTerm,
        table.sort.value,
        time,
    ]);
    useEffect(() => {
        if (visitante_id) {
            document.body.classList.add("overflow-hidden");
            return;
        }
        document.body.classList.remove("overflow-hidden");
    }, [visitante_id]);
    return (
        <div>
            {blogsPaginatorQuery.isLoading ? (
                <div className="h-[500px] w-full flex justify-center items-center">
                    <LoaderSubmit color="var(--primary)" />
                </div>
            ) : blogsPaginatorQuery.isSuccess ? (
                <>
                    <div class="overflow-auto">
                        <VigilioTable query={blogsPaginatorQuery} table={table}>
                            <VigilioTable.header className="flex justify-center md:justify-between items-center mb-3  flex-wrap gap-2">
                                <SelectTimer />
                                <div className="flex items-center gap-1">
                                    <VigilioTable.header.limit />
                                    <VigilioTable.header.refetch />
                                </div>
                            </VigilioTable.header>
                            <VigilioTable.table>
                                <VigilioTable.thead>
                                    <VigilioTable.thead.row>
                                        <VigilioTable.thead.th />
                                    </VigilioTable.thead.row>
                                </VigilioTable.thead>
                                <VigilioTable.tbody>
                                    <VigilioTable.tbody.row>
                                        {(data) => (
                                            <VigilioTable.tbody.td
                                                data={data}
                                            />
                                        )}
                                    </VigilioTable.tbody.row>
                                </VigilioTable.tbody>
                            </VigilioTable.table>
                            <VigilioTable.footer>
                                <div className="flex justify-center flex-col items-center gap-2">
                                    <VigilioTable.footer.paginator />
                                    <VigilioTable.footer.show />
                                </div>
                            </VigilioTable.footer>
                        </VigilioTable>
                    </div>
                </>
            ) : null}{" "}
            {visitante_id.value ? (
                <VisitantesPagesByVisitanteTable
                    visitante_id={visitante_id.value}
                    isOpen={!!visitante_id.value}
                    onClose={() => {
                        visitante_id.value = null;
                    }}
                />
            ) : (
                <></>
            )}
        </div>
    );
}

export default VisitantesTable;
