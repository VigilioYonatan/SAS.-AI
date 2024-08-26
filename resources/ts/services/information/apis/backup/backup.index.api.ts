import enviroments from "~/config";
import {
	type UseQuery,
	useQuery,
	type OptionsQuery,
} from "@vigilio/preact-fetching";
import type { BackupSchemaFromServer } from "@/information/schemas/backup.schema";

export type BackupIndexApiMethod = UseQuery<BackupIndexAPI, unknown>;

export function backupIndexApi(
	options?: OptionsQuery<BackupIndexAPI, unknown>,
): BackupIndexApiMethod {
	return useQuery(
		"/backup",
		async (url) => {
			const response = await fetch(`${enviroments.VITE_URL}/api${url}`);
			const result: BackupIndexAPI = await response.json();
			if (!result.success) throw result;
			return result;
		},
		options,
	);
}

export interface BackupIndexAPI {
	success: boolean;
	data: BackupSchemaFromServer[];
}

export interface Logo {
	dimension: number;
	file: string;
}
