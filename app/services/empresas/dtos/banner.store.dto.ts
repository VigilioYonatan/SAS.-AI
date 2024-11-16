import { omitAsync, type Input } from "@vigilio/valibot";
import { bannerSchema } from "../schemas/banner.schema";

export const bannerStoreDto = omitAsync(bannerSchema, ["id", "empresa_id"]);
export type BannerStoreDto = Input<typeof bannerStoreDto>;
