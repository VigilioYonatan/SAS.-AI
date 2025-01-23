import { Signal } from "@preact/signals";
import { useMutation, type UseMutation } from "@vigilio/preact-fetching";

export function whatsappLogoutApi(
    name: Signal<string>
): UseMutation<WhatsappLogoutApi, unknown, WhatsappLogoutApiError> {
    return useMutation(`/whatsapp/logout/${name.value}`, async (url) => {
        const response = await fetch(`/api${url}`, {
            method: "POST",
        });
        const result = await response.json();
        if (!result.success) throw result;
        return result;
    });
}
interface WhatsappLogoutApi {
    success: true;
    message: string;
}
interface WhatsappLogoutApiError {
    success: true;
    message: string;
}
