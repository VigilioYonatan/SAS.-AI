import type { UsersSchema } from "@/users/schemas/users.schema";
import { number, string, type Input, object, nullable } from "@vigilio/valibot";
import type { NotificationsUserSchema } from "./notifications_user.schema";

export const notificationsSchema = object({
	id: number(),
	user_id: nullable(number()),
	url: string(),
	type: string(),
	content: string(),
});

export type NotificationsSchema = Input<typeof notificationsSchema>;
export type NotificationsSchemaFromServer = NotificationsSchema & {
	use: Pick<UsersSchema, "id" | "username" | "photo" | "role_id"> | null;
	NotificationsUser: NotificationsUserSchema;
	createdAt?: Date;
	updatedAt?: Date;
};
export type NotifcationType = "register" | "order" | "comment";
