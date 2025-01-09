import { CrudSchema } from "@/empresas/schemas/crud.schema";
import { useMutation, type UseMutation } from "@vigilio/preact-fetching";
import { uploadApi } from "~/libs/upload";
export function crudDataStoreApi(
    crud: CrudSchema["data"],
    type: string
): UseMutation<CrudStoreApi, Record<string, unknown>, CrudStoreApiError> {
    return useMutation(`/crud_data/${type}`, async (url, body) => {
        const files: Record<string, unknown> = {};
        const rest: Record<string, unknown> = {};

        await Promise.all(
            crud.map(async (c) => {
                if (c.type === "FILE") {
                    let images = null;
                    if (!c.options.allowNull) {
                        const { files } = await uploadApi(
                            `/api/uploads/${type}/${c.name}`,
                            {
                                file: body[
                                    c.name as keyof typeof body
                                ] as File[],
                            }
                        );
                        images = files;
                    }
                    files[c.name as keyof typeof files] =
                        JSON.stringify(images);
                } else {
                    rest[c.name as keyof typeof rest] =
                        body[c.name as keyof typeof body];
                }
            })
        );

        const response = await fetch(`/api${url}`, {
            method: "POST",
            body: JSON.stringify({ ...rest, ...files }),
            headers: {
                "content-type": "application/json",
            },
        });
        const result = await response.json();
        if (!result.success) throw result;
        return result;
    });
}
interface CrudStoreApi {
    success: true;
    message: string;
}
interface CrudStoreApiError {
    success: true;
    message: string;
    body: keyof CrudSchema;
}
