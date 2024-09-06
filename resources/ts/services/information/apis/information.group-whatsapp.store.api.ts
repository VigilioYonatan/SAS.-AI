import { useMutation, type UseMutation } from "@vigilio/preact-fetching";
import type {
	ContactsSchema,
	GroupWhatsapp,
} from "../schemas/information.schema";

export function informationGroupWhatsappStoreApi(): UseMutation<
	InformationGroupWhatsappStoreApi,
	GroupWhatsapp,
	InformationGroupWhatsappStoreApiError
> {
	return useMutation("/information/group-whatsapp", async (url, body) => {
		const response = await fetch(`/api${url}`, {
			method: "POST",
			body: JSON.stringify(body),
			headers: {
				"content-type": "application/json",
			},
		});
		const result = await response.json();
		if (!result.success) throw result;
		return result;
	});
}
interface InformationGroupWhatsappStoreApi {
	success: true;
	message: string;
}
interface InformationGroupWhatsappStoreApiError {
	success: true;
	message: string;
	body: keyof ContactsSchema;
}
