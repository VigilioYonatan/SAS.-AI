import { useEffect } from "preact/hooks";
import useCartStore from "../stores/cart.store";
import type { OrdersSchemaFromServer } from "@/orders/schemas/orders.schema";
import useSocketStore from "~/stores/socket.store";

interface ClearCartPaypalSuccessProps {
    order: OrdersSchemaFromServer;
}
function ClearCartPaypalSuccess({ order }: ClearCartPaypalSuccessProps) {
    const cartStore = useCartStore();
    const { io } = useSocketStore();

    useEffect(() => {
        cartStore.methods.cleanStorage();
        io?.emit("notifications:order-store", {
            order_code: order.order_code,
            total: order.total,
            user_id: order.user_id,
        });
    }, [io]);

    return null;
}
export default ClearCartPaypalSuccess;
