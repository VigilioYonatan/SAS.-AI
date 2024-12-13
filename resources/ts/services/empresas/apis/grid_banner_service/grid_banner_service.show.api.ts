import { GridBannerServicechema } from "@/empresas/schemas/grid-banner-service.schema";
import { type UseQuery, useQuery } from "@vigilio/preact-fetching";

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
	gridBanner: GridBannerServicechema;
}

export interface GridBannerServiceShowErrorAPI {
	success: boolean;
	message: string;
}
