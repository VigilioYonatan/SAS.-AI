import type { Columns } from "@vigilio/preact-table";
import type { UrlsSchemaFromServer } from "../schemas/urls.schema";
import { sweetAlert, sweetModal } from "@vigilio/sweet";
import { urlsDestroyApi } from "../apis/urls.destroy.api";
import { reactComponent } from "~/libs/preact";
import UrlsUpdate from "../views/UrlsUpdate";
import useCopyToClipboard from "~/hooks/useCopyToClipboard";
import { BASE_URL } from "@/empresas/stores/empresa.store";

export type UrlsIndexSecondaryPaginator = "acciones";
export const urlsColumns: Columns<
	UrlsSchemaFromServer,
	UrlsIndexSecondaryPaginator
> = [
	{
		key: "id",
		isSort: true,
	},
	{
		key: "web",
		header: "Web",
		isSort: true,
		cell: (props) => (
			<span class="w-[200px] text-wrap break-words line-clamp-3">
				{props.web}
			</span>
		),
	},
	{
		key: "hash",
		header: "link",
		cell: (props) => {
			const [cp] = useCopyToClipboard();

			return (
				<div class="dark:text-white font-bold flex justify-center items-center gap-2">
					<a
						class="text-primary hover:underline"
						target="_blank"
						href={`/sh/${props.hash}`}
						rel="noreferrer"
					>
						{BASE_URL}/sh/{props.hash}
					</a>
					<button
						type="button"
						onClick={() => {
							cp(`${BASE_URL}/sh/${props.hash}`).then(() => {
								sweetAlert({
									icon: "success",
									title: "Copiado correctamente",
								});
							});
						}}
					>
						<i class="fa-regular fa-copy text-xl" />
					</button>
				</div>
			);
		},
	},
	{
		key: "enabled",
		header: "Disponible",
		cell: (props) => (
			<div
				class={`${
					props.enabled ? "bg-success" : "bg-danger"
				} w-[10px] h-[10px] rounded-full mx-auto`}
			/>
		),
		isSort: true,
	},
	{
		key: "acciones",
		cell: (props, _, methods) => {
			const urlsDestroyMutation = urlsDestroyApi();
			return (
				<div class="flex gap-2 items-center">
					<button
						class="px-1 py-1 lg:px-4 lg:py-2 rounded-md bg-orange-600 text-white"
						type="button"
						aria-label="edit user"
						onClick={() =>
							sweetModal({
								html: reactComponent(
									<UrlsUpdate refetch={methods.refetch} id={props.id} />,
								),
								isCloseInBackground: false,
								showCloseButton: true,
							})
						}
					>
						<i class="fa-solid text-sm fa-pen lg:mr-1" />
					</button>
					<button
						class="px-1 bg-danger py-1 lg:px-4 lg:py-2 rounded-md  text-white"
						type="button"
						aria-label="edit url"
						onClick={() => {
							urlsDestroyMutation.mutate(props.hash, {
								onSuccess: (data) => {
									sweetAlert({
										icon: "success",
										title: data.message,
									});
									methods.refetch(false);
								},
								onError: (err) => {
									sweetAlert({
										icon: "danger",
										title: err.message,
									});
								},
							});
						}}
					>
						<i class="fa-solid fa-trash" />
					</button>
				</div>
			);
		},
	},
];
