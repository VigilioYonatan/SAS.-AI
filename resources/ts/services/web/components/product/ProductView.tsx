import { subtotalIgv } from "@/cart/libs/helpers";
import useProduct, { type CouponStore } from "@/products/hooks/useProduct";
import { formatMoney } from "@vigilio/express-core/helpers";
import enviroments, { BASE_URL } from "~/config";
import { SampleNextArrow, SamplePrevArrow } from "../ArrowsSlider";
import useThemeStore from "~/stores/theme.store";
import useEmpresastore, {
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
import { transferencias } from "@/empresas/libs/helpers";
import { Fragment } from "preact/jsx-runtime";
import { verifyBank } from "@/cart/views/Niubiz";
import { printFileWithDimension } from "~/libs/upload";

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
        images500Variant,
        changeVariant,
        images500,
        variant,
    } = useProduct({
        product: product.producto.value as
            | ProductsNormalSchemaFromServer
            | ProductsRestaurantSchemaFromServer,
    });
    const { ShowImage, changeShowImage, state } = useShowImage();

    return (
        <div class="flex gap-6 flex-col md:flex-row  product-card p-2  lg:h-[600px]">
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
                    dots: images500Variant.length > 0,
                    arrows: images500Variant.length > 0,
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
                        {images500Variant.length > 0 ? (
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
            <div class="flex flex-col gap-2 md:w-5/12 mt-8 py-2">
                {product.varianteChoose?.sku ? (
                    <span class="text-terciary text-xs">
                        SKU: {product.varianteChoose?.sku}
                    </span>
                ) : null}
                <div class="flex  text-terciary text-xs flex-col">
                    <div class="flex gap-2">
                        {product.producto.value.category.icon ? (
                            <div
                                dangerouslySetInnerHTML={{
                                    __html: product.producto.value.category
                                        .icon,
                                }}
                            />
                        ) : null}
                        <span class=" font-bold text-xs">
                            {product.producto.value.category.name}
                        </span>
                    </div>

                    <span class="dark:text-white text-black font-bold text-lg">
                        {product.producto.value.name}
                    </span>
                </div>
                {(product.producto.value as ProductsNormalSchemaFromServer)
                    .brand?.image ? (
                    <img
                        src={
                            printFileWithDimension(
                                (
                                    product.producto
                                        .value as ProductsNormalSchemaFromServer
                                ).brand.image!,
                                100
                            )[0]
                        }
                        alt={
                            (
                                product.producto
                                    .value as ProductsNormalSchemaFromServer
                            ).brand.name
                        }
                        width={40}
                        class="object-contain w-[40px]"
                        height={40}
                    />
                ) : null}
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
                        class="text-black font-bold dark:text-white text-xl"
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
                        storageEmpresa!.tipo_empresa.tipo_servicio_id === 1
                            ? (!product.varianteChoose!.ilimit &&
                                  product.varianteChoose!.stock! > 0) ||
                              product.varianteChoose!.ilimit
                                ? "text-primary"
                                : "text-danger"
                            : ""
                    }  font-bold text-sm flex items-center gap-2`}
                >
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
                <div class="my-2">
                    {/* aaaaaaaaaaaaaaaaca variante */}
                    {(producto.value as ProductsNormalSchemaFromServer)
                        ?.variants ? (
                        <>
                            {" "}
                            <div class="flex flex-col gap-3">
                                {(
                                    producto.value as ProductsNormalSchemaFromServer
                                )?.options.map((option) => (
                                    <div key={option.id}>
                                        <span class="dark:text-white text-xs font-bold text-black">
                                            {option.name}
                                        </span>
                                        <div class="flex gap-2 flex-wrap">
                                            {option.features.length ? (
                                                <>
                                                    {option.features.length >=
                                                    4 ? (
                                                        <select
                                                            onChange={(e) => {
                                                                changeVariant({
                                                                    option_id:
                                                                        option.id,
                                                                    feature_id:
                                                                        Number(
                                                                            (
                                                                                e.target as HTMLInputElement
                                                                            )
                                                                                .value
                                                                        ),
                                                                });
                                                            }}
                                                            class="bg-white  dark:bg-background-dark text-xs dark:text-white w-full py-3 rounded-md shadow"
                                                        >
                                                            {option.features.map(
                                                                (feature) => (
                                                                    <option
                                                                        value={
                                                                            feature.id
                                                                        }
                                                                        class="font-bold  rounded-md  text-sm"
                                                                        key={
                                                                            feature.id
                                                                        }
                                                                    >
                                                                        {
                                                                            feature.description
                                                                        }
                                                                    </option>
                                                                )
                                                            )}
                                                        </select>
                                                    ) : (
                                                        <>
                                                            {option.features.map(
                                                                (feature) => {
                                                                    // para checar el boton segun variante
                                                                    const existFeature =
                                                                        variant
                                                                            .value!.map(
                                                                                (
                                                                                    feat
                                                                                ) =>
                                                                                    feat.feature_id
                                                                            )
                                                                            .includes(
                                                                                feature.id
                                                                            );

                                                                    return (
                                                                        <button
                                                                            type="button"
                                                                            aria-label="change button"
                                                                            key={
                                                                                feature?.id
                                                                            }
                                                                            onClick={() =>
                                                                                changeVariant(
                                                                                    {
                                                                                        option_id:
                                                                                            option.id,
                                                                                        feature_id:
                                                                                            feature.id,
                                                                                    }
                                                                                )
                                                                            }
                                                                        >
                                                                            {option.type ===
                                                                            1 ? (
                                                                                <div
                                                                                    class={`shadow font-bold ${
                                                                                        enviroments.TYPE_BORDER ===
                                                                                        "square"
                                                                                            ? "rounded-sm"
                                                                                            : "rounded-md"
                                                                                    }  flex text-primary py-2  text-sm min-w-[100px] px-2  justify-center items-center hover:bg-primary hover:text-white ${
                                                                                        existFeature
                                                                                            ? "bg-primary text-white border-2 border-primary"
                                                                                            : "bg-white"
                                                                                    }`}
                                                                                >
                                                                                    {
                                                                                        feature?.value
                                                                                    }
                                                                                </div>
                                                                            ) : (
                                                                                <div
                                                                                    class={`w-[35px] h-[35px] ${
                                                                                        enviroments.TYPE_BORDER ===
                                                                                        "square"
                                                                                            ? ""
                                                                                            : "rounded-full"
                                                                                    }  relative ${
                                                                                        existFeature
                                                                                            ? "border-4 border-primary"
                                                                                            : ""
                                                                                    }`}
                                                                                    style={{
                                                                                        backgroundColor:
                                                                                            feature?.value,
                                                                                    }}
                                                                                >
                                                                                    <span class="absolute -bottom-2 left-2 z-10 dark:bg-admin-background-dark shadow dark:text-white bg-white text-[10px] px-2 rounded-md py-1 hidden group-hover:block ">
                                                                                        {
                                                                                            feature?.description
                                                                                        }
                                                                                    </span>
                                                                                </div>
                                                                            )}
                                                                        </button>
                                                                    );
                                                                }
                                                            )}
                                                        </>
                                                    )}
                                                </>
                                            ) : null}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </>
                    ) : null}
                </div>
                {/* coupon form  si  esta en el carrito que no se vea el formulario de cupon */}
                {!existProductInCart &&
                storageEmpresa!.tipo_empresa.tipo_servicio_id === 1 ? (
                    product.varianteChoose!.ilimit ||
                    (!product.varianteChoose!.ilimit &&
                        product.varianteChoose!.stock! > 0)
                ) : (producto.value as ProductsRestaurantSchemaFromServer)
                      .ilimit ||
                  (!(producto.value as ProductsRestaurantSchemaFromServer)
                      .ilimit &&
                      (producto.value! as ProductsRestaurantSchemaFromServer)
                          .stock! > 0) ||
                  (producto.value as ProductsRestaurantSchemaFromServer)
                      .ilimit ? (
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
                    (!varianteChoose?.ilimit && varianteChoose?.stock! < 1) ? (
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

                <MetodosDePago />
                <div class="flex  flex-col gap-1">
                    <span class=" dark:text-white text-xs font-bold text-black">
                        Compartir
                    </span>
                    <div class="flex gap-6 items-center dark:text-white text-primary w-full">
                        <a
                            target="_self"
                            rel="noreferrer"
                            href={`mailto:?subject=${encodeURIComponent(
                                `Más información de ${product.producto.value.name}`
                            )}&amp;body=${BASE_URL}/${
                                product.producto.value.slug
                            }`}
                            class="flex  items-center   "
                        >
                            <i class="fas fa-envelope  text-lg" />
                        </a>
                        <a
                            target="_blank"
                            rel="noreferrer"
                            href={`https://x.com/share?url=${BASE_URL}/${
                                product.producto.value.slug
                            }&amp;text=${encodeURIComponent(
                                `Más información de ${product.producto.value.name}`
                            )}`}
                            class="flex  items-center   "
                        >
                            <i class="fab fa-twitter  text-lg" />
                        </a>
                        <a
                            target="_blank"
                            rel="noreferrer"
                            href={`https://facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                                `${BASE_URL}/${product.producto.value.slug}`
                            )}`}
                            class="flex  items-center   "
                        >
                            <i class="fab fa-facebook text-lg" />
                        </a>
                        <a
                            target="_blank"
                            rel="noreferrer"
                            href={`https://wa.me/51${
                                empresaStore.state!.telephoneFirst
                            }?text=Hola, estoy interesado en ${
                                product.producto.value.name
                            }`}
                            class="flex  items-center   "
                        >
                            <i class="fab fa-whatsapp  text-lg" />
                        </a>
                    </div>
                </div>
                <div class="flex  flex-col gap-1">
                    <span class=" dark:text-white text-xs font-bold text-black">
                        Descripción
                    </span>
                    <p class="text-xs line-clamp-4 dark:text-white">
                        {product.producto.value.description}
                    </p>
                </div>
                <a
                    href={`${BASE_URL}/${product.producto.value.slug}`}
                    class="self-end hover:underline delay-custom-1 text-primary text-xs font-semibold "
                >
                    Más información
                </a>
            </div>
        </div>
    );
}
interface MetodosDePagoProps {
    isEfectivo?: boolean;
}
export function MetodosDePago({ isEfectivo = true }: MetodosDePagoProps) {
    const empresaStore = useEmpresastore();

    return (
        <div class="flex flex-col gap-2">
            {isEfectivo ? (
                <span class="dark:text-white text-xs font-bold text-black ">
                    Métodos de pago disponible
                </span>
            ) : null}

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
                {empresaStore.state?.metodos_pago.enable_efectivo &&
                isEfectivo ? (
                    <p class="text-xs  text-center border p-1 rounded-md border-gray-400 text-black dark:text-white">
                        <i class="far fa-handshake" /> Efectivo
                    </p>
                ) : null}
                {empresaStore.state!.metodos_pago.transferencias &&
                transferencias(
                    empresaStore.state!.metodos_pago.transferencias
                ) ? (
                    <>
                        {empresaStore.state!.bancos.map((bank) => {
                            const tr =
                                empresaStore.state!.metodos_pago
                                    .transferencias!;
                            return (
                                <Fragment key={bank.key}>
                                    {tr[bank.key as keyof typeof tr] &&
                                    verifyBank(
                                        tr[bank.key as keyof typeof tr]
                                    ) ? (
                                        <img
                                            class="h-6 object-contain"
                                            width={40}
                                            src={bank.image}
                                            alt={bank.value}
                                        />
                                    ) : null}
                                </Fragment>
                            );
                        })}
                    </>
                ) : null}
            </div>
        </div>
    );
}
export default ProductCardView;
