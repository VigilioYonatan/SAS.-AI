import { type UseQuery, useQuery } from "@vigilio/preact-fetching";
import type { NewSchema } from "@/empresas/schemas/new.schema";

export function bannerDestroyApi(
    id: number
): UseQuery<BackupDestroyAPI, BackupDestroyErrorAPI> {
    return useQuery<BackupDestroyAPI, BackupDestroyErrorAPI>(
        `/banner/${id}`,
        async (url) => {
            const response = await fetch(`/api${url}`);
            const result = await response.json();
            if (!result.success) throw result;
            return result;
        }
    );
}

export interface BackupDestroyAPI {
    success: boolean;
    banner: NewSchema;
}

export interface BackupDestroyErrorAPI {
    success: boolean;
    message: string;
}
