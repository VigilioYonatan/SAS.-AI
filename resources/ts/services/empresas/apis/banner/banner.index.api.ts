import { BannerSchema } from "@/empresas/schemas/banner.schema";
import { useQuery } from "@vigilio/preact-fetching";

export function bannerIndexApi() {
    return useQuery("/banner", async (url) => {
        const response = await fetch(`/api${url}`);
        const result: BannerIndexAPI = await response.json();
        if (!result.success) throw result;
        return result;
    });
}

export interface BannerIndexAPI {
    success: boolean;
    data: BannerSchema[];
}

export interface Logo {
    dimension: number;
    file: string;
}
