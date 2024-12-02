import { omitAsync, type Input } from "@vigilio/valibot";
import { gridBannerServicechema } from "../schemas/grid-banner-service.schema";

export const gridBannerServiceUpdateDto = omitAsync(gridBannerServicechema, [
    "id",
    "empresa_id",
]);

export type GridBannerServiceUpdateDto = Input<
    typeof gridBannerServiceUpdateDto
>;
