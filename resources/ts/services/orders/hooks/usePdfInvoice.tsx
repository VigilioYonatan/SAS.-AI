import { sweetAlert, sweetModal } from "@vigilio/sweet";
import { reactComponent } from "~/libs/preact";
import { ordersPDFApi } from "../apis/orders.pdf.api";
import type { OrdersSchemaFromServer } from "../schemas/orders.schema";
import Loading from "@/admin/components/Loading";
import View404 from "@/admin/views/404";
import LoaderSubmit from "~/components/LoaderSubmit";
import { STATUSORDER } from "../libs";
import { ordersHTMLApi } from "../apis/orders.html.api";
import { whatsappSendFileApi } from "@/bot/apis/whatsapp.api";
import { storageEmpresa } from "@/empresas/stores/empresa.store";
import Helper from "~/components/Helper";

interface usePdfInvoiceProps {
	order: OrdersSchemaFromServer;
	type?: "invoice" | "note" | "guide" | "recibo";
}
function usePdfInvoice({ order, type = "recibo" }: usePdfInvoiceProps) {
	function onPdf(isClient = false) {
		if (!order.invoice) {
			sweetAlert({
				icon: "warning",
				title: "No se puede realizar esta acción",
				height: 80,
				timer: 4,
			});
			return;
		}

		sweetModal({
			html: reactComponent(<PDFComponent isClient={isClient} />),
			showCloseButton: true,
			position: "start",
		});
	}

	function PDFComponent({ isClient = false }: { isClient: boolean }) {
		const whatsappSendFileMutation = whatsappSendFileApi();
		const ordersPDFQuery = ordersPDFApi(order.order_code, type);
		const html = ordersHTMLApi(order.order_code, type);

		let component: JSX.Element | JSX.Element[] | null = null;

		if (ordersPDFQuery.isLoading) {
			component = <Loading className="h-[450px]" />;
		}
		if (ordersPDFQuery.isError) {
			component = <View404 />;
		}
		if (ordersPDFQuery.isSuccess) {
			const pdf = URL.createObjectURL(ordersPDFQuery.data!);
			const nameFile = `${order.order_code}-${
				type === "invoice" ? "comprobante" : "nota"
			}`;

			async function onSendWhatsapp() {
				if (
					!order.invoice ||
					order.status_order_id !== STATUSORDER.pagado ||
					!order.telephone
				) {
					sweetAlert({
						icon: "warning",
						title:
							"No se puede realizar esta acción, por que no se ha pagado esta orden",
					});
					return;
				}
				sweetModal({
					title: "¿Estás seguro de enviar el comprobante por whatsapp?",
					customIcon:
						"<i class='fas fa-user-robot text-3xl dark:text-white' ></i>",
					showCloseButton: true,
					showCancelButton: true,
				}).then(async ({ isConfirmed }) => {
					if (isConfirmed) {
						//  convertirmos a pdf por que solo recibe pdf
						const archivoPDF = new File([ordersPDFQuery.data!], nameFile, {
							type: "application/pdf",
						});
						whatsappSendFileMutation.mutate(
							{
								file: archivoPDF,
								name: `${order.order_code}-${type}`,
								telephone: `${storageEmpresa?.dial_code}${order.telephone}@c.us`,
							},
							{
								onSuccess() {
									sweetAlert({
										icon: "success",
										title: "Se envió comprobante correctamente",
									});
								},
								onError() {
									sweetModal({
										icon: "danger",
										title: "No Se envió comprobante correctamente",
										text: "Asegurarse de tener whatsapp conectado correctamente. Comunicarse con la empresa para recibir ayuda.",
									});
								},
							},
						);
					}
				});
			}
			component = (
				<div>
					<embed
						src={pdf}
						type="application/pdf"
						width="100%"
						height={600}
						frameborder="0"
					/>
					<br />
					<div class="flex gap-2 mt-5 items-center  justify-between flex-wrap">
						<div class="flex gap-2 items-center ">
							<a
								class="bg-blue-600 px-4 py-2 rounded-md text-white shadow-md justify-center flex items-center text-xs gap-2"
								href={pdf}
								download={nameFile}
							>
								<i class="fa-solid fa-download" /> Descargar
							</a>
							{order.telephone && !isClient ? (
								<button
									type="button"
									class="bg-green-600 px-4 py-2 rounded-md text-white shadow-md justify-center flex items-center text-xs gap-2"
									onClick={onSendWhatsapp}
									disabled={whatsappSendFileMutation.isLoading || false}
								>
									{whatsappSendFileMutation.isLoading ? (
										<LoaderSubmit />
									) : (
										<>
											<i class="fa-brands fa-whatsapp ml-1" />
											Enviar a +{storageEmpresa?.dial_code} {order.telephone}
										</>
									)}
								</button>
							) : (
								<span class="dark:text-white text-xs">
									No se insertó numero
								</span>
							)}
						</div>
						<button
							type="button"
							class="text-black px-4 py-2 rounded-md bg-white shadow-md flex gap-2 items-center justify-center text-xs relative"
							onClick={async () => {
								sweetModal({
									html: reactComponent(
										<div
											class=""
											onClick={() => {
												window.print();
											}}
										>
											<div
												class="bg-white p-2 container-html"
												dangerouslySetInnerHTML={{
													__html: html
														.data!.replaceAll(
															"<br>",
															"<div style='display:block;'></div>",
														)
														.replaceAll(
															`<hr style="display: block; height: 1px; border: 0; border-top: 1px solid #666;  padding: 0;">`,
															"",
														),
												}}
											/>
											<style jsx>{`
                                                .container-html img {
                                                    width: 100px !important;
                                                }
                                                .container-html td {
                                                    font-size: 1rem;
                                                }
                                                .container-html blockquote {
                                                    margin: 0px !important;
                                                }
                                            `}</style>
										</div>,
									),
									sweetWidth: "400px",
									showCloseButton: true,
									position: "start",
								});
							}}
						>
							<i class="fa-solid fa-print" /> Imprimir
							<HelperPDF />
						</button>
					</div>
				</div>
			);
		}
		return component;
	}
	return {
		onPdf,
	};
}
interface HelperPDFProps {
	top?: number;
	right?: number;
}
export function HelperPDF({ right = -155, top = -10 }: HelperPDFProps) {
	return (
		<Helper top={top} right={right}>
			<div class="absolute  -top-24 dark:bg-admin-background-dark bg-white text-black p-2 rounded-sm hidden group-hover:block dark:text-white w-[300px]">
				<span class="text-primary font-bold dark:text-white">
					¿Como imprimir en Impresora Termica 80mm?
				</span>
				<ul>
					<li>
						1. Descargar y Instalar{" "}
						<a
							href="https://www.mediafire.com/file/dy47axlpgdajhz9/ESCPOSPrintServicev3.1.2_edbyyouarefinished_src_A2ZAPK.COM.apk"
							target="_blank"
							rel="noreferrer"
							class="text-primary underline"
						>
							Aplicación
						</a>{" "}
						en tu dispositivo Android.
					</li>
					<li>
						2. Ver el video de como usar la aplicación{" "}
						<a
							href="https://youtu.be/0DWUF3cJpRU"
							target="blank"
							class="text-primary underline font-bold"
						>
							Ver video.
						</a>
					</li>
					<li>
						3. Recuerda que debes tener una impresora térmica con bluetooth.
					</li>
				</ul>
			</div>
		</Helper>
	);
}
export default usePdfInvoice;
