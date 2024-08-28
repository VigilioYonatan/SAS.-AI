import { useMutation } from "@vigilio/preact-fetching";

export function backgroundDestroyApi() {
    return useMutation<BackgroundDestroyAPI, number, BackgroundDestroyErrorAPI>(
        "/background",
        async (url, id: number) => {
            const response = await fetch(`/api${url}/${id}`, {
                method: "DELETE",
            });
            const result = await response.json();

            if (!result.success) throw result;
            return result;
        }
    );
}

export interface BackgroundDestroyErrorAPI {
    success: boolean;
    message: string;
}
export interface BackgroundDestroyAPI {
    success: boolean;
    message: string;
}
