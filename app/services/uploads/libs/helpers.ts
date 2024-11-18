import type { FilesSchema } from "../schemas/uploads.schema";
import { File } from "formidable";
import { slug } from "@vigilio/express-core/helpers";
import sharp, { type OutputInfo, type Sharp } from "sharp";
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import type { Empresas } from "@/empresas/entities/empresas.entity";
import { BASE_URL } from "@/empresas/libs";
import { dirMode } from "~/config";
import {
	BadRequestException,
	InternalServerErrorException,
} from "@vigilio/express-core";

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
	| "subcategories"
	| "suppliers"
	| "new"
	| "banner"
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
	"subcategories",
	"brands",
	"suppliers",
	"new",
	"banner",
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
	| "qrPlin"
	| "logo_pwa"
	| "file"
	| "background_auth";
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
	"logo_pwa",
	"file",
	"background_auth",
];

interface uploadFilesProps {
	empresa: Empresas;
	files: File[];
	name?: string;
	entity: UploadsEntities;
	qualities: number[] | null;
	directory?: string;
	isPwa?: boolean;
}
export async function uploadFiles({
	empresa,
	files,
	entity,
	name,
	qualities,
	directory = "/images",
	isPwa,
}: uploadFilesProps) {
	let filesNames: { file: string; dimension?: number }[] = [];
	const dirEmpresa = `${pathUploads()}/${empresa.slug}`;
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

	let logo = null;
	if (entity === "products" && empresa.setting.isLogoImage && empresa.logo) {
		const response = await fetch(
			printFileWithDimension(empresa)(empresa.logo, 300)[0],
		);
		const result = await response.arrayBuffer();
		const width = 80;
		const height = 80;
		const radius = 40;
		const logoSharp = sharp(result)
			.resize(width, height)
			.composite([
				{
					input: redondearImagen({
						height,
						width,
						radius,
					}),
					blend: "dest-in",
				},
			]);
		logo = await logoSharp.toBuffer();
	}

	for (const file of files) {
		let sharpFiles: Sharp | Promise<OutputInfo>[] = [];

		if (qualities && file.mimetype?.startsWith("image")) {
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
				if (logo && quality !== 100) {
					sharpFiles = [
						...sharpFiles,
						sharp(file.filepath)
							.resize(quality)
							.composite([
								{
									input: logo,
									gravity: "southeast", // Posicionar en la esquina inferior derecha
									blend: "over",
								},
							])
							.webp({ quality: 90 })
							.toFile(path.resolve(dirEntity, fileName)),
					];
				}
				if (isPwa) {
					try {
						async function validateImage(filePath: string) {
							try {
								const image = sharp(filePath);
								const metadata = await image.metadata();

								const width = metadata.width!;
								const height = metadata.height!;
								const tolerance = 0.1;
								const minHeight = width * (1 - tolerance);
								const maxHeight = width * (1 + tolerance);

								// Condición para verificar si la imagen es válida
								if (height < minHeight || height > maxHeight) {
									throw new BadRequestException(
										"La imagen no debe ser rectangular",
										{ body: "logo_pwa" },
									);
								}
								return true;
							} catch (error) {
								throw new InternalServerErrorException("error image");
							}
						}

						await validateImage(file.filepath);
						const width = Math.round(quality * 0.34);
						const height = Math.round(quality * 0.34);
						const logoSharp = sharp(
							`${dirMode}/public/images/settings/others/vigilio-services-ico.png`,
						)
							.resize({ width, height, fit: "inside" })
							.toBuffer();
						logo = await logoSharp;

						sharpFiles = [
							...sharpFiles,
							sharp(file.filepath)
								.resize(quality)
								.composite([
									{
										input: logo,
										gravity: "southeast", // Posicionar en la esquina inferior derecha
										blend: "over",
									},
								])
								.webp({ quality: 90 })
								.toFile(path.resolve(dirEntity, fileName)),
						];
					} catch (error) {
						throw new InternalServerErrorException("error image");
					}
				} else {
					sharpFiles = [
						...sharpFiles,
						sharp(file.filepath)
							.resize(quality)
							.webp({ quality: 90 })
							.toFile(path.resolve(dirEntity, fileName)),
					];
				}
			}
		} else {
			const ext = file.originalFilename?.split(".").at(-1);

			const fileName = `${
				name ? slug(name) : crypto.randomUUID()
			}${Date.now().toString(32).substring(4)}.${!ext?.length ? "txt" : ext}`;
			fs.writeFileSync(
				path.resolve(dirEntity, fileName),
				// biome-ignore lint/suspicious/noExplicitAny: <explanation>
				fs.readFileSync(file.filepath) as any,
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
	return `${dirMode}/public/empresas`;
}
function redondearImagen({
	height,
	width,
	radius,
}: {
	width: number;
	height: number;
	radius: number;
}) {
	const roundedCorners = Buffer.from(
		`<svg width="${width}" height="${height}">
      <rect x="0" y="0" width="${width}" height="${height}" 
        rx="${radius}" ry="${radius}" 
        style="fill:white;" />
      <rect x="${radius}" y="0" width="${width - radius}" height="${radius}" 
        style="fill:black;" />
      <rect x="0" y="${radius}" width="${width}" height="${height - radius}" 
        style="fill:black;" />
    </svg>`,
	);
	return roundedCorners;
}
// dimension solo es valido para imagenes
export function printFileWithDimension(empresa: Empresas) {
	return (
		files: { file: string; dimension?: number }[],
		dimension: number | null,
	) => {
		const filterImages = dimension
			? files.filter(
					(img) =>
						img.file!.startsWith("https://") || img.dimension === dimension,
				)
			: files;

		return filterImages.map((file) =>
			file.file!.startsWith("https://")
				? file.file
				: `${BASE_URL(empresa)}/empresas/${empresa.slug}/${file.file}`,
		);
	};
}
export function removeFile(slug: string, files: FilesSchema[]) {
	for (const file of files) {
		const image = `${pathUploads()}/${slug}/${file.file}`;
		if (fs.existsSync(image)) {
			fs.unlinkSync(image);
		}
	}
}
