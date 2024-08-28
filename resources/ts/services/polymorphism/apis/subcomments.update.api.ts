import { useMutation } from "@vigilio/preact-fetching";
import type { CommentsSchema } from "@/polymorphism/schemas/comments.schema";
import type { SubcommentsUpdateDto } from "../dtos/subcomments.update.dto";

export function subcommentsUpdateApi(
    commentables_type: string,
    commentables_id: number,
    subcommentables_id: number,
    id: number
) {
    return useMutation<
        SubcommentsUpdateAPI,
        SubcommentsUpdateDto,
        SubcommentsUpdateErrorAPI
    >(
        `/comments/${commentables_type}/${commentables_id}/subcomments/${subcommentables_id}/${id}`,
        async (url, body) => {
            const response = await fetch(`/api${url}`, {
                body: JSON.stringify(body),
                method: "PUT",
                headers: {
                    "content-type": "application/json",
                },
            });
            const result = await response.json();
            if (!result.success) throw result;
            return result;
        }
    );
}

export interface SubcommentsUpdateAPI {
    success: boolean;
    subcomment: CommentsSchema;
}

export interface SubcommentsUpdateErrorAPI {
    success: boolean;
    message: string;
    body: string;
}
