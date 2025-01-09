import { useMutation } from "@vigilio/preact-fetching";
import type { NewSchema } from "@/empresas/schemas/new.schema";

export function crudDestroyApi() {
    return useMutation<crudDestroyAPI, number, crudDestroyErrorAPI>(
        "/crud",
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

export interface crudDestroyAPI {
    success: boolean;
    crud: NewSchema;
}

export interface crudDestroyErrorAPI {
    success: boolean;
    message: string;
}
