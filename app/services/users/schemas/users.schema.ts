import { slug } from "@vigilio/express-core/helpers";
import {
	type Input,
	number,
	minLength,
	objectAsync,
	email,
	maxLength,
	string,
	array,
	boolean,
	date,
	coerce,
	nullable,
	transform,
	toTrimmed,
	nullableAsync,
	object,
	custom,
} from "@vigilio/valibot";
import { usersPhotoQualities } from "../libs";
import { filesSchema } from "@/uploads/schemas/uploads.schema";

export const subscription = objectAsync({
	endpoint: string(),
	keys: object({ p256dh: string(), auth: string() }),
});
export type Subscription = Input<typeof subscription>;
export const usersSchema = objectAsync({
	id: number(),
	user_code: string(),
	username: string([toTrimmed(), minLength(1), minLength(6), maxLength(30)]),
	identification_number: nullable(string("Documento de identidad no válido")),
	name: string([toTrimmed(), minLength(1), minLength(3), maxLength(30)]),
	lastname: nullable(string([toTrimmed(), minLength(3), maxLength(60)])),
	birthday: nullable(coerce(date(), (value) => new Date(value as string))),
	email: nullable(string([toTrimmed(), minLength(1), email(), maxLength(100)])),
	password: string([
		toTrimmed(),
		minLength(1),
		minLength(6),
		maxLength(30),
		custom((val) => /[a-zA-Z]/.test(val), "Debe tener por lo menos una letra."),
		custom((val) => /\d/.test(val), "Debe tener por lo menos un número."),
	]),
	address: nullable(string([toTrimmed(), minLength(10), maxLength(100)])),
	telephone: string([
		toTrimmed(),
		minLength(6),
		custom((value) => /^\d+$/.test(value), "Este campo solo permite números."),
	]),
	reference: nullable(string([minLength(10), maxLength(100)])),
	photo: nullable(array(filesSchema(usersPhotoQualities))),
	enabled: boolean(),
	isOnline: boolean(),
	slug: transform(
		string([toTrimmed(), minLength(1), minLength(3), maxLength(30)]),
		slug,
	),
	token: nullable(string()),
	speciality: nullable(string()),
	role_id: number(),
	empresa_id: number(),
	subscription: nullableAsync(subscription),
	buys: nullable(
		array(
			object({
				title: string(),
				date: nullable(coerce(date(), (val) => new Date(val as Date))),
				order: string(),
			}),
		),
	),
	enabledNotification: nullable(boolean()),
	city_id: nullable(number()),
});

export type UsersSchema = Input<typeof usersSchema> & {
	updatedAt?: Date;
	createdAt?: Date;
};
export type UsersSchemaFromServer = UsersSchema & {
	createdAt?: Date;
	updatedAt?: Date;
};
