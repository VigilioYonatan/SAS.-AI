import { useQuery } from "@vigilio/preact-fetching";
import type { QuestionsSchema } from "@/empresas/schemas/questions.schema";

export function questionsIndexApi() {
    return useQuery("/questions", async (url) => {
        const response = await fetch(`/api${url}`);
        const result: QuestionsIndexAPI = await response.json();
        if (!result.success) throw result;
        return result;
    });
}

export interface QuestionsIndexAPI {
    success: boolean;
    data: QuestionsSchema[];
}

export interface Logo {
    dimension: number;
    file: string;
}
