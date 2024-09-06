import AdminBreadCrumb from "@/admin/components/AdminBreadCrumb";
import BoxEntity from "@/admin/components/BoxEntity";
import { useTable } from "@vigilio/preact-table";
import invoicesColumns from "../libs/InvoicesColumns";
import { invoicesPaginatorApi } from "@/common/paginator/invoices.paginator.api";
import VigilioTable from "~/components/table";
import Container from "@/admin/components/Container";
import AdminHr from "~/components/AdminHr";
import { useSignal } from "@preact/signals";
import { useEffect } from "preact/hooks";
import { adminFacturationSystemApi } from "../apis/systemFacturation.api";
import Loading from "@/admin/components/Loading";
import useAuthStore from "@/auth/stores/auth.store";
import PieFacturacion from "../components/PieFacturacion";
import { SunatImage } from "~/config/settings";
import CompaniesStore from "../components/CompanyStore";
import { printFileWithDimension } from "~/libs/upload";
import { sweetModal } from "@vigilio/sweet";
import { reactComponent } from "~/libs/preact";
import { subFacturacion } from "~/config/guards";
import usePaginatorTimer from "~/hooks/usePaginatorTimer";
import OrdersShow from "@/orders/views/OrdersShow";
import type { OrdersSchemaFromServer } from "@/orders/schemas/orders.schema";
import useInformationStore from "@/information/stores/information.store";

