import { boolean, startsWith } from "@vigilio/valibot";
import {
    type Input,
    number,
    minLength,
    objectAsync,
    maxLength,
    toTrimmed,
    string,
} from "valibot";

export const urlsSchema = objectAsync({
    id: number(),
    web: string([
        toTrimmed(),
        minLength(1),
        startsWith("http", "Debe empezar con http"),
    ]),
    hash: string([toTrimmed(), minLength(1), minLength(3), maxLength(50)]),
    information_id: number(),
    enabled: boolean(),
});

export type UrlsSchema = Input<typeof urlsSchema>;
