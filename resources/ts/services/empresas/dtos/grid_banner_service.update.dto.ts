import { Input, omit } from "@vigilio/valibot";
import { gridBannerServicechema } from "../schemas/grid-banner-service.schema";

export const gridBannerServiceUpdateDto = omit(gridBannerServicechema, [
    "id",
    "empresa_id",
]);

export type GridBannerServiceUpdateDto = Input<
    typeof gridBannerServiceUpdateDto
>;
