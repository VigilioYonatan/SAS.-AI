import { omitAsync, type Input } from "@vigilio/valibot";
import { questionsSchema } from "../schemas/questions.schema";

export const questionsUpdateDto = omitAsync(questionsSchema, [
    "id",
    "empresa_id",
]);
export type QuestionsUpdateDto = Input<typeof questionsUpdateDto>;
