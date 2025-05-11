import { useMutation } from "@vigilio/preact-fetching";
import { generateSignature } from "~/libs/helpers";

export function aiImagesApi() {
    return useMutation<AIImagesApi, string, AISendMessageApiError>(
        "/ia/images",
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
            const result: AIImagesApi = await response.json();
            if (!result.success) throw result;
            return result;
        }
    );
}
interface AIImagesApi {
    success: true;
    data: {
        images: { image: string; preview: string }[];
    };
}
interface AISendMessageApiError {
    success: true;
    message: string;
}
