import enviroments from "~/config";
import { useMutation } from "@vigilio/preact-fetching";

export function backupDestroyApi() {
	return useMutation<BackupDestroyAPI, number, BackupDestroyErrorAPI>(
		"/backup",
		async (url, id: number) => {
			const response = await fetch(`${enviroments.VITE_URL}/api${url}/${id}`, {
				method: "DELETE",
			});
			const result = await response.json();

			if (!result.success) throw result;
			return result;
		},
	);
}

export interface BackupDestroyErrorAPI {
	success: boolean;
	message: string;
}
export interface BackupDestroyAPI {
	success: boolean;
	message: string;
}
