import {
    OptionsQuery,
    type UseQuery,
    useQuery,
} from "@vigilio/preact-fetching";
import { Signal } from "@preact/signals";
import { PageSchema } from "@/empresas/schemas/pages.schema";
import { GridBannerPageSchemaFromServer } from "@/empresas/schemas/grid-banner-page.schema";

export function pagesShowApi(
    slug: Signal<string>,
    options: OptionsQuery<PagesShowAPI, PagesShowErrorAPI> = {}
): UseQuery<PagesShowAPI, PagesShowErrorAPI> {
    return useQuery<PagesShowAPI, PagesShowErrorAPI>(
        `/pages/${slug.value}`,
        async (url) => {
            const response = await fetch(`/api${url}`);
            const result = await response.json();
            if (!result.success) throw result;
            return result;
        },
        options
    );
}

export interface PagesShowAPI {
    success: boolean;
    page: PageSchema & {
        grid_banner_pages: GridBannerPageSchemaFromServer[];
    };
    data: GridBannerPageSchemaFromServer[];
}

export interface PagesShowErrorAPI {
    success: boolean;
    message: string;
}
