import enviroments from "~/config";
import { type UseQuery, useQuery } from "@vigilio/preact-fetching";
import type { BackupSchemaFromServer } from "@/information/schemas/backup.schema";

export function backupShowApi(
	id: number,
): UseQuery<BackupShowAPI, BackupShowErrorAPI> {
	return useQuery<BackupShowAPI, BackupShowErrorAPI>(
		`/backup/${id}`,
		async (url) => {
			const response = await fetch(`${enviroments.VITE_URL}/api${url}`);
			const result = await response.json();
			if (!result.success) throw result;
			return result;
		},
	);
}

export interface BackupShowAPI {
	success: boolean;
	backup: BackupSchemaFromServer;
}

export interface BackupShowErrorAPI {
	success: boolean;
	message: string;
}
