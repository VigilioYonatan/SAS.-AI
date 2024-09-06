import { useMutation, type UseMutation } from "@vigilio/preact-fetching";
export type empresaContactsUpdateMutation = UseMutation<
    empresaContactsUpdateApi,
    { ia: boolean; telephone: string; isFavorite: boolean },
    empresaContactsUpdateErrorApi
>;
export function empresaContactsUpdateApi(): empresaContactsUpdateMutation {
    return useMutation("/empresas/contacts", async (url, body) => {
        const { telephone, ...rest } = body;
        const response = await fetch(`/api${url}/${telephone}`, {
            method: "PUT",
            body: JSON.stringify(rest),
            headers: {
                "Content-Type": "application/json",
            },
        });
        const result = await response.json();
        if (!result.success) throw result;
        return result;
    });
}
interface empresaContactsUpdateApi {
    success: true;
    message: string;
}
interface empresaContactsUpdateErrorApi {
    success: false;
    message: string;
}
