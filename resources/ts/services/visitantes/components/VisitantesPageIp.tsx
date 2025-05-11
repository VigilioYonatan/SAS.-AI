import {
    type Columns,
    type UseTable,
    type UseTableMethods,
    useTable,
} from "@vigilio/preact-table";
import type { VisitantesPagesSchema } from "../schemas/visitantes_pages.schema";
import type { VisitantesSchema } from "../schemas/visitantes.schema";
import { Fragment, useEffect } from "react";
import { visitantesPagesIpApiTable } from "../apis/visitantes.api";
import { secondsToHMS } from "~/libs/helpers";
import MagnifyingGlass from "~/components/icons/MagnifyingGlass";
import SortIcon from "~/components/icons/SortIcon";
import ArrowLeft from "~/components/icons/ArrowLeft";
import ArrowRight from "~/components/icons/ArrowRight";
import ReloadIcon from "~/components/icons/ReloadIcon";
import { useSignal } from "@preact/signals";
import LoaderSubmit from "~/components/LoaderSubmit";
import usePaginatorTimer from "~/hooks/usePaginatorTimer";

export type VisitantesPagesIpSecondaryPaginator = "index" | "interaccion";
export type VisitantesPagesIpMethods = {
    refetch: (clean?: boolean) => Promise<void>;
} & UseTableMethods<
    VisitantesPagesSchema & {
        visitantes_page: {
            totalTime: number;
            visitCount: number;
            totalCount: number;
            visits: number;
            totalClick: number;
            totalScroll: number;
        };
    },
    VisitantesPagesIpSecondaryPaginator
>;

export type VisitantesPagesIpColumnsPaginator = Columns<
    VisitantesSchema & {
        visitantes_page: {
            totalTime: number;
            visitCount: number;
            totalCount: number;
            visits: number;
            totalClick: number;
            totalScroll: number;
        };
        createdAt: Date;
    },
    VisitantesPagesIpSecondaryPaginator,
    VisitantesPagesIpMethods
>;
export type VisitantesPagesIpTable = UseTable<
    VisitantesSchema & {
        visitantes_page: {
            totalTime: number;
            visitCount: number;
            totalCount: number;
            visits: number;
            totalClick: number;
            totalScroll: number;
        };
    },
    VisitantesPagesIpSecondaryPaginator,
    VisitantesPagesIpMethods
