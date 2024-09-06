import type { Columns } from "@vigilio/preact-table";
import type { CouponsSchemaFromServer } from "../schemas/coupons.schema";
import { sweetAlert, sweetModal } from "@vigilio/sweet";
import { reactComponent } from "~/libs/preact";
import CouponsUpdate from "../views/CouponsUpdate";
import { NOW, TimePeru, formatDateTwo, restarDays } from "~/libs/helpers";
import useCopyToClipboard from "~/hooks/useCopyToClipboard";

export type CouponsIndexSecondaryPaginator = "acciones";

export const couponsColumns: Columns<
	CouponsSchemaFromServer,
	CouponsIndexSecondaryPaginator,
	{ refetch: (clean?: boolean) => void }
> = [
	{
		key: "coupon",
		isSort: true,
		cell: (props) => {
			const [copy] = useCopyToClipboard();
			return (
				<button
					type="button"
					aria-label="copy"
					class="flex gap-2 items-center justify-center active:text-primary mx-auto"
					onClick={(e) => {
						e.stopPropagation();
						copy(props.coupon).then(() => {
							sweetAlert({
								icon: "success",
								title: "Copiado correctamente",
							});
						});
					}}
				>
					<span>{props.coupon}</span>
					<span class="">
						<i class="far fa-copy text-base" />
					</span>
				</button>
			);
		},
	},
	{
		key: "discount",
		header: "Descuento",
		isSort: true,
		cell: (props) => `${props.discount}%`,
	},
	{ key: "max_use", header: "Maximo de usos Actual" },
	{
		key: "date",
		isSort: true,
		header: "expiración",
		cell: (props) => (
			<div class="flex gap-2 items-center">
				{formatDateTwo(props.date, "DD-MM-YY hh:mm A")}
				{restarDays(NOW().toDate(), TimePeru(props.date).toDate()) < 0 ? (
					<span class="text-xs py-1 px-4 rounded-md text-white bg-danger ml-2">
						Venció
					</span>
				) : null}
			</div>
		),
	},

	{
		key: "acciones",
		cell: (props, _, methods) => {
			function onEditCoupon(e: Event) {
				e.stopPropagation();
				sweetModal({
					html: reactComponent(
						<CouponsUpdate refetch={methods.refetch} id={props.id} />,
					),
					isCloseInBackground: false,
					sweetWidth: "800px",
					showCloseButton: true,
					position: "start",
				});
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
