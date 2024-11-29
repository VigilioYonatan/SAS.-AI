import { useMutation } from "@vigilio/preact-fetching";
import type { QuestionsUpdateDto } from "@/empresas/dtos/questions.update.dto";

export function questionsUpdateApi(id: number) {
    return useMutation<
        QuestionsUpdateAPI,
        QuestionsUpdateDto,
        QuestionsUpdateErrorAPI
    >(`/questions/${id}`, async (url, body) => {
        const response = await fetch(`/api${url}`, {
            method: "PUT",
            body: JSON.stringify(body),
            headers: {
                "Content-type": "application/json",
            },
        });
        const result = await response.json();
        if (!result.success) throw result;
        return result;
    });
}

export interface QuestionsUpdateAPI {
    success: boolean;
    message: string;
}

export interface QuestionsUpdateErrorAPI {
    success: boolean;
    body: keyof QuestionsUpdateDto;
    message: string;
}
