import { sweetModal } from "@vigilio/sweet";
import type { OrdersSchemaFromServer } from "../schemas/orders.schema";
import { reactComponent } from "~/libs/preact";
import ProductsShow from "@/products/views/ProductsShow";
import enviroments from "~/config";
import {
	formatDolares,
	formatSoles,
	pasarelaComision,
	paypalComision,
	subtotal,
} from "@/cart/libs/helpers";

interface TableDetailsOrderProps {
	order: OrdersSchemaFromServer;
	isClient?: boolean;
}
function TableDetailsOrder({
	order,
	isClient = false,
}: TableDetailsOrderProps) {
	function onOpenProduct(id: number) {
		if (isClient) {
			window.location.href = `${enviroments.VITE_URL}/${id}`;
			return;
		}
		sweetModal({
			html: reactComponent(<ProductsShow id={id} />),
			position: "start",
			showCloseButton: true,
			sweetWidth: "700px",
		});
	}

	return (
		<table class="w-full dark:text-white">
			<thead class="bg-primary p-3">
				<tr class="text-white">
					<th class="text-xs lg:text-sm">ID</th>
					<th class="text-xs lg:text-sm">Producto</th>
					<th class="text-xs lg:text-sm">Cantidad</th>
					<th class="text-xs lg:text-sm">Valor Unitario</th>
					<th class="text-xs lg:text-sm">SubTotal</th>
				</tr>
			</thead>
			<tbody>
				{order.details_orders.map((detail_order) => (
					<tr class="border-b " key={detail_order.id}>
						<td class="text-center col-span-1 font-normal">
							{detail_order.product ? detail_order.product.id : "0"}
						</td>
						<td class="md:p-2 min-w-[200px]">
							<button
								type="button"
								aria-label="open to product"
								onClick={() => onOpenProduct(detail_order.product_id)}
								class="text-xs md:text-sm text-center mx-auto hover:text-primary font-normal  block"
							>
								{detail_order.product
									? detail_order.product.name
									: "producto eliminado"}{" "}
								{detail_order.variante}
							</button>
						</td>
						<td class="text-center  text-xs lg:text-sm">
							{detail_order.quantity}
						</td>
						<td class="text-center  text-xs lg:text-sm">
							{order.moneyChange === 1
								? formatSoles(detail_order.price / detail_order.quantity)
								: formatDolares(
										detail_order.price /
											detail_order.quantity /
											order.moneyChange,
									)}{" "}
							{detail_order.coupon ? (
								<span>inc. {detail_order.coupon}</span>
							) : null}
						</td>
						<td class="text-center text-xs lg:text-sm">
							{order.moneyChange === 1
								? formatSoles(detail_order.price)
								: formatDolares(detail_order.price / order.moneyChange)}
						</td>
					</tr>
				))}
				{order.district_id ? (
					<tr class="border-b ">
						<td class="text-center col-span-1 font-normal">0</td>
						<td class="md:p-2 min-w-[200px]">
							<button
								type="button"
								aria-label="open to product"
								class="text-xs md:text-sm text-center mx-auto hover:text-primary font-normal  block"
							>
								Costo de envio - {order.district.province.department.name}
							</button>
						</td>
						<td class="text-center  text-xs lg:text-sm">1</td>
						<td class="text-center  text-xs lg:text-sm">
							{order.moneyChange === 1
								? formatSoles(
										order.igv
											? subtotal(
													order.district.province.department.priceShipping,
													enviroments.VITE_IGV,
													true,
												)
											: order.district.province.department.priceShipping,
									)
								: formatDolares(
										order.igv
											? subtotal(
													order.district.province.department.priceShipping,
													enviroments.VITE_IGV,
													true,
												) / order.moneyChange
											: order.district.province.department.priceShipping /
													order.moneyChange,
									)}
						</td>
						<td class="text-center text-xs lg:text-sm">
							{order.moneyChange === 1
								? formatSoles(
										order.igv
											? subtotal(
													order.district.province.department.priceShipping,
													enviroments.VITE_IGV,
													true,
												)
											: order.district.province.department.priceShipping /
													order.moneyChange,
									)
								: formatDolares(
										order.igv
											? subtotal(
													order.district.province.department.priceShipping,
													enviroments.VITE_IGV,
													true,
												) / order.moneyChange
											: order.district.province.department.priceShipping /
													order.moneyChange,
									)}
						</td>
					</tr>
				) : null}
			</tbody>
			<tfoot>
				<tr class="w-full">
					<td />
					<td />
					<td>
						<div class="min-w-[200px]">
							{order.moneyChange === 1 ? (
								""
							) : (
								<span class="dark:text-white text-xs mb-2 font-semibold">
									Se pagó en dolares: S/.
									{order.moneyChange.toFixed(2)}
								</span>
							)}
						</div>
					</td>
					<td class="text-center">Total: </td>
					<td class="text-center bg-primary text-white  text-sm">
						{order.moneyChange === 1 ? (
							<>{formatSoles(order.total)}</>
						) : (
							formatDolares(order.total / order.moneyChange)
						)}
						{order.pasarela_comision || order.paypal_token ? (
							<button
								type="button"
								aria-label="on"
								class="text-xs bg-white text-black px-2 py-1 rounded-full relative group ml-2"
							>
								?
								<span class="absolute hidden group-hover:block z-40 -top-10 -left-40 bg-black text-white p-2 rounded-md  w-[200px]">
									{order.pasarela_response ? (
										<>
											{order.moneyChange === 1
												? formatSoles(pasarelaComision(order.total))
												: formatDolares(
														pasarelaComision(order.total) / order.moneyChange,
													)}
										</>
									) : null}
									{order.paypal_response
										? formatDolares(
												paypalComision(order.total, order.moneyChange) -
													order.total / order.moneyChange,
											)
										: null}{" "}
									Comision pasarela{" "}
									{order.is_pasarela_client
										? "- Cliente pagó la comisión."
										: "- Pagaste la comisión."}
								</span>
							</button>
						) : null}
					</td>
				</tr>
			</tfoot>
		</table>
	);
}

export default TableDetailsOrder;
