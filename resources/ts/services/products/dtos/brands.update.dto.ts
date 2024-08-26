import { type Input, omit, pick } from "@vigilio/valibot";
import { brandsStoreDto } from "./brands.store.dto";
import { brandsSchema } from "../schemas/brands.schema";

export const brandsUpdateDto = omit(brandsSchema, [
	"id",
	"brand_code",
	"image",
]);
export type BrandsUpdateDto = Input<typeof brandsUpdateDto>;

export const brandsUpdateImageDto = pick(brandsStoreDto, ["image"]);
export type BrandsUpdateImageDto = Input<typeof brandsUpdateImageDto>;
