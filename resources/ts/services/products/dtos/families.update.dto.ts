import { type Input, omit, pick } from "@vigilio/valibot";
import { familiesStoreDto } from "./families.store.dto";
import { familiesSchema } from "../schemas/families.schema";

export const familiesUpdateDto = omit(familiesSchema, [
	"id",
	"family_code",
	"image",
	"background",
]);
export const familiesUpdateImageDto = pick(familiesStoreDto, ["image"]);
export const familiesUpdateBackgroundDto = pick(familiesStoreDto, [
	"background",
]);

export type FamiliesUpdateDto = Input<typeof familiesUpdateDto>;
export type FamiliesUpdateImageDto = Input<typeof familiesUpdateImageDto>;
export type FamiliesUpdateBackgroundDto = Input<
	typeof familiesUpdateBackgroundDto
>;
