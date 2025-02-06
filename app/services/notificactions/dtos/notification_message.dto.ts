import { type Input, number, objectAsync, string } from "@vigilio/valibot";

export const notificationMessageDto = objectAsync({
    title: string(),
    message: string(),
    url: string(),
    days: number(),
    again: number(),
});
export type NotificationMessageDto = Input<typeof notificationMessageDto>;
