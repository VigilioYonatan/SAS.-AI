import type { Columns } from "@vigilio/preact-table";
import type { OrdersSchemaFromServer } from "../schemas/orders.schema";
import { formatDolares, formatSoles } from "@/cart/libs/helpers";
import { onDownload, showTime } from "~/libs/helpers";
import { PAYMETHOD, STATUSORDER, colorByOrdersId } from ".";
import { PdfImage, SunatImage, XmlImage, cdrImage } from "~/config/settings";
import { payMethodIcon } from ".";
import AdminDropdown from "@/admin/components/AdminDropdown";
import useSendSunat from "../hooks/useSendSunat";
import usePdfInvoice from "../hooks/usePdfInvoice";
import enviroments from "~/config";
import { ordersUpdateApi } from "../apis/orders.update.api";
import { sweetAlert } from "@vigilio/sweet";

const ordersColumns: Columns<OrdersSchemaFromServer, "actions"> = [
	{ key: "id", isSort: true },
	{ key: "order_code", header: "código" },
	{
		key: "status_order_id",
		header: "estado",
		cell: (props, _, methods) => {
			const ordersUpdateApiMutation = ordersUpdateApi(props.order_code);
			return (
				<span
					class={`${colorByOrdersId(
						props.status_order_id,
					)} py-1 px-2 rounded-md text-white font-semibold`}
				>
					{props.status_order_id === STATUSORDER.entregado ? (
						<i class="fa-regular fa-circle-check mr-1" />
					) : null}
					{props.status_order_id === STATUSORDER.problema ? (
						<i class="fa-solid fa-circle-exclamation mr-1" />
					) : null}
					{props.status_order.name}
					{props.status_order_id === STATUSORDER.pendiente &&
					(props.pay_method_id === PAYMETHOD.paypal ||
						props.pasarela_comision) ? (
						<button
							type="button"
							aria-label="show message"
							class="relative  px-2 py-1 rounded-full text-xs text-white group ml-2 bg-black"
							onClick={(e) => e.stopPropagation()}
						>
							{" "}
							?{" "}
							<span class="absolute -top-10 z-10 hidden group-hover:block  bg-black p-2 rounded-md w-[200px] text-wrap break-words">
								Si sigue PENDIENTE, quiere decir que ha intentando pagar pero no
								se ha realizado el pago. Recomiendo cambiar estado a{" "}
								<b>'HUBO UN PROBLEMA'</b> si sigue en PENDIENTE por varios
								minutos.
							</span>{" "}
						</button>
					) : null}
					{props.status_order_id === STATUSORDER.pagado ? (
						<button
							type="button"
							aria-label="show message"
							class="relative  px-2 py-1 rounded-full text-xs text-white group ml-2 bg-black"
							onClick={(e) => e.stopPropagation()}
						>
							?
							<span class="absolute -top-10 z-10 hidden group-hover:block  bg-black p-2 rounded-md w-[200px] text-wrap break-words">
								Recuerda cambiar el estado a <b>ENTREGADO CORRECTAMENTE</b> si
								ya entregaste el pedido.{" "}
								<button
									type="button"
									aria-label="change"
									class="text-primary underline"
									onClick={(e) => {
										e.stopPropagation();
										ordersUpdateApiMutation.mutate(
											{
												...props,
												status_order_id: STATUSORDER.entregado,
												send_message: false,
											},
											{
												onSuccess() {
													methods.refetch(false);
													sweetAlert({
														icon: "success",
														title:
															"Se cambió el estado correctamente a ENTREGADO CORRECTAMENTE",
													});
												},
												onError(err) {
													sweetAlert({
														icon: "success",
														title: err.message,
													});
												},
											},
										);
									}}
								>
									Cambiar a entregado
								</button>
							</span>
						</button>
					) : null}
				</span>
			);
		},
		isSort: true,
	},
	{
		key: "pay_method_id",
		header: "Metódo de pago",
		cell: (props) => (
			<div
				dangerouslySetInnerHTML={{
					__html: payMethodIcon()[props.pay_method_id],
				}}
				class="flex justify-center items-center"
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
		header: "Facturación",
		cell: orderActions,
	},
];
export default ordersColumns;
export function orderActions(
	props: OrdersSchemaFromServer,
	_: number,
	methods: { refetch: (clean?: boolean) => void },
) {
	if (!props.invoice)
		return <span class="dark:text-white text-xs">En espera</span>;
	if (props.invoice?.kind_invoice_code === "00") {
		return <span class="dark:text-white text-xs">Ticket</span>;
	}

	const { ordersUpdateApiMutation, onSendInvoiceSunat, onSendNoteSunat } =
		useSendSunat({
			order: props,
			refetch: methods.refetch,
		});
	const invoicePDF = usePdfInvoice({ order: props });
	const notePDF = usePdfInvoice({ order: props, type: "note" });

	return (
		<div class="flex justify-center items-center">
			<AdminDropdown
				triggerChildren={({ onOpenClose }) => (
					<button
						disabled={!props.invoice?.send_sunat}
						onClick={(e) => {
							if (!props.invoice?.send_sunat) return;
							e.stopPropagation();
							onOpenClose();
						}}
						class="flex gap-1 sm:gap-4 items-center justify-center "
						type="button"
						aria-label="show sunat"
					>
						<div>
							<img
								src={SunatImage()}
								class={`object-contain lg:w-[70px] ${
									!props.invoice?.send_sunat ? "grayscale" : ""
								}`}
								width={50}
								height={100}
								alt="sunat"
							/>
							<span class="text-terciary font-bold text-[9px] ">
								{props.invoice?.kind_invoice_code === "01"
									? "Factura"
									: "Boleta"}
							</span>
						</div>

						<i class="fas fa-ellipsis-v text-2xl" />
					</button>
				)}
			>
				<div>
					<div>
						<span class="dark:text-white text-[10px] mb-1">
							{props.invoice?.kind_invoice_code === "01" ? "Factura" : "Boleta"}{" "}
							: {props.invoice?.serie}-{props.invoice?.correlativo}{" "}
							{props.invoice?.send_sunat ? (
								<i class="far fa-check-circle" />
							) : null}
						</span>
						<div
							class="flex gap-2 items-center justify-center z-10"
							onClick={(e) => e.stopPropagation()}
						>
							<button
								type="button"
								aria-label="btn to pdf"
								onClick={() => invoicePDF.onPdf()}
							>
								<img
									src={PdfImage()}
									class={`object-cover ${!props.invoice ? "grayscale" : ""}`}
									width={40}
									height={100}
									alt="pdf"
								/>
							</button>
							<button
								type="button"
								onClick={() => {
									if (!props.invoice?.xml_path) return;
									onDownload(
										`${enviroments.VITE_URL}/${props.invoice!.xml_path}`,
										`${props.order_code}-xml`,
									);
								}}
								disabled={!props.invoice?.xml_path}
							>
								<img
									src={XmlImage()}
									class={`object-cover ${
										!props.invoice?.xml_path ? "grayscale" : ""
									}`}
									width={40}
									height={100}
									alt="xml"
								/>
							</button>
							<button
								type="button"
								onClick={() => {
									if (!props.invoice?.cdr_path) return;
									onDownload(
										`${enviroments.VITE_URL}/${props.invoice?.cdr_path}`,
										`${props.order_code}-cdr`,
									);
								}}
								disabled={!props.invoice?.cdr_path}
							>
								<img
									src={cdrImage()}
									class={`object-cover ${
										!props.invoice?.cdr_path ? "grayscale" : ""
									}`}
									width={40}
									height={100}
									alt="cdr"
								/>
							</button>

							<button
								type="button"
								onClick={onSendInvoiceSunat}
								aria-label="send sunat"
								class="relative group"
							>
								{ordersUpdateApiMutation.isLoading ? (
									<span class="text-xs bg-black bg-opacity-85 absolute px-4 rounded-md z-10 top-2 text-white -right-1">
										Emitiendo
									</span>
								) : null}
								<img
									src={SunatImage()}
									class={`object-contain ${
										!props.invoice!.send_sunat
											? "grayscale hover:grayscale-0 cursor-pointer"
											: ""
									}`}
									width={80}
									height={100}
									alt="sunat"
								/>{" "}
								{props.invoice?.response_sunat ? (
									<span class="text-xs bg-black bg-opacity-80 px-2 rounded-md text-[10px] font-normal hidden group-hover:block absolute text-white top-0  w-[100px] text-wrap overflow-hidden">
										{JSON.stringify(props.invoice.response_sunat)}
									</span>
								) : null}
							</button>
						</div>
					</div>
					{/* nota */}
					{props.invoice?.send_sunat &&
					props.status_order_id === STATUSORDER.problema ? (
						<div>
							<span class="dark:text-white text-[10px] mb-1">
								{props.note?.kind_invoice_code === "07"
									? "Nota de Credito"
									: "Nota de Debito"}{" "}
								: {props.note?.serie}-{props.note?.correlativo}{" "}
								{props.note?.send_sunat ? (
									<i class="far fa-check-circle" />
								) : null}
							</span>
							<div
								class="flex gap-2 items-center justify-center z-10"
								onClick={(e) => e.stopPropagation()}
							>
								<button
									type="button"
									aria-label="btn to pdf"
									onClick={() => notePDF.onPdf()}
								>
									<img
										src={PdfImage()}
										class={`object-cover w-[30px] ${
											!props.note ? "grayscale" : ""
										}`}
										width={30}
										height={100}
										alt="pdf"
									/>
								</button>
								<button
									type="button"
									onClick={() => {
										if (!props.note?.xml_path) return;
										onDownload(
											`${enviroments.VITE_URL}/${props.note?.xml_path}`,
											`${props.order_code}-note-xml`,
										);
									}}
									disabled={!props.note?.xml_path}
								>
									<img
										src={XmlImage()}
										class={`object-cover ${
											!props.note?.xml_path ? "grayscale" : ""
										}`}
										width={40}
										height={100}
										alt="xml"
									/>
								</button>
								<button
									type="button"
									onClick={() => {
										if (!props.note?.cdr_path) return;
										onDownload(
											`${enviroments.VITE_URL}/${props.note?.cdr_path}`,
											`${props.order_code}-note-cdr`,
										);
									}}
									disabled={!props.note?.cdr_path}
								>
									<img
										src={cdrImage()}
										class={`object-cover ${
											!props.note?.cdr_path ? "grayscale" : ""
										}`}
										width={40}
										height={100}
										alt="cdr"
									/>
								</button>

								<button
									type="button"
									onClick={onSendNoteSunat}
									aria-label="send sunat"
									class="relative group"
								>
									{ordersUpdateApiMutation.isLoading ? (
										<span class="text-xs bg-black bg-opacity-85 absolute px-4 rounded-md z-10 top-2 text-white -right-1">
											Emitiendo
										</span>
									) : null}
									<img
										src={SunatImage()}
										class={`object-contain ${
											!props.note?.send_sunat
												? "grayscale hover:grayscale-0 cursor-pointer"
												: ""
										}`}
										width={80}
										height={100}
										alt="sunat"
									/>
									{props.note?.response_sunat ? (
										<span class="text-xs bg-black bg-opacity-80 px-2 rounded-md text-[10px] font-normal hidden group-hover:block absolute text-white top-0  w-[100px] text-wrap overflow-hidden">
											{JSON.stringify(props.note.response_sunat)}
										</span>
									) : null}
								</button>
							</div>
						</div>
					) : null}
				</div>
			</AdminDropdown>
		</div>
	);
}
