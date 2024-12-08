import { storageEmpresa } from "@/empresas/stores/empresa.store";
import { type Input, number, object, string, optional } from "@vigilio/valibot";
import { BASE_URL } from "~/config";

export function filesSchema() {
    return object({ dimension: number(), file: optional(string()) });
}

export type FilesSchema = Input<ReturnType<typeof filesSchema>>;

/****  METHOD to get files   *****/
export function printFileWithDimension(
    files: FilesSchema[],
    dimension: number | null
) {
    const filterImages = dimension
        ? files.filter(
              (img) =>
                  img.file!.startsWith("https://") ||
                  img.dimension === dimension ||
                  img.file?.endsWith("mp4")
          )
        : files;

    return filterImages.map((file) =>
        file.file!.startsWith("https://") || file.file!.startsWith("blob:")
            ? file.file
            : `${BASE_URL}/empresas/${storageEmpresa?.slug}/${file.file}`
    );
}

/****  METHOD to get files to edit  - TYPE="image/webp"*****/
export async function getFilesEdit(
    files: FilesSchema[],
    dimension: number | null,
    type = "image/webp"
) {
    try {
        const filterImages = dimension
            ? files.filter((pro) => {
                  return (
                      pro.file!.startsWith("https://") ||
                      pro.dimension === dimension ||
                      pro.file!.endsWith("mp4")
                  );
              })
            : files;

        const response = await Promise.all(
            filterImages.map(async (file) => {
                try {
                    // probar si el primer fetch funciona si no no
                    return await fetch(
                        file.file?.startsWith("https://") ||
                            file.file?.startsWith("http://")
                            ? `/proxy?url=${file.file!}`
                            : `${BASE_URL}/empresas/${storageEmpresa?.slug}/${file.file}`
                    );
                } catch (error) {
                    return null;
                }
            })
        );
        const result = await Promise.all(
            response.filter((val) => val).map(async (req) => await req!.blob())
        );

        const images = result.map(
            (res, i) =>
                new File([res], filterImages[i].file!, {
                    type: filterImages[i].file!.endsWith("mp4")
                        ? "video/mp4"
                        : type,
                })
        );
        return images;
    } catch (error) {
        return [];
    }
}

/****  METHOD to consume api files  *****/
export interface ResultApiImages {
    success: boolean;
    files: FilesSchema[];
}
export async function uploadApi(
    url: string,
    body: { name?: string; file: File[] | null }
) {
    const formData = new FormData();

    if (body.name) {
        formData.append("name", body.name);
    }
    if (body.file) {
        for (const file of body.file) {
            formData.append("file", file);
        }
    }
    const responseImage = await fetch(url, {
        method: "POST",
        body: formData,
    });
    const resultImage: ResultApiImages = await responseImage.json();
    if (!resultImage.success) throw resultImage;
    return resultImage;
}