>;
interface VisitantesPagesByVisitanteTableProps {
    page_id: number;
}
function VisitantesPagesIpTable({
    page_id,
}: VisitantesPagesByVisitanteTableProps) {
    const { time, SelectTimer } = usePaginatorTimer();
    const columns: Columns<
        VisitantesSchema & {
            visitantes_page: {
                totalTime: number;
                visitCount: number;
                totalCount: number;
                visits: number;
                totalClick: number;
                totalScroll: number;
            };
            createdAt: Date;
        },
        VisitantesPagesIpSecondaryPaginator
    > = [
        { key: "id", header: "N°", cell: (_, i) => i + 1, isSort: true },
        {
            key: "ip",
            isSort: true,
        },
        {
            key: "ubicacion",
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
                            {isCero(
                                secondsToHMS(props.visitantes_page.totalTime)
                                    .hours
                            )}
                            :
                            {isCero(
                                secondsToHMS(props.visitantes_page.totalTime)
                                    .minutes
                            ) || 0}
                            :
                            {isCero(
                                secondsToHMS(props.visitantes_page.totalTime)
                                    .seconds
                            )}
                        </span>
                        <span>
                            <b className="font-bold">Clicks:</b>{" "}
                            {props.visitantes_page.totalClick || 0}
                        </span>
                        <span>
                            <b className="font-bold">Scrolls:</b>{" "}
                            {props.visitantes_page.totalScroll || 0}
                        </span>
                    </div>
                );
            },
        },
    ];
    const table = useTable({
        columns,
        pagination: { limit: 10 },
    });

    const blogsPaginatorQuery = visitantesPagesIpApiTable(page_id, table, time);

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

    return (
        <>
            {blogsPaginatorQuery.isLoading ? (
                <div className="h-[500px] w-full flex justify-center items-center">
                    <LoaderSubmit color="var(--primary)" />
                </div>
            ) : blogsPaginatorQuery.isSuccess ? (
                <>
                    {" "}
                    <div className="flex justify-between mb-4 gap-2">
                        <SelectTimer />
                        <div className="flex gap-2 items-center">
                            <button
                                type="button"
                                onClick={() =>
                                    blogsPaginatorQuery.refetch(true)
                                }
                                className="py-2 px-3 rounded-md bg-primary"
                            >
                                {blogsPaginatorQuery.isFetching ? (
                                    <LoaderSubmit color="white" />
                                ) : (
                                    <ReloadIcon className="w-[16px] h-[16px] fill-white" />
                                )}
                            </button>
                            <div className="flex gap-2 items-center max-w-[300px] font-semibold w-full  px-2 py-2 rounded-xl text-sm bg-gray-100">
                                <MagnifyingGlass width={20} height={20} />
                                <input
                                    type="text"
                                    className="w-full font-semibold outline-none text-black bg-transparent"
                                    placeholder="Buscar"
                                    onChange={(e) => {
                                        table.search.onSearchByName(
                                            (e.target as HTMLInputElement).value
                                        );
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                    {blogsPaginatorQuery.data?.results?.length ? (
                        <>
                            <div className="">
                                <div className="overflow-auto min-h-[400px] bg-white   w-full">
                                    <table className="w-full border-collapse ">
                                        <thead className="bg-primary py-3 px-4 text-white rounded-lg overflow-auto w-full">
                                            <tr>
                                                {table.table
                                                    .Thead()
                                                    .map(
                                                        ({
                                                            isSort,
                                                            key,
                                                            value,
                                                            methods,
                                                        }) => (
                                                            <th
                                                                scope="col"
                                                                className={""}
                                                                key={key}
                                                            >
                                                                <button
                                                                    type="button"
                                                                    aria-label="button to sort"
                                                                    onClick={() => {
                                                                        if (
                                                                            isSort
                                                                        ) {
                                                                            if (
                                                                                typeof isSort ===
                                                                                "string"
                                                                            ) {
                                                                                methods?.sorting(
                                                                                    isSort
                                                                                );
                                                                                return;
                                                                            }
                                                                            methods?.sorting(
                                                                                key
                                                                            );
                                                                        }
                                                                    }}
                                                                    className="flex gap-1 justify-center items-center  w-full py-2"
                                                                    style={{
                                                                        display:
                                                                            "flex",
                                                                    }}
                                                                >
                                                                    {isSort ? (
                                                                        <SortIcon
                                                                            width={
                                                                                20
                                                                            }
                                                                            height={
                                                                                20
                                                                            }
                                                                            className="fill-white"
                                                                        />
                                                                    ) : null}
                                                                    <span className="line-clamp-1 mx-auto px-2">
                                                                        {value}
                                                                    </span>
                                                                </button>
                                                            </th>
                                                        )
                                                    )}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {table.table.TBody?.Row()?.map(
                                                (data) => (
                                                    <tr
                                                        key={data.index}
                                                        onClick={() => {
                                                            // setSolicitud(data);
                                                        }}
                                                    >
                                                        {table.table.TBody.Cell(
                                                            data
                                                        )?.map((val) => (
                                                            <td
                                                                key={val.key}
                                                                className=" py-3 text-gray-700   font-semibold tracking-wide border-b border-gray-700 text-sm"
                                                            >
                                                                <div className="flex justify-center items-center">
                                                                    {val.value}
                                                                </div>
                                                            </td>
                                                        ))}
                                                    </tr>
                                                )
                                            )}
                                        </tbody>
                                    </table>
                                </div>

                                <div className="flex justify-center py-4 items-center">
                                    <div className="flex flex-col gap-2 items-center text-sm font-semibold justify-center space-x-2 py-4">
                                        <div className="flex space-x-2">
                                            <button
                                                onClick={() =>
                                                    table.pagination.onBackPage()
                                                }
                                                type="button"
                                                aria-label="button previous table"
                                            >
                                                <ArrowLeft
                                                    fill="var(--primary)"
                                                    width={10}
                                                    height={10}
                                                />
                                            </button>
                                            {table.pagination.paginator.pages.map(
                                                (page) => (
                                                    <Fragment key={page}>
                                                        {table.pagination
                                                            .paginator
                                                            .currentPage ===
                                                        page ? (
                                                            <span className="px-3 py-1 text-primary bg-primary text-white border border-primary rounded hover:bg-primary hover:text-white">
                                                                {page}
                                                            </span>
                                                        ) : (
                                                            <button
                                                                type="button"
                                                                className="px-3 py-1 text-primary border border-primary rounded hover:bg-primary hover:text-white"
                                                                aria-label="button change page table"
                                                                onClick={() =>
                                                                    table.pagination.onChangePage(
                                                                        page
                                                                    )
                                                                }
                                                            >
                                                                {page}
                                                            </button>
                                                        )}
                                                    </Fragment>
                                                )
                                            )}

                                            <button
                                                onClick={() =>
                                                    table.pagination.onNextPage()
                                                }
                                                type="button"
                                                aria-label="button next page table"
                                            >
                                                <ArrowRight
                                                    fill="var(--primary)"
                                                    width={10}
                                                    height={10}
                                                />
                                            </button>
                                        </div>
                                        <span className="text-gray-700">
                                            Mostrando{" "}
                                            {
                                                blogsPaginatorQuery.data.results
                                                    .length
                                            }{" "}
                                            de{" "}
                                            {
                                                table.pagination.paginator
                                                    .totalItems
                                            }{" "}
                                            resultados
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </>
                    ) : (
                        <span className="text-primary font-semibold text-center block">
                            No se encontró ningun visitante pages
                        </span>
                    )}
                </>
            ) : null}
        </>
    );
}
export default VisitantesPagesIpTable;
