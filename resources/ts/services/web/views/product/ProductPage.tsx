import { formatMoney, subtotalIgv } from "@/cart/libs/helpers";
import useEmpresastore, {
    storageEmpresa,
} from "@/empresas/stores/empresa.store";
import useProduct, { type CouponStore } from "@/products/hooks/useProduct";
import { useSignal } from "@preact/signals";
import Slider from "react-slick";
import enviroments, { BASE_URL } from "~/config";
import WebLayout, { type HeaderType } from "@/web/components/WebLayout";
import Form from "~/components/form";
import ProductCard from "@/web/components/product";
import useThemeStore from "~/stores/theme.store";
import {
    SampleNextArrow,
    SamplePrevArrow,
} from "@/web/components/ArrowsSlider";
import WebBreadCrumb from "@/web/components/WebBreadCrumb";
import useShowImage from "~/hooks/useShowImage";
import TitleSectionTwo from "@/web/components/TitleSectionTwo";
import { printFileWithDimension } from "~/libs/upload";
import { MetodosDePago } from "@/web/components/product/ProductView";
import { ProductsRestaurantSchemaFromServer } from "@/products/schemas/products_restaurant.schema";
import { ProductsNormalSchemaFromServer } from "@/products/schemas/products_normal.schema";
import { printProductVariant, ProductKeys } from "@/products/libs/helpers";
import useAuthStore from "@/auth/stores/auth.store";
import ProductRatingStore from "@/products/components/ProductRatingStore";
import ProductsComments from "@/products/components/ProductsComments";
import useCartStore from "@/cart/stores/cart.store";
import { Rating } from "react-custom-rating-component";
import LoaderSubmit from "~/components/LoaderSubmit";
import useVideo from "~/hooks/useVideo";
import { bgPrimaryHover } from "~/config/settings";
import { getParams } from "~/libs/helpers";
import QuillText from "~/components/QuillText";

export interface VariantFeature {
    option_id: number;
    id: number;
}
interface ProductPageProps {
    product:
        | ProductsNormalSchemaFromServer
        | ProductsRestaurantSchemaFromServer;
    categoriesproductsrandom:
        | ProductsNormalSchemaFromServer[]
        | ProductsRestaurantSchemaFromServer[];
    productbybrands:
        | ProductsNormalSchemaFromServer[]
        | ProductsRestaurantSchemaFromServer[];
    category_name: string;
    header: HeaderType;
    totalcomments: number;
}

