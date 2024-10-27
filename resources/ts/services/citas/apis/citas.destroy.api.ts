import { useMutation } from "@vigilio/preact-fetching";

export function citasDestroyApi() {
    return useMutation<CitasDestroyAPI, number, CitasDestroyErrorAPI>(
        "/citas",
        async (url, body) => {
            const response = await fetch(`/api${url}/${body}`, {
                method: "DELETE",
            });
            const result = await response.json();
            if (!result.success) throw result;
            return result;
        }
    );
}

export interface CitasDestroyAPI {
    success: boolean;
    message: string;
}
export interface CitasDestroyErrorAPI {
    success: boolean;
    message: string;
    body: string;
}
