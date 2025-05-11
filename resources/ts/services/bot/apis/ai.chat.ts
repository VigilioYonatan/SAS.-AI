import { useMutation } from "@vigilio/preact-fetching";
import { Input, minLength, object, string } from "@vigilio/valibot";
export const aichat = object({
    message: string([minLength(1)]),
    token: string(),
    id: string(),
});
export type AiChat = Input<typeof aichat>;
export function aiChatApi() {
    return useMutation<AIProductApi, AiChat, AISendMessageApiError>(
        "/api/ia/chat",
        async (url, body) => {
            const response = await fetch(url, {
                method: "POST",
                body: JSON.stringify(body),
                headers: { "Content-Type": "application/json" },
            });
            const result: AIProductApi = await response.json();
            return result;
        }
    );
}
interface AIProductApi {
    success: true;
    data: {
        images: { image: string; preview: string }[];
        description: string;
        caracterisiticas: { key: string; value: string }[];
        product_key: string | null;
    };
}
interface AISendMessageApiError {
    success: true;
    message: string;
}
