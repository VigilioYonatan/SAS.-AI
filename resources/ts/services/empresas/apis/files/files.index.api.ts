import { type UseQuery, useQuery } from "@vigilio/preact-fetching";
import { FileSchema } from "@/empresas/schemas/file.schema";

export function filesIndexApi(): UseQuery<FilesIndexAPI, FilesIndexErrorAPI> {
	return useQuery<FilesIndexAPI, FilesIndexErrorAPI>("/files", async (url) => {
		const response = await fetch(`/api${url}`);
		const result = await response.json();
		if (!result.success) throw result;
		return result;
	});
}

export interface FilesIndexAPI {
	success: boolean;
	files: FileSchema[];
}

export interface FilesIndexErrorAPI {
	success: boolean;
	message: string;
}
