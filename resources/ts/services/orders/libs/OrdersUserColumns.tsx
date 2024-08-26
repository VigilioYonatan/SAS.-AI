import type { Columns } from "@vigilio/preact-table";
import type { OrdersSchemaFromServer } from "../schemas/orders.schema";
import { formatDolares, formatSoles } from "@/cart/libs/helpers";
import { showTime } from "~/libs/helpers";
import { colorByOrdersId } from ".";
import { payMethodIcon } from ".";
import { PdfImage } from "~/config/settings";
import usePdfInvoice from "../hooks/usePdfInvoice";

const ordersUserColumns: Columns<OrdersSchemaFromServer, "actions"> = [
	{ key: "id", isSort: true },
	{ key: "order_code", header: "código" },
	{
		key: "status_order_id",
		header: "estado",
		cell: (props) => (
			<span
				class={`${colorByOrdersId(
					props.status_order_id,
				)} py-1 px-2 rounded-md  text-white font-semibold`}
			>
				{props.status_order.name}
			</span>
		),
		isSort: true,
	},
	{
		key: "pay_method_id",
		header: "Metódo de pago",
		cell: (props) => (
			<div
				class="flex justify-center"
				dangerouslySetInnerHTML={{
					__html: payMethodIcon()[props.pay_method_id],
				}}
			/>
		),
	},
	{
		key: "total",
		cell: (props) => {
			return (
				<div class="relative">
					<span class="font-bold">
						{props.moneyChange === 1 ? (
							formatSoles(props.total)
						) : (
							<>
								{formatSoles(props.total)} -{" "}
								<span class="text-xs">
									{formatDolares(props.total / props.moneyChange)}
								</span>
							</>
						)}
					</span>
					{props.pasarela_comision || props.paypal_token ? (
						<span class="text-[10px] absolute left-2  -top-6 text-white bg-black px-1 py-0.5 rounded-md">
							pasarela comisión
						</span>
					) : null}
				</div>
			);
		},
		isSort: true,
	},
	{
		key: "createdAt",
		header: "Fecha",
		cell: (props) => <div>{showTime(props.createdAt)}</div>,
		isSort: true,
	},
	{
		key: "actions",
		header: "Comprobante",
		cell: (props: OrdersSchemaFromServer, _: number) => {
			if (!props.invoice)
				return <span class="dark:text-white text-xs">En espera</span>;

			const invoicePDF = usePdfInvoice({ order: props });

			return (
				<button
					type="button"
					aria-label="btn to pdf"
					onClick={(e) => {
						e.stopPropagation();
						invoicePDF.onPdf(true);
					}}
				>
					<img
						src={PdfImage()}
						class={`object-cover ${!props.invoice ? "grayscale" : ""}`}
						width={40}
						height={100}
						alt="pdf"
					/>
				</button>
			);
		},
	},
];
export default ordersUserColumns;
