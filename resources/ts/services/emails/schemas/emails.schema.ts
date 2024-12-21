import {
	email,
	maxLength,
	minLength,
	number,
	object,
	string,
	toTrimmed,
	type Input,
} from "@vigilio/valibot";

export const emailsSchema = object({
	id: number(),
	name: string([toTrimmed(), minLength(3), maxLength(30)]),
	subject: string([toTrimmed(), minLength(4), maxLength(200)]),
	email: string([toTrimmed(), email()]),
	content: string([toTrimmed(), minLength(10), maxLength(200)]),
});

export type EmailsSchema = Input<typeof emailsSchema>;
export type EmailsSchemaFromServer = EmailsSchema & {
	createdAt: Date;
	updatedAt: Date;
};
