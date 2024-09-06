import { useMutation, type UseMutation } from "@vigilio/preact-fetching";
import type { GroupWhatsapp } from "../schemas/information.schema";

export type GroupWhatsappShowApiMethod = UseMutation<
	GroupWhatsappShowAPI,
	unknown,
	unknown
>;

export function groupWhatsappShowApi(
	telephone: string,
): GroupWhatsappShowApiMethod {
	return useMutation(
		`/information/group-whatsapp/${telephone}`,
		async (url) => {
			const response = await fetch(`/api${url}`);
			const result: GroupWhatsappShowAPI = await response.json();
			if (!result.success) throw result;
			return result;
		},
	);
}

export interface GroupWhatsappShowAPI {
	success: boolean;
	group: GroupWhatsapp;
}
