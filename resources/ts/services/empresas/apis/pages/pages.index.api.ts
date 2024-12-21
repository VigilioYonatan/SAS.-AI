import { PageSchema } from "@/empresas/schemas/pages.schema";
import { useQuery } from "@vigilio/preact-fetching";

export function pagesIndexApi() {
    return useQuery("/pages", async (url) => {
        const response = await fetch(`/api${url}`);
        const result: PagesIndexAPI = await response.json();
        if (!result.success) throw result;
        return result;
    });
}

export interface PagesIndexAPI {
    success: boolean;
    data: PageSchema[];
}

export interface Logo {
    dimension: number;
    file: string;
}
