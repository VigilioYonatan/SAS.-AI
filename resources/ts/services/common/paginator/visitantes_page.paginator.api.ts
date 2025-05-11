import { VisitantesIndexSecondaryPaginator } from "@/visitantes/components/VisitantesPages";
import { VisitantesPagesIndexSecondaryPaginator } from "@/visitantes/components/VisitantesPagesByVisitante";
import { VisitantesSchema } from "@/visitantes/schemas/visitantes.schema";
import { VisitantesPagesSchema } from "@/visitantes/schemas/visitantes_pages.schema";
import { useQuery } from "@vigilio/preact-fetching";
import { UseTable } from "@vigilio/preact-table";
import { TimeTable } from "~/hooks/usePaginatorTimer";

export function visitantesApiTable(
    table: UseTable<VisitantesSchema, VisitantesIndexSecondaryPaginator>,
    time: TimeTable | null
) {
    const query = useQuery<VisitantesPaginatorAPI, VisitantesPaginatorAPIError>(
        "/paginator/visitantes",
        async (url) => {
            const data = new URLSearchParams();

            data.append("offset", String(table.pagination.value.offset));
            data.append("limit", String(table.pagination.value.limit));
            data.append("search", String(table.search.debounceTerm || ""));
            if (!Object.keys(table.sort.value).length) {
                data.append("id", "DESC");
            }

            for (const [key, value] of Object.entries(table.sort.value)) {
                data.append(key, value as string);
            }
            if (time) {
                data.append("time", time);
            }
            const response = await fetch(`/api${url}?${data}`);
            const result = await response.json();
            return result;
        },
        {
            onSuccess(data) {
                table.updateData({
                    count: data.count,
                    result: data.results,
                });
            },
        }
    );
    return query;
}
interface VisitantesPaginatorAPI {
    success: true;
    results: VisitantesSchema[];
    count: number;
    next: string | null;
    previous: string | null;
}
interface VisitantesPaginatorAPIError {
    success: false;
    message: string;
    params: string;
}

// ------
export type VisitantesPagesSchemaFromServer = VisitantesPagesSchema & {
    createdAt: Date;
    visits: number;
    totalTime: number;
    visitCount: number;
    totalCount: number;
    totalClick: number;
    totalScroll: number;
};
export function visitantesPagesApiTable(
    table: UseTable<
        VisitantesPagesSchemaFromServer,
        VisitantesPagesIndexSecondaryPaginator
    >,
    time: TimeTable | null
) {
    const query = useQuery<
        VisitantesPagesPaginatorAPI,
        VVisitantesPagesPaginatorAPIError
    >(
        "/paginator/visitantes-pages",
        async (url) => {
            const data = new URLSearchParams();

            data.append("offset", String(table.pagination.value.offset));
            data.append("limit", String(table.pagination.value.limit));
            data.append("search", String(table.search.debounceTerm || ""));

            if (!Object.keys(table.sort.value).length) {
                data.append("id", "DESC");
            }
            for (const [key, value] of Object.entries(table.sort.value)) {
                data.append(key, value as string);
            }
            if (time) {
                data.append("time", time);
            }

            const response = await fetch(`/api${url}?${data}`);
            const result = await response.json();
            return result;
        },
        {
            onSuccess(data) {
                table.updateData({
                    count: data.count,
                    result: data.results,
                });
            },
        }
    );
    return query;
}
interface VisitantesPagesPaginatorAPI {
    success: true;
    results: VisitantesPagesSchemaFromServer[];
    count: number;
    next: string | null;
    previous: string | null;
}
interface VVisitantesPagesPaginatorAPIError {
    success: false;
    message: string;
    params: string;
}

export function visitantesPagesByVisitanteApiTable(
    table: UseTable<
        VisitantesPagesSchemaFromServer,
        VisitantesIndexSecondaryPaginator
    >,
    time: TimeTable | null,
    visitante_id: number
) {
    const query = useQuery<
        VisitantesPagesByVisitantePaginatorAPI,
        VisitantesPagesByVisitantePaginatorAPIError
    >(
        "/api/paginator/visitantes-pages-visitante-id",
        async (url) => {
            const data = new URLSearchParams();

            data.append("offset", String(table.pagination.value.offset));
            data.append("limit", String(table.pagination.value.limit));
            data.append("search", String(table.search.debounceTerm || ""));

            if (!Object.keys(table.sort.value).length) {
                data.append("id", "DESC");
            }

            for (const [key, value] of Object.entries(table.sort.value)) {
                data.append(key, value as string);
            }
            if (time) {
                data.append("time", time);
            }
            data.append("visitante_id", String(visitante_id));

            const response = await fetch(`${url}?${data}`);
            const result = await response.json();
            return result;
        },
        {
            onSuccess(data) {
                table.updateData({
                    count: data.count,
                    result: data.results,
                });
            },
        }
    );
    return query;
}
interface VisitantesPagesByVisitantePaginatorAPI {
    success: true;
    results: VisitantesPagesSchemaFromServer[];
    count: number;
    next: string | null;
    previous: string | null;
}
interface VisitantesPagesByVisitantePaginatorAPIError {
    success: false;
    message: string;
    params: string;
}
//

export function visitantesPagesIpApiTable(
    page_id: number,
    table: UseTable<
        VisitantesPagesSchemaFromServer,
        VisitantesIndexSecondaryPaginator
    >,
    time: TimeTable
) {
    const query = useQuery<
        VisitantesPagesIPPaginatorAPI,
        VisitantesPagesByIPPaginatorAPIError
    >(
        "/api/paginator/visitantes-pages-ip",
        async (url) => {
            const data = new URLSearchParams();

            data.append("page_id", String(page_id));
            data.append("offset", String(table.pagination.value.offset));
            data.append("limit", String(table.pagination.value.limit));
            data.append("search", String(table.search.debounceTerm || ""));
            if (!Object.keys(table.sort.value).length) {
                data.append("id", "DESC");
            }
            for (const [key, value] of Object.entries(table.sort.value)) {
                data.append(key, value as string);
            }
            if (time) {
                data.append("time", time);
            }

            const response = await fetch(`${url}?${data}`);
            const result = await response.json();
            return result;
        },
        {
            onSuccess(data) {
                table.updateData({
                    count: data.count,
                    result: data.results,
                });
            },
        }
    );
    return query;
}
interface VisitantesPagesIPPaginatorAPI {
    success: true;
    results: VisitantesPagesSchemaFromServer[];
    count: number;
    next: string | null;
    previous: string | null;
}
interface VisitantesPagesByIPPaginatorAPIError {
    success: false;
    message: string;
    params: string;
}
