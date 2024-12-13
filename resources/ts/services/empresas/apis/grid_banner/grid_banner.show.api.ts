import { GridBannerSchema } from "@/empresas/schemas/grid_banner.schema";
import { type UseQuery, useQuery } from "@vigilio/preact-fetching";

export function gridBannerShowApi(
    id: number
): UseQuery<GridBannerShowAPI, GridBannerShowErrorAPI> {
    return useQuery<GridBannerShowAPI, GridBannerShowErrorAPI>(
        `/grid_banner/${id}`,
        async (url) => {
            const response = await fetch(`/api${url}`);
            const result = await response.json();
            if (!result.success) throw result;
            return result;
        }
    );
}

export interface GridBannerShowAPI {
    success: boolean;
    grid: GridBannerSchema;
}

export interface GridBannerShowErrorAPI {
    success: boolean;
    message: string;
}
