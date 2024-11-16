import { omit, type Input } from "@vigilio/valibot";
import { gridBannerSchema } from "../schemas/grid_banner.schema";

export const gridBannerUpdateDto = omit(gridBannerSchema, ["id", "empresa_id"]);

export type GridBannerUpdateDto = Input<typeof gridBannerUpdateDto>;
