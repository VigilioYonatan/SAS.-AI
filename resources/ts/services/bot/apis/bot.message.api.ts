import { useMutation } from "@vigilio/preact-fetching";

export function botSendMessageApi() {
    return useMutation(
        "/bot/message",
        async (
            url,
            body: {
                data: string | File;
                telephone: string;
            }
        ) => {
            const form = new FormData();
            form.append("message", body.data);
            const response = await fetch(`/api${url}/${body.telephone}`, {
                body: form,
                method: "POST",
            });
            const result = await response.json();
            if (!result.success) throw result;
            return result;
        }
    );
}
