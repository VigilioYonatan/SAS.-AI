import { omitAsync, type Input } from "@vigilio/valibot";
import { questionsSchema } from "../schemas/questions.schema";

export const questionsStoreDto = omitAsync(questionsSchema, [
    "id",
    "empresa_id",
]);
export type QuestionsStoreDto = Input<typeof questionsStoreDto>;
