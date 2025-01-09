import { useMutation } from "@vigilio/preact-fetching";

export function crudDataDestroyApi(type: string) {
    return useMutation<crudDataDestroyAPI, number, crudDataDestroyErrorAPI>(
        `/crud_data/${type}`,
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

export interface crudDataDestroyAPI {
    success: boolean;
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    string: any;
}

export interface crudDataDestroyErrorAPI {
    success: boolean;
    message: string;
}
