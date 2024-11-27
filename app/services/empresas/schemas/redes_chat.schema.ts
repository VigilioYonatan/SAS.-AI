import {
	array,
	number,
	object,
	objectAsync,
	string,
	type Input,
} from "@vigilio/valibot";

export const redesChatSchema = objectAsync({
	id: number(),
	whatsapp_chat: array(object({ id: string(), name: string() })),
	tiktok_chat: array(object({ id: string(), name: string() })),
	linkedin_chat: array(object({ id: string(), name: string() })),
	messenger_chat: array(object({ id: string(), name: string() })),
	instagram_chat: array(object({ id: string(), name: string() })),
	telegram_chat: array(object({ id: string(), name: string() })),
	empresa_id: number(),
});
export type RedesChatSchema = Input<typeof redesChatSchema>;
