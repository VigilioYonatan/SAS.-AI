import { useMutation, type UseMutation } from "@vigilio/preact-fetching";
import { ContactsSchema, GroupWhatsapp } from "../schemas/empresas.schema";

export function empresaGroupWhatsappStoreApi(): UseMutation<
	empresaGroupWhatsappStoreApi,
	GroupWhatsapp,
	empresaGroupWhatsappStoreApiError
> {
	return useMutation("/empresas/group-whatsapp", async (url, body) => {
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
interface empresaGroupWhatsappStoreApi {
	success: true;
	message: string;
}
interface empresaGroupWhatsappStoreApiError {
	success: true;
	message: string;
	body: keyof ContactsSchema;
}
