import { FileSchema, fileSchema } from "@/empresas/schemas/file.schema";
import { useMutation, type UseMutation } from "@vigilio/preact-fetching";
import {
    array,
    Input,
    instance,
    maxLength,
    merge,
    minLength,
    object,
    omit,
    string,
} from "@vigilio/valibot";
import { uploadApi } from "~/libs/upload";
import validFileValibot from "~/libs/valibot";
export const storeUploadFleFiles = "/uploads/files/file";

export const filesStoreDto = merge([
    omit(fileSchema, ["empresa_id", "id", "file"]),
    object({
        file: array(instance(File), [
            validFileValibot({
                required: true,
                min: 1,
                max: 1,
                types: [
                    "image/jpg",
                    "image/jpeg",
                    "image/png",
                    "image/webp",
                    "video/mp4",
                    "application/pdf",
                    "text/plain",
                ],
                maxSize: 30,
            }),
        ]),
        name: string([minLength(3), maxLength(30)]),
    }),
]);
export type FileStoreDto = Input<typeof filesStoreDto>;
export function filesStoreApi(): UseMutation<
    FilesStoreApi,
    FileStoreDto & { name: string },
    FilesStoreApiError
> {
    return useMutation("/files", async (url, body) => {
        const { files } = await uploadApi(`/api${storeUploadFleFiles}`, {
            file: body.file,
            name: body.name,
        });
        const file = files;
        const response = await fetch(`/api${url}`, {
            method: "POST",
            body: JSON.stringify({ ...body, file }),
            headers: {
                "content-type": "application/json",
            },
        });
        const result = await response.json();
        if (!result.success) throw result;
        return result;
    });
}
interface FilesStoreApi {
    success: true;
    file: FileSchema;
}
interface FilesStoreApiError {
    success: true;
    message: string;
    body: keyof FileStoreDto & { name: string };
}
