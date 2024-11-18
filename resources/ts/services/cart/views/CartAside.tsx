import useCartStore from "@/cart/stores/cart.store";
import ProductCart from "../components/ProductCart";
import { formatMoney } from "../libs/helpers";
import { linkVigilio } from "~/config/settings";

const CartAside = () => {
	const cartStore = useCartStore();
	return (
		<>
			<div class="mb-4">
				<div class="flex justify-center items-center">
					<span class="flex justify-center text-primary font-bold uppercase dark:text-white items-center">
						Tu carrito ({cartStore.computed.showCartLength})
					</span>
				</div>
			</div>
			<div class="flex flex-col gap-2 overflow-auto h-full w-full ">
				{cartStore.computed.showCartLength ? (
					<>
						{cartStore.state.cart?.map((product) => (
							<ProductCart
								product={product}
								key={product.variant ? product.variant.id : product.id}
							/>
						))}
					</>
				) : (
					<div className="flex flex-col items-center justify-center  dark:text-white">
						<span class="dark:text-white">No se agregó ningún producto</span>
						<a class=" text-sm lowercase mt-2  hover:underline" href={"/shop"}>
							<i class="fa-solid fa-cart-shopping  mr-2" /> Ver productos
						</a>
					</div>
				)}
			</div>
			{cartStore.computed.showCartLength ? (
				<div class="w-full dark:bg-paper-dark bg-background-light flex flex-col gap-3 p-4 absolute bottom-0 left-0">
					<span class="dark:text-white text-center ">
						Total: <b>{formatMoney(cartStore.methods.getTotal())}</b>
					</span>
					<a
						href={"/cart"}
						class="text-primary py-2 text-white border-2 border-primary  hover:text-primary w-full text-center font-bold bg-primary "
					>
						<i class="fad fa-credit-card mr-1" /> Pagar
					</a>
					<a
						href={linkVigilio()}
						target="_blank"
						rel="noreferrer"
						class="text-[7px] opacity-70 md:text-xs  text-center dark:text-white"
					>
						Powered by <b class=" text-primary">Vigilio Services</b>
					</a>
				</div>
			) : null}
		</>
	);
};

export default CartAside;
