import { useQuery } from "@vigilio/preact-fetching";
import type { NewSchema } from "@/empresas/schemas/new.schema";

export function newIndexApi() {
    return useQuery("/new", async (url) => {
        const response = await fetch(`/api${url}`);
        const result: NewIndexAPI = await response.json();
        if (!result.success) throw result;
        return result;
    });
}

export interface NewIndexAPI {
    success: boolean;
    data: NewSchema[];
}

export interface Logo {
    dimension: number;
    file: string;
}
