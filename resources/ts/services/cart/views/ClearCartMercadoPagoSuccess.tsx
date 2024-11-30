import useSocketStore from "~/stores/socket.store";
import useCartStore from "../stores/cart.store";
import { useEffect } from "preact/hooks";
import { OrdersSchemaFromServer } from "@/orders/schemas/orders.schema";
interface ClearCartMercadoPagoSuccesssProps {
    order: OrdersSchemaFromServer;
}
function ClearCartMercadoPagoSuccess({
    order,
}: ClearCartMercadoPagoSuccesssProps) {
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

export default ClearCartMercadoPagoSuccess;
