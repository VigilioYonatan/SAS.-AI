import type { QuestionsStoreDto } from "@/empresas/dtos/questions.store.dto";
import type { QuestionsSchema } from "@/empresas/schemas/questions.schema";
import { useMutation, type UseMutation } from "@vigilio/preact-fetching";
export const storeUploadImagesQuestions = "/uploads/questions/image";
export function questionsStoreApi(): UseMutation<
    QuestionsStoreApi,
    QuestionsStoreDto,
    QuestionsStoreApiError
> {
    return useMutation("/questions", async (url, body) => {
       
        const response = await fetch(`/api${url}`, {
            method: "POST",
            body: JSON.stringify(body),
            headers: {
                "content-type": "application/json",
            },
        });
        const result = await response.json();
        if (!result.success) throw result;
        return result;
    });
}
interface QuestionsStoreApi {
    success: true;
    message: string;
}
interface QuestionsStoreApiError {
    success: true;
    message: string;
    body: keyof QuestionsSchema;
}
