import { useQuery } from "@vigilio/preact-fetching";

export function crudDataIndexApi(type: string) {
    return useQuery(`/crud_data/${type}`, async (url) => {
        const response = await fetch(`/api${url}`);
        const result: CrudDataIndexAPI = await response.json();
        if (!result.success) throw result;
        return result;
    });
}

export type CrudDataIndexAPI = {
    [key: string]: Record<string, unknown> & { id: number; slug: string };
} & { success: boolean };