function ProductPage({
    product,
    categoriesproductsrandom,
    category_name,
    productbybrands,
    header,
    totalcomments,
}: ProductPageProps) {
    const params = getParams();
    const commentID = params.get("comment");
    const type = useSignal<
        "description" | "characteristics" | "reviews" | "more"
    >(commentID ? "reviews" : "description");
    // description
    const empresaStore = useEmpresastore();
    const themeStore = useThemeStore();
    const authStore = useAuthStore();
    const { ShowImage, changeShowImage, state } = useShowImage();
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
        zoom,
        images500Variant,
        varianteChoose,
        changeVariant,
        favoritesStoreMutation,
        favoritesDestroyMutation,
        onFavorite,
        variant,
    } = useProduct({ product, isService: false });

    const cartStore = useCartStore();

    return (
        <WebLayout header={header}>
            <section class="max-w-6xl gap-6 mx-auto mb-6 mt-20  lg:mt-6 lg:flex-row px-4">
                <div class="my-2 md:my-6 overflow-auto">
                    <WebBreadCrumb
                        current={product.name}
                        uris={
                            [
                                {
                                    title: "Tienda",
                                    uri: "/shop",
                                },
                                {
                                    title: `${category_name}`,
                                    uri: `/shop/${product.category.slug}`,
                                },
                                product.subcategory
                                    ? {
                                          title: `${category_name}`,
                                          uri: `/shop/${product.category.slug}/${product.subcategory.slug}`,
                                      }
                                    : null,
                            ].filter(Boolean) as {
                                title: string;
                                uri: string;
                            }[]
                        }
                    />
                </div>
                <div class="flex gap-6 flex-col md:flex-row  product-card-page p-2 ">
                    <Slider
                        {...{
                            customPaging: (i) => {
                                return (
                                    <div class="w-full h-full dark:bg-paper-dark bg-paper-light group">
                                        {isImagesLength[i]?.endsWith("mp4") ? (
                                            <div class="w-full h-full relative">
                                                <video
                                                    width={100}
                                                    height={100}
                                                    class="w-full h-full object-cover"
                                                    src={isImagesLength[i]}
                                                    muted
                                                />
                                                <i class="fas fa-play text-white absolute text-sm top-[15px] right-[16px] z-[9]" />
                                            </div>
                                        ) : (
                                            <img
                                                width={100}
                                                height={100}
                                                class="w-full h-full object-contain"
                                                alt={product.name}
                                                src={isImagesLength[i]}
                                            />
                                        )}
                                    </div>
                                );
                            },
                            dots: true,
                            arrows: images500Variant.length > 1,
                            dotsClass: "slick-dots slick-thumb",
                            infinite: false,
                            speed: 500,
                            slidesToShow: 1,
                            slidesToScroll: 1,
                            adaptiveHeight: true,
                            className:
                                "w-full  md:w-7/12 relative self-start product-page-slide",
                            nextArrow: <SampleNextArrow />,
                            prevArrow: <SamplePrevArrow />,
                        }}
                    >
                        {isImagesLength.map((img, i) => (
                            <div
                                class="rounded-md  h-[300px] md:h-[500px]   relative overflow-hidden w-full flex justify-center items-center"
                                key={img}
                                onMouseMove={zoom.handleMouseMove}
                                onMouseLeave={zoom.handleMouseLeave}
                            >
                                {images500Variant.length ? (
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
                                {img?.endsWith("mp4") ? (
                                    <VideoProduct file={img} />
                                ) : (
                                    <img
                                        alt={product.name}
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
                                )}
                            </div>
                        ))}
                    </Slider>
                    <ShowImage length={images500Variant.length}>
                        <Slider
                            className="w-full mx-2"
                            {...{
                                dots: false,
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
                            {images500Variant.map((image) => (
                                <div class=" md:h-[800px] relative" key={image}>
                                    {image?.endsWith("mp4") ? (
                                        <VideoProduct file={image} />
                                    ) : (
                                        <img
                                            class="w-full h-full object-contain"
                                            src={image}
                                            width={800}
                                            height={800}
                                            alt={image}
                                        />
                                    )}
                                </div>
                            ))}
                        </Slider>
                    </ShowImage>
                    <style jsx>{`
                        .product-card-page .slick-dots li {
                            min-width: 50px !important;
                            min-height: 50px !important;
                            border: 1px solid
                                ${themeStore.state === "dark"
                                    ? "rgba(192, 192, 192, 0.2)"
                                    : "rgba(0, 0, 0, 0.2)"};
                            bottom: -36px;
                        }
                        .product-card-page .slick-dots .slick-active {
                            border: 2px solid var(--primary);
                        }
                        .product-card-page .slick-slide div {
                            outline: none;
                        }
                        .zoom-image {
                            transition: transform 0.5s ease;
                        }
                        .zoom-image:hover {
                            transform: scale(1.5);
                        }
                    `}</style>
                    <div class="flex flex-col gap-3 md:w-5/12 mt-8  product-page-container">
                        {varianteChoose?.sku ? (
                            <span class="text-terciary text-xs">
                                SKU: {varianteChoose?.sku}
                            </span>
                        ) : null}
                        <div class="flex gap-2 text-gray-400 dark:text-gray-300 text-xs font-semibold">
                            {product.category?.icon ? (
                                <div
                                    dangerouslySetInnerHTML={{
                                        __html: product.category.icon,
                                    }}
                                />
                            ) : null}

                            <span>{product.category.name}</span>
                        </div>
                        <h1 class="text-primary font-bold dark:text-white line-clamp-2 text-lg">
                            {product.name}{" "}
                            {varianteChoose &&
                            (producto.value as ProductsNormalSchemaFromServer)
                                .variants
                                ? printProductVariant(
                                      producto.value as ProductsNormalSchemaFromServer,
                                      varianteChoose
                                  )
                                      .filter((opt) => opt?.id !== 1)
                                      .map((variant) => {
                                          // si es color que muestre el color, sino solo el valor
                                          return variant?.features.map(
                                              (feature) => feature?.description
                                          );
                                      })
                                      .join(" ")
                                : null}
                        </h1>{" "}
                        <Rating
                            defaultValue={product.rating.promedio}
                            shape={enviroments.TYPE_START}
                            size="20px"
                            spacing="5px"
                            readOnly
                            activeColor="var(--primary)"
                        />
                        {(product as ProductsNormalSchemaFromServer).brand
                            ?.image ? (
                            <img
                                src={
                                    printFileWithDimension(
                                        (
                                            product as ProductsNormalSchemaFromServer
                                        ).brand.image!,
                                        100
                                    )[0]
                                }
                                alt={
                                    (product as ProductsNormalSchemaFromServer)
                                        .brand.name
                                }
                                width={40}
                                class="object-contain w-[40px] "
                                height={40}
                            />
                        ) : null}
                        <div class="flex flex-col  product-page-container-cost">
                            <div class="flex gap-2">
                                {product.discount > 0 ? (
                                    <span
                                        class="text-sm text-gray-400 line-through"
                                        itemprop={formatMoney(
                                            subtotalIgv(product, false)
                                        )}
                                    >
                                        {formatMoney(
                                            subtotalIgv(product, false)
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
                                class=" font-bold dark:text-white text-xl"
                                itemprop="price"
                            >
                                {formatMoney(
                                    subtotalIgv(product, true, discount.value)
                                )}
                            </span>
                        </div>{" "}
                        <span
                            class={`${
                                storageEmpresa?.tipo_empresa
                                    .tipo_servicio_id === 2
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
                                (
                                    producto.value as ProductsNormalSchemaFromServer
                                ).variants
                                    ? (!varianteChoose!.ilimit &&
                                          varianteChoose!.stock! > 0) ||
                                      varianteChoose!.ilimit
                                        ? "text-primary"
                                        : "text-danger"
                                    : ""
                            }  font-bold text-sm flex items-center gap-2`}
                        >
                            {storageEmpresa!.tipo_empresa.tipo_servicio_id ===
                            2 ? (
                                <>
                                    {(
                                        producto.value as ProductsRestaurantSchemaFromServer
                                    ).ilimit
                                        ? storageEmpresa!.tipo_empresa
                                              .tipo_servicio_id === 2
                                            ? "Cantidad Ilimitada"
                                            : "En stock"
                                        : `${
                                              (
                                                  producto.value as ProductsRestaurantSchemaFromServer
                                              ).stock
                                          } unidades`}
                                </>
                            ) : null}
                            {(producto.value as ProductsNormalSchemaFromServer)
                                .variants ? (
                                <>
                                    {varianteChoose!.ilimit
                                        ? storageEmpresa!.tipo_empresa
                                              .tipo_servicio_id === 2
                                            ? "Cantidad Ilimitada"
                                            : "En stock"
                                        : `${varianteChoose!.stock} unidades`}
                                </>
                            ) : null}
                        </span>
                        <>
                            {/* aaaaaaaaaaaaaaaaca variante */}
                            {(producto.value as ProductsNormalSchemaFromServer)
                                ?.variants ? (
                                <div
                                    class={` ${
                                        (
                                            producto.value as ProductsNormalSchemaFromServer
                                        )?.options.filter(
                                            (option) => option.id !== 1
                                        ).length
                                            ? "my-2"
                                            : ""
                                    }`}
                                >
                                    {" "}
                                    <div class="flex flex-col gap-3">
                                        {(
                                            producto.value as ProductsNormalSchemaFromServer
                                        )?.options
                                            .filter((option) => option.id !== 1)
                                            .map((option) => (
                                                <div key={option.id}>
                                                    <span class="dark:text-white text-xs font-bold ">
                                                        {option.name}
                                                    </span>
                                                    <div class="flex gap-2 flex-wrap">
                                                        {option.features
                                                            .length ? (
                                                            <>
                                                                {option.features
                                                                    .length >=
                                                                4 ? (
                                                                    <select
                                                                        onChange={(
                                                                            e
                                                                        ) => {
                                                                            changeVariant(
                                                                                {
                                                                                    option_id:
                                                                                        option.id,
                                                                                    id: Number(
                                                                                        (
                                                                                            e.target as HTMLInputElement
                                                                                        )
                                                                                            .value
                                                                                    ),
                                                                                }
                                                                            );
                                                                        }}
                                                                        class="bg-white  dark:bg-background-dark text-xs dark:text-white w-full py-3 rounded-md shadow"
                                                                    >
                                                                        {option.features.map(
                                                                            (
                                                                                feature
                                                                            ) => (
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
                                                                            (
                                                                                feature
                                                                            ) => {
                                                                                // para checar el boton segun variante
                                                                                const existFeature =
                                                                                    variant
                                                                                        .value!.map(
                                                                                            (
                                                                                                feat
                                                                                            ) =>
                                                                                                feat.id
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
                                                                                                    id: feature.id,
                                                                                                }
                                                                                            )
                                                                                        }
                                                                                        class="group"
                                                                                    >
                                                                                        {option.type ===
                                                                                        1 ? (
                                                                                            <div
                                                                                                class={`shadow font-bold ${
                                                                                                    enviroments.TYPE_BORDER ===
                                                                                                    "square"
                                                                                                        ? "rounded-sm"
                                                                                                        : "rounded-md"
                                                                                                }  flex  py-2  text-sm min-w-[100px] px-2  justify-center items-center hover:bg-primary ${bgPrimaryHover()} ${
                                                                                                    existFeature
                                                                                                        ? "bg-primary   border-2 border-primary"
                                                                                                        : "bg-white text-black"
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
                                                                                                        : "rounded-md"
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
                                                                                                <span class="absolute -bottom-2 left-2 z-10 dark:bg-admin-background-dark shadow dark:text-white bg-white text-[10px] text-black px-2 rounded-md py-1 hidden group-hover:block ">
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
                                </div>
                            ) : null}
                        </>
                        {cartStore.state.cart ? (
                            <>
                                {(!existProductInCart &&
                                    (varianteChoose?.ilimit ||
                                        (!varianteChoose?.ilimit &&
                                            varianteChoose?.stock! > 0))) ||
                                (
                                    producto.value as ProductsRestaurantSchemaFromServer
                                )?.ilimit ||
                                (!(
                                    producto.value as ProductsRestaurantSchemaFromServer
                                )?.ilimit &&
                                    (
                                        producto.value! as ProductsRestaurantSchemaFromServer
                                    ).stock! > 0) ? (
                                    <Form
                                        {...couponForm}
                                        onSubmit={onCoupon}
                                        className="flex gap-2 items-center [&>div>div>div>div>input]:bg-white [&>div>div>div>div>input]:text-black  dark:[&>div>div>div>div>input]:bg-background-dark"
                                    >
                                        <div class="w-full flex-col ">
                                            {discount.value ? (
                                                <p class="text-xs text-primary">
                                                    Se agregó {discount.value}%
                                                    de descuento
                                                </p>
                                            ) : null}
                                            <Form.control.web
                                                type="text"
                                                title="¿Tienes un cupón de descuento?"
                                                placeholder="XXXXX-XXXXX-XXXXX"
                                                name={
                                                    "coupon" as keyof CouponStore
                                                }
                                                disabled={!!discount.value}
                                            />
                                        </div>

                                        <Form.button.submit
                                            disabled={
                                                productCouponMutation.isLoading ||
                                                false
                                            }
                                            isLoading={
                                                productCouponMutation.isLoading ||
                                                false
                                            }
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

                                <div class=" product-page-container-buttons flex gap-2">
                                    {(!(
                                        producto.value as ProductsRestaurantSchemaFromServer
                                    )?.ilimit &&
                                        (
                                            producto.value as ProductsRestaurantSchemaFromServer
                                        )?.stock! < 1) ||
                                    (!varianteChoose?.ilimit &&
                                        varianteChoose?.stock! < 1) ? (
                                        <span
                                            class={`bg-danger py-3 w-full text-center ${
                                                enviroments.TYPE_BORDER ===
                                                "circle"
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
                                                        enviroments.TYPE_BORDER ===
                                                        "circle"
                                                            ? "rounded-md"
                                                            : ""
                                                    } group hover:outline-2 hover:outline-primary shadow `}
                                                >
                                                    <button
                                                        type="button"
                                                        class="px-4 py-2 text-xl text-white font-bold"
                                                        aria-label="increase quantity"
                                                        onClick={
                                                            onDecrementCart
                                                        }
                                                    >
                                                        -
                                                    </button>
                                                    <span class="px-4 py-2  block text-white font-bold">
                                                        {
                                                            producto.value
                                                                .quantity
                                                        }
                                                    </span>
                                                    <button
                                                        type="button"
                                                        class="px-4 py-2 text-xl text-white font-bold"
                                                        aria-label="decrease quantity"
                                                        onClick={
                                                            onIncrementCart
                                                        }
                                                    >
                                                        +
                                                    </button>
                                                </div>
                                            ) : null}
                                            {!existProductInCart ? (
                                                <button
                                                    class={`bg-primary text-white px-6 py-2 ${
                                                        enviroments.TYPE_BORDER ===
                                                        "circle"
                                                            ? "rounded-md"
                                                            : ""
                                                    } text-primary font-bold shadow  w-full`}
                                                    type="button"
                                                    aria-label="add cart"
                                                    onClick={async () => {
                                                        await handleInsertProduct(
                                                            false
                                                        );
                                                    }}
                                                    disabled={
                                                        cartStoreMutation.isLoading ||
                                                        false
                                                    }
                                                >
                                                    {cartStoreMutation.isLoading ? (
                                                        <span>cargando...</span>
                                                    ) : (
                                                        <>
                                                            <i
                                                                class={
                                                                    enviroments.TYPE_CART
                                                                }
                                                            />{" "}
                                                            Agregar
                                                        </>
                                                    )}
                                                </button>
                                            ) : (
                                                <span class=" flex gap-2 items-center justify-center w-full bg-secondary border-r border-primary  font-bold  py-3 text-white shadow rounded-md">
                                                    <span> Añadido </span>
                                                </span>
                                            )}{" "}
                                            <button
                                                type="button"
                                                disabled={
                                                    favoritesStoreMutation.isLoading ||
                                                    favoritesDestroyMutation.isLoading ||
                                                    false
                                                }
                                                class={`${
                                                    producto.value.user
                                                        ?.isFavorite
                                                        ? "bg-primary text-white"
                                                        : "text-primary"
                                                }  px-2 py-1 ${
                                                    enviroments.TYPE_BORDER ===
                                                    "circle"
                                                        ? "rounded-md"
                                                        : ""
                                                }  border-2 border-primary min-w-[50px] `}
                                                onClick={onFavorite}
                                            >
                                                {favoritesStoreMutation.isLoading ||
                                                favoritesDestroyMutation.isLoading ? (
                                                    <LoaderSubmit />
                                                ) : (
                                                    <i class="fas fa-heart text-2xl " />
                                                )}
                                            </button>
                                        </>
                                    )}
                                </div>
                            </>
                        ) : (
                            <div
                                class={`animate-pulse ${
                                    enviroments.TYPE_BORDER === "circle"
                                        ? "rounded-md"
                                        : ""
                                } overflow-hidden`}
                            >
                                <div class="bg-gray-500 w-full h-[22px] " />

                                <div class="flex gap-2 mt-2">
                                    <div class="bg-gray-500 w-full h-[32px]" />
                                    <div class="bg-gray-500 w-[60px] h-[32px]" />
                                </div>
                                <div class="flex gap-2 mt-2">
                                    <div class="grid grid-cols-3 gap-2 w-[250px]">
                                        <div class="bg-gray-500 w-full h-[32px]" />
                                        <div class="bg-gray-500 w-full h-[32px]" />
                                        <div class="bg-gray-500 w-full h-[32px]" />
                                    </div>
                                    <div class="bg-gray-500 w-full h-[32px]" />
                                </div>
                            </div>
                        )}
                        {/* coupon form  si  esta en el carrito que no se vea el formulario de cupon */}
                        <div class="flex  flex-col gap-1  product-page-container-shared">
                            <span class=" dark:text-white text-xs font-bold ">
                                Compartir
                            </span>
                            <div class="flex gap-2 items-center dark:text-white text-primary text-lg">
                                <a
                                    target="_self"
                                    rel="noreferrer"
                                    aria-label="shared"
                                    href={`mailto:?subject=${encodeURIComponent(
                                        `Más información de ${product.name}`
                                    )}&amp;body=${BASE_URL}/${product.slug}`}
                                >
                                    <i class="fas fa-envelope" />
                                </a>
                                <a
                                    target="_blank"
                                    rel="noreferrer"
                                    aria-label="shared"
                                    href={`https://x.com/share?url=${BASE_URL}/${
                                        product.slug
                                    }&amp;text=${encodeURIComponent(
                                        `Más información de ${product.name}`
                                    )}`}
                                >
                                    <i class="fab fa-twitter" />
                                </a>
                                <a
                                    target="_blank"
                                    rel="noreferrer"
                                    href={`https://facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                                        `${BASE_URL}/${product.slug}`
                                    )}`}
                                    aria-label="shared"
                                >
                                    <i class="fab fa-facebook" />
                                </a>
                                <a
                                    target="_blank"
                                    rel="noreferrer"
                                    href={`https://wa.me/${
                                        empresaStore.state!.dial_code
                                    }${
                                        empresaStore.state!.telephoneFirst
                                    }?text=Hola, estoy interesado en ${
                                        product.name
                                    }`}
                                    aria-label="shared"
                                >
                                    <i class="fab fa-whatsapp" />
                                </a>
                            </div>
                        </div>
                        <MetodosDePago />
                    </div>
                </div>
                <div class="flex flex-col lg:flex-row gap-4 mt-16 ">
                    <div class="flex flex-col gap-8 w-full bg-background-light dark:bg-background-dark p-2 rounded-md">
                        <div class="w-full flex md:grid md:grid-cols-4   overflow-auto font-semibold text-sm border-b border-gray-400 dark:border-gray-500">
                            <button
                                type="button"
                                aria-label="change type"
                                class={` flex justify-center items-center  pb-2 ${
                                    type.value === "description"
                                        ? "md:border-b-2 border-primary"
                                        : ""
                                } min-w-[120px]`}
                                onClick={() => {
                                    type.value = "description";
                                }}
                            >
                                Descripción
                            </button>
                            <button
                                type="button"
                                aria-label="change type"
                                class={` flex justify-center items-center gap-1  pb-2 ${
                                    type.value === "characteristics"
                                        ? "md:border-b-2 border-primary"
                                        : ""
                                } min-w-[120px]`}
                                onClick={() => {
                                    type.value = "characteristics";
                                }}
                            >
                                Características{"  "}
                                <span class="text-xs ">
                                    ({product.characteristics.length})
                                </span>
                            </button>
                            <button
                                type="button"
                                aria-label="change type"
                                class={` flex justify-center items-center  pb-2 ${
                                    type.value === "reviews"
                                        ? "md:border-b-2 border-primary"
                                        : ""
                                } min-w-[120px]`}
                                onClick={() => {
                                    type.value = "reviews";
                                }}
                            >
                                Reviews{" "}
                                {totalcomments > 0 ? `(${totalcomments})` : ""}
                            </button>
                            <button
                                type="button"
                                aria-label="change type"
                                class={` flex justify-center items-center  pb-2 ${
                                    type.value === "more"
                                        ? "md:border-b-2 border-primary"
                                        : ""
                                } min-w-[120px]`}
                                onClick={() => {
                                    type.value = "more";
                                }}
                            >
                                Más
                            </button>
                        </div>
                        <div
                            class={`${
                                type.value === "characteristics" ? "" : "hidden"
                            } w-full`}
                        >
                            <div class="">
                                {product.characteristics.length ? (
                                    <table
                                        class={`text-lg  font-medium w-full  overflow-hidden shadow ${
                                            enviroments.TYPE_BORDER === "circle"
                                                ? "rounded-md"
                                                : ""
                                        }`}
                                    >
                                        <thead>
                                            <tr class="h-[30px]">
                                                <th class="text-sm bg-primary text-white font-semibold">
                                                    Nombre
                                                </th>
                                                <th class="text-sm bg-primary text-white font-semibold">
                                                    Valor
                                                </th>
                                            </tr>
                                        </thead>

                                        <tbody>
                                            {product.characteristics.map(
                                                (characteristic) => (
                                                    <tr
                                                        class="text-[12px] odd:bg-background-light dark:odd:bg-background-dark"
                                                        key={
                                                            characteristic.name
                                                        }
                                                    >
                                                        <td>
                                                            <span class="font-semibold px-2 dark:text-white ">
                                                                {
                                                                    characteristic.name
                                                                }
                                                            </span>
                                                        </td>
                                                        <td>
                                                            <span class="font-normal dark:text-white px-2">
                                                                {
                                                                    characteristic.value
                                                                }
                                                            </span>
                                                        </td>
                                                    </tr>
                                                )
                                            )}
                                        </tbody>
                                    </table>
                                ) : (
                                    <span class="dark:text-white text-sm">
                                        No se insertó caracteristicas a este
                                        producto
                                    </span>
                                )}
                            </div>
                        </div>
                        <div
                            class={`${
                                type.value === "description" ? "" : "hidden"
                            }`}
                        >
                            {product.description ? (
                                <>
                                    <div
                                        class={
                                            "delay-custom-1  max-h-[1200px] overflow-auto"
                                        }
                                    >
                                        <QuillText text={product.description} />
                                    </div>
                                </>
                            ) : (
                                <p class="dark:text-white text-sm">
                                    {" "}
                                    No hay descripcion
                                </p>
                            )}
                        </div>
                        {/* si el usuario esta logueado que pueda loguear */}

                        <div
                            class={`${
                                type.value === "reviews" ? "" : "hidden"
                            } flex flex-col md:flex-row gap-2`}
                        >
                            <div class="w-[350px]">
                                <div class="flex flex-col w-full">
                                    <div class="flex justify-between text-sm">
                                        <span class=" dark:text-principal-light font-semibold">
                                            {enviroments.TYPE_START ===
                                            "heart" ? (
                                                <i class="fa-solid fa-heart mr-1" />
                                            ) : (
                                                <i class="fa-solid fa-star mr-1" />
                                            )}
                                            {Math.round(
                                                product.rating.promedio
                                            ) ?? 0}{" "}
                                            de 5
                                        </span>
                                        <span class=" dark:text-principal-light font-semibold">
                                            {product.rating.quantity} ratings
                                        </span>
                                    </div>
                                    {product.rating.ratings.map((rate) => (
                                        <div
                                            class="flex gap-1 items-center "
                                            key={rate.rating}
                                        >
                                            <span class=" dark:text-principal-light font-bold text-md w-[15px] flex justify-center items-center">
                                                {Math.round(rate.rating)}
                                            </span>
                                            <div
                                                class={`bg-gray-300 ${
                                                    enviroments.TYPE_BORDER ===
                                                    "circle"
                                                        ? "rounded-lg"
                                                        : "rounded-md"
                                                }  overflow-hidden w-full`}
                                            >
                                                <div
                                                    class="bg-primary h-3"
                                                    style={`width: ${rate.percentage}%;`}
                                                />
                                            </div>
                                            <span class=" dark:text-principal-light font-bold text-md w-[60px]">
                                                {Math.round(rate.percentage)}%
                                            </span>
                                        </div>
                                    ))}
                                </div>
                                <br />
                                {authStore.state! ? (
                                    <ProductRatingStore
                                        type={
                                            ProductKeys(false) as
                                                | "ProductsNormals"
                                                | "ProductsRestaurants"
                                                | "ProductsServicios"
                                        }
                                        product={producto}
                                    />
                                ) : null}
                            </div>
                            <br />
                            <div class=" p-1 rounded-md w-full">
                                <ProductsComments
                                    comment_id={
                                        commentID ? Number(commentID) : null
                                    }
                                    type={
                                        ProductKeys(false) as
                                            | "ProductsNormals"
                                            | "ProductsRestaurants"
                                            | "ProductsServicios"
                                    }
                                    product={producto}
                                />
                            </div>
                        </div>
                    </div>

                    <div class="lg:w-[400px]">
                        <TitleSectionTwo>
                            <>Más de {category_name}</>
                        </TitleSectionTwo>
                        <div class="gap-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-1 justify-center  p-2 overflow-y-auto">
                            {categoriesproductsrandom.map((product) => (
                                <ProductCard product={product} key={product.id}>
                                    <ProductCard.header>
                                        <ProductCard.buttons isAbsolute />
                                    </ProductCard.header>
                                    <ProductCard.body showDescription={false} />
                                    <ProductCard.footer showButtonCart />
                                </ProductCard>
                            ))}
                        </div>
                    </div>
                </div>
            </section>
            {productbybrands?.length &&
            (product as ProductsNormalSchemaFromServer).brand?.name ? (
                <section class="max-w-6xl gap-6 mx-auto px-4 my-12">
                    <TitleSectionTwo>
                        <>
                            Más de{" "}
                            {
                                (product as ProductsNormalSchemaFromServer)
                                    .brand.name
                            }
                        </>
                    </TitleSectionTwo>
                    <div class="w-full group">
                        <Slider
                            {...{
                                adaptiveHeight: true,
                                focusOnSelect: true,
                                infinite: true,
                                slidesToShow: 4,
                                slidesToScroll: 1,
                                speed: 500,
                                nextArrow: <SampleNextArrow />,
                                prevArrow: <SamplePrevArrow />,
                                responsive: [
                                    {
                                        breakpoint: 1024,
                                        settings: {
                                            slidesToShow: 3,
                                        },
                                    },
                                    {
                                        breakpoint: 600,
                                        settings: {
                                            slidesToShow: 2,
                                        },
                                    },
                                    {
                                        breakpoint: 480,
                                        settings: {
                                            slidesToShow: 1,
                                        },
                                    },
                                ],
                            }}
                            className="w-full brands-section"
                        >
                            {productbybrands.map((product) => (
                                <ProductCard product={product} key={product.id}>
                                    <ProductCard.header>
                                        <ProductCard.buttons isAbsolute />
                                    </ProductCard.header>
                                    <ProductCard.body showDescription={false} />
                                    <ProductCard.footer showButtonCart />
                                </ProductCard>
                            ))}
                        </Slider>
                        <style jsx>{`
                            .brands-section .slick-slide > div {
                                margin-inline: 8px;
                                outline: none;
                            }
                        `}</style>
                    </div>
                </section>
            ) : (
                <></>
            )}
        </WebLayout>
    );
}
interface VideoProductProps {
    file: string;
}
function VideoProduct({ file }: VideoProductProps) {
    const { state: video, methods, refs } = useVideo();
    return (
        <div class="relative w-full h-full group">
            <div class="absolute top-0 left-0 right-0 bottom-0" />
            {/* biome-ignore lint/a11y/useMediaCaption: <explanation> */}
            <video
                ref={refs.video}
                class="h-full w-full relative object-contain"
                onClick={methods.onHover}
            >
                <source src={file} type="video/mp4" />
                Tu navegador no soporta el tag de video.
            </video>{" "}
            <button
                class={`${
                    video.isHover ? "visible" : "invisible"
                } absolute delay-custom-1 top-[46%] right-[48%] md:top-[45%] md:right-[45%] text-xl md:text-4xl text-white flex justify-center items-center`}
                onClick={methods.onPlayPause}
                type="button"
                aria-label="play video"
            >
                {video.isPlay ? (
                    <i class="fas fa-pause group-hover:opacity-100" />
                ) : (
                    <i class="fas fa-play " />
                )}
            </button>{" "}
            <div
                class={`${
                    video.isHover ? "visible" : "invisible"
                } flex  items-center z-[9] mt-2 absolute bottom-6 right-0 left-0 mx-1`}
            >
                <input
                    type="range"
                    min="0"
                    max="100"
                    value={methods.reproductor.progress} // Progreso del video
                    onChange={methods.reproductor.handleProgressChange} // Cambia la posición del video
                    className="w-full  custom-range" // Estilo para que sea ancho completo
                />
                <style jsx>{`
                    .custom-range::-moz-range-progress {
                        background-color: var(--primary);
                        height: 8px;
                    }
                    /* Color de la barra después del control deslizante */
                    .custom-range::-webkit-slider-thumb {
                        -webkit-appearance: none;
                        appearance: none;
                        width: 16px;
                        height: 16px;
                        background-color: var(--primary);
                        cursor: pointer;
                        border-radius: 50%;
                        position: relative;
                        z-index: 2;
                    }
                `}</style>
                <div class="flex items-center text-xs">
                    <span>
                        {methods.reproductor.formatTime(
                            methods.reproductor.currentTime
                        )}
                    </span>
                    {"/"}
                    <span>
                        {methods.reproductor.formatTime(
                            methods.reproductor.duration
                        )}
                    </span>
                </div>
            </div>
        </div>
    );
}
export default ProductPage;
