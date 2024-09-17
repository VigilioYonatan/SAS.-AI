import { useMutation, type UseMutation } from "@vigilio/preact-fetching";
import { ContactsSchema, GroupWhatsapp } from "../schemas/empresas.schema";

export function empresaGroupWhatsappUpdateApi(): UseMutation<
	empresaGroupWhatsappUpdateApi,
	GroupWhatsapp,
	empresaGroupWhatsappUpdateApiError
> {
	return useMutation("/empresas/group-whatsapp", async (url, body) => {
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
interface empresaGroupWhatsappUpdateApi {
	success: true;
	message: string;
}
interface empresaGroupWhatsappUpdateApiError {
	success: true;
	message: string;
	body: keyof ContactsSchema;
}
