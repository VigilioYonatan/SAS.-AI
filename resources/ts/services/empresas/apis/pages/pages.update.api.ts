import { PagesUpdateDto } from "@/empresas/dtos/pages.update.dto";
import { useMutation } from "@vigilio/preact-fetching";

export function pageUpdateApi(id: number) {
    return useMutation<PageUpdateAPI, PagesUpdateDto, PageUpdateErrorAPI>(
        `/pages/${id}`,
        async (url, body) => {
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
        }
    );
}

export interface PageUpdateAPI {
    success: boolean;
    message: string;
}

export interface PageUpdateErrorAPI {
    success: boolean;
    body: keyof PagesUpdateDto;
    message: string;
}
