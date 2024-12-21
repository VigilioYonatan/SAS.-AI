import { GridBannerPageSchemaFromServer } from "@/empresas/schemas/grid-banner-page.schema";
import { type UseQuery, useQuery } from "@vigilio/preact-fetching";

export function gridBannerPageShowApi(
    id: number,
): UseQuery<GridBannerPageShowAPI, GridBannerPageShowErrorAPI> {
    return useQuery<GridBannerPageShowAPI, GridBannerPageShowErrorAPI>(
        `/grid_banner_page/${id}`,
        async (url) => {
            const response = await fetch(`/api${url}`);
            const result = await response.json();
            if (!result.success) throw result;
            return result;
        }
    );
}

export interface GridBannerPageShowAPI {
    success: boolean;
    gridBanner: GridBannerPageSchemaFromServer;
}

export interface GridBannerPageShowErrorAPI {
    success: boolean;
    message: string;
}
