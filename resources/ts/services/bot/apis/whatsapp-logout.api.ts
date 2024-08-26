import { useMutation, type UseMutation } from "@vigilio/preact-fetching";
import enviroments from "~/config";

export function whatsappLogoutApi(): UseMutation<
	WhatsappLogoutApi,
	unknown,
	WhatsappLogoutApiError
> {
	return useMutation("/bot/logout", async (url) => {
		const response = await fetch(`${enviroments.VITE_URL}/api${url}`, {
			method: "POST",
		});
		const result = await response.json();
		if (!result.success) throw result;
		return result;
	});
}
interface WhatsappLogoutApi {
	success: true;
	message: string;
}
interface WhatsappLogoutApiError {
	success: true;
	message: string;
}
