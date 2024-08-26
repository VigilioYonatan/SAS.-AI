import enviroments from "~/config";
import { type UseQuery, useQuery } from "@vigilio/preact-fetching";
import type { RuletaSchema } from "@/information/schemas/ruleta.schema";

export function ruletaShowApi(
	id: number,
): UseQuery<RuletaShowAPI, RuletaShowErrorAPI> {
	return useQuery<RuletaShowAPI, RuletaShowErrorAPI>(
		`/ruleta/${id}`,
		async (url) => {
			const response = await fetch(`${enviroments.VITE_URL}/api${url}`);
			const result = await response.json();
			if (!result.success) throw result;
			return result;
		},
	);
}

export interface RuletaShowAPI {
	success: boolean;
	noticia: RuletaSchema;
}

export interface RuletaShowErrorAPI {
	success: boolean;
	message: string;
}
