import { GridBannerServicechemaFromServer } from "@/empresas/schemas/grid-banner-service.schema";
import { useQuery } from "@vigilio/preact-fetching";

export function gridBannerServiceIndexApi() {
    return useQuery("/grid_banner_service", async (url) => {
        const response = await fetch(`/api${url}`);
        const result: GridBannerServiceIndexAPI = await response.json();
        if (!result.success) throw result;
        return result;
    });
}

export interface GridBannerServiceIndexAPI {
    success: boolean;
    data: GridBannerServicechemaFromServer[];
}

export interface Logo {
    dimension: number;
    file: string;
}
