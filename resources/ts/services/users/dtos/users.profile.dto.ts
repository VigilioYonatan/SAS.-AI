import {
	type Input,
	pick,
	object,
	nullable,
	array,
	instance,
} from "@vigilio/valibot";
import { usersSchema } from "../schemas/users.schema";
import validFileValibot from "~/libs/valibot";

export const usersProfileDto = pick(usersSchema, [
	"name",
	"address",
	"birthday",
	"lastname",
	"enabledNotification",
	"email",
	"speciality",
	"identification_number",
]);
export const usersProfilePhotoDto = object({
	photo: nullable(
		array(instance(File), [
			validFileValibot({
				required: true,
				min: 1,
				max: 1,
				types: ["image/webp", "image/jpg", "image/jpeg", "image/png"],
			}),
		]),
	),
});

export type UsersProfileDto = Input<typeof usersProfileDto>;
export type UsersProfilePhotoDto = Input<typeof usersProfilePhotoDto>;
