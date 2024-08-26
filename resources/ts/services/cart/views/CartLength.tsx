import LoaderSubmit from "~/components/LoaderSubmit";
import useCartStore from "../stores/cart.store";
function CartLength() {
	const cartStore = useCartStore();

	return (
		<>
			{!cartStore.state.cart ? (
				<LoaderSubmit />
			) : (
				<>{cartStore.computed.showCartLength}</>
			)}
		</>
	);
}

export default CartLength;
