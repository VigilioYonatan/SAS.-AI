import { omitAsync, type Input } from "@vigilio/valibot";
import { gridBannerSchema } from "../schemas/grid_banner.schema";

export const gridBannerUpdateDto = omitAsync(gridBannerSchema, [
	"id",
	"empresa_id",
]);

export type GridBannerUpdateDto = Input<typeof gridBannerUpdateDto>;
