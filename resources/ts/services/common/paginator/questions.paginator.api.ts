import { useQuery } from "@vigilio/preact-fetching";
import { QuestionsSchema } from "@/empresas/schemas/questions.schema";
import { UsePaginator } from "@vigilio/preact-paginator";

export function questionsPaginatorApi(paginator: UsePaginator) {
    const result = useQuery<QuestionsPaginatorAPI, QuestionsPaginatorAPIError>(
        "/paginator/questions",
        async (url) => {
            const data = new URLSearchParams();
            data.append("offset", String(paginator.pagination.value.offset));
            data.append("limit", String(paginator.pagination.value.limit));
            data.append("search", String(paginator.search.debounceTerm));
            data.append("id", "DESC");
            const response = await fetch(`/api${url}?${data}`);
            const result = await response.json();
            if (!result.success) throw result;
            paginator.updateData({ total: result.count });
            return result;
        }
    );
    return result;
}
export interface QuestionsPaginatorAPI {
    success: true;
    results: QuestionsSchema[];
    count: number;
    next: string | null;
    previous: string | null;
}
export interface QuestionsPaginatorAPIError {
    success: false;
    message: string;
    params: string;
}
