import { useMutation } from "@vigilio/preact-fetching";

export function groupWhatsappDestroyApi() {
    return useMutation<
        GroupWhatsappDestroyAPI,
        string,
        { message: string; success: boolean }
    >("/empresas/group-whatsapp", async (url, name) => {
        const response = await fetch(`/api${url}/${name}`, {
            method: "DELETE",
        });
        const result = await response.json();
        if (!result.success) throw result;
        return result;
    });
}

export interface GroupWhatsappDestroyAPI {
    success: boolean;
    message: string;
}
