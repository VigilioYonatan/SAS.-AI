import { useMutation, type UseMutation } from "@vigilio/preact-fetching";
import type { ContactsSchema } from "../schemas/information.schema";

export function informationContactsDestroyApi(): UseMutation<
    InformationContactsDestroyApi,
    { telephone: string },
    InformationContactsDestroyApiError
> {
    return useMutation("/information/contacts", async (url, body) => {
        const response = await fetch(`/api${url}/${body.telephone}`, {
            method: "DELETE",
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
interface InformationContactsDestroyApi {
    success: true;
    message: string;
}
interface InformationContactsDestroyApiError {
    success: true;
    message: string;
    body: keyof ContactsSchema;
}
