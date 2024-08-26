import enviroments from "~/config";
import { useQuery } from "@vigilio/preact-fetching";
import type {
	SubcommentsSchema,
	SubcommentsSchemaFromServe,
} from "@/polymorphism/schemas/subcomments.schema";
import type { UsePaginator } from "@vigilio/preact-paginator";
import type { Signal } from "@preact/signals";

export function subcommentsIndexApi(
	commentables_type: string,
	commentables_id: number,
	subcommentables_id: number,
	paginator: UsePaginator,
	subcommentarios: Signal<SubcommentsSchema[]>,
) {
	return useQuery<SubcommentsIndexAPI, SubcommentsIndexErrorAPI>(
		`/comments/${commentables_type}/${commentables_id}/subcomments/${subcommentables_id}`,
		async (url) => {
			const data = new URLSearchParams();
			data.append("offset", String(paginator.pagination.value.offset));
			data.append("limit", String(paginator.pagination.value.limit));
			const response = await fetch(`${enviroments.VITE_URL}/api${url}?${data}`);
			const result = await response.json();
			if (!result.success) throw result;
			return result;
		},
		{
			onSuccess(data) {
				paginator.updateData({ total: data.count });
				subcommentarios.value = [...subcommentarios.value, ...data.results];
			},
			// skipFetching: true,
		},
	);
}

export interface SubcommentsIndexAPI {
	success: boolean;
	count: number;
	results: SubcommentsSchemaFromServe[];
}

export interface SubcommentsIndexErrorAPI {
	success: boolean;
	message: string;
}
