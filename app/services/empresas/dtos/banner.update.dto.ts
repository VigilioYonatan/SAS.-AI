import { omitAsync, type Input } from "@vigilio/valibot";
import { bannerSchema } from "../schemas/banner.schema";

export const bannerUpdateDto = omitAsync(bannerSchema, [
	"id",
	"empresa_id",
	"file",
]);
export type BannerUpdateDto = Input<typeof bannerUpdateDto>;
