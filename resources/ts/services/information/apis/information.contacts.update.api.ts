import { useMutation, type UseMutation } from "@vigilio/preact-fetching";
export type InformationContactsUpdateMutation = UseMutation<
    InformationContactsUpdateApi,
    { ia: boolean; telephone: string; isFavorite: boolean },
    InformationContactsUpdateErrorApi
>;
export function informationContactsUpdateApi(): InformationContactsUpdateMutation {
    return useMutation("/information/contacts", async (url, body) => {
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
interface InformationContactsUpdateApi {
    success: true;
    message: string;
}
interface InformationContactsUpdateErrorApi {
    success: false;
    message: string;
}
