import type { FilesSchema } from "../schemas/uploads.schema";
import { File } from "formidable";
import { slug } from "@vigilio/express-core/helpers";
import sharp, { type OutputInfo, type Sharp } from "sharp";
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import type { Empresas } from "@/empresas/entities/empresas.entity";
import { BASE_URL } from "@/empresas/libs";

/** entities  */
export type UploadsEntities =
    | "users"
    | "products"
    | "empresas"
    | "orders"
    | "metodos_pago"
    | "posts"
    | "background"
    | "brands"
    | "categories"
    | "settings";

export const uploadsEntities: UploadsEntities[] = [
    "products",
    "users",
    "empresas",
    "orders",
    "metodos_pago",
    "posts",
    "background",
    "categories",
    "brands",
    "settings",
];

/**** properties about entities *****/
export type UploadsProperties =
    | "images"
    | "photo"
    | "image"
    | "logo"
    | "wallpaper"
    | "certificado"
    | "transferencia_image"
    | "icon"
    | "qrYape"
    | "qrPlin";
export const uploadsProperties: UploadsProperties[] = [
    "images",
    "image",
    "photo",
    "logo",
    "wallpaper",
    "certificado",
    "transferencia_image",
    "icon",
    "qrYape",
    "qrPlin",
];

interface uploadFilesProps {
    empresa: string;
    files: File[];
    name?: string;
    entity: UploadsEntities;
    qualities: number[] | null;
    directory: string;
}
export async function uploadFiles({
    empresa,
    files,
    entity,
    name,
    qualities,
    directory = "/images",
}: uploadFilesProps) {
    let filesNames: { file: string; dimension?: number }[] = [];
    const dirEmpresa = `${pathUploads()}/${empresa}`;
    const dir = `${dirEmpresa}/${directory}`;
    const dirEntity = `${dir}/${entity}`;
    if (!fs.existsSync(dirEmpresa)) {
        fs.mkdirSync(dirEmpresa);
        // biome-ignore lint/suspicious/noConsoleLog: <explanation>
        console.log("Creado directorio correctamente");
    }
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
        // biome-ignore lint/suspicious/noConsoleLog: <explanation>
        console.log("Creado directorio correctamente");
    }
    if (!fs.existsSync(dirEntity)) {
        fs.mkdirSync(dirEntity);
        // biome-ignore lint/suspicious/noConsoleLog: <explanation>
        console.log("Creado directorio correctamente");
    }
    for (const file of files) {
        let sharpFiles: Sharp | Promise<OutputInfo>[] = [];
        if (qualities) {
            for (const quality of qualities) {
                const fileName = `${
                    name ? slug(name) : crypto.randomUUID()
                }${Date.now().toString(32).substring(4)}x${quality}.webp`;
                filesNames = [
                    ...filesNames,
                    {
                        file: `${directory.slice(1)}/${entity}/${fileName}`,
                        dimension: quality,
                    },
                ] as { file: string; dimension: number }[];
                sharpFiles = [
                    ...sharpFiles,
                    sharp(file.filepath)
                        .resize(quality)
                        .webp({ quality: 80 })
                        .toFile(path.resolve(dirEntity, fileName)),
                ];
            }
        } else {
            const ext = path.extname(file.filepath);
            const fileName = `${
                name ? slug(name) : crypto.randomUUID()
            }${Date.now().toString(32).substring(4)}.${
                !ext.length ? "txt" : ext
            }`;
            fs.writeFileSync(
                path.resolve(dirEntity, fileName),
                fs.readFileSync(file.filepath)
            );
            filesNames = [
                ...filesNames,
                { file: `${directory.slice(1)}/${entity}/${fileName}` },
            ];
        }
        await Promise.all(sharpFiles);
    }
    return filesNames;
}
export function pathUploads() {
    return path.resolve(
        __dirname,
        "..",
        "..",
        "..",
        "..",
        "public",
        "empresas"
    );
}

// dimension solo es valido para imagenes
export function printFileWithDimension(empresa: Empresas) {
    return (
        files: { file: string; dimension?: number }[],
        dimension: number | null
    ) => {
        const filterImages = dimension
            ? files.filter(
                  (img) =>
                      img.file!.startsWith("https://") ||
                      img.dimension === dimension
              )
            : files;

        return filterImages.map((file) =>
            file.file!.startsWith("https://")
                ? file.file
                : `${BASE_URL(empresa)}/empresas/${empresa.slug}/${
                      file.file
                  }`
        );
    };
}
export function removeFile(slug: string, files: FilesSchema[]) {
    for (const file of files) {
        const image = `${pathUploads()}/empresas/${slug}/${file.file}`;
        if (fs.existsSync(image)) {
            fs.unlinkSync(image);
        }
    }
}
