import { useEffect } from "preact/hooks";
import useCartStore from "../stores/cart.store";
import type { OrdersSchemaFromServer } from "@/orders/schemas/orders.schema";
import useSocketStore from "~/stores/socket.store";
import useAuthStore from "@/auth/stores/auth.store";

interface ClearCartPaypalSuccessProps {
	order: OrdersSchemaFromServer;
}
function ClearCartPaypalSuccess({ order }: ClearCartPaypalSuccessProps) {
	const cartStore = useCartStore();
	const { io } = useSocketStore();
	const authStore = useAuthStore();

	useEffect(() => {
		cartStore.methods.cleanStorage();
		io?.emit("notifications:order-store", {
			order_code: order.order_code,
			total: order.total,
			user_id: authStore.state?.id,
		});
	}, [io, authStore.state]);

	return null;
}
export default ClearCartPaypalSuccess;
