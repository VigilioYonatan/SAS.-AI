import { formatDate } from "@vigilio/express-core/helpers";
import { NOW, TimePeru, formatDateTwo, restarDays } from "~/libs/helpers";
import { couponsShowApi } from "../apis/coupons/coupons.show.api";
import Loading from "@/admin/components/Loading";
import View404 from "@/admin/views/404";

interface CouponsShowProps {
	coupon: string;
}
function CouponsShow({ coupon }: CouponsShowProps) {
	const couponShowIndex = couponsShowApi(coupon);

	let component = null;
	if (couponShowIndex.isLoading) {
		component = <Loading />;
	}

	if (couponShowIndex.isError) {
		component = <View404 message={`No se encontró un cupón ${coupon}`} />;
	}
	if (couponShowIndex.isSuccess) {
		const coupon = couponShowIndex.data!.coupon;
		component = (
			<div class="flex gap-4 flex-wrap justify-center  font-semibold">
				<div class="flex-1 min-w-[250px]">
					<div class="flex gap-1 flex-col mb-3 odd:bg-paper-light odd:dark:bg-admin-terciary rounded-md p-2">
						<span class="text-primary dark:text-terciary font-bold">ID:</span>
						<span class="dark:text-secondary-light text-secondary-dark tracking-wide">
							{coupon.id}
						</span>
					</div>
					<div class="flex gap-1 flex-col mb-3  odd:bg-paper-light odd:dark:bg-admin-terciary rounded-md p-2">
						<span class="text-primary dark:text-terciary font-bold">
							Cupón:
						</span>
						<span class="dark:text-secondary-light text-secondary-dark tracking-wide">
							{coupon.coupon}
						</span>
					</div>
					<div class="flex gap-1 flex-col mb-3 odd:bg-paper-light odd:dark:bg-admin-terciary rounded-md p-2">
						<span class="text-primary dark:text-terciary font-bold">
							Descuento:
						</span>
						<span class="dark:text-secondary-light text-secondary-dark tracking-wide line-clamp-2">
							{coupon.discount} %
						</span>
					</div>
					<div class="flex gap-1 flex-col mb-3 odd:bg-paper-light odd:dark:bg-admin-terciary rounded-md p-2">
						<span class="text-primary dark:text-terciary font-bold">
							Fecha de expiración:
						</span>
						<span class="dark:text-secondary-light text-secondary-dark tracking-wide">
							{formatDateTwo(coupon.date, "DD-MM-YY hh:mm A")}
							{restarDays(NOW().toDate(), TimePeru(coupon.date).toDate()) <
							0 ? (
								<span class="text-xs py-1 px-4 rounded-md text-white bg-danger ml-2">
									Venció
								</span>
							) : null}
						</span>
					</div>
				</div>
				<div class="flex-1 min-w-[250px]">
					<div class="flex gap-1 flex-col mb-3 odd:bg-paper-light odd:dark:bg-admin-terciary rounded-md p-2">
						<span class="text-primary dark:text-terciary font-bold">
							Subcategorías:
						</span>
						<div class="flex items-center  flex-wrap gap-1">
							{coupon.subcategory.map((subcategories) => (
								<span
									class="dark:text-white text-xs  rounded-md px-4 py-1 dark:bg-admin-paper-dark bg-white"
									key={subcategories.id}
								>
									{subcategories.name}
								</span>
							))}
						</div>
					</div>
					<div class="flex gap-1 flex-col mb-3 odd:bg-paper-light odd:dark:bg-admin-terciary rounded-md p-2">
						<span class="text-primary dark:text-terciary font-bold">
							Creado:
						</span>
						<span class="dark:text-secondary-light text-secondary-dark tracking-wide">
							{formatDate(coupon.createdAt!)}
						</span>
					</div>
					<div class="flex gap-1 flex-col mb-3 odd:bg-paper-light odd:dark:bg-admin-terciary rounded-md p-2">
						<span class="text-primary dark:text-terciary font-bold">
							Actualizado:
						</span>
						<span class="dark:text-secondary-light text-secondary-dark tracking-wide">
							{formatDate(coupon.updatedAt!)}
						</span>
					</div>
				</div>
			</div>
		);
	}
	return component;
}

export default CouponsShow;
