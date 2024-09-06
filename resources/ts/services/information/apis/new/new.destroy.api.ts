import { type UseQuery, useQuery } from "@vigilio/preact-fetching";
import type { NewSchema } from "@/information/schemas/new.schema";

export function webDestroyApi(
	id: number,
): UseQuery<BackupDestroyAPI, BackupDestroyErrorAPI> {
	return useQuery<BackupDestroyAPI, BackupDestroyErrorAPI>(
		`/web/${id}`,
		async (url) => {
			const response = await fetch(`/api${url}`);
			const result = await response.json();
			if (!result.success) throw result;
			return result;
		},
	);
}

export interface BackupDestroyAPI {
	success: boolean;
	web: NewSchema;
}

export interface BackupDestroyErrorAPI {
	success: boolean;
	message: string;
}
