import { useQuery } from "@vigilio/preact-fetching";
import type { UseTable } from "@vigilio/preact-table";
import type { DepartmentsSchemaFromServer } from "@/ubigeo/schemas/departments.schema";
import type { DepartmentsIndexSecondaryPaginator } from "@/ubigeo/libs/DepartmentsColumns";

export function departmentsPaginatorApi(
    table: UseTable<
        DepartmentsSchemaFromServer,
        DepartmentsIndexSecondaryPaginator
    >
) {
    const result = useQuery<
        DepartmentsPaginatorAPI,
        DepartmentsPaginatorAPIError
    >(
        "/paginator/departments",
        async (url) => {
            const data = new URLSearchParams();
            data.append("offset", String(table.pagination.value.offset));
            data.append("limit", String(table.pagination.value.limit));
            data.append("search", String(table.search.value));
            if (!Object.keys(table.sort.value).length) {
                data.append("ubigeo", "DESC");
            }
            for (const [key, value] of Object.entries(table.sort.value)) {
                data.append(key, value as string);
            }
            const response = await fetch(`/api${url}?${data}`);
            const result = await response.json();
            if (!result.success) throw result;
            return result;
        },
        {
            onSuccess(data) {
                table.updateData({
                    count: data.count,
                    result: data.results,
                    methods: {
                        refetch: result.refetch,
                    },
                });
            },
        }
    );
    return result;
}
interface DepartmentsPaginatorAPI {
    success: true;
    results: DepartmentsSchemaFromServer[];
    count: number;
    next: string | null;
    previous: string | null;
}
interface DepartmentsPaginatorAPIError {
    success: false;
    message: string;
    params: string;
}
