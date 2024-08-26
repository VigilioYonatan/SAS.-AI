import { type Input, number, object, string, optional } from "@vigilio/valibot";
import enviroments from "~/config";

export function filesSchema() {
	return object({ dimension: number(), file: optional(string()) });
}

export type FilesSchema = Input<ReturnType<typeof filesSchema>>;

/****  METHOD to get files   *****/
export function printFileWithDimension(
	files: FilesSchema[],
	dimension: number | null,
) {
	const filterImages = dimension
		? files.filter(
				(img) =>
					img.file!.startsWith("https://") || img.dimension === dimension,
			)
		: files;

	return filterImages.map((file) =>
		file.file!.startsWith("https://")
			? file.file
			: `${enviroments.VITE_URL}/${file.file}`,
	);
}

/****  METHOD to get files to edit  - TYPE="image/webp"*****/
export async function getFilesEdit(
	files: FilesSchema[],
	dimension: number | null,
	type = "image/webp",
) {
	const filterImages = dimension
		? files.filter(
				(pro) =>
					pro.file!.startsWith("https://") || pro.dimension === dimension,
			)
		: files;
	const response = await Promise.all(
		filterImages.map(async (file) => {
			return await fetch(
				file.file!.startsWith("https://")
					? file.file!
					: `${enviroments.VITE_URL}/${file.file}`,
			);
		}),
	);
	const result = await Promise.all(
		response.map(async (req) => await req.blob()),
	);

	const images = result.map(
		(res, i) =>
			new File([res], filterImages[i].file!, {
				type,
			}),
	);
	return images;
}

/****  METHOD to consume api files  *****/
export interface ResultApiImages {
	success: boolean;
	files: FilesSchema[];
}
export async function uploadApi(
	url: string,
	body: { name?: string; file: File[] | null },
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
