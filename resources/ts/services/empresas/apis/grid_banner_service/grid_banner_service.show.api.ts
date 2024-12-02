import { type UseQuery, useQuery } from "@vigilio/preact-fetching";
import type { BannerSchema } from "@/empresas/schemas/banner.schema";

export function gridBannerServiceShowApi(
	id: number,
): UseQuery<GridBannerServiceShowAPI, GridBannerServiceShowErrorAPI> {
	return useQuery<GridBannerServiceShowAPI, GridBannerServiceShowErrorAPI>(
		`/grid_banner_service/${id}`,
		async (url) => {
			const response = await fetch(`/api${url}`);
			const result = await response.json();
			if (!result.success) throw result;
			return result;
		},
	);
}

export interface GridBannerServiceShowAPI {
	success: boolean;
	banner: BannerSchema;
}

export interface GridBannerServiceShowErrorAPI {
	success: boolean;
	message: string;
}
