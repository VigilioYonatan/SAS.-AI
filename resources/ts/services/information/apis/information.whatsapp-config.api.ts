import type {
	ContactsSchema,
	Whatsappconfig,
} from "../schemas/information.schema";
import { useMutation, type UseMutation } from "@vigilio/preact-fetching";

export function informationWhatsappConfigUpdateApi(): UseMutation<
	InformationWhatsappConfigUpdateApi,
	Whatsappconfig,
	InformationWhatsappConfigUpdateApiError
> {
	return useMutation("/information/whatsapp-config", async (url, body) => {
		const response = await fetch(`/api${url}`, {
			method: "PUT",
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
interface InformationWhatsappConfigUpdateApi {
	success: true;
	message: string;
}
interface InformationWhatsappConfigUpdateApiError {
	success: true;
	message: string;
	body: keyof ContactsSchema;
}
