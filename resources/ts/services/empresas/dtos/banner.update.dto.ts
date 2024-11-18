import { omitAsync, pick, type Input } from "@vigilio/valibot";
import { bannerSchema } from "../schemas/banner.schema";
import { bannerStoreDto } from "./banner.store.dto";

export const bannerUpdateDto = omitAsync(bannerSchema, [
	"id",
	"empresa_id",
	"file",
]);
export const bannerUpdateFileDto = pick(bannerStoreDto, ["file"]);

export type BannerUpdateFileDto = Input<typeof bannerUpdateFileDto>;

export type BannerUpdateDto = Input<typeof bannerUpdateDto>;
