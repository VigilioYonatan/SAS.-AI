import {
    array,
    boolean,
    maxLength,
    maxValue,
    minLength,
    minValue,
    nullable,
    number,
    object,
    objectAsync,
    string,
    toTrimmed,
    type Input,
} from "@vigilio/valibot";

export const citasSettingSchema = objectAsync({
    id: number(),
    max_days: number([minValue(0), maxValue(120)]),
    max_minutes: number([minValue(10), maxValue(360)]),
    sendQuestionChunk: boolean(),
    maxCitas: number([minValue(1)]),
    maxCitasForHour: number([minValue(1)]),
    questions: array(
        object({
            question: string([minLength(4)]),
            options: array(string([minLength(3), maxLength(30)])),
        })
    ),
    enabled: boolean(),
    isNextDay: boolean(),
    sendAlert: nullable(number([maxValue(24)])),
    horario: array(
        object({
            id: number(),
            day: string([toTrimmed()]),
            openTime: string(),
            closeTime: string(),
            enabled: boolean(),
        })
    ),
    custom: nullable(string([minLength(10), maxLength(255)])),
    empresa_id: number(),
});
export type CitasSettingSchema = Input<typeof citasSettingSchema>;
