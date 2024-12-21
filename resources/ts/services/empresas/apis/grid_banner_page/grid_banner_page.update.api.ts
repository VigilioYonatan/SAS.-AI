import { GridBannerPageUpdateDto } from "@/empresas/dtos/grid_banner_service.update.dto";
import { useMutation } from "@vigilio/preact-fetching";

export function gridBannerPageUpdateApi(id: number) {
    return useMutation<
        GridBannerPageUpdateAPI,
        GridBannerPageUpdateDto,
        GridBannerPageUpdateErrorAPI
    >(`/grid_banner_page/${id}`, async (url, body) => {
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

export interface GridBannerPageUpdateAPI {
    success: boolean;
    message: string;
}

export interface GridBannerPageUpdateErrorAPI {
    success: boolean;
    body: keyof GridBannerPageUpdateDto;
    message: string;
}
