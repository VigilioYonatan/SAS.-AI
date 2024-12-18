import { GridBannerServicechemaFromServer } from "@/empresas/schemas/grid-banner-service.schema";
import { Signal } from "@preact/signals";
import { useQuery } from "@vigilio/preact-fetching";
interface gridBannerServiceIndexApiProps {
    type: Signal<string>;
}
export function gridBannerServiceIndexApi({type}:gridBannerServiceIndexApiProps) {
    return useQuery(`/grid_banner_${type.value}`, async (url) => {
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
