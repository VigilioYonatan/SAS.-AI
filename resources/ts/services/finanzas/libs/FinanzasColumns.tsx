import type { Columns } from "@vigilio/preact-table";
import type { FinanzasSchemaFromServer } from "../schemas/finanzas.schema";
import dayjs from "~/libs/helpers";
import { formatMoney } from "@/cart/libs/helpers";
import { FinanzasUpdate } from "../components/FinanzasUpdate";
import { sweetAlert, sweetModal } from "@vigilio/sweet";
import { reactComponent } from "~/libs/preact";
import { finanzasDestroyApi } from "../apis/finanzas.destroy.api";
import LoaderSubmit from "~/components/LoaderSubmit";

export type FinanzasIndexSecondaryPaginator = "acciones" | "index";

const finanzasColumns: Columns<
	FinanzasSchemaFromServer,
	FinanzasIndexSecondaryPaginator,
	{ refetch: (clean?: boolean) => void }
> = [
	{
		key: "id",
		isSort: true,
	},
	{
		key: "date",
		header: "Fecha",
		cell: (props) => (
			<span class="line-clamp-2  text-xs">
				{dayjs(props.date).utc(false).format("MM-DD-YYYY")}
			</span>
		),
		isSort: true,
	},
	{
		key: "presupuesto",
		header: "Presupuesto",
		cell: (props) => (
			<span class="block text-center text-xs">
				{formatMoney(props.presupuesto)}
			</span>
		),
		isSort: true,
	},
	{
		key: "monto",
		header: "Monto",
		cell: (props) => (
			<span class="block text-center text-xs">{formatMoney(props.monto)}</span>
		),
		isSort: true,
	},
	{
		key: "tipo_finanza_id",
		header: "Tipo",
		isSort: true,
		cell: (props) => (
			<span
				class={`text-xs py-1 px-2 rounded-md text-white ${
					props.tipo_finanza_id === 1 ? "bg-success" : "bg-danger"
				}`}
			>
				{props.tipo_finanza_id === 1 ? (
					<>
						<i class="fa-solid fa-up" /> Ingreso
					</>
				) : (
					<>
						<i class="fa-solid fa-down" /> Egreso
					</>
				)}
			</span>
		),
	},
	{ key: "description" },
	{
		key: "category_finanza_id",
		header: "Categoria",
		isSort: true,
		cell: (props) => (
			<span class="text-xs flex gap-1 items-center justify-center">
				<div
					dangerouslySetInnerHTML={{
						__html: props.categoriesFinanza.icon,
					}}
				/>{" "}
				{props.categoriesFinanza.value}
			</span>
		),
	},
	{
		key: "acciones",
		cell: (props, _, methods) => {
			const finanzasDestroyMutation = finanzasDestroyApi();
			function onEditFinanza(e: Event) {
				e.stopPropagation();
				sweetModal((onClose) => ({
					html: reactComponent(
						<FinanzasUpdate
							finanza={props}
							onClose={onClose}
							refetch={methods.refetch}
						/>,
					),
					isCloseInBackground: false,
					sweetWidth: "800px",
					showCloseButton: true,
					position: "center",
				}));
			}
			function onDelete() {
				sweetModal({
					title: "¿Estás seguro de eliminar esta finanza?",
				}).then(({ isConfirmed }) => {
					if (isConfirmed) {
						finanzasDestroyMutation.mutate(props.id, {
							onSuccess() {
								sweetAlert({
									icon: "success",
									title: "Se eliminó correctamente.",
								});
								methods.refetch(false);
							},
							onError() {
								sweetAlert({
									icon: "danger",
									title: "No se eliminó correctamente.",
								});
							},
						});
					}
				});
			}
			return (
				<div class="flex gap-2 items-center">
					<button
						class="px-1 py-1 lg:px-4 lg:py-2 rounded-md bg-orange-600 text-white"
						type="button"
						aria-label="edit coupon"
						onClick={onEditFinanza}
					>
						<i class="fa-solid text-sm fa-pen lg:mr-1" />
					</button>
					<button
						class="px-1 py-1 lg:px-4 lg:py-2 rounded-md bg-danger text-white"
						type="button"
						aria-label="edit coupon"
						onClick={onDelete}
						disabled={finanzasDestroyMutation.isLoading || false}
					>
						{finanzasDestroyMutation.isLoading ? (
							<LoaderSubmit />
						) : (
							<i class="fa-solid text-sm fa-trash lg:mr-1" />
						)}
					</button>
				</div>
			);
		},
	},
];
export default finanzasColumns;
