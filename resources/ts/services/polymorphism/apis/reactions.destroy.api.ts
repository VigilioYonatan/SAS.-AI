import { useMutation } from "@vigilio/preact-fetching";

export function reactionsDestroyApi(
    reactionsable_type: string,
    reactionsable_id: number
) {
    return useMutation<ReactionsDestroyAPI, number, ReactionsDestroyErrorAPI>(
        `/reactions/${reactionsable_type}/${reactionsable_id}`,
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

export interface ReactionsDestroyErrorAPI {
    success: boolean;
    message: string;
}
export interface ReactionsDestroyAPI {
    success: boolean;
    message: string;
}
