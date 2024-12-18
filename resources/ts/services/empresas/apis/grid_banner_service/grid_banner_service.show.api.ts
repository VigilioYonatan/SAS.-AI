import { GridBannerServicechema } from "@/empresas/schemas/grid-banner-service.schema";
import { Signal } from "@preact/signals";
import { type UseQuery, useQuery } from "@vigilio/preact-fetching";

export function gridBannerServiceShowApi(
    id: number,
    type: Signal<string>
): UseQuery<GridBannerServiceShowAPI, GridBannerServiceShowErrorAPI> {
    return useQuery<GridBannerServiceShowAPI, GridBannerServiceShowErrorAPI>(
        `/grid_banner_${type.value}/${id}`,
        async (url) => {
            const response = await fetch(`/api${url}`);
            const result = await response.json();
            if (!result.success) throw result;
            return result;
        }
    );
}

export interface GridBannerServiceShowAPI {
    success: boolean;
    gridBanner: GridBannerServicechema;
}

export interface GridBannerServiceShowErrorAPI {
    success: boolean;
    message: string;
}
