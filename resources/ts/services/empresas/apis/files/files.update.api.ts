import { Input, pick } from "@vigilio/valibot";
import { useMutation, UseMutation } from "@vigilio/preact-fetching";
import { ResultApiImages, uploadApi } from "~/libs/upload";
import { filesStoreDto, storeUploadFleFiles } from "./files.store.api";

export const fileUpdateDto = pick(filesStoreDto, ["file"]);
export type FileUpdateDto = Input<typeof fileUpdateDto>;
export function filesUpdateApi(
	id: number,
): UseMutation<
	ResultApiImages,
	FileUpdateDto & { name: string },
	FilesUpdateApiError
> {
	return useMutation(`${storeUploadFleFiles}/${id}`, async (url, body) => {
		const result = await uploadApi(`/api${url}`, {
			file: body.file,
			name: body.name,
		});
		return result;
	});
}

interface FilesUpdateApiError {
	success: true;
	message: string;
	body: keyof FileUpdateDto;
}
