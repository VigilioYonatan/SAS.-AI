import {
	merge,
	minLength,
	object,
	string,
	type Input,
	omit,
} from "@vigilio/valibot";
import { emailsStoreDto } from "./emails.store.dto";

export const emailsSendAllDto = merge([
	omit(emailsStoreDto, ["name", "email"]),
	object({
		title: string([minLength(5)]),
		content: string([minLength(5)]),
	}),
]);
export type EmailsSendAllDto = Input<typeof emailsSendAllDto>;
