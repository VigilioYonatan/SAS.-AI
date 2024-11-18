import { BannerSchema } from "@/empresas/schemas/banner.schema";
import { GridBannerSchema } from "@/empresas/schemas/grid_banner.schema";
import { useQuery } from "@vigilio/preact-fetching";

export function gridBannerIndexApi() {
	return useQuery("/grid_banner", async (url) => {
		const response = await fetch(`/api${url}`);
		const result: GridBannerIndexAPI = await response.json();
		if (!result.success) throw result;
		return result;
	});
}

export interface GridBannerIndexAPI {
	success: boolean;
	data: (GridBannerSchema & { banners: BannerSchema[] })[];
}

export interface Logo {
	dimension: number;
	file: string;
}
