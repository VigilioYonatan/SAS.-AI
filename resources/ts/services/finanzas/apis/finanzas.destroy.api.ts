import { useMutation } from "@vigilio/preact-fetching";

export function finanzasDestroyApi() {
    return useMutation<FinanzasDestroyAPI, number, FinanzasDestroyErrorAPI>(
        "/finanzas",
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

export interface FinanzasDestroyErrorAPI {
    success: boolean;
    message: string;
}
export interface FinanzasDestroyAPI {
    success: boolean;
    message: string;
}
