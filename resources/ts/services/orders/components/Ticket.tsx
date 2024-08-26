import { formatDateTwo } from "~/libs/helpers";
import { PdfImage } from "~/config/settings";
import type { OrdersSchemaFromServer } from "../schemas/orders.schema";
import usePdfInvoice from "../hooks/usePdfInvoice";

interface InvoiceProps {
	order: OrdersSchemaFromServer;
}
function Ticket({ order }: InvoiceProps) {
	const { onPdf } = usePdfInvoice({ order });
	return (
		<div class="flex flex-col gap-2  w-full p-2">
			<div class="flex flex-col gap-2">
				<span class="flex gap-2 items-center text-primary  font-bold ">
					{order.invoice!.kind_invoice_code === "00" ? "Ticket" : null}
				</span>
			</div>
			<span class="flex gap-2 items-center text-primary dark:text-terciary font-bold">
				Serie - Correlativo:
				<b class="dark:text-secondary-light text-secondary-dark tracking-wide">
					{order.invoice!.serie}-{order.invoice!.correlativo}
				</b>
			</span>

			<span class="flex gap-2 items-center text-primary dark:text-terciary font-bold">
				Fecha:
				<b class="dark:text-secondary-light text-secondary-dark tracking-wide">
					{formatDateTwo(order.invoice!.createdAt!, "YYYY-MM-DD hh:mm")}
				</b>
			</span>
			<div class="flex flex-col gap-2">
				<span class="flex gap-2 items-center text-primary dark:text-terciary font-bold">
					Archivos:
				</span>
				<div class="flex gap-4">
					<button type="button" onClick={() => onPdf()}>
						<img
							class="object-cover"
							src={PdfImage()}
							width={40}
							height={100}
							alt="pdf"
						/>
					</button>
				</div>
			</div>
		</div>
	);
}

export default Ticket;
