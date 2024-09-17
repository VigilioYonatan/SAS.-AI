import type { Columns } from "@vigilio/preact-table";
import { reactComponent } from "~/libs/preact";
import { sweetModal } from "@vigilio/sweet";
import { formatMoney } from "@/cart/libs/helpers";
import RegionsUpdate from "../views/RegionsUpdate";
import useEmpresastore from "@/empresas/stores/empresa.store";
import { RegionsSchemaFromServer } from "../schemas/regions.schema";

export type RegionsIndexSecondaryPaginator = "acciones" | "index" | "ubigeo";

const regionsColumns: Columns<
	RegionsSchemaFromServer,
	RegionsIndexSecondaryPaginator,
	{ refetch: (clean?: boolean) => void }
> = [
	{
		key: "code",
		header: "codigo",
		cell: (props) => props.code,
		isSort: true,
	},
	{ key: "name", header: "Region", isSort: true },
	{
		key: "priceShipping",
		header: "Costo de envio",
		cell: (props) => {
			const empresa = useEmpresastore();
			return (
				<div>
					<span class="font-bold">
						{props.priceShipping > 0
							? formatMoney(props.priceShipping)
							: "GRATIS"}
					</span>
					{empresa.state!.enabled_igv && props.priceShipping > 0 ? (
						<span class="ml-1">
							+{empresa.state!.igv}% {empresa.state!.tipo_impuesto}
						</span>
					) : null}
				</div>
			);
		},
		isSort: true,
	},
	{
		key: "days",
		header: "Dias de envio",
		cell: (props) => `${props.days} días`,
	},
	{
		key: "enabled",
		header: "Disponible Envio",
		cell: (props) => (
			<div
				class={`${
					props.enabled ? "bg-success" : "bg-danger"
				} w-[15px] h-[15px] rounded-full mx-auto`}
			/>
		),
		isSort: true,
	},
	{
		key: "acciones",
		cell: (props, _, methods) => {
			function onEditCoupon(e: Event) {
				e.stopPropagation();
				sweetModal((onClose) => ({
					html: reactComponent(
						<RegionsUpdate
							onClose={onClose}
							refetch={methods.refetch}
							id={props.id}
						/>,
					),
					isCloseInBackground: false,
					sweetWidth: "600px",
					showCloseButton: true,
				}));
			}
			return (
				<div>
					<button
						class="px-1 py-1 lg:px-4 lg:py-2 rounded-md bg-orange-600 text-white"
						type="button"
						aria-label="edit department"
						onClick={onEditCoupon}
					>
						<i class="fa-solid text-sm fa-pen lg:mr-1" />
					</button>
				</div>
			);
		},
	},
];
export default regionsColumns;
