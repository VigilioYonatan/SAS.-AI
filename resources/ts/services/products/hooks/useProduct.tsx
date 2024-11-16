import useAuthStore from "@/auth/stores/auth.store";
import useCartStore from "@/cart/stores/cart.store";

import { useSignal } from "@preact/signals";
import dayjs, { deepEqual, NOW } from "~/libs/helpers";
import type { CartProductSchema } from "@/cart/schemas";
import { formatMoney, subtotalIgv } from "@/cart/libs/helpers";
import { cartStoreApi } from "@/cart/apis/cart.store.api";
import { printImagesProduct, productOBJ } from "../libs/helpers";
import { NoImage } from "~/config/settings";
import { useForm } from "react-hook-form";
import {
    minLength,
    nullable,
    object,
    string,
    toTrimmed,
    type Input,
} from "@vigilio/valibot";
import { valibotVigilio } from "~/libs/valibot";
import { productCouponApi } from "../apis/products/products.coupon.api";
import { sweetAlert, sweetModal } from "@vigilio/sweet";
import { reactComponent } from "~/libs/preact";
import { VariantFeature } from "@/web/views/product/ProductPage";
import { VariantSchemaFromServer } from "../schemas/options/variants.schema";
import { ProductsNormalSchemaFromServer } from "../schemas/products_normal.schema";
import { ProductsRestaurantSchemaFromServer } from "../schemas/products_restaurant.schema";
import { storageEmpresa } from "@/empresas/stores/empresa.store";
import { ProductsServicioSchemaFromServer } from "../schemas/products_servicio.schema";
import useFavoriteStore from "@/favorites/stores/favorites.store";
import { favoritesDestroyApi } from "@/favorites/apis/favorites.destroy.api";
import { openAuth } from "@/auth/views/AuthLogin";
import { favoritesStoreApi } from "@/favorites/apis/favorites.store.api";
import confetti from "canvas-confetti";

const couponStore = object({
    coupon: nullable(string([toTrimmed(), minLength(6)])),
});
export type CouponStore = Input<typeof couponStore>;

