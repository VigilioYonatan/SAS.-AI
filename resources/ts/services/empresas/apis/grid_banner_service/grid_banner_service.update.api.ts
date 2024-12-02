import { GridBannerServiceUpdateDto } from "@/empresas/dtos/grid_banner_service.update.dto";
import { useMutation } from "@vigilio/preact-fetching";

export function gridBannerServiceUpdateApi(id: number) {
    return useMutation<
        GridBannerServiceUpdateAPI,
        GridBannerServiceUpdateDto,
        GridBannerServiceUpdateErrorAPI
    >(`/grid_banner_service/${id}`, async (url, body) => {
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

export interface GridBannerServiceUpdateAPI {
    success: boolean;
    message: string;
}

export interface GridBannerServiceUpdateErrorAPI {
    success: boolean;
    body: keyof GridBannerServiceUpdateDto;
    message: string;
}
