import {
    type Columns,
    type UseTable,
    type UseTableMethods,
    useTable,
} from "@vigilio/preact-table";
import type { VisitantesPagesSchema } from "../schemas/visitantes_pages.schema";
import { formatDateTwo, secondsToHMS } from "~/libs/helpers";
import { useEffect, type ReactNode } from "preact/compat";
import usePaginatorTimer from "~/hooks/usePaginatorTimer";
import VigilioTable from "~/components/table";
import { visitantesPagesByVisitanteApiTable } from "@/common/paginator/visitantes_page.paginator.api";

export type VisitantesPagesIndexSecondaryPaginator = "index" | "interaccion";
export type VisitantesPagesIndexMethods = {
    refetch: (clean?: boolean) => Promise<void>;
} & UseTableMethods<
    VisitantesPagesSchema,
    VisitantesPagesIndexSecondaryPaginator
>;

export type VisitantesPagesColumnsPaginator = Columns<
    VisitantesPagesSchema & { createdAt: Date },
    VisitantesPagesIndexSecondaryPaginator,
    VisitantesPagesIndexMethods
>;
export type VisitantesPagesIndexTable = UseTable<
    VisitantesPagesSchema & { createdAt: Date },
    VisitantesPagesIndexSecondaryPaginator,
    VisitantesPagesIndexMethods
>;
interface VisitantesPagesByVisitanteTableProps {
    visitante_id: number;
    onClose: () => void;
    isOpen: boolean;
}
function VisitantesPagesByVisitanteTable({
    visitante_id,
    onClose,
    isOpen,
}: VisitantesPagesByVisitanteTableProps) {
    const { time, SelectTimer } = usePaginatorTimer();

    const columns: Columns<
        VisitantesPagesSchema & {
            createdAt: Date;
            updatedAt: Date;
            totalTime: number;
            visitCount: number;
            totalCount: number;
            totalClick: number;
            totalScroll: number;
            visits: number;
        },
        VisitantesPagesIndexSecondaryPaginator
    > = [
        { key: "id", header: "N°", cell: (_, i) => i + 1, isSort: true },
        {
            key: "page",
            header: "Página",
            cell: (props) => (
                <a href={props.page} target="_blank" rel="noreferrer">
                    {props.page}
                </a>
            ),
            isSort: true,
        },
        {
            key: "interaccion",
            header: "Interacción",
            cell: (props) => {
                function isCero(time: number) {
                    return time < 11 ? `0${time}` : time;
                }
                return (
                    <div className="flex flex-col gap-1">
                        <span>
                            <b className="font-bold">Horas Vistas:</b>{" "}
                            {isCero(secondsToHMS(props.totalTime).hours)}:
                            {isCero(secondsToHMS(props.totalTime).minutes) || 0}
                            :{isCero(secondsToHMS(props.totalTime).seconds)}
                        </span>
                        <span>
                            <b className="font-bold">Clicks:</b>{" "}
                            {props.totalClick || 0}
                        </span>
                        <span>
                            <b className="font-bold">Scrolls:</b>{" "}
                            {props.totalScroll || 0}
                        </span>
                    </div>
                );
            },
        },
        {
            key: "updatedAt",
            header: "Actualización",
            cell: (props) => {
                return (
                    <div className="flex flex-col gap-1">
                        <span>
                            <b className="font-bold">Total vistas:</b> <br />
                            {props.visits}
                        </span>
                        <span>
                            <b className="font-bold">Ultima actualización:</b>{" "}
                            <br />
                            {
                                formatDateTwo(
                                    props.updatedAt,
                                    "DD-MM-YYYY hh:mmA"
                                ) as ReactNode
                            }
                        </span>
                    </div>
                );
            },
            isSort: true,
        },
    ];
    const table = useTable({
        columns,
        pagination: { limit: 10 },
    });

    const visitantesPagesQuery = visitantesPagesByVisitanteApiTable(
        table,
        time,
        visitante_id
    );

    useEffect(() => {
        visitantesPagesQuery.refetch(false);
    }, [
        table.search.debounceTerm,
        table.pagination.page,
        table.pagination.value.limit,
        table.search.debounceTerm,
        table.sort.value,
    ]);
    useEffect(() => {
        // cuando cambie el time en el select. hacer peticion
        visitantesPagesQuery.refetch(false);
    }, [time]);
    return (
        <div>
            <div class="overflow-x-auto overflow-y-hidden">
                <VigilioTable query={visitantesPagesQuery} table={table}>
                    <VigilioTable.header>
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
                            <VigilioTable.tbody.row
                            // handleClick={handleOpenUser}
                            >
                                {(data) => (
                                    <VigilioTable.tbody.td data={data} />
                                )}
                            </VigilioTable.tbody.row>
                        </VigilioTable.tbody>
                    </VigilioTable.table>
                    <VigilioTable.footer>
                        <VigilioTable.footer.show />
                        <VigilioTable.footer.paginator />
                    </VigilioTable.footer>
                </VigilioTable>
            </div>
        </div>
    );
}
export default VisitantesPagesByVisitanteTable;
