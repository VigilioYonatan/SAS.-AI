import {
    mergeAsync,
    minLength,
    object,
    string,
    type Input,
    omitAsync,
} from "@vigilio/valibot";
import { emailsStoreDto } from "./emails.store.dto";

export const emailsSendAllDto = mergeAsync([
    omitAsync(emailsStoreDto, ["name", "email"]),
    object({
        title: string([minLength(5)]),
        content: string([minLength(5)]),
    }),
]);
export type EmailsSendAllDto = Input<typeof emailsSendAllDto>;
