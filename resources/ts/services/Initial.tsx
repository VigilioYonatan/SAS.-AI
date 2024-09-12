import { useEffect } from "preact/hooks";
import useCartStore from "@/cart/stores/cart.store";
import useAuthstore from "@/auth/stores/auth.store";
import { registerPushNotification } from "./notifications/libs";
import useSocketStore from "~/stores/socket.store";

function Initial() {
    const cartStore = useCartStore();
    const socketStore = useSocketStore();
    const user = useAuthstore();
    useEffect(() => {
        cartStore.methods.initial();
        socketStore.connectSocket();
    }, []);

    useEffect(() => {
        // push notifications solo para registrados y admins
        if (user.state) {
            registerPushNotification();
        }
    }, [user.state]);
    return null;
}

export default Initial;
