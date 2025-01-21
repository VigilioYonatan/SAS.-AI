import { useMutation } from "@vigilio/preact-fetching";

export function aiHTMLApi() {
    return useMutation<
        AIHTMLApi,
        { image: string; prompt: string },
        AISendMessageApiError
    >("/ia/html", async (url, body) => {
        const response = await fetch(`/api${url}`, {
            body: JSON.stringify({
                ...body,
            }),
            headers: {
                "Content-Type": "application/json",
            },
            method: "POST",
        });
        const result: AIHTMLApi = await response.json();
        if (!result.success) throw result;
        return result;
    });
}
interface AIHTMLApi {
    success: true;
    data: string;
}
interface AISendMessageApiError {
    success: true;
    message: string;
}
