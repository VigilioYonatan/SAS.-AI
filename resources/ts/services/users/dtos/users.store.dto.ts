import {
	type Input,
	array,
	instance,
	merge,
	object,
	omit,
	nullable,
} from "@vigilio/valibot";
import { usersSchema } from "../schemas/users.schema";
import validFileValibot from "~/libs/valibot";

export const usersStoreDto = merge([
	omit(usersSchema, [
		"id",
		"user_code",
		"google",
		"token",
		"isOnline",
		"photo",
		"subscription",
		"enabledEmailsOffers",
		"enabledNotification",
		"premios",
	]),
	object({
		photo: nullable(
			array(instance(File), [
				validFileValibot({
					required: false,
					min: 1,
					max: 1,
				}),
			]),
		),
	}),
]);

export type UsersStoreDto = Input<typeof usersStoreDto>;
