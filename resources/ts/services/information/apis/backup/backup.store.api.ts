import type { BackupSchema } from "@/information/schemas/backup.schema";
import { useMutation, type UseMutation } from "@vigilio/preact-fetching";
import enviroments from "~/config";

export const backupUploadImage = "/uploads/backup/image";
export function backupStoreApi(): UseMutation<
	BackupStoreApi,
	null,
	BackupStoreApiError
> {
	return useMutation("/backup", async (url, body) => {
		const response = await fetch(`${enviroments.VITE_URL}/api${url}`, {
			method: "POST",
			body: JSON.stringify(body),
		});
		const result = await response.json();
		if (!result.success) throw result;
		return result;
	});
}
interface BackupStoreApi {
	success: true;
	message: string;
}
interface BackupStoreApiError {
	success: true;
	message: string;
	body: keyof BackupSchema;
}