function FacturacionIndex() {
	const adminFacturationSystem = adminFacturationSystemApi();
	const information = useInformationStore();
	if (
		!useAuthStore().guards.permissionAdminGuard() &&
		information.state?.dial_code
	) {
		window.history.back();
		return null;
	}
	if (!subFacturacion()) {
		window.location.href = "/admin/plus";
		return null;
	}
	let component: JSX.Element | JSX.Element[] | null = null;
	if (adminFacturationSystem.isLoading) {
		component = <Loading />;
	}
	if (adminFacturationSystem.error) {
		component = (
			<div class="dark:text-secondary-light text-secondary-dark">
				Error: comunicarse con desarrollador
			</div>
		);
	}
	if (
		adminFacturationSystem.isSuccess &&
		adminFacturationSystem.data?.success
	) {
		const count = adminFacturationSystem.data.count;
		const { time, SelectTimer } = usePaginatorTimer();
		const kind_invoice_code = useSignal("01");

		const tableInvoices = useTable({
			columns: invoicesColumns(kind_invoice_code),
			pagination: { limit: 20 },
		});

		function onChangeComprobante(e: Event) {
			const codeComprobant = (e.target as HTMLSelectElement).value;
			kind_invoice_code.value = codeComprobant;
		}
		const invoicePaginator = invoicesPaginatorApi(
			tableInvoices,
			kind_invoice_code.value,
			time,
		);

		function onCompanyUpdate() {
			sweetModal((onClose) => ({
				html: reactComponent(<CompaniesStore onClose={onClose} />),
				isCloseInBackground: false,
				showCloseButton: true,
				sweetWidth: "700px",
			}));
		}

		useEffect(() => {
			invoicePaginator.refetch(false);
		}, [time]);
		useEffect(() => {
			invoicePaginator.refetch(false);
		}, [kind_invoice_code.value]);

		function onOpenOrder(props: OrdersSchemaFromServer) {
			sweetModal({
				html: reactComponent(
					<OrdersShow
						params={{
							order_code: props.order_code,
						}}
					/>,
				),
				showCloseButton: true,
				position: "start",
				sweetWidth: "800px",
				isCloseInBackground: false,
			});
		}

		component = (
			<div class="p-2">
				<div className="flex flex-col gap-4 mx-1 mb-3">
					<AdminBreadCrumb current="facturación" />
				</div>

				{information.state?.company && information.state.enabled_igv ? (
					<>
						<div class="p-2 flex flex-col lg:flex-row gap-4">
							<div class="grid grid-cols-1 sm:grid-cols-2 2xl:grid-cols-3 gap-4 w-full">
								<BoxEntity
									title="Facturaciones"
									color="bg-green-500"
									ico={<i class="fa-sharp fa-solid fa-ballot-check" />}
									quantity={String(count.facturas)}
								/>
								<BoxEntity
									title="Boletas"
									color="bg-blue-500"
									ico={<i class="fal fa-receipt" />}
									quantity={String(count.boletas)}
								/>
								<BoxEntity
									title="Notas de Credito"
									color="bg-orange-500"
									ico={<i class="fas fa-file-invoice" />}
									quantity={String(count.notaCredito)}
								/>
								<BoxEntity
									title="Notas de Debito"
									color="bg-white"
									ico={<i class="fas fa-file-invoice text-black" />}
									quantity={String(count.notaDebito)}
								/>
							</div>
							<div class="xl:w-[550px] p-2 flex justify-center items-center flex-col bg-white rounded-md shadow dark:bg-admin-paper-dark dark:text-white relative">
								<h2 class="text-3xl font-bold">{new Date().getFullYear()}</h2>
								<p class="text-2xl font-normal text-center">
									Sistema de Facturación
								</p>
								<img src={SunatImage()} width={100} height={100} alt="sunat" />
								<button
									class="absolute top-0 right-0 m-2"
									type="button"
									aria-label="settings snat"
									onClick={onCompanyUpdate}
								>
									<i class="fa-solid fa-gear" />
								</button>
								{information.state.certificado ? (
									<a
										class="absolute top-0 right-6 m-2"
										href={
											printFileWithDimension(
												information.state.certificado,
												null,
											)[0]
										}
										download
									>
										<i class="fa-solid fa-file-certificate" />
									</a>
								) : null}
							</div>
						</div>
						<div class="flex xl:flex-row flex-col gap-4 p-2 items-center">
							<Container className="p-2 rounded-md overflow-auto w-full">
								<span class="dark:text-secondary-light text-secondary-dark font-bold text-xl mt-2 block text-center xl:text-start">
									Comprobantes
								</span>
								<AdminHr spacing={0} />
								<div class="overflow-auto">
									<VigilioTable query={invoicePaginator} table={tableInvoices}>
										<VigilioTable.header className="mb-4 flex flex-wrap gap-2 items-center justify-center md:justify-between">
											<select
												name="kind_invoice_code"
												id="kind_invoice_code"
												value={kind_invoice_code}
												onChange={onChangeComprobante}
												class="px-3 py-2 rounded-md font-semibold bg-paper-light dark:bg-admin-terciary  dark:text-white"
											>
												<option value="01">Facturas</option>
												<option value="03">Boletas</option>
												<option value="07">Notas de Credito</option>
												<option value="08">Notas de Debito</option>
											</select>
											<SelectTimer />
											<div class="flex gap-2 items-center">
												<VigilioTable.header.limit />
												<VigilioTable.header.refetch />
											</div>
										</VigilioTable.header>
										<VigilioTable.table>
											<VigilioTable.thead>
												<VigilioTable.thead.row>
													<VigilioTable.thead.th />
												</VigilioTable.thead.row>
											</VigilioTable.thead>
											<VigilioTable.tbody>
												<VigilioTable.tbody.row handleClick={onOpenOrder}>
													{(data) => <VigilioTable.tbody.td data={data} />}
												</VigilioTable.tbody.row>
											</VigilioTable.tbody>
										</VigilioTable.table>
										<VigilioTable.footer>
											<VigilioTable.footer.paginator />
											<VigilioTable.footer.show />
										</VigilioTable.footer>
									</VigilioTable>
								</div>
							</Container>
							<Container className="flex justify-center items-center p-2 w-full   xl:w-[600px] self-start">
								<PieFacturacion count={count} />
							</Container>
						</div>
					</>
				) : (
					<Container className="max-w-[600px] mt-1">
						<CompaniesStore />
					</Container>
				)}
			</div>
		);
	}

	return component;
}

export default FacturacionIndex;
