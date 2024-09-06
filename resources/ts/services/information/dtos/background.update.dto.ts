import { omit, type Input, pick } from "@vigilio/valibot";
import { backgroundSchema } from "../schemas/background.schema";
import { backgroundStoreDto } from "./background.store.dto";

export const backgroundUpdateDto = omit(backgroundSchema, [
	"id",
	"image",
	"information_id",
]);
export type BackgroundUpdateDto = Input<typeof backgroundUpdateDto>;
export const backgroundImageUpdateDto = pick(backgroundStoreDto, ["image"]);
export type BackgroundImageUpdateDto = Input<typeof backgroundImageUpdateDto>;
