import { useMutation, type UseMutation } from "@vigilio/preact-fetching";
import type { ContactsSchema } from "../schemas/information.schema";

export function informationContactsStoreUpdateApi(): UseMutation<
	InformationContactsStoreUpdateApi,
	ContactsSchema,
	InformationContactsStoreUpdateApiError
> {
	return useMutation("/information/contacts", async (url, body) => {
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
interface InformationContactsStoreUpdateApi {
	success: true;
	message: string;
}
interface InformationContactsStoreUpdateApiError {
	success: true;
	message: string;
	body: keyof ContactsSchema;
}
