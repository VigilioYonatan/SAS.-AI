import { useMutation, type UseMutation } from "@vigilio/preact-fetching";
import { ContactsSchema } from "../schemas/empresas.schema";

export function empresaContactsStoreUpdateApi(): UseMutation<
	empresaContactsStoreUpdateApi,
	ContactsSchema,
	empresaContactsStoreUpdateApiError
> {
	return useMutation("/empresas/contacts", async (url, body) => {
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
interface empresaContactsStoreUpdateApi {
	success: true;
	message: string;
}
interface empresaContactsStoreUpdateApiError {
	success: true;
	message: string;
	body: keyof ContactsSchema;
}
