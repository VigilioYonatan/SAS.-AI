import { useMutation } from "@vigilio/preact-fetching";
import type { NewSchema } from "@/empresas/schemas/new.schema";

export function webDestroyApi() {
    return useMutation<number, BackupDestroyAPI, BackupDestroyErrorAPI>(
        "/new",
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

export interface BackupDestroyAPI {
    success: boolean;
    web: NewSchema;
}

export interface BackupDestroyErrorAPI {
    success: boolean;
    message: string;
}
