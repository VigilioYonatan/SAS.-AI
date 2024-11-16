import { useQuery } from "@vigilio/preact-fetching";
import type { CommentsSchemaFromServe } from "@/polymorphism/schemas/comments.schema";
import type { UsePaginator } from "@vigilio/preact-paginator";

export function commentsIndexApi(
	commentables_type: string,
	commentables_id: number,
	paginator: UsePaginator,
) {
	return useQuery<CommentsIndexAPI, CommentsIndexErrorAPI>(
		`/comments/${commentables_type}/${commentables_id}`,
		async (url) => {
			const data = new URLSearchParams();
			data.append("offset", String(paginator.pagination.value.offset));
			data.append("limit", String(paginator.pagination.value.limit));
			const response = await fetch(`/api${url}?${data}`);
			const result = await response.json();
			if (!result.success) throw result;
			paginator.updateData({ total: result.count });
			return result;
		},
	);
}

export interface CommentsIndexAPI {
	success: boolean;
	count: number;
	results: (CommentsSchemaFromServe & { count: number })[];
}

export interface CommentsIndexErrorAPI {
	success: boolean;
	message: string;
}
