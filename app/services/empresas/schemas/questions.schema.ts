import {
    maxLength,
    minLength,
    nullable,
    number,
    objectAsync,
    string,
    type Input,
} from "@vigilio/valibot";

export const questionsSchema = objectAsync({
    id: number(),
    question: string([minLength(5), maxLength(250)]),
    answer: nullable(string([maxLength(250)])),
    empresa_id: number(),
});
export type QuestionsSchema = Input<typeof questionsSchema>;
