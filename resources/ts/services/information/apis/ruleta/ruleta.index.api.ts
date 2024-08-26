import enviroments from "~/config";
import { useQuery } from "@vigilio/preact-fetching";
import type { RuletaSchema } from "@/information/schemas/ruleta.schema";

export function ruletaIndexApi() {
	return useQuery("/ruleta", async (url) => {
		const response = await fetch(`${enviroments.VITE_URL}/api${url}`);
		const result: RuletaIndexAPI = await response.json();
		if (!result.success) throw result;
		return result;
	});
}

export interface RuletaIndexAPI {
	success: boolean;
	data: RuletaSchema[];
}

export interface Logo {
	dimension: number;
	file: string;
}
