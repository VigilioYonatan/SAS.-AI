import { formatDateTwo, onDownload } from "~/libs/helpers";
import { PdfImage, SunatImage, XmlImage, cdrImage } from "~/config/settings";
import enviroments from "~/config";
import type { OrdersSchemaFromServer } from "../schemas/orders.schema";
import useSendSunat from "../hooks/useSendSunat";
import usePdfInvoice from "../hooks/usePdfInvoice";

interface NoteProps {
	refetch: (clean?: boolean) => void;
	order: OrdersSchemaFromServer;
}
function Note({ order, refetch }: NoteProps) {
	const { ordersUpdateApiMutation, onSendNoteSunat } = useSendSunat({
		order,
		refetch,
	}); // pdf
	const { onPdf } = usePdfInvoice({ order, type: "note" });

	return (
		<div class="flex flex-col gap-2  w-full my-2 p-2">
			<div class="flex flex-col gap-2">
				<span class="flex gap-2 items-center text-primary  font-bold">
					{order.note!.kind_invoice_code === "07"
						? "Nota de Credito"
						: "Nota de debito"}
				</span>
			</div>
			<span class="flex gap-2 items-center text-primary dark:text-terciary font-bold">
				Serie - Correlativo:
				<b class="dark:text-secondary-light text-secondary-dark tracking-wide">
					{order.note!.serie}-{order.note!.correlativo}
				</b>
			</span>
			<span class="flex gap-2 items-center text-primary dark:text-terciary font-bold">
				Fecha:
				<b class="dark:text-secondary-light text-secondary-dark tracking-wide">
					{formatDateTwo(order.note!.createdAt!, "YYYY-MM-DD hh:mm")}
				</b>
			</span>
			<div class="flex flex-col gap-2">
				<span class="flex gap-2 items-center text-primary dark:text-terciary font-bold">
					Archivos:
				</span>
				<div class="flex gap-4">
					<button type="button" onClick={() => onPdf()}>
						<img
							class={`object-cover ${!order.note ? "grayscale" : ""}`}
							src={PdfImage()}
							width={40}
							height={100}
							alt="pdf"
						/>
					</button>
					<button
						type="button"
						onClick={() => {
							if (!order.note?.xml_path) return;
							onDownload(
								`${enviroments.VITE_URL}/${order.note!.xml_path}`,
								`${order.order_code}-note-xml`,
							);
						}}
						disabled={!order.note!.xml_path}
					>
						<img
							src={XmlImage()}
							class={`object-cover  ${
								!order.note!.xml_path ? "grayscale" : ""
							}`}
							width={48}
							height={100}
							alt="xml"
						/>
					</button>
					<button
						type="button"
						onClick={() => {
							if (!order.note?.cdr_path) return;
							onDownload(
								`${enviroments.VITE_URL}/${order.note!.cdr_path}`,
								`${order.order_code}-note-cdr`,
							);
						}}
						disabled={!order.note!.cdr_path}
					>
						<img
							src={cdrImage()}
							class={`object-cover ${!order.note!.cdr_path ? "grayscale" : ""}`}
							width={48}
							height={100}
							alt="cdr"
						/>
					</button>
					<button
						type="button"
						onClick={onSendNoteSunat}
						aria-label="send sunat"
						class="relative group"
						disabled={ordersUpdateApiMutation.isLoading || false}
					>
						{ordersUpdateApiMutation.isLoading ? (
							<span class="text-xs bg-black bg-opacity-85 absolute px-4 rounded-md top-2 text-white -right-1 z-10">
								Emitiendo
							</span>
						) : null}
						<img
							src={SunatImage()}
							class={`object-contain ${
								!order.note!.send_sunat
									? "grayscale hover:grayscale-0 cursor-pointer"
									: ""
							}`}
							width={80}
							height={100}
							alt="sunat"
						/>{" "}
						{order.note?.response_sunat ? (
							<pre class="text-xs bg-black bg-opacity-80 px-2 rounded-md text-[10px] font-normal hidden group-hover:block absolute text-white top-0 left-5 text-wrap break-words">
								{JSON.stringify(order.note.response_sunat)}
							</pre>
						) : null}
					</button>
				</div>
			</div>
		</div>
	);
}

export default Note;
