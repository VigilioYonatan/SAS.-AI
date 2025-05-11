import { useTable } from "@vigilio/preact-table";
import VigilioTable from "~/components/table";
import PostsStore from "./PostsStore";
import type { PostsSchemaFromServer } from "../schemas/posts.schema";
import Container from "@/admin/components/Container";
import AdminBreadCrumb from "@/admin/components/AdminBreadCrumb";
import { sweetModal } from "@vigilio/sweet";
import { reactComponent } from "~/libs/preact";
import PostsShow from "./PostsShow";
import { postsPaginatorApi } from "@/common/paginator/posts.paginator.api";
import postsColumns from "../libs/PostsColumns";

function PostsIndex() {
    const table = useTable({
        columns: postsColumns,
    });
    const query = postsPaginatorApi(table);

    function onShowPost(post: PostsSchemaFromServer) {
        sweetModal((onClose) => ({
            html: reactComponent(
                <PostsShow
                    id={post.id}
                    onClose={onClose}
                    refetch={query.refetch}
                />
            ),
            showCloseButton: true,
            sweetWidth: "900px",
            position: "start",
        }));
    }

    function onPostStore() {
        sweetModal((onClose) => ({
            html: reactComponent(
                <PostsStore onClose={onClose} refetch={query.refetch} />
            ),
            showCloseButton: true,
            isCloseInBackground: false,
            sweetWidth: "900px",
            position: "start",
        }));
    }
    return (
        <Container className="p-2">
            <div className="flex flex-col gap-4 mx-1 ">
                <AdminBreadCrumb current="Posts" />
                <div class="">
                    <button
                        type="button"
                        class="bg-primary px-2 py-2   text-white rounded-md font-bold text-xs uppercase shadow"
                        aria-label="button to open create new post"
                        onClick={onPostStore}
                    >
                        <i class="fas fa-newspaper" /> Agregar Post
                    </button>
                </div>
            </div>
            <div class="overflow-auto">
                <VigilioTable query={query} table={table}>
                    <VigilioTable.header className="p-0 mb-2 flex justify-between items-center">
                        <VigilioTable.header.tools
                            hiddenDelete
                            hiddenFetching
                            hiddenInput
                        />
                        <div class="flex items-center gap-1">
                            <VigilioTable.header.limit />
                            <VigilioTable.header.refetch />
                        </div>
                    </VigilioTable.header>
                    <VigilioTable.table>
                        <VigilioTable.thead>
                            <VigilioTable.thead.row>
                                <VigilioTable.thead.th />
                            </VigilioTable.thead.row>
                        </VigilioTable.thead>
                        <VigilioTable.tbody>
                            <VigilioTable.tbody.row handleClick={onShowPost}>
                                {(data) => (
                                    <VigilioTable.tbody.td data={data} />
                                )}
                            </VigilioTable.tbody.row>
                        </VigilioTable.tbody>
                    </VigilioTable.table>
                    <VigilioTable.footer>
                        <VigilioTable.footer.paginator />
                        <VigilioTable.footer.show />
                    </VigilioTable.footer>
                </VigilioTable>
            </div>
        </Container>
    );
}

export default PostsIndex;
