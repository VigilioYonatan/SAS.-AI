import type { Columns } from "@vigilio/preact-table";
import { ClientsSchemaFromServer } from "../schemas/client.schema";
import { formatTelephoneNumber } from "~/libs/helpers";
import { informationContactsSearchApi } from "@/information/apis/information.contacts.search.api";
import { informationContactsStoreUpdateApi } from "@/information/apis/information.contacts.store.api";
import { useEffect } from "preact/hooks";
import LoaderSubmit from "~/components/LoaderSubmit";
import { storageInformation } from "@/information/stores/information.store";

export type ClientsIndexSecondaryPaginator = "acciones" | "index";

const clientsColumns: Columns<
	ClientsSchemaFromServer,
	ClientsIndexSecondaryPaginator
> = [
	{ key: "id", isSort: true },
	{ key: "fullname", header: "Nombre Completo" },
	{
		key: "telephone",
		header: "Telephono",
		cell: (props) =>
			`+${storageInformation?.dial_code} ${formatTelephoneNumber(
				props.telephone,
			)}`,
	},

	{
		key: "enabled",
		header: "Habilitado",
		cell: (props) => {
			return (
				<div>
					<div
						class={`${
							props.enabled ? "bg-success" : "bg-danger"
						} w-[15px] h-[15px]`}
					/>
				</div>
			);
		},
	},
	{
		key: "acciones",
		cell: (props, _index) => {
			const informationContactsSearchQuery =
				// biome-ignore lint/suspicious/noExplicitAny: <explanation>
				informationContactsSearchApi({ value: props.telephone } as any);
			const informationContactsStoreUpdateMutate =
				informationContactsStoreUpdateApi();
			useEffect(() => {
				informationContactsSearchQuery.refetch();
			}, []);
			let component: JSX.Element | JSX.Element[] | null = null;
			if (informationContactsSearchQuery.isFetching) {
				component = <LoaderSubmit color="var(--primary)" />;
			}

			if (informationContactsSearchQuery.isSuccess) {
				component = (
					<>
						{informationContactsSearchQuery.data?.data.length ? (
							<button
								type="button"
								onClick={() => {
									informationContactsStoreUpdateMutate.mutate({
										ia: true,
										isFavorite: false,
										name: props.fullname ?? "sin nombre",
										telephone: props.telephone,
									});
								}}
							>
								<i class="fab fa-whatsapp-square" />
							</button>
						) : null}
					</>
				);
			}

			return (
				<div class="flex gap-2 items-center justify-center">{component}</div>
			);
		},
	},
];
export default clientsColumns;
