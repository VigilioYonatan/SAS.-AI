import enviroments from "~/config";
import { useMutation } from "@vigilio/preact-fetching";

export function groupWhatsappDestroyApi() {
	return useMutation<
		GroupWhatsappDestroyAPI,
		string,
		{ message: string; success: boolean }
	>("/information/group-whatsapp", async (url, name) => {
		const response = await fetch(`${enviroments.VITE_URL}/api${url}/${name}`, {
			method: "DELETE",
		});
		const result = await response.json();
		if (!result.success) throw result;
		return result;
	});
}

export interface GroupWhatsappDestroyAPI {
	success: boolean;
	message: string;
}
