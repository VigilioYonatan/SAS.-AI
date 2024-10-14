import { useMutation } from "@vigilio/preact-fetching";

export function categoriesFinanzasDestroyApi() {
    return useMutation<
        CategoriesFinanzasDestroyAPI,
        number,
        CategoriesFinanzasDestroyErrorAPI
    >("/finanzas", async (url, id: number) => {
        const response = await fetch(`/api${url}/${id}`, {
            method: "DELETE",
        });
        const result = await response.json();

        if (!result.success) throw result;
        return result;
    });
}

export interface CategoriesFinanzasDestroyErrorAPI {
    success: boolean;
    message: string;
}
export interface CategoriesFinanzasDestroyAPI {
    success: boolean;
    message: string;
}
