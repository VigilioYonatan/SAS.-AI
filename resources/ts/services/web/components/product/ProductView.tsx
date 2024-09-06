import { subtotalIgv } from "@/cart/libs/helpers";
import useProduct, { type CouponStore } from "@/products/hooks/useProduct";
import { formatMoney } from "@vigilio/express-core/helpers";
import enviroments from "~/config";
import { SampleNextArrow, SamplePrevArrow } from "../ArrowsSlider";
import useThemeStore from "~/stores/theme.store";
import useEmpresastore, {
    BASE_URL,
    storageEmpresa,
} from "@/empresas/stores/empresa.store";
import useShowImage from "~/hooks/useShowImage";
import Form from "~/components/form";
import {
    paypalICOImage,
    plinImage,
    VisaMastercardImage,
    yapeImage,
} from "~/config/settings";
import Slider from "react-slick";
import { ProductsRestaurantSchemaFromServer } from "@/products/schemas/products_restaurant.schema";
import { ProductsNormalSchemaFromServer } from "@/products/schemas/products_normal.schema";

interface ProductCardViewProps {
    product: ReturnType<typeof useProduct>;
}
function ProductCardView({ product }: ProductCardViewProps) {
    const themeStore = useThemeStore();
    const empresaStore = useEmpresastore();
    const {
        isImagesLength,
        handleInsertProduct,
        onCoupon,
        onDecrementCart,
        onIncrementCart,
        producto,
        existProductInCart,
        cartStoreMutation,
        couponForm,
        discount,
        productCouponMutation,
        varianteChoose,
        zoom,
        images500,
    } = useProduct({
        product: product.producto.value as
            | ProductsNormalSchemaFromServer
            | ProductsRestaurantSchemaFromServer,
    });
    const { ShowImage, changeShowImage, state } = useShowImage();

    return (
        <div class="flex gap-6 flex-col md:flex-row  product-card p-2 ">
            <Slider
                {...{
                    customPaging: (i) => {
                        return (
                            <div class="w-full h-full dark:bg-paper-dark bg-paper-light">
                                <img
                                    width={100}
                                    height={100}
                                    class="w-full h-full object-contain"
                                    alt={product.producto.value.name}
                                    src={isImagesLength[i]}
                                />
                            </div>
                        );
                    },
                    dots: images500.length > 1,
                    arrows: images500.length > 1,
                    dotsClass: "slick-dots slick-thumb",
                    infinite: false,
                    speed: 500,
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    adaptiveHeight: true,
                    className: "w-full  md:w-7/12 relative self-start",
                    nextArrow: <SampleNextArrow />,
                    prevArrow: <SamplePrevArrow />,
                }}
            >
                {isImagesLength.map((img, i) => (
                    <div
                        class="rounded-md  h-[300px] md:h-[400px]   relative overflow-hidden "
                        key={img}
                        onMouseMove={zoom.handleMouseMove}
                        onMouseLeave={zoom.handleMouseLeave}
                    >
                        {images500.length ? (
                            <button
                                class="absolute right-0 m-2 dark:text-white z-10"
                                type="button"
                                aria-label="show image"
                                onClick={() => {
                                    changeShowImage(i + 1);
                                }}
                            >
                                <i class="fa-light fa-magnifying-glass-plus" />
                            </button>
                        ) : null}

                        <img
                            alt={product.producto.value.name}
                            class={`h-full object-contain w-full ${
                                zoom ? "zoom-image" : ""
                            }`}
                            width={800}
                            height={800}
                            src={img}
                            style={{
                                transformOrigin: `${zoom.position.x} ${zoom.position.y}`,
                            }}
                        />
                    </div>
                ))}
            </Slider>
            <ShowImage length={images500.length}>
                <Slider
                    className="w-full"
                    {...{
                        dots: true,
                        speed: 500,
                        slidesToShow: 1,
                        slidesToScroll: 1,
                        arrows: false,
                        adaptiveHeight: true,
                        initialSlide: state! - 1,
                        afterChange(currentSlide) {
                            changeShowImage(currentSlide + 1);
                        },
                    }}
                >
                    {images500.map((image) => (
                        <div class="h-[800px]" key={image}>
                            <img
                                class="w-full h-full object-contain"
                                src={image}
                                width={500}
                                height={500}
                                alt=""
                            />
                        </div>
                    ))}
                </Slider>
            </ShowImage>
            <style jsx>{`
                .product-card .slick-dots li {
                    min-width: 50px !important;
                    min-height: 50px !important;
                    border: 1px solid
                        ${themeStore.state === "dark"
                            ? "rgba(192, 192, 192, 0.2)"
                            : "rgba(0, 0, 0, 0.2)"};
                    bottom: -36px;
                }
                .product-card .slick-dots .slick-active {
                    border: 2px solid var(--primary);
                }
                .product-card .slick-slide div {
                    margin-inline: 8px;
                    outline: none;
                }
                .zoom-image {
                    transition: transform 0.5s ease;
                }
                .zoom-image:hover {
                    transform: scale(1.5);
                }
            `}</style>
            <div class="flex flex-col gap-2 md:w-5/12 mt-8">
                <div class="flex gap-2 text-terciary text-xs">
                    <span>{product.producto.value.category.name}</span>
                </div>
                <h3 class="text-primary font-bold dark:text-white line-clamp-2">
                    {product.producto.value.name}
                </h3>
                <div class="flex flex-col">
                    <div class="flex gap-2">
                        {product.producto.value.discount > 0 ? (
                            <span
                                class="text-sm text-gray-400 line-through"
                                itemprop={formatMoney(
                                    subtotalIgv(product.producto.value, false)
                                )}
                                content={formatMoney(
                                    subtotalIgv(product.producto.value, false)
                                )}
                            >
                                {formatMoney(
                                    subtotalIgv(product.producto.value, false)
                                )}
                            </span>
                        ) : null}
                        {discount.value ? (
                            <span class="text-sm text-gray-400 line-through">
                                -{discount.value}%
                            </span>
                        ) : null}
                    </div>

                    <span
                        class="text-primary font-bold dark:text-white text-xl"
                        itemprop="price"
                        content={formatMoney(
                            subtotalIgv(product.producto.value, true)
                        )}
                    >
                        {formatMoney(
                            subtotalIgv(
                                product.producto.value,
                                true,
                                discount.value
                            )
                        )}
                    </span>
                </div>
                <span
                    class={`${
                        storageEmpresa?.tipo_empresa.tipo_servicio_id === 2
                            ? (
                                  producto.value as ProductsRestaurantSchemaFromServer
                              ).ilimit ||
                              (!(
                                  producto.value as ProductsRestaurantSchemaFromServer
                              ).ilimit &&
                                  (
                                      producto.value as ProductsRestaurantSchemaFromServer
                                  ).stock! > 0)
                                ? "text-success"
                                : "text-danger"
                            : ""
                    } ${
                        [1, 3].includes(
                            storageEmpresa!.tipo_empresa.tipo_servicio_id
                        )
                            ? (!product.varianteChoose!.ilimit &&
                                  product.varianteChoose!.stock! < 1) ||
                              !product.producto.value.enabled
                                ? "text-success"
                                : ""
                            : ""
                    }  font-bold text-xs flex items-center gap-2`}
                >
                    <i class="fa-duotone fa-circle-check text-xl" />
                    {storageEmpresa!.tipo_empresa.tipo_servicio_id === 2 ? (
                        <>
                            {(
                                producto.value as ProductsRestaurantSchemaFromServer
                            ).ilimit
                                ? "En stock"
                                : `${
                                      (
                                          producto.value as ProductsRestaurantSchemaFromServer
                                      ).stock
                                  } unidades`}
                        </>
                    ) : null}
                    {storageEmpresa!.tipo_empresa.tipo_servicio_id === 1 ? (
                        <>
                            {product.varianteChoose!.ilimit
                                ? "En stock"
                                : `${product.varianteChoose!.stock} unidades`}
                        </>
                    ) : null}
                </span>
                {/* coupon form  si  esta en el carrito que no se vea el formulario de cupon */}
                {!existProductInCart &&
                storageEmpresa!.tipo_empresa.tipo_servicio_id === 1 ? (
                    product.varianteChoose!.ilimit ||
                    (!product.varianteChoose!.ilimit &&
                        product.varianteChoose!.stock! > 0) ||
                    product.producto.value.enabled
                ) : (producto.value as ProductsRestaurantSchemaFromServer)
                      .ilimit ||
                  (!(producto.value as ProductsRestaurantSchemaFromServer)
                      .ilimit &&
                      (producto.value! as ProductsRestaurantSchemaFromServer)
                          .stock! > 0) ||
                  product.producto.value.enabled ? (
                    <Form
                        {...couponForm}
                        onSubmit={onCoupon}
                        className="flex gap-2 items-center"
                    >
                        <div class="w-full flex-col">
                            {discount.value ? (
                                <p class="text-xs text-primary">
                                    Se agregó {discount.value}% de descuento
                                </p>
                            ) : null}
                            <Form.control.web
                                type="text"
                                title="¿Tienes un cupón de descuento?"
                                placeholder="XXXXX-XXXXX-XXXXX"
                                name={"coupon" as keyof CouponStore}
                                disabled={!!discount.value}
                            />
                        </div>

                        <Form.button.submit
                            disabled={productCouponMutation.isLoading || false}
                            isLoading={productCouponMutation.isLoading || false}
                            title=""
                            className="w-[40px] h-[40px] flex justify-center items-center"
                            ico={
                                discount.value ? (
                                    <span>x</span>
                                ) : (
                                    <i class="fa-solid fa-magnifying-glass text-base" />
                                )
                            }
                        />
                    </Form>
                ) : null}
                <div class="flex gap-2">
                    {(!(producto.value as ProductsRestaurantSchemaFromServer)
                        ?.ilimit &&
                        (producto.value as ProductsRestaurantSchemaFromServer)
                            ?.stock! < 1) ||
                    (!varianteChoose?.ilimit && varianteChoose?.stock! < 1) ||
                    !producto.value.enabled ? (
                        <span
                            class={`bg-danger py-3 w-full text-center ${
                                enviroments.TYPE_BORDER === "circle"
                                    ? "rounded-md"
                                    : ""
                            } shadow text-white font-semibold`}
                        >
                            {!producto.value.enabled
                                ? "No disponible"
                                : "Agotado"}
                        </span>
                    ) : (
                        <>
                            {!existProductInCart ? (
                                <div
                                    class={`flex items-center bg-secondary ${
                                        enviroments.TYPE_BORDER === "circle"
                                            ? "rounded-md"
                                            : ""
                                    } group hover:outline-2 hover:outline-primary shadow `}
                                >
                                    <button
                                        type="button"
                                        class="px-4 py-2 text-xl text-white font-bold"
                                        aria-label="increase quantity"
                                        onClick={onDecrementCart}
                                    >
                                        -
                                    </button>
                                    <span class="px-4 py-2  block text-white font-bold">
                                        {producto.value.quantity}
                                    </span>
                                    <button
                                        type="button"
                                        class="px-4 py-2 text-xl text-white font-bold"
                                        aria-label="decrease quantity"
                                        onClick={onIncrementCart}
                                    >
                                        +
                                    </button>
                                </div>
                            ) : null}

                            {!existProductInCart ? (
                                <button
                                    class={`bg-primary text-white px-6 py-2 ${
                                        enviroments.TYPE_BORDER === "circle"
                                            ? "rounded-md"
                                            : ""
                                    } text-primary font-bold shadow  w-full`}
                                    type="button"
                                    aria-label="add cart"
                                    onClick={async () => {
                                        await handleInsertProduct(false);
                                    }}
                                    disabled={
                                        cartStoreMutation.isLoading || false
                                    }
                                >
                                    {cartStoreMutation.isLoading ? (
                                        <span>cargando...</span>
                                    ) : (
                                        <>
                                            <i class={enviroments.TYPE_CART} />{" "}
                                            Agregar Carrito
                                        </>
                                    )}
                                </button>
                            ) : (
                                <span class=" flex gap-2 items-center justify-center w-full bg-secondary border-r border-primary  font-bold  py-3 text-white shadow rounded-md">
                                    <span> Añadido </span>
                                </span>
                            )}
                        </>
                    )}
                </div>
                <div class="flex  flex-col gap-1">
                    <span class=" dark:text-white text-xs font-bold text-black">
                        Compartir
                    </span>
                    <div class="flex gap-2 items-center dark:text-white text-primary">
                        <a
                            target="_self"
                            rel="noreferrer"
                            href={`mailto:?subject=${encodeURIComponent(
                                `Más información de ${product.producto.value.name}`
                            )}&amp;body=${BASE_URL}/${
                                product.producto.value.slug
                            }`}
                        >
                            <i class="fas fa-envelope" />
                        </a>
                        <a
                            target="_blank"
                            rel="noreferrer"
                            href={`https://x.com/share?url=${BASE_URL}/${
                                product.producto.value.slug
                            }&amp;text=${encodeURIComponent(
                                `Más información de ${product.producto.value.name}`
                            )}`}
                        >
                            <i class="fab fa-twitter" />
                        </a>
                        <a
                            target="_blank"
                            rel="noreferrer"
                            href={`https://facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                                `${BASE_URL}/${product.producto.value.slug}`
                            )}`}
                        >
                            <i class="fab fa-facebook" />
                        </a>
                        <a
                            target="_blank"
                            rel="noreferrer"
                            href={`https://wa.me/51${
                                empresaStore.state!.telephoneFirst
                            }?text=Hola, estoy interesado en ${
                                product.producto.value.name
                            }`}
                        >
                            <i class="fab fa-whatsapp" />
                        </a>
                    </div>
                </div>
                <MetodosDePago />
                <a
                    href={`${BASE_URL}/${product.producto.value.slug}`}
                    class="self-end hover:underline delay-custom-1 text-primary text-xs font-semibold"
                >
                    Más información
                </a>
            </div>
        </div>
    );
}

