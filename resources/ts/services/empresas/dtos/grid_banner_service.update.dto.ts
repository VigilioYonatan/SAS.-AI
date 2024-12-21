import { Input, omit } from "@vigilio/valibot";
import { gridBannerPageSchema } from "../schemas/grid-banner-page.schema";

export const gridBannerPageUpdateDto = omit(gridBannerPageSchema, [
    "id",
    "empresa_id",
    "page_id",
]);

export type GridBannerPageUpdateDto = Input<typeof gridBannerPageUpdateDto>;
