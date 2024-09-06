import { type UseQuery, useQuery } from "@vigilio/preact-fetching";
import type { NewSchema } from "@/information/schemas/new.schema";

export function webShowApi(
	id: number,
): UseQuery<BackupShowAPI, BackupShowErrorAPI> {
	return useQuery<BackupShowAPI, BackupShowErrorAPI>(
		`/web/${id}`,
		async (url) => {
			const response = await fetch(`/api${url}`);
			const result = await response.json();
			if (!result.success) throw result;
			return result;
		},
	);
}

export interface BackupShowAPI {
	success: boolean;
	noticia: NewSchema;
}

export interface BackupShowErrorAPI {
	success: boolean;
	message: string;
}
