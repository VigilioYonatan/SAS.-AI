import { useMutation } from "@vigilio/preact-fetching";

export function groupWhatsappTelephoneDestroyApi() {
    return useMutation<
        GroupWhatsappTelephoneDestroyAPI,
        { name: string; telephone: string },
        { message: string; success: boolean }
    >("/information/group-whatsapp", async (url, body) => {
        const response = await fetch(
            `/api${url}/${body.name}/telephone/${body.telephone}`,
            {
                method: "DELETE",
            }
        );
        const result = await response.json();
        if (!result.success) throw result;
        return result;
    });
}

export interface GroupWhatsappTelephoneDestroyAPI {
    success: boolean;
    message: string;
}
