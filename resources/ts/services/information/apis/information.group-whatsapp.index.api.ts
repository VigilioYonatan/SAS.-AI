import enviroments from "~/config";
import { useMutation, type UseMutation } from "@vigilio/preact-fetching";
import type { GroupWhatsapp } from "../schemas/information.schema";

export type InformationContactsIndexApiMethod = UseMutation<
	InformationContactsIndexAPI,
	unknown,
	unknown
>;

export function informationContactsIndexApi(): InformationContactsIndexApiMethod {
	return useMutation("/information/group-whatsapp", async (url) => {
		const response = await fetch(`${enviroments.VITE_URL}/api${url}`);
		const result: InformationContactsIndexAPI = await response.json();
		if (!result.success) throw result;
		return result;
	});
}

export interface InformationContactsIndexAPI {
	success: boolean;
	data: GroupWhatsapp[];
}
