import { type UseQuery, useQuery } from "@vigilio/preact-fetching";
import type { BannerSchema } from "@/empresas/schemas/banner.schema";

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
    banner: BannerSchema;
}

export interface GridBannerShowErrorAPI {
    success: boolean;
    message: string;
}
