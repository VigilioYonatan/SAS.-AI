import { formatDateTwo, onDownload } from "~/libs/helpers";
import usePdfInvoice from "../hooks/usePdfInvoice";
import useSendSunat from "../hooks/useSendSunat";
import type { OrdersSchemaFromServer } from "../schemas/orders.schema";
import { cdrImage, PdfImage, SunatImage, XmlImage } from "~/config/settings";
interface GuideProps {
	order: OrdersSchemaFromServer;
	refetch: (clean?: boolean) => void;
}
function Guide({ order, refetch }: GuideProps) {
	const { onSendGuideSunat, ordersUpdateApiMutation } = useSendSunat({
		order,
		refetch,
	});

	const { onPdf } = usePdfInvoice({ order, type: "guide" });

	return (
		<div class="flex flex-col gap-2  w-full p-2">
			<div class="flex flex-col gap-2">
				<span class="flex gap-2 items-center text-primary  font-bold ">
					{order.guide!.kind_guide_code === "09"
						? "Guia de remision remitente"
						: ""}
				</span>
			</div>
			<span class="flex gap-2 items-center text-primary dark:text-terciary font-bold">
				Serie - Correlativo:
				<b class="dark:text-secondary-light text-secondary-dark tracking-wide">
					{order.guide!.serie}-{order.guide!.correlativo}
				</b>
			</span>

			<span class="flex gap-2 items-center text-primary dark:text-terciary font-bold">
				Fecha:
				<b class="dark:text-secondary-light text-secondary-dark tracking-wide">
					{formatDateTwo(order.guide!.createdAt!, "YYYY-MM-DD hh:mm")}
				</b>
			</span>
			<div class="flex flex-col gap-2">
				<span class="flex gap-2 items-center text-primary dark:text-terciary font-bold">
					Archivos:
				</span>
				<div class="flex gap-4">
					<button type="button" onClick={() => onPdf()}>
						<img
							class={`object-cover ${!order.guide ? "grayscale" : ""}`}
							src={PdfImage()}
							width={40}
							height={100}
							alt="pdf"
						/>
					</button>
					<button
						type="button"
						onClick={() => {
							if (!order.guide?.xml_path) return;
							onDownload(
								`/empresas/${order.guide!.xml_path}`,
								`${order.order_code}.xml`,
							);
						}}
						disabled={!order.guide!.xml_path}
					>
						<img
							src={XmlImage()}
							class={`object-cover  ${
								!order.guide?.xml_path ? "grayscale" : ""
							}`}
							width={48}
							height={100}
							alt="xml"
						/>
					</button>
					<button
						type="button"
						onClick={() => {
							if (!order.guide?.cdr_path) return;
							onDownload(
								`/empresas/${order.guide!.cdr_path}`,
								`${order.order_code}.cdr`,
							);
						}}
						disabled={!order.guide!.cdr_path}
					>
						<img
							src={cdrImage()}
							class={`object-cover ${
								!order.guide!.cdr_path ? "grayscale" : ""
							}`}
							width={48}
							height={100}
							alt="cdr"
						/>
					</button>
					<button
						type="button"
						onClick={onSendGuideSunat}
						aria-label="send sunat"
						class="relative group"
						disabled={ordersUpdateApiMutation.isLoading || false}
					>
						{ordersUpdateApiMutation.isLoading ? (
							<span class="text-xs bg-black bg-opacity-85 absolute px-4 rounded-md z-10 top-2 text-white -right-1">
								Emitiendo
							</span>
						) : null}
						<img
							src={SunatImage()}
							class={`object-contain ${
								!order.guide!.send_sunat
									? "grayscale hover:grayscale-0 cursor-pointer"
									: ""
							}`}
							width={80}
							height={100}
							alt="sunat"
						/>
						{order.guide?.response_sunat ? (
							<span class="text-xs bg-black bg-opacity-80 px-2 rounded-md text-[10px] font-normal hidden group-hover:block absolute text-white top-0 left-10">
								{JSON.stringify(order.guide.response_sunat)}
							</span>
						) : null}
					</button>
				</div>
			</div>
		</div>
	);
}

export default Guide;
