import { useMutation, type UseMutation } from "@vigilio/preact-fetching";
import type {
    ContactsSchema,
    GroupWhatsapp,
} from "../schemas/information.schema";

export function informationGroupWhatsappUpdateApi(): UseMutation<
    InformationGroupWhatsappUpdateApi,
    GroupWhatsapp,
    InformationGroupWhatsappUpdateApiError
> {
    return useMutation("/information/group-whatsapp", async (url, body) => {
        const response = await fetch(`/api${url}`, {
            method: "PUT",
            body: JSON.stringify(body),
            headers: {
                "content-type": "application/json",
            },
        });
        const result = await response.json();
        if (!result.success) throw result;
        return result;
    });
}
interface InformationGroupWhatsappUpdateApi {
    success: true;
    message: string;
}
interface InformationGroupWhatsappUpdateApiError {
    success: true;
    message: string;
    body: keyof ContactsSchema;
}
