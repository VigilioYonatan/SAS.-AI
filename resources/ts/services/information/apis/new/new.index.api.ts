import enviroments from "~/config";
import { useQuery } from "@vigilio/preact-fetching";
import type { NewSchema } from "@/information/schemas/new.schema";

export function newIndexApi() {
	return useQuery("/new", async (url) => {
		const response = await fetch(`${enviroments.VITE_URL}/api${url}`);
		const result: NewIndexAPI = await response.json();
		if (!result.success) throw result;
		return result;
	});
}

export interface NewIndexAPI {
	success: boolean;
	data: NewSchema[];
}

export interface Logo {
	dimension: number;
	file: string;
}
