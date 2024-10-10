import { useMutation, type UseMutation } from "@vigilio/preact-fetching";

export function whatsappUpdateApi(): UseMutation<
    WhatsappUpdateApi,
    unknown,
    WhatsappUpdateApiError
> {
    return useMutation("/whatsapp/update", async (url) => {
        const response = await fetch(`/api${url}`, {
            method: "POST",
        });
        const result = await response.json();
        if (!result.success) throw result;
        return result;
    });
}

interface WhatsappUpdateApi {
    success: true;
    message: string;
}
interface WhatsappUpdateApiError {
    success: true;
    message: string;
}
