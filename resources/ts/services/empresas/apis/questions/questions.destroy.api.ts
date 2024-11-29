import { useMutation } from "@vigilio/preact-fetching";
import type { NewSchema } from "@/empresas/schemas/new.schema";

export function questionsDestroyApi() {
    return useMutation<BackupDestroyAPI, number, BackupDestroyErrorAPI>(
        "/questions",
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
    questions: NewSchema;
}

export interface BackupDestroyErrorAPI {
    success: boolean;
    message: string;
}
