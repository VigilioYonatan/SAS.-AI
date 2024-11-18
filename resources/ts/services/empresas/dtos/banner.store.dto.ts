import {
	array,
	instance,
	merge,
	object,
	omit,
	type Input,
} from "@vigilio/valibot";
import { bannerSchema } from "../schemas/banner.schema";
import validFileValibot from "~/libs/valibot";
import { storageEmpresa } from "../stores/empresa.store";

export const bannerStoreDto = merge([
	omit(bannerSchema, ["id", "empresa_id", "file"]),
	object({
		file: array(instance(File), [
			validFileValibot({
				required: true,
				min: 1,
				max: 1,
				types: [
					"image/jpg",
					"image/webp",
					"image/jpeg",
					"image/gif",
					"image/png",
					"video/mp4",
				],
				maxSize: storageEmpresa?.isFreeVPS ? 35 : 100, //50mb
			}),
		]),
	}),
]);
export type BannerStoreDto = Input<typeof bannerStoreDto>;
