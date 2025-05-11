import { PostsIndexSecondaryPaginator } from "@/posts/libs/PostsColumns";
import { PostsSchemaFromServer } from "@/posts/schemas/posts.schema";
import { useQuery } from "@vigilio/preact-fetching";
import { UsePaginator } from "@vigilio/preact-paginator";
import type { UseTable } from "@vigilio/preact-table";

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

//
export function postsClientPaginatorApi(paginator: UsePaginator) {
    const result = useQuery<PostsPaginatorAPI, PostsPaginatorAPIError>(
        "/paginator/posts_client",
        async (url) => {
            const data = new URLSearchParams();
            data.append("offset", String(paginator.pagination.value.offset));
            data.append("limit", String(paginator.pagination.value.limit));
            data.append("search", String(paginator.search.value));
            data.append("date", "DESC");
            const response = await fetch(`/api${url}?${data}`);
            const result = await response.json();
            if (!result.success) throw result;
            return result;
        },
        {
            onSuccess(data) {
                paginator.updateData({
                    total: data.count,
                });
            },
        }
    );
    return result;
}
