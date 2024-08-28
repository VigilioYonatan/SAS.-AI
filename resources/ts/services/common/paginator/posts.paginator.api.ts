import { useQuery } from "@vigilio/preact-fetching";
import type { PostsSchemaFromServer } from "@/posts/schemas/posts.schema";
import type { UseTable } from "@vigilio/preact-table";
import type { PostsIndexSecondaryPaginator } from "@/posts/libs/PostsColumns";

export function postsPaginatorApi(
    table: UseTable<
        PostsSchemaFromServer,
        PostsIndexSecondaryPaginator,
        { refetch: (clean?: boolean) => void }
    >
) {
    const result = useQuery<PostsPaginatorAPI, PostsPaginatorAPIError>(
        "/paginator/posts",
        async (url) => {
            const data = new URLSearchParams();
            data.append("offset", String(table.pagination.value.offset));
            data.append("limit", String(table.pagination.value.limit));
            if (!Object.keys(table.sort.value).length) {
                data.append("id", "DESC");
            }
            for (const [key, value] of Object.entries(table.sort.value)) {
                data.append(key, value as string);
            }
            const response = await fetch(`/api${url}?${data}`);
            const result = await response.json();
            if (!result.success) throw result;
            return result;
        },
        {
            onSuccess(data) {
                table.updateData({
                    count: data.count,
                    result: data.results,
                    methods: {
                        refetch: result.refetch,
                    },
                });
            },
        }
    );
    return result;
}
interface PostsPaginatorAPI {
    success: true;
    results: PostsSchemaFromServer[];
    count: number;
    next: string | null;
    previous: string | null;
}
interface PostsPaginatorAPIError {
    success: false;
    message: string;
    params: string;
}
