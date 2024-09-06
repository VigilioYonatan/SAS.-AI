import type { Columns } from "@vigilio/preact-table";
import type { PostsSchemaFromServer } from "../schemas/posts.schema";
import { printFileWithDimension } from "~/libs/upload";
import { reactComponent } from "~/libs/preact";
import { sweetModal } from "@vigilio/sweet";
import PostsUpdate from "../views/PostsUpdate";
import { useMediaQueryNoReactive } from "~/hooks/useMediaQuery";
import { formatDateTwo } from "~/libs/helpers";

export type PostsIndexSecondaryPaginator = "acciones" | "index";

const postsColumns: Columns<
	PostsSchemaFromServer,
	PostsIndexSecondaryPaginator,
	{ refetch: (clean?: boolean) => void }
> = [
	{
		key: "id",
		isSort: true,
	},
	{
		key: "title",
		header: "Titulo",
		cell: (props) => <span class="line-clamp-2 ">{props.title}</span>,
	},
	{
		key: "image",
		header: "Imagen",
		cell: (props) => {
			if (!props.image) return;
			return (
				<img
					class="mx-auto min-w-[40px] min-h-[40px] object-cover"
					width={50}
					height={50}
					alt={"a"}
					src={printFileWithDimension(props.image, 100)[0]}
				/>
			);
		},
	},
	{
		key: "createdAt",
		header: "Fecha",
		cell: (props) => formatDateTwo(props.createdAt!, "MM-DD-YYYY hh:mm A"),
		isSort: true,
	},
	{
		key: "acciones",
		cell: (props, _, methods) => {
			function onEditCoupon(e: Event) {
				e.stopPropagation();
				sweetModal((onClose) => ({
					html: reactComponent(
						<PostsUpdate
							id={props.id}
							onClose={onClose}
							refetch={methods.refetch}
						/>,
					),
					isCloseInBackground: false,
					sweetWidth: "800px",
					showCloseButton: true,
					position: useMediaQueryNoReactive("(min-width:500px)")
						? "center"
						: "start",
				}));
			}
			return (
				<div>
					<button
						class="px-1 py-1 lg:px-4 lg:py-2 rounded-md bg-orange-600 text-white"
						type="button"
						aria-label="edit coupon"
						onClick={onEditCoupon}
					>
						<i class="fa-solid text-sm fa-pen lg:mr-1" />
					</button>
				</div>
			);
		},
	},
];
export default postsColumns;
