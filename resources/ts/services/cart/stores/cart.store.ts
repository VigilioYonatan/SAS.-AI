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
import useAuthStore from "@/auth/stores/auth.store";
import { storageEmpresa } from "@/empresas/stores/empresa.store";
import { ProductsNormalSchemaFromServer } from "@/products/schemas/products_normal.schema";
import { ProductsRestaurantSchemaFromServer } from "@/products/schemas/products_restaurant.schema";
import { productEntityId, productOBJ } from "@/products/libs/helpers";
import { cartStoreApi } from "../apis/cart.store.api";

interface CartState {
    cart: CartProductSchema[] | null;
}

const keyCartStorage = `${storageEmpresa?.slug}:cart`;

const state = signal<CartState>({
    cart: null,
});
const dropdown = signal<boolean>(false);
export function useCartStore() {
    const auth = useAuthStore();
    const cartUpdateMutation = cartUpdateApi();
    const cartDestroyMutation = cartDestroyApi();
    const cartStoreMutation = cartStoreApi();
    const productCouponMutation = productCouponApi();
    /** INSERTAR PRODUCTO AL CARRITO */
    function onInsertProduct(product: CartProductSchema) {
        if (!product.variant?.ilimit && product.variant?.stock! < 1) return; // quiere decir que no hay stock y hay menos de 1 unidad
        if (
            storageEmpresa?.tipo_empresa.tipo_servicio_id === 2 &&
            !(product as ProductsRestaurantSchemaFromServer)?.ilimit &&
            (product as ProductsRestaurantSchemaFromServer)?.stock! < 1
        ) {
            return;
        }

        if (
            isAlreadyExistProductToCart(
                product.id,
                product.variant ? product.variant.id : null
            )
        )
            return;
        const cart: CartProductSchema[] = [
            ...(state.value.cart ?? []),
            product,
        ];
        state.value = { ...state.value, cart };
        if (!auth.state) {
            const cartMapped: CartStoreDto[] = cart.map((cart) => ({
                coupon: cart.coupon,
                ...productOBJ(cart.id),
                variant_id: cart.variant ? cart.variant.id : null,
                quantity: cart.quantity,
            }));
            localStorage.setItem(keyCartStorage, JSON.stringify(cartMapped));
        }
    }

    /** AGREGAR UNO POR UNO DEL CARRITO PRODUCTO AL CARRITO */
    function onIncrementProductToCart(product: CartProductSchema) {
        if (
            !isAlreadyExistProductToCart(
                product.id,
                product.variant ? product.variant.id : null
            )
        )
            return;
        const incrementProductToCart =
            storageEmpresa!.tipo_empresa.tipo_servicio_id === 1
                ? state.value.cart?.map((cart) => {
                      if (
                          cart.id === product.id &&
                          cart.variant!.id === product.variant!.id
                      ) {
                          //  hasta que la cantidad sea hasta el stock y si es ilimitado que siga agregando
                          if (
                              cart.quantity >= cart.variant!.stock! &&
                              !cart.variant!.ilimit
                          )
                              return cart;
                          const quantity = cart.quantity + 1;
                          if (auth.state) {
                              cartUpdateMutation.mutate({
                                  quantity: quantity,
                                  ...productOBJ(cart.id),
                                  coupon: product.coupon,
                                  variant_id: product.variant
                                      ? product.variant.id
                                      : null,
                              });
                          }
                          const discountCoupon = calculatePorcentajeDiscount(
                              subtotalIgv(cart),
                              cart.subtotal / cart.quantity
                          );

                          return {
                              ...cart,
                              quantity,
                              subtotal:
                                  subtotalIgv(cart, true, discountCoupon) *
                                  quantity,
                          };
                      }
                      return cart;
                  }) ?? []
                : state.value.cart?.map((cart) => {
                      if (cart.id === product.id) {
                          //  hasta que la cantidad sea hasta el stock y si es ilimitado que siga agregando
                          if (
                              cart.quantity >=
                                  (cart as ProductsRestaurantSchemaFromServer)
                                      .stock! &&
                              !(cart as ProductsRestaurantSchemaFromServer)
                                  .ilimit
                          )
                              return cart;
                          const quantity = cart.quantity + 1;
                          if (auth.state) {
                              cartUpdateMutation.mutate({
                                  quantity: quantity,
                                  ...productOBJ(cart.id),
                                  coupon: product.coupon,
                                  variant_id: null,
                              });
                          }
                          const discountCoupon = calculatePorcentajeDiscount(
                              subtotalIgv(cart),
                              cart.subtotal / cart.quantity
                          );

                          return {
                              ...cart,
                              quantity,
                              subtotal:
                                  subtotalIgv(cart, true, discountCoupon) *
                                  quantity,
                          };
                      }
                      return cart;
                  }) ?? [];
        state.value = { ...state.value, cart: incrementProductToCart };
        if (!auth.state) {
            const cart: CartStoreDto[] = incrementProductToCart?.map(
                (cart) => ({
                    coupon: cart.coupon,
                    quantity: cart.quantity,
                    ...productOBJ(cart.id),
                    variant_id: cart.variant ? cart.variant.id : null,
                })
            );
            localStorage.setItem(keyCartStorage, JSON.stringify(cart));
        }
    }
    /** QUITAR UNO DEL CARRITO PRODUCTO AL CARRITO */
    function onDecrementProductToCart(product: CartProductSchema) {
        if (
            !isAlreadyExistProductToCart(
                product.id,
                product.variant ? product.variant.id : null
            )
        )
            return;
        const decrementProductToCart =
            storageEmpresa!.tipo_empresa.tipo_servicio_id === 1
                ? state.value.cart?.map((prod) => {
                      if (
                          prod.id === product.id &&
                          prod.variant!.id === product.variant!.id
                      ) {
                          if (prod.quantity <= 1) return prod;
                          const quantity = prod.quantity - 1;
                          if (auth.state) {
                              cartUpdateMutation.mutate({
                                  ...productOBJ(prod.id),
                                  quantity: quantity,
                                  coupon: product.coupon,
                                  variant_id: product.variant
                                      ? product.variant.id
                                      : null,
                              });
                          }
                          const discountCoupon = calculatePorcentajeDiscount(
                              subtotalIgv(prod),
                              prod.subtotal / prod.quantity
                          );

                          return {
                              ...prod,
                              quantity,
                              subtotal:
                                  subtotalIgv(prod, true, discountCoupon) *
                                  quantity,
                          };
                      }
                      return prod;
                  }) ?? []
                : state.value.cart?.map((prod) => {
                      if (prod.id === product.id) {
                          if (prod.quantity <= 1) return prod;
                          const quantity = prod.quantity - 1;
                          if (auth.state) {
                              cartUpdateMutation.mutate({
                                  ...productOBJ(prod.id),
                                  quantity: quantity,
                                  coupon: product.coupon,
                                  variant_id: product.variant
                                      ? product.variant.id
                                      : null,
                              });
                          }
                          const discountCoupon = calculatePorcentajeDiscount(
                              subtotalIgv(prod),
                              prod.subtotal / prod.quantity
                          );

                          return {
                              ...prod,
                              quantity,
                              subtotal:
                                  subtotalIgv(prod, true, discountCoupon) *
                                  quantity,
                          };
                      }
                      return prod;
                  }) ?? [];
        state.value = { ...state.value, cart: decrementProductToCart };
        if (!auth.state) {
            const cart: CartStoreDto[] = decrementProductToCart.map((cart) => ({
                coupon: cart.coupon,
                ...productOBJ(cart.id),
                quantity: cart.quantity,
                variant_id: cart.variant ? cart.variant.id : null,
            }));
            localStorage.setItem(keyCartStorage, JSON.stringify(cart));
        }
    }

    /** ELIMINAR PRODUCTO DEL CARRITO */
    function onRemoveProductToCart(
        product_id: number,
        variant_id: number | null = null
    ) {
        if (!isAlreadyExistProductToCart(product_id, variant_id)) return;
        const removeProductToCart =
            storageEmpresa!.tipo_empresa.tipo_servicio_id === 1
                ? state.value.cart!.filter(
                      (prod) =>
                          !(
                              prod.id === product_id &&
                              prod.variant!.id === variant_id
                          )
                  )
                : state.value.cart!.filter((prod) => !(prod.id === product_id));
        state.value = { ...state.value, cart: removeProductToCart };
        if (auth.state) {
            cartDestroyMutation.mutate({
                ...productOBJ(product_id),
                variant_id,
            });
        } else {
            const cart: CartStoreDto[] = removeProductToCart.map((cart) => ({
                coupon: cart.coupon,
                quantity: cart.quantity,
                ...productOBJ(cart.id),
                variant_id: cart.variant ? cart.variant.id : null,
            }));
            localStorage.setItem(keyCartStorage, JSON.stringify(cart));
        }
    }

    /** Existe el producto en el carrito? devuelve el producto encontrado si no es nulo */
    function isAlreadyExistProductToCart(
        product_id: number,
        variant_id: number | null
    ) {
        let exist: CartProductSchema | null = null;
        if (variant_id) {
            exist =
                state.value.cart?.find(
                    (prod) =>
                        prod.id === product_id &&
                        prod.variant!.id === variant_id
                ) ?? null;
        } else {
            exist =
                state.value.cart?.find((prod) => prod.id === product_id) ??
                null;
        }

        return exist;
    }

    /* cantidad de productos en el carrito */
    const showCartLength = computed(() => {
        return state.value.cart?.length || 0;
    });

    /* suma total de los productos en el carrito - subtotal */
    function getTotal() {
        // filtramos a los que no tienen ningun producto y los que no esán habilitado
        const total = [1, 3].includes(
            storageEmpresa!.tipo_empresa.tipo_servicio_id
        )
            ? state.value.cart
                  ?.filter(
                      (prod) =>
                          prod.enabled &&
                          (prod.variant!.ilimit || prod.variant!.stock! > 0)
                  )
                  .reduce((ins, prod) => {
                      return ins + prod.subtotal;
                  }, 0) ?? 0
            : state.value.cart
                  ?.filter(
                      (prod) =>
                          prod.enabled &&
                          ((prod as ProductsRestaurantSchemaFromServer)
                              .ilimit ||
                              (prod as ProductsRestaurantSchemaFromServer)
                                  .stock! > 0)
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
                        `/products/${
                            cart[productEntityId() as keyof typeof cart]
                        }`
                    );
                    if (!product) {
                        onRemoveProductToCart(
                            (cart.product_normal_id ??
                                cart.product_restaurant_id ??
                                cart.product_servicio_id) as number,
                            cart.variant_id
                        );
                        return null;
                        // eliminar carrito
                    }
                    let sub = subtotalIgv(product);
                    let variant = null;
                    let quantity = cart.quantity < 1 ? 1 : cart.quantity;
                    if (storageEmpresa!.tipo_empresa.tipo_servicio_id === 1) {
                        variant = (
                            product as ProductsNormalSchemaFromServer
                        ).variants.find(
                            (variant) => variant.id === cart.variant_id
                        );
                        if (!variant) {
                            onRemoveProductToCart(
                                (cart.product_normal_id ||
                                    cart.product_restaurant_id ||
                                    cart.product_servicio_id) as number,
                                cart.variant_id
                            );
                            return null;
                        }
                        if (!variant!.ilimit && variant!.stock! < quantity) {
                            quantity = variant!.stock!;
                        }
                    } else {
                        if (
                            !(product as ProductsRestaurantSchemaFromServer)!
                                .ilimit &&
                            (product as ProductsRestaurantSchemaFromServer)!
                                .stock! < quantity
                        ) {
                            quantity =
                                (product as ProductsRestaurantSchemaFromServer)!
                                    .stock!;
                        }
                    }

                    // si la cantidad es -1

                    if (cart.coupon) {
                        try {
                            const { discount } =
                                (await productCouponMutation.mutateAsync({
                                    coupon: cart.coupon,
                                    product_id: (cart.product_normal_id ||
                                        cart.product_restaurant_id ||
                                        cart.product_servicio_id) as number,
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
            })
        );
        if (cartMapped) {
            state.value = {
                ...state.value,
                cart:
                    (cartMapped.filter(
                        (item) => item !== null
                    ) as CartState["cart"]) || [],
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
            localStorage.getItem(keyCartStorage) ?? "[]"
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
        cart: {
            id: number;
            variant?: number | null;
            quantity: number;
        }[]
    ) {
        const cartMapped: CartStoreDto[] = cart.map((cart) => ({
            coupon: null,
            quantity: cart.quantity,
            ...productOBJ(cart.id),
            variant_id: cart.variant ?? null,
        }));
        await formatedProductCart(cartMapped);

        if (!auth.state) {
            localStorage.setItem(keyCartStorage, JSON.stringify(cartMapped));
        } else {
            await Promise.all(
                cartMapped.map(async (prod) => {
                    await cartStoreMutation.mutate({
                        ...prod,
                        coupon: null,
                        quantity: prod.quantity,
                        variant_id: prod.variant_id ?? null,
                    });
                })
            );
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
