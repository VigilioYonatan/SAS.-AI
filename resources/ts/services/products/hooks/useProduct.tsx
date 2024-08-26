import useAuthStore from "@/auth/stores/auth.store";
import useCartStore from "@/cart/stores/cart.store";

import { useSignal } from "@preact/signals";
import dayjs, { deepEqual, NOW } from "~/libs/helpers";
import type { ProductsSchemaFromServer } from "../schemas/products.schema";
import type { CartProductSchema } from "@/cart/schemas";
import {
    formatMoney,
    formatMoneyDinamic,
    subtotalIgv,
} from "@/cart/libs/helpers";
import { cartStoreApi } from "@/cart/apis/cart.store.api";
import { printImagesProduct } from "../libs/helpers";
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
import enviroments from "~/config";

const couponStore = object({
    coupon: nullable(string([toTrimmed(), minLength(6)])),
});
export type CouponStore = Input<typeof couponStore>;

interface UseProductProps {
    product: ProductsSchemaFromServer;
}
function useProduct({ product }: UseProductProps) {
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
    const variant = useSignal<VariantFeature[]>(product.variants[0].features);

    const varianteChoose: VariantSchemaFromServer = product.variants.find(
        (vari) => {
            return deepEqual(vari.features, variant.value);
        }
    )!;

    const isProductNew = NOW().diff(dayjs(product.createdAt), "day") < 7;

    // hacer reactivo producto
    const producto = useSignal<CartProductSchema>({
        ...product,
        subtotal: subtotalIgv(product),
        quantity: 1,
        coupon: null,
        variant: varianteChoose!,
    });

    const existProductInCart = cartStore.methods.isAlreadyExistProductToCart(
        producto.value.id,
        varianteChoose!.id
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
    const images800Variant = printImagesProduct(product.images, 800).filter(
        (_, i) => varianteChoose.images.some((img) => img === i + 1)
    );
    const images100Variant = printImagesProduct(product.images, 100).filter(
        (_, i) => varianteChoose.images.some((img) => img === i + 1)
    );
    const images500Variant = printImagesProduct(product.images, 500).filter(
        (_, i) => varianteChoose.images.some((img) => img === i + 1)
    );
    const isImagesLength = images800Variant.length
        ? images800Variant
        : [NoImage()];

    function changeVariant(body: VariantFeature) {
        onResetCart();
        variant.value = variant.value.map((variant) =>
            variant.option_id === body.option_id
                ? {
                      ...variant,
                      feature_id: body.feature_id,
                  }
                : variant
        );
    }

    const discount = useSignal<null | number>(null);
    const couponForm = useForm<CouponStore>({
        resolver: valibotVigilio(couponStore),
    });
    const coupon = couponForm.watch("coupon");
    const productCouponMutation = productCouponApi();
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
        if (!varianteChoose.ilimit && varianteChoose.stock! < 1) {
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
                    product_id: producto.value.id,
                    variant_id: varianteChoose!.id,
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
            variant: varianteChoose!,
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
                            <span class="text-principal-primary font-semibold">
                                {formatMoney(formatMoneyDinamic(subtotal))}
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
                            href={`${enviroments.VITE_URL}/cart`}
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

    return {
        onCoupon,
        handleInsertProduct,
        isImagesLength,
        changeVariant,
        onIncrementCart,
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