export function MetodosDePago() {
    const empresaStore = useEmpresastore();
    return (
        <div class="flex flex-col gap-2">
            <span class="dark:text-white text-xs font-bold text-black ">
                Métodos de pago disponible
            </span>
            <div class="flex gap-2 items-center overflow-auto scrollbar-hide">
                {empresaStore.state?.metodos_pago.mercado_pago.enabled ? (
                    <img
                        src={VisaMastercardImage()}
                        width={80}
                        height={80}
                        alt="visa"
                    />
                ) : null}

                {empresaStore.state?.metodos_pago.qrYape ? (
                    <img src={yapeImage()} width={30} height={30} alt="yape" />
                ) : null}
                {empresaStore.state?.metodos_pago.qrPlin ? (
                    <img src={plinImage()} width={30} height={30} alt="yape" />
                ) : null}
                {empresaStore.state?.metodos_pago.paypal.enabled ? (
                    <img
                        src={paypalICOImage()}
                        width={30}
                        height={30}
                        alt="yape"
                    />
                ) : null}
                {empresaStore.state?.metodos_pago.enable_efectivo ? (
                    <p class="text-xs  text-center border p-1 rounded-md border-gray-400 text-black dark:text-white">
                        <i class="far fa-handshake" /> Efectivo
                    </p>
                ) : null}
                {/* {empresaStore.state!.transferencias?.bcp &&
                verifyBank(empresaStore.state!.transferencias.bcp) ? (
                    <img src={bcpImage()} width={50} height={30} alt="yape" />
                ) : null}
                {empresaStore.state!.transferencias?.interbank &&
                verifyBank(empresaStore.state!.transferencias.interbank) ? (
                    <img
                        src={interbankImage()}
                        width={50}
                        height={30}
                        alt="yape"
                    />
                ) : null}
                {empresaStore.state!.transferencias?.bbva &&
                verifyBank(empresaStore.state!.transferencias.bbva) ? (
                    <img src={bbvaImage()} width={50} height={30} alt="yape" />
                ) : null} */}
            </div>
        </div>
    );
}
export default ProductCardView;
