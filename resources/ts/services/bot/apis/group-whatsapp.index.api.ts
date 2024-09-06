import { useQuery } from "@vigilio/preact-fetching";
import type { GroupWhatsapp } from "@/information/schemas/information.schema";

export function groupWhatsappIndexApi() {
	return useQuery<GroupWhatsappIndexAPI, unknown>(
		"/information/group-whatsapp",
		async (url) => {
			const response = await fetch(`/api${url}`);
			const result = await response.json();
			if (!result.success) throw result;
			return result;
		},
	);
}

export interface GroupWhatsappIndexAPI {
	success: boolean;
	data: GroupWhatsapp[];
}
