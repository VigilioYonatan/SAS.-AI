import { useTable } from "@vigilio/preact-table";
import VigilioTable from "~/components/table";
import { couponsColumns } from "../libs/CouponsColums";
import { couponsPaginatorApi } from "@/common/paginator/coupons.paginator.api";
import AdminHr from "~/components/AdminHr";
import CouponsStore from "./CouponsStore";
import type { CouponsSchemaFromServer } from "../schemas/coupons.schema";
import Container from "@/admin/components/Container";
import AdminBreadCrumb from "@/admin/components/AdminBreadCrumb";
import { sweetModal } from "@vigilio/sweet";
import { reactComponent } from "~/libs/preact";
import CouponsShow from "./CouponsShow";

function CouponsIndex() {
	const table = useTable({
		columns: couponsColumns,
	});
	const query = couponsPaginatorApi(table);

	function onShowCoupon(coupon: CouponsSchemaFromServer) {
		sweetModal({
			html: reactComponent(<CouponsShow coupon={coupon.coupon} />),
			showCloseButton: true,
		});
	}
	return (
		<Container className="px-2">
			<AdminBreadCrumb current="cupones" />
			<div>
				<CouponsStore refetch={query.refetch} />
				<AdminHr />
				<div class="overflow-auto">
					<VigilioTable query={query} table={table}>
						<VigilioTable.header className="p-0 mb-2 flex justify-between items-center">
							<VigilioTable.header.tools hiddenDelete />
							<div class="flex items-center gap-1">
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
								<VigilioTable.tbody.row handleClick={onShowCoupon}>
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
			</div>
		</Container>
	);
}

export default CouponsIndex;
