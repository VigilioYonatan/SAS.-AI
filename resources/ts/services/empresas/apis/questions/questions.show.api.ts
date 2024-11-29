import { type UseQuery, useQuery } from "@vigilio/preact-fetching";
import { QuestionsSchema } from "@/empresas/schemas/questions.schema";

export function questionsShowApi(
    id: number
): UseQuery<QuestionsShowAPI, QuestionsShowErrorAPI> {
    return useQuery<QuestionsShowAPI, QuestionsShowErrorAPI>(
        `/questions/${id}`,
        async (url) => {
            const response = await fetch(`/api${url}`);
            const result = await response.json();
            if (!result.success) throw result;
            return result;
        }
    );
}

export interface QuestionsShowAPI {
    success: boolean;
    question: QuestionsSchema;
}

export interface QuestionsShowErrorAPI {
    success: boolean;
    message: string;
}
