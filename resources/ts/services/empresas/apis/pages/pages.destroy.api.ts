import { useMutation } from "@vigilio/preact-fetching";
import type { NewSchema } from "@/empresas/schemas/new.schema";

export function pagesDestroyApi() {
    return useMutation<pagesDestroyAPI, number, pagesDestroyErrorAPI>(
        "/pages",
        async (url, id) => {
            const response = await fetch(`/api${url}/${id}`, {
                method: "DELETE",
            });
            const result = await response.json();
            if (!result.success) throw result;
            return result;
        }
    );
}

export interface pagesDestroyAPI {
    success: boolean;
    pages: NewSchema;
}

export interface pagesDestroyErrorAPI {
    success: boolean;
    message: string;
}
