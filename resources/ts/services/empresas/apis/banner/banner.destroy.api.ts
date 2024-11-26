import { useMutation } from "@vigilio/preact-fetching";

export function bannerDestroyApi() {
    return useMutation<BackupDestroyAPI, number, BackupDestroyErrorAPI>(
        "/banner",
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
    message: string;
}

export interface BackupDestroyErrorAPI {
    success: boolean;
    message: string;
}
