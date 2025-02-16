import { printImagesProduct, productOBJ } from "@/products/libs/helpers";
import { formatMoney, subtotalIgv } from "@/cart/libs/helpers";
import useCartStore from "@/cart/stores/cart.store";
import { cartStoreApi } from "@/cart/apis/cart.store.api";
import { sweetAlert, sweetModal } from "@vigilio/sweet";
import { reactComponent } from "~/libs/preact";
import ProductsShow from "../views/ProductsShow";
import LoaderSubmit from "~/components/LoaderSubmit";
import ProductNotification from "./ProductNotification";
import { ProductsRestaurantSchemaFromServer } from "../schemas/products_restaurant.schema";
import { storageEmpresa } from "@/empresas/stores/empresa.store";
interface ProductCardRestaurantProps {
    product: ProductsRestaurantSchemaFromServer;
    refetch: (clean?: boolean) => void;
}
function ProductCardRestaurant({
    product,
    refetch,
}: ProductCardRestaurantProps) {
    const cartStore = useCartStore();
    const cartStoreMutation = cartStoreApi();

    function handleOpenProduct(product: ProductsRestaurantSchemaFromServer) {
        return sweetModal((onClose) => ({
            html: reactComponent(
                <ProductsShow
                    id={product.id}
                    refetch={refetch}
                    onClose={onClose}
                    isService={false}
                />
            ),
            showCloseButton: true,
            position: "start",
            sweetWidth: "800px",
            isCloseInBackground: false,
        }));
    }

    // function
    async function onCart() {
        cartStoreMutation.mutate(
            {
                ...productOBJ(product.id),
                quantity: 1,
                variant_id: null,
                coupon: null,
            },
            {
                onSuccess() {
                    cartStore.methods.onInsertProduct({
                        ...product,
                        subtotal: subtotalIgv(product),
                        quantity: 1,
                        coupon: null,
                        variant: null,
                    });
                    sweetAlert({
                        showCloseButton: true,
                        html: reactComponent(
                            <ProductNotification product={product} />
                        ),
                        height: 100,
                        width: 300,
                        timer: 2,
                    });
                },
                onError(error) {
                    sweetAlert({
                        icon: "danger",
                        title: `Hubo un error al agregar ${error.message}`,
                    });
                },
            }
        );
    }
    const existProductInCart = cartStore.methods.isAlreadyExistProductToCart(
        product.id,
        null
    );
    return (
        <div
            class="shadow rounded-md overflow-hidden dark:bg-admin-terciary"
            key={product.id}
        >
            <div class="w-full relative">
                <img
                    class="w-full h-[250px] object-contain"
                    src={printImagesProduct(product.images, 500)[0]}
                    width={100}
                    height={100}
                    alt=""
                />
            </div>
            <div class=" justify-center items-center mt-2 flex flex-col gap-2 min-h-[200px]">
                <button
                    type="button"
                    aria-label="to open oproduct"
                    onClick={() => handleOpenProduct(product)}
                    class="text-primary dark:text-white font-semibold text-xs md:text-base text-wrap line-clamp-3"
                >
                    {product.name}
                </button>
                <b class="dark:text-white ">
                    <span>{formatMoney(subtotalIgv(product))}</span>
                </b>
                <div>
                    {product!.ilimit ? (
                        <span class="dark:text-white font-bold">
                            {storageEmpresa!.tipo_empresa.tipo_servicio_id === 2
                                ? "Cantidad Ilimitada"
                                : "En stock"}
                        </span>
                    ) : product!.stock! > 0 ? (
                        <span class="dark:text-white font-bold">
                            {product?.stock} unidades
                        </span>
                    ) : (
                        <span class="text-danger font-bold">Agotado</span>
                    )}
                </div>
                {!product.enabled ||
                (!product!.ilimit && product!.stock! < 1) ? (
                    <span class="text-white flex gap-2 items-center justify-center w-full bg-danger border-r border-primary py-1 font-bold">
                        <span>
                            {!product.enabled ? "Desabilitado" : "Agotado"}{" "}
                        </span>
                    </span>
                ) : (
                    <>
                        {existProductInCart ? (
                            <span class="added bg-black py-3  w-full text-white text-xs font-bold  flex justify-center">
                                <i class="fa-solid fa-cart-shopping mr-2" />
                                Añadido
                            </span>
                        ) : (
                            <button
                                type="button"
                                aria-label="to send"
                                onClick={onCart}
                                class="bg-primary py-3 flex justify-center items-center  w-full text-white text-xs font-bold"
                            >
                                {cartStoreMutation.isLoading ? (
                                    <LoaderSubmit />
                                ) : (
                                    <>
                                        <i class="fa-solid fa-cart-shopping mr-2" />
                                        Agregar Carrito
                                    </>
                                )}
                            </button>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}

export default ProductCardRestaurant;
