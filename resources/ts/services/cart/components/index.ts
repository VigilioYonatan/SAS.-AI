import { formatMoney } from "../libs/helpers";
import type { OrdersCartStoreDto } from "@/orders/dtos/orders-cart.dto";

interface confirmOrderProps {
	body: OrdersCartStoreDto;
	arrayKindInvoices: { key: string; value: string }[];
	total: number;
}
export function confirmOrder({
	body,
	arrayKindInvoices,
	total,
}: confirmOrderProps) {
	const { address, reference } = body;
	return `
    <div class="flex flex-col gap-2">
        <p>
            Número de celular: <b>${body.telephone || "No se ingresó"}</b>
        </p>
        <p>
            Dirección: <b>${address}</b>
        </p>
        <p>
            Referencia: <b>${reference}</b>
        </p>
        <p>
            Tipo de comprobante: <b>${
							arrayKindInvoices?.find(
								(kind) => kind.key === body.invoice?.kind_invoice_code,
							)?.value
						}</b>
        </p>
        ${
					body.invoice?.kind_invoice_code === "01"
						? `<p>
                        Tipo de documento: <b>${"dni"}</b>
                    </p><p>
                    Numero de identificación: <b>${
											body.invoice?.identification_number
										}</b>
                    </p>`
						: body.invoice?.kind_invoice_code === "03"
							? ` <p>
                    Ruc: <b>${body.invoice?.identification_number}</b>
                    </p><p>
                    Razón Social: <b>${body.invoice?.razon_social}</b>
                </p>
                <p>
                Dirección: <b>${body.address}</b>
                </p>`
							: null
				}
        <p>
            Total: <b>${formatMoney(total)}</b>
        </p>
    </div>
    `;
}
