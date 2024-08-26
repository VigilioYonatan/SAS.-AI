import { orderActions } from "@/orders/libs/OrdersColumns";
import type { OrdersSchemaFromServer } from "@/orders/schemas/orders.schema";
import type { Signal } from "@preact/signals";
import type { Columns } from "@vigilio/preact-table";

export type InvoicesIndexSecondaryPaginator =
	| "actions"
	| "index"
	| "correlativo"
	| "comprobante";

function invoicesColumns(
	invoice: Signal<string>,
): Columns<OrdersSchemaFromServer, InvoicesIndexSecondaryPaginator> {
	const cols: Columns<OrdersSchemaFromServer, InvoicesIndexSecondaryPaginator> =
		[
			{
				key: "correlativo",
				cell: (props: OrdersSchemaFromServer) =>
					props.note
						? `${props.note?.serie}-${props.note.correlativo}`
						: `${props.invoice?.serie}-${props.invoice?.correlativo}`,
			},
			{ key: "order_code", header: "orden" },

			{
				key: "actions",
				header: "Facturación",
				cell: orderActions,
			},
		];

	if (invoice.value === "07" || invoice.value === "08") {
		cols.splice(1, 1, {
			key: "comprobante",
			cell: (props) => `${props.invoice?.serie}-${props.invoice?.correlativo}`,
		});
	}
	return cols;
}
export default invoicesColumns;
