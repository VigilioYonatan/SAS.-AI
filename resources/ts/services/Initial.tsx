import { useEffect } from "preact/hooks";
import useCartStore from "@/cart/stores/cart.store";
import useAuthstore from "@/auth/stores/auth.store";
import { registerPushNotification } from "./notifications/libs";

function Initial() {
	const cartStore = useCartStore();
	const user = useAuthstore();
	useEffect(() => {
		cartStore.methods.initial();
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
