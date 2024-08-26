import { sweetAlert } from "@vigilio/sweet";
import type { OrdersSchemaFromServer } from "../schemas/orders.schema";
import { ordersUpdateApi } from "../apis/orders.update.api";
import { STATUSORDER } from "../libs";

interface UseSendSunatProps {
	order: OrdersSchemaFromServer;
	refetch: (clean?: boolean) => void;
}
function useSendSunat({ order, refetch }: UseSendSunatProps) {
	const ordersUpdateApiMutation = ordersUpdateApi(order.order_code);

	function onSendInvoiceSunat() {
		if (
			!order.invoice ||
			![STATUSORDER.pagado, STATUSORDER.entregado].includes(
				order.status_order_id,
			)
		) {
			sweetAlert({
				icon: "warning",
				title:
					"No se puede realizar esta acción, por que el estado de la orden no es 'PAGADO Y ENTREGADO' o 'ENTREGADO CORRECTAMENTE'",
				height: 80,
				timer: 4,
			});
			return;
		}
		if (order.invoice.send_sunat) {
			sweetAlert({
				icon: "warning",
				title: `Ya se emitió esta ${
					order.invoice.kind_invoice_code === "01" ? "Factura" : "Boleta"
				}`,
			});
			return;
		}
		ordersUpdateApiMutation.mutate(
			{
				...order,
				send_message: false,
				invoice: { ...order.invoice, send_sunat: true },
			},
			{
				onSuccess() {
					refetch(false);
					sweetAlert({
						icon: "success",
						title: `Se emitió esta ${
							order.invoice!.kind_invoice_code === "01" ? "Factura" : "Boleta"
						} correctamente`,
					});
				},
				onError(error) {
					sweetAlert({
						icon: "danger",
						title: error.message,
					});
				},
			},
		);
	}

	function onSendNoteSunat() {
		if (!order.note || order.status_order_id !== STATUSORDER.problema) {
			sweetAlert({
				icon: "warning",
				title:
					"No se puede realizar esta acción, por que el estado de la orden no es 'HUBO UN PROBLEMA'",
				height: 80,
				timer: 4,
			});
			return;
		}
		if (order.note.send_sunat) {
			sweetAlert({
				icon: "warning",
				title: `Ya se emitió esta ${
					order.note.kind_invoice_code === "07"
						? "Nota de Credito"
						: "Nota de Debito"
				} correctamente.`,
			});
			return;
		}
		ordersUpdateApiMutation.mutate(
			{
				...order,
				send_message: false,
				note: { ...order.note, send_sunat: true },
			},
			{
				onSuccess() {
					refetch(false);
					sweetAlert({
						icon: "success",
						title: `Se emitió esta ${
							order.invoice!.kind_invoice_code === "07"
								? "Nota de Credito"
								: "Nota de Debito"
						} correctamente`,
					});
				},
				onError(error) {
					sweetAlert({
						icon: "danger",
						title: error.message,
					});
				},
			},
		);
	}
	function onSendGuideSunat() {
		if (
			!order.guide ||
			![STATUSORDER.pagado, STATUSORDER.enviando].includes(
				order.status_order_id,
			)
		) {
			sweetAlert({
				icon: "warning",
				title:
					"No se puede realizar esta acción, por que el estado de la orden no es correcto",
				height: 80,
				timer: 4,
			});
			return;
		}
		if (order.guide.send_sunat) {
			sweetAlert({
				icon: "warning",
				title: "Ya se emitió esta guía correctamente.",
			});
			return;
		}
		ordersUpdateApiMutation.mutate(
			{
				...order,
				send_message: false,
				guide: { ...order.guide, send_sunat: true },
			},
			{
				onSuccess() {
					refetch(false);
					sweetAlert({
						icon: "success",
						title: "Se emitió esta guia correctamente",
					});
				},
				onError(error) {
					sweetAlert({
						icon: "danger",
						title: error.message,
					});
				},
			},
		);
	}

	return {
		onSendInvoiceSunat,
		onSendNoteSunat,
		ordersUpdateApiMutation,
		onSendGuideSunat,
	};
}

export default useSendSunat;
