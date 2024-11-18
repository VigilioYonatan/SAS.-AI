import {
	array,
	instance,
	merge,
	object,
	omit,
	type Input,
} from "@vigilio/valibot";
import { backgroundSchema } from "../schemas/background.schema";
import validFileValibot from "~/libs/valibot";
import { storageEmpresa } from "../stores/empresa.store";

export const backgroundStoreDto = merge([
	omit(backgroundSchema, ["id", "image", "empresa_id"]),
	object({
		image: array(instance(File), [
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

				maxSize: storageEmpresa?.isFreeVPS ? 50 : 100, //50mb
			}),
		]),
	}),
]);
export type BackgroundStoreDto = Input<typeof backgroundStoreDto>;
