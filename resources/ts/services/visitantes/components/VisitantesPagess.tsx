import {
    type Columns,
    type UseTable,
    type UseTableMethods,
    useTable,
} from "@vigilio/preact-table";
import type { VisitantesPagesSchema } from "../schemas/visitantes_pages.schema";
import { formatDateTwo, secondsToHMS } from "~/libs/helpers";
import { useSignal } from "@preact/signals";
import { useEffect, type ReactNode } from "preact/compat";
import LoaderSubmit from "~/components/LoaderSubmit";
import usePaginatorTimer from "~/hooks/usePaginatorTimer";
import VigilioTable from "~/components/table";
import { visitantesPagesApiTable } from "@/common/paginator/visitantes_page.paginator.api";

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

function VisitantesPagesPagessTable() {
    const { time, SelectTimer } = usePaginatorTimer();
    const page_id = useSignal<number | null>(null);

    const columns: Columns<
        VisitantesPagesSchema & {
            createdAt: Date;
            updatedAt: Date;
            totalTime: number;
            visitCount: number;
            totalCount: number;
            totalClick: number;
            visits: number;
            totalScroll: number;
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
            header: "INTERACCIÓN",
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
                            {formatDateTwo(props.updatedAt) as ReactNode}
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

    const visitantesPaginatorQuery = visitantesPagesApiTable(
        // biome-ignore lint/suspicious/noExplicitAny: <explanation>
        table as any,
        time
    );

    useEffect(() => {
        visitantesPaginatorQuery.refetch(false);
    }, [
        table.search.debounceTerm,
        table.pagination.page,
        table.pagination.value.limit,
        table.search.debounceTerm,
        table.sort.value,
        time,
    ]);

    return (
        <div>
            {visitantesPaginatorQuery.isLoading ? (
                <div className="h-[500px] w-full flex justify-center items-center">
                    <LoaderSubmit color="var(--primary)" />
                </div>
            ) : visitantesPaginatorQuery.isSuccess ? (
                <>
                    <div class="overflow-auto">
                        <VigilioTable
                            query={visitantesPaginatorQuery}
                            table={table}
                        >
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
            ) : null}
            {/* <Modal
                isOpen={!!page_id.value}
                onClose={() => {
                    page_id.value = null;
                }}
            >
                {page_id.value ? (
                    <VisitantesPagesIpTable page_id={page_id.value} />
                ) : null}
            </Modal> */}
        </div>
    );
}
export default VisitantesPagesPagessTable;
