import { GridBannerUpdateDto } from "@/empresas/dtos/grid_banner.update.dto";
import { useMutation } from "@vigilio/preact-fetching";

export function gridBannerUpdateApi(id: number) {
	return useMutation<
		GridBannerUpdateAPI,
		GridBannerUpdateDto,
		GridBannerUpdateErrorAPI
	>(`/grid_banner/${id}`, async (url, body) => {
		const response = await fetch(`/api${url}`, {
			method: "PUT",
			body: JSON.stringify(body),
			headers: {
				"Content-type": "application/json",
			},
		});
		const result = await response.json();
		if (!result.success) throw result;
		return result;
	});
}

export interface GridBannerUpdateAPI {
	success: boolean;
	message: string;
}

export interface GridBannerUpdateErrorAPI {
	success: boolean;
	body: keyof GridBannerUpdateDto;
	message: string;
}