interface UseProductProps {
    product:
        | ProductsNormalSchemaFromServer
        | ProductsRestaurantSchemaFromServer
        | ProductsServicioSchemaFromServer;
    isService: boolean;
}
function useProduct({ product, isService }: UseProductProps) {
    const authStore = useAuthStore();
    const cartStore = useCartStore();

    const zoom = useSignal(false);

    const position = useSignal<Record<"x" | "y", string>>({
        x: "50%",
        y: "50%",
    });

    function handleMouseMove(e: MouseEvent) {
        const { left, top, width, height } = (
            e.target as HTMLDivElement
        ).getBoundingClientRect();
        const x = ((e.clientX - left) / width) * 100;
        const y = ((e.clientY - top) / height) * 100;
        position.value = { x: `${x}%`, y: `${y}%` };
        zoom.value = true;
    }

    function handleMouseLeave() {
        position.value = { x: "50%", y: "50%" };
        zoom.value = false;
    }
    const variant = useSignal<VariantFeature[] | null>(
        (product as ProductsNormalSchemaFromServer).variants
            ? (product as ProductsNormalSchemaFromServer).variants[0].features
            : null
    );

    const varianteChoose: VariantSchemaFromServer | null = (
        product as ProductsNormalSchemaFromServer
    ).variants
        ? ((product as ProductsNormalSchemaFromServer).variants.find((vari) => {
              return deepEqual(
                  vari.features.map((v) => ({
                      id: v.id,
                      option_id: v.option_id,
                  })),
                  variant.value!.map((v) => ({
                      id: v.id,
                      option_id: v.option_id,
                  }))
              );
          })! as VariantSchemaFromServer)
        : null;

    const isProductNew = NOW().diff(dayjs(product.createdAt), "day") < 7;

    // hacer reactivo producto
    const producto = useSignal<CartProductSchema>({
        ...product,
        subtotal: subtotalIgv(product),
        quantity: 1,
        coupon: null,
        variant: varianteChoose ? varianteChoose : null,
    });
    const favoriteStore = useFavoriteStore();
    const favoritesDestroyMutation = favoritesDestroyApi(producto.value.id);

    const existProductInCart = cartStore.methods.isAlreadyExistProductToCart(
        producto.value.id,
        varianteChoose ? varianteChoose!.id : null
    );
    function onIncrementCart() {
        producto.value = {
            ...producto.value,
            quantity: producto.value.quantity + 1,
            subtotal: subtotalIgv(product) * producto.value.quantity + 1,
        };
    }
    function onDecrementCart() {
        if (producto.value.quantity <= 1) return;
        producto.value = {
            ...producto.value,
            quantity: producto.value.quantity - 1,
            subtotal: subtotalIgv(product) * producto.value.quantity - 1,
        };
    }
    function onResetCart() {
        producto.value = {
            ...producto.value,
            subtotal: subtotalIgv(product),
            quantity: 1,
            coupon: null,
        };
    }

    const cartStoreMutation = cartStoreApi();
    const images500 = printImagesProduct(product.images, 500);
    const images100 = printImagesProduct(product.images, 100);

    const images100Variant = (product as ProductsNormalSchemaFromServer)
        .variants
        ? printImagesProduct(product.images, 100).filter((_, i) =>
              varianteChoose!.images.some((img) => img === i + 1)
          )
        : printImagesProduct(product.images, 100);
    const images500Variant = (product as ProductsNormalSchemaFromServer)
        .variants
        ? printImagesProduct(product.images, 500).filter((_, i) =>
              varianteChoose!.images.some((img) => img === i + 1)
          )
        : printImagesProduct(product.images, 500);
    const isImagesLength = images500Variant.length
        ? images500Variant
        : [NoImage()];

    function changeVariant(body: VariantFeature) {
        onResetCart();

        if (!(product as ProductsNormalSchemaFromServer).variants) return;
        variant.value = variant.value!.map((variant) =>
            variant.option_id === body.option_id
                ? {
                      ...variant,
                      id: body.id,
                  }
                : variant
        );
    }

    const discount = useSignal<null | number>(null);
    const couponForm = useForm<CouponStore>({
        resolver: valibotVigilio(couponStore),
    });
    const coupon = couponForm.watch("coupon");
    const productCouponMutation = productCouponApi(isService);
    const favoritesStoreMutation = favoritesStoreApi(
        producto.value.id,
        isService
    );
    function onCoupon(data: CouponStore) {
        const coupon = data.coupon;
        if (discount.value) {
            discount.value = null;
            couponForm.setValue("coupon", null);
            return;
        }
        if (coupon) {
            productCouponMutation.mutate(
                { product_id: producto.value.id, coupon },
                {
                    onSuccess(data) {
                        discount.value = data.discount;
                        sweetAlert({
                            icon: "success",
                            title: `Se agregó un descuento de ${data.discount}% en este producto`,
                        });
                    },
                    onError(err) {
                        discount.value = null;
                        couponForm.setValue("coupon", null);
                        couponForm.setError(
                            "coupon",
                            { message: err.message },
                            { shouldFocus: true }
                        );
                    },
                }
            );
        }
    }

    async function handleInsertProduct(isOpenModal = true) {
        if (!producto.value.enabled) return;
        if ((product as ProductsNormalSchemaFromServer).variants) {
            if (!varianteChoose!.ilimit && varianteChoose!.stock! < 1) {
                return;
            }
        }
        if (
            storageEmpresa?.tipo_empresa.tipo_servicio_id === 2 &&
            !(product as ProductsRestaurantSchemaFromServer)?.ilimit &&
            (product as ProductsRestaurantSchemaFromServer)?.stock! < 1
        ) {
            return;
        }

        if (existProductInCart) {
            cartStore.dropdown.onOpen();
            return;
        }

        const couponValue = discount.value ? coupon : null;

        if (authStore.state) {
            try {
                await cartStoreMutation.mutateAsync({
                    quantity: producto.value.quantity,
                    ...productOBJ(producto.value.id),
                    variant_id: varianteChoose ? varianteChoose!.id : null,
                    coupon: couponValue,
                });
            } catch (error) {
                sweetAlert({
                    icon: "danger",
                    title: JSON.stringify((error as Error).message),
                });
                return;
            }
        }
        const subtotal = discount.value
            ? subtotalIgv(producto.value, true, discount.value) *
              producto.value.quantity
            : subtotalIgv(producto.value) * producto.value.quantity;
        cartStore.methods.onInsertProduct({
            ...producto.value,
            variant: varianteChoose ? varianteChoose : null,
            subtotal,
            coupon: couponValue,
        });
        if (isOpenModal) {
            cartStore.dropdown.onOpen();
        } else {
            sweetModal((onclose) => ({
                html: reactComponent(
                    <div class="flex flex-col gap-4 items-center">
                        <i class="fa-solid fa-circle-check text-primary text-6xl" />
                        <span class="font-semibold dark:text-gray-300">
                            Se agregó un producto a tu carrito
                        </span>
                        <p class="text-center text-gray-400 text-sm">
                            {producto.value.quantity <= 1
                                ? "1 producto agregado"
                                : `${producto.value.quantity} productos agregados`}{" "}
                            correctamente. (
                            <span class="text-primary font-semibold ">
                                {formatMoney(subtotal)}
                            </span>
                            )
                        </p>
                        <button
                            type="button"
                            onClick={onclose}
                            aria-label="continue shipping"
                            class="w-full py-2 bg-primary text-white text-sm font-semibold uppercase"
                        >
                            Continuar Comprando
                        </button>
                        <a
                            href={"/cart"}
                            aria-label="shop"
                            class="w-full py-2 text-center bg-black text-white text-sm font-semibold uppercase"
                        >
                            Ir al carrito
                        </a>
                    </div>
                ),
                showCloseButton: true,
            }));
        }
        producto.value = { ...producto.value, quantity: 1 };
    }
    function onFavorite() {
        if (!authStore.state) {
            openAuth();
            return;
        }

        if (producto.value.user?.isFavorite) {
            favoritesDestroyMutation.mutate(null, {
                onSuccess(data) {
                    sweetAlert({
                        title: data.message,
                        icon: "success",
                    });
                    favoriteStore.methods.onFavoriteDestroy();
                    producto.value = {
                        ...producto.value,
                        user: {
                            ...producto.value.user!,
                            isFavorite: false,
                        },
                    };
                },
                onError(error) {
                    sweetAlert({
                        title: error.message,
                        icon: "danger",
                    });
                },
            });
            return;
        }
        favoritesStoreMutation.mutate(null, {
            onSuccess() {
                confetti({
                    angle: 90,
                    spread: 360,
                    startVelocity: 40,
                    colors: [
                        "#a864fd",
                        "#29cdff",
                        "#78ff44",
                        "#ff718d",
                        "#fdff6a",
                    ],
                });
                favoriteStore.methods.onFavoriteStore();
                producto.value = {
                    ...producto.value,
                    user: {
                        ...producto.value.user!,
                        isFavorite: true,
                    },
                };
            },
            onError(error) {
                sweetAlert({
                    title: error.message,
                    icon: "danger",
                });
            },
        });
    }
    return {
        onCoupon,
        onFavorite,
        handleInsertProduct,
        isImagesLength,
        changeVariant,
        onIncrementCart,
        coupon,
        onDecrementCart,
        images100Variant,
        images100,
        images500,
        images500Variant,
        varianteChoose,
        producto,
        variant,
        existProductInCart,
        cartStoreMutation,
        favoritesDestroyMutation,
        favoritesStoreMutation,
        couponForm,
        discount,
        productCouponMutation,
        isProductNew,
        zoom: {
            handleMouseMove,
            handleMouseLeave,
            zoom: zoom.value,
            position: position.value,
        },
        cartStore,
    };
}

export default useProduct;
