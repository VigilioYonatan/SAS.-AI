import { computed, signal } from "@preact/signals";
import {
	calculatePorcentajeDiscount,
	subtotal,
	subtotalIgv,
} from "../libs/helpers";
import { useEffect } from "preact/hooks";
import { cartUpdateApi } from "../apis/cart.update.api";
import { cartDestroyApi } from "../apis/cart.destroy.api";
import { cartIndexApi } from "../apis/cart.index.api";
import { productShowFetch } from "@/products/apis/products/products.show.api";
import { productCouponApi } from "@/products/apis/products/products.coupon.api";
import type { CartProductSchema } from "../schemas";
import type { CartStoreDto } from "../dtos/cart.store.dto";
import enviroments from "~/config";
import useAuthStore from "@/auth/stores/auth.store";

interface CartState {
	cart: CartProductSchema[] | null;
}

const keyCartStorage = `${enviroments.VITE_URL}:cart`;

const state = signal<CartState>({
	cart: null,
});
const dropdown = signal<boolean>(false);
export function useCartStore() {
	const auth = useAuthStore();
	const cartUpdateMutation = cartUpdateApi();
	const cartDestroyMutation = cartDestroyApi();
	const productCouponMutation = productCouponApi();

	/** INSERTAR PRODUCTO AL CARRITO */
	function onInsertProduct(product: CartProductSchema) {
		if (!product.variant.ilimit && product.variant!.stock! < 1) return; // quiere decir que no hay stock y hay menos de 1 unidad
		if (isAlreadyExistProductToCart(product.id, product.variant.id)) return;
		const cart: CartProductSchema[] = [...(state.value.cart ?? []), product];
		state.value = { ...state.value, cart };
		if (!auth.state) {
			const cartMapped: CartStoreDto[] = cart.map((cart) => ({
				coupon: cart.coupon,
				product_id: cart.id,
				variant_id: cart.variant.id,
				quantity: cart.quantity,
			}));
			localStorage.setItem(keyCartStorage, JSON.stringify(cartMapped));
		}
	}

	/** AGREGAR UNO POR UNO DEL CARRITO PRODUCTO AL CARRITO */
	function onIncrementProductToCart(product: CartProductSchema) {
		if (!isAlreadyExistProductToCart(product.id, product.variant.id)) return;
		const incrementProductToCart =
			state.value.cart?.map((prod) => {
				if (prod.id === product.id && prod.variant.id === product.variant.id) {
					//  hasta que la cantidad sea hasta el stock y si es ilimitado que siga agregando
					if (prod.quantity >= prod.variant.stock! && !prod.variant.ilimit)
						return prod;
					const quantity = prod.quantity + 1;
					if (auth.state) {
						cartUpdateMutation.mutate({
							quantity: quantity,
							product_id: product.id,
							coupon: product.coupon,
							variant_id: product.variant.id,
						});
					}
					const discountCoupon = calculatePorcentajeDiscount(
						subtotalIgv(prod),
						prod.subtotal / prod.quantity,
					);

					return {
						...prod,
						quantity,
						subtotal: subtotalIgv(prod, true, discountCoupon) * quantity,
					};
				}
				return prod;
			}) ?? [];
		state.value = { ...state.value, cart: incrementProductToCart };
		if (!auth.state) {
			const cart: CartStoreDto[] = incrementProductToCart?.map((cart) => ({
				coupon: cart.coupon,
				product_id: cart.id,
				quantity: cart.quantity,
				variant_id: cart.variant.id,
			}));
			localStorage.setItem(keyCartStorage, JSON.stringify(cart));
		}
	}
	/** QUITAR UNO DEL CARRITO PRODUCTO AL CARRITO */
	function onDecrementProductToCart(product: CartProductSchema) {
		if (!isAlreadyExistProductToCart(product.id, product.variant.id)) return;
		const decrementProductToCart =
			state.value.cart?.map((prod) => {
				if (prod.id === product.id && prod.variant.id === product.variant.id) {
					if (prod.quantity <= 1) return prod;
					const quantity = prod.quantity - 1;
					if (auth.state) {
						cartUpdateMutation.mutate({
							product_id: product.id,
							quantity: quantity,
							coupon: product.coupon,
							variant_id: product.variant.id,
						});
					}
					const discountCoupon = calculatePorcentajeDiscount(
						subtotalIgv(prod),
						prod.subtotal / prod.quantity,
					);

					return {
						...prod,
						quantity,
						subtotal: subtotalIgv(prod, true, discountCoupon) * quantity,
					};
				}
				return prod;
			}) ?? [];
		state.value = { ...state.value, cart: decrementProductToCart };
		if (!auth.state) {
			const cart: CartStoreDto[] = decrementProductToCart.map((cart) => ({
				coupon: cart.coupon,
				product_id: cart.id,
				quantity: cart.quantity,
				variant_id: cart.variant.id,
			}));
			localStorage.setItem(keyCartStorage, JSON.stringify(cart));
		}
	}

	/** ELIMINAR PRODUCTO DEL CARRITO */
	function onRemoveProductToCart(product_id: number, variant_id: number) {
		if (!isAlreadyExistProductToCart(product_id, variant_id)) return;
		const removeProductToCart = state.value.cart!.filter(
			(prod) => !(prod.id === product_id && prod.variant.id === variant_id),
		);
		state.value = { ...state.value, cart: removeProductToCart };
		if (auth.state) {
			cartDestroyMutation.mutate({ product_id, variant_id });
		} else {
			const cart: CartStoreDto[] = removeProductToCart.map((cart) => ({
				coupon: cart.coupon,
				product_id: cart.id,
				quantity: cart.quantity,
				variant_id: cart.variant.id,
			}));
			localStorage.setItem(keyCartStorage, JSON.stringify(cart));
		}
	}

	/** Existe el producto en el carrito? devuelve el producto encontrado si no es nulo */
	function isAlreadyExistProductToCart(product_id: number, variant_id: number) {
		const exist =
			state.value.cart?.find(
				(prod) => prod.id === product_id && prod.variant.id === variant_id,
			) ?? null;
		return exist;
	}

	/* cantidad de productos en el carrito */
	const showCartLength = computed(() => {
		return state.value.cart?.length || 0;
	});

	/* suma total de los productos en el carrito - subtotal */
	function getTotal() {
		// filtramos a los que no tienen ningun producto y los que no esán habilitado
		const total =
			state.value.cart
				?.filter(
					(prod) =>
						prod.enabled && (prod.variant.ilimit || prod.variant.stock! > 0),
				)
				.reduce((ins, prod) => {
					return ins + prod.subtotal;
				}, 0) ?? 0;

		return total;
	}

	function onClose() {
		dropdown.value = false;
	}
	function onOpen() {
		dropdown.value = true;
	}
	useEffect(() => {
		document.body.classList.toggle("overflow-hidden", dropdown.value);
	}, [dropdown.value]);

	/* cuando se modifica el localstorage que se guarden los cambios. MUY UTIL */
	// useEffect(() => {
	// 	async function updateData(e: StorageEvent) {
	// 		if (e.key === keyCartStorage) {
	// 			const cartStorage = e.newValue!;
	// 			localStorage.setItem(keyCartStorage, cartStorage);
	// 			await formatedProductCart(JSON.parse(cartStorage));
	// 		}
	// 	}
	// 	window.addEventListener("storage", updateData);
	// 	return () => {
	// 		window.removeEventListener("storage", updateData);
	// 	};
	// }, []);

	/* ACTUALIZA EL CARRITO DE COMPRAS EN INFORMACION REAL */
	async function formatedProductCart(cart: CartStoreDto[]) {
		const cartMapped = await Promise.all(
			cart.map(async (cart) => {
				try {
					const { product } = await productShowFetch(
						`/products/${cart.product_id}`,
					);
					if (!product) {
						onRemoveProductToCart(cart.product_id, cart.variant_id);
						return null;
						// eliminar carrito
					}
					let sub = subtotalIgv(product);
					const variant = product.variants.find(
						(variant) => variant.id === cart.variant_id,
					);
					if (!variant) {
						onRemoveProductToCart(cart.product_id, cart.variant_id);
						return null;
					}

					// si la cantidad es -1
					let quantity = cart.quantity < 1 ? 1 : cart.quantity;
					if (!variant!.ilimit && variant!.stock! < quantity) {
						quantity = variant!.stock!;
					}
					if (cart.coupon) {
						try {
							const { discount } = (await productCouponMutation.mutateAsync({
								coupon: cart.coupon,
								product_id: cart.product_id,
							}))!;
							sub = subtotal(sub, discount);
						} catch (error) {
							// hubo un error con el cupon
						}
					}

					return {
						...product,
						subtotal: sub * quantity,
						quantity,
						coupon: cart.coupon,
						variant,
					};
				} catch (error) {
					return null;
				}
			}),
		);
		if (cartMapped) {
			state.value = {
				...state.value,
				cart:
					(cartMapped.filter((item) => item !== null) as CartState["cart"]) ||
					[],
			};
		}
	}

	// esto inicializa el carro de compra- todo
	async function initial() {
		if (auth.state) {
			const response = await cartIndexApi();
			await formatedProductCart(response.data);
			return;
		}
		const cart = JSON.parse(
			localStorage.getItem(keyCartStorage) ?? "[]",
		) as CartStoreDto[];
		await formatedProductCart(cart);
	}

	/* limpiar el carrito de compra-. util cuando el cliente ya pago correctamente */
	function cleanStorage() {
		if (auth.state) {
			state.value = { ...state.value, cart: [] };
			return;
		}
		state.value = { ...state.value, cart: [] };
		localStorage.setItem(keyCartStorage, JSON.stringify([]));
	}
	/* ESTO ES cuando el link de /cart?items=[{id:1,...}] */
	async function initialCart(
		cart: { id: number; variant_id: number; quantity: number }[],
	) {
		if (!auth.state) {
			const cartMapped: CartStoreDto[] = cart.map((cart) => ({
				coupon: null,
				quantity: cart.quantity,
				product_id: cart.id,
				variant_id: cart.variant_id,
			}));
			localStorage.setItem(keyCartStorage, JSON.stringify(cartMapped));
			await formatedProductCart(cartMapped);
		}
	}

	return {
		state: state.value,
		methods: {
			onInsertProduct,
			onIncrementProductToCart,
			onDecrementProductToCart,
			onRemoveProductToCart,
			isAlreadyExistProductToCart,
			getTotal,
			cleanStorage,
			initialCart,
			initial,
		},
		computed: {
			showCartLength: showCartLength.value,
		},
		dropdown: {
			value: dropdown.value,
			onClose,
			onOpen,
		},
	};
}
export default useCartStore;
