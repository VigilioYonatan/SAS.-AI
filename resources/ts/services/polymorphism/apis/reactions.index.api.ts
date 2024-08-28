import { useQuery } from "@vigilio/preact-fetching";
import type { ReactionsSchema } from "@/polymorphism/schemas/reactions.schema";

export function reactionsIndexApi(
    reactionsable_type: string,
    reactionsable_id: number
) {
    return useQuery<ReactionsShowAPI, ReactionsShowErrorAPI>(
        `/reactions/${reactionsable_type}/${reactionsable_id}`,
        async (url) => {
            const response = await fetch(`/api${url}`);
            const result = await response.json();
            if (!result.success) throw result;
            return result;
        }
    );
}

export interface ReactionsShowAPI {
    success: boolean;
    data: ReactionsSchema[];
}

export interface ReactionsShowErrorAPI {
    success: boolean;
    message: string;
}
