import enviroments from "~/config";
import { useMutation, type UseMutation } from "@vigilio/preact-fetching";
import type { GroupWhatsapp } from "@/information/schemas/information.schema";

export function groupWhatsappStoreApi(): UseMutation<
	GroupWhatsappStoreApi,
	GroupWhatsapp,
	GroupWhatsappStoreApiError
> {
	return useMutation("/information/group-whatsapp", async (url, body) => {
		const response = await fetch(`${enviroments.VITE_URL}/api${url}`, {
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
interface GroupWhatsappStoreApi {
	success: true;
	message: string;
}
interface GroupWhatsappStoreApiError {
	success: true;
	message: string;
	body: keyof GroupWhatsapp;
}
