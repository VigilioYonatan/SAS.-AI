import { GridBannerPageSchemaFromServer } from "@/empresas/schemas/grid-banner-page.schema";
import { useQuery } from "@vigilio/preact-fetching";

export function gridBannerPageIndexApi() {
    return useQuery("/grid_banner_page", async (url) => {
        const response = await fetch(`/api${url}`);
        const result: GridBannerPageIndexAPI = await response.json();
        if (!result.success) throw result;
        return result;
    });
}

export interface GridBannerPageIndexAPI {
    success: boolean;
    data: GridBannerPageSchemaFromServer[];
}

export interface Logo {
    dimension: number;
    file: string;
}
