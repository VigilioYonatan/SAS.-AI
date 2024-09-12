import { coerce, date } from "@vigilio/valibot";
import { type Input, number, objectAsync, string } from "valibot";

export const urlsPaymentSchema = objectAsync({
	id: number(),
	url: string(),
	hash: string(),
	time: coerce(date(), (value) => new Date(value as string)),
	empresa_id: number(),
});

export type UrlsPaymentSchema = Input<typeof urlsPaymentSchema>;
