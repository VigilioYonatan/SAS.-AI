import {
    boolean,
    type Input,
    number,
    object,
    objectAsync,
    string,
} from "@vigilio/valibot";

export const visitantesPageDto = objectAsync({
    token: string(),
    api_key: string(),
    event: object({
        page: string(),
        time: number(),
        click: number(),
        scroll: number(),
        isVisit: boolean(),
    }),
});

export type VisitantesPageDto = Input<typeof visitantesPageDto>;
