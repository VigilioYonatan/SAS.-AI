import { useMutation } from "@vigilio/preact-fetching";
import { generateSignature } from "~/libs/helpers";

export function aiFindErrorApi() {
    return useMutation<AIFinErrorApi, string, AISendMessageApiError>(
        "/ia/find-error",
        async (url, body) => {
            const urlpath = `/api${url}/${body}`;
            const { signature, timestamp } = await generateSignature(
                "GET",
                urlpath
            );
            const response = await fetch(urlpath, {
                headers: {
                    "x-signature": signature,
                    "x-timestamp": timestamp.toString(),
                },
            });
            const result: AIFinErrorApi = await response.json();
            if (!result.success) throw result;
            return result;
        }
    );
}
interface AIFinErrorApi {
    success: true;
    data: {
        images: { image: string; preview: string }[];
    };
}
interface AISendMessageApiError {
    success: true;
    message: string;
}
