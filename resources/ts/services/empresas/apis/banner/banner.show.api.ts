import { type UseQuery, useQuery } from "@vigilio/preact-fetching";
import type { NewSchema } from "@/empresas/schemas/new.schema";

export function bannerShowApi(
    id: number
): UseQuery<BannerShowAPI, BannerShowErrorAPI> {
    return useQuery<BannerShowAPI, BannerShowErrorAPI>(
        `/banner/${id}`,
        async (url) => {
            const response = await fetch(`/api${url}`);
            const result = await response.json();
            if (!result.success) throw result;
            return result;
        }
    );
}

export interface BannerShowAPI {
    success: boolean;
    noticia: NewSchema;
}

export interface BannerShowErrorAPI {
    success: boolean;
    message: string;
}
