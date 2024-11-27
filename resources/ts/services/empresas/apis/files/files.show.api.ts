import { type UseQuery, useQuery } from "@vigilio/preact-fetching";
import { FileSchema } from "@/empresas/schemas/file.schema";

export function filesShowApi(
	id: number,
): UseQuery<FilesShowAPI, FilesShowErrorAPI> {
	return useQuery<FilesShowAPI, FilesShowErrorAPI>(
		`/files/${id}`,
		async (url) => {
			const response = await fetch(`/api${url}`);
			const result = await response.json();
			if (!result.success) throw result;
			return result;
		},
	);
}

export interface FilesShowAPI {
	success: boolean;
	file: FileSchema;
}

export interface FilesShowErrorAPI {
	success: boolean;
	message: string;
}
