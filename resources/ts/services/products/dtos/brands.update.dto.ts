import { type Input, omit, pick } from "@vigilio/valibot";
import { brandsSchema } from "../schemas/brands.schema";
import { brandsStoreDto } from "./brands.store.dto";

export const brandsUpdateDto = omit(brandsSchema, [
	"id",
	"brand_code",
	"empresa_id",
]);
export const brandsUpdateImageDto = pick(brandsStoreDto, ["image"]);

export type BrandsUpdateDto = Input<typeof brandsUpdateDto>;
export type BrandsUpdateImagesDto = Input<typeof brandsUpdateImageDto>;
