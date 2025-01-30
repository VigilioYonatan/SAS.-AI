import { formatMoney, subtotalIgv } from "@/cart/libs/helpers";
import useEmpresastore, {
    storageEmpresa,
} from "@/empresas/stores/empresa.store";
import useProduct from "@/products/hooks/useProduct";
import { useSignal } from "@preact/signals";
import Slider from "react-slick";
import enviroments, { BASE_URL } from "~/config";
import WebLayout, { type HeaderType } from "@/web/components/WebLayout";
import useThemeStore from "~/stores/theme.store";
import {
    SampleNextArrow,
    SamplePrevArrow,
} from "@/web/components/ArrowsSlider";
import WebBreadCrumb from "@/web/components/WebBreadCrumb";
import useShowImage from "~/hooks/useShowImage";
import TitleSectionTwo from "@/web/components/TitleSectionTwo";
import { MetodosDePago } from "@/web/components/product/ProductView";
import { ProductsServicioSchemaFromServer } from "@/products/schemas/products_servicio.schema";
import { bgPrimaryHover } from "~/config/settings";
import { getParams } from "~/libs/helpers";
import useAuthStore from "@/auth/stores/auth.store";
import ProductsComments from "@/products/components/ProductsComments";
import { ProductKeys } from "@/products/libs/helpers";
import ProductRatingStore from "@/products/components/ProductRatingStore";
import { ServicioCard } from "../home/components/ServiciosSection";
import "quill/dist/quill.snow.css"; // Estilos por defecto de Quill
import QuillText from "~/components/QuillText";

export interface VariantFeature {
    option_id: number;
    id: number;
}
interface ServicioPageProps {
    product: ProductsServicioSchemaFromServer;
    categoriesproductsrandom: ProductsServicioSchemaFromServer[];
    category_name: string;
    header: HeaderType;
    totalcomments: number;
}

function ServicioPage({
    product,
    category_name,
    header,
    totalcomments,
    categoriesproductsrandom,
}: ServicioPageProps) {
    const empresaStore = useEmpresastore();
    const themeStore = useThemeStore();
    const { ShowImage, changeShowImage, state } = useShowImage();
    const { isImagesLength, discount, zoom, images500Variant, producto } =
        useProduct({
            product,
            isService: true,
        });
    const params = getParams();
    const authStore = useAuthStore();
    const commentID = params.get("comment");
    const choose = useSignal<null | { days: number; cantidad: number }>(
        product.days.length ? product.days[0] : null
    );
    const type = useSignal<
        "description" | "characteristics" | "reviews" | "more"
    >(commentID ? "reviews" : "description");
    return (
        <WebLayout header={header}>
            <section class="max-w-6xl gap-6 mx-auto mb-6 mt-20  lg:mt-6 lg:flex-row px-4">
                <div class="my-2 md:my-6 overflow-auto">
                    <WebBreadCrumb
                        current={product.name}
                        uris={[
                            {
                                title: "Tienda",
                                uri: "/shop",
                            },
                        ]}
                    />
                </div>
                <div class="flex gap-6 flex-col md:flex-row  product-card-page p-2 group">
                    <Slider
                        {...{
                            customPaging: (i) => {
                                return (
                                    <div class="w-full h-full dark:bg-paper-dark bg-paper-light">
                                        <img
                                            width={100}
                                            height={100}
                                            class="w-full h-full object-contain"
                                            alt={product.name}
                                            src={isImagesLength[i]}
                                            loading="lazy"
                                        />
                                    </div>
                                );
                            },
                            dots: images500Variant.length > 1,
                            arrows: images500Variant.length > 1,
                            dotsClass: "slick-dots slick-thumb",
                            infinite: false,
                            speed: 500,
                            slidesToShow: 1,
                            slidesToScroll: 1,
                            adaptiveHeight: true,
                            className:
                                "w-full  md:w-7/12 relative self-start group servicio-page-slide",
                            nextArrow: <SampleNextArrow />,
                            prevArrow: <SamplePrevArrow />,
                        }}
                    >
                        {isImagesLength.map((img, i) => (
                            <div
                                class="rounded-md  h-[300px] md:h-[500px]   relative overflow-hidden "
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

                                <img
                                    alt={product.name}
                                    class={`h-full object-contain w-full ${
                                        zoom ? "zoom-image" : ""
                                    }`}
                                    width={800}
                                    height={800}
                                    src={img}
                                    loading="lazy"
                                    style={{
                                        transformOrigin: `${zoom.position.x} ${zoom.position.y}`,
                                    }}
                                />
                            </div>
                        ))}
                    </Slider>
                    <ShowImage length={images500Variant.length}>
                        <Slider
                            className="w-[auto!important] md:!w-[800px] "
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
                            {images500Variant.map((image) => (
                                <div class="h-[800px] w-full" key={image}>
                                    <img
                                        class="w-full h-full object-contain"
                                        src={image}
                                        width={800}
                                        height={800}
                                        alt=""
                                        loading="lazy"
                                    />
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
                    <div class="flex flex-col gap-2 md:w-5/12 mt-8 ">
                        <div class="flex gap-2   dark:text-gray-300 text-xs font-semibold text-gray-400">
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
                            {product.name}
                        </h1>{" "}
                        {product.days.length ? (
                            <div class="flex gap-2 flex-wrap">
                                {product.days.map((day) => (
                                    <button
                                        key={day.days}
                                        class={`shadow font-bold ${
                                            enviroments.TYPE_BORDER === "square"
                                                ? "rounded-sm"
                                                : "rounded-md"
                                        }  flex text-primary py-1  text-sm min-w-[100px] px-2  justify-center items-center  hover:bg-primary ${bgPrimaryHover()} ${
                                            choose.value?.days === day.days
                                                ? "bg-primary text-white border-2 border-primary"
                                                : "bg-white"
                                        }`}
                                        type="button"
                                        aria-label="change day"
                                        onClick={() => {
                                            choose.value = day;
                                        }}
                                    >
                                        {day.name}
                                    </button>
                                ))}
                            </div>
                        ) : (
                            <></>
                        )}
                        <div class="flex flex-col">
                            <div class="flex gap-2">
                                {product.discount > 0 ? (
                                    <span
                                        class="text-sm text-gray-400 line-through"
                                        itemprop={formatMoney(
                                            choose.value
                                                ? subtotalIgv(product, false) *
                                                      4
                                                : subtotalIgv(product, false)
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
                                class="font-bold dark:text-white text-xl"
                                itemprop="price"
                            >
                                {choose.value
                                    ? formatMoney(
                                          subtotalIgv(
                                              product,
                                              true,
                                              discount.value
                                          ) * choose.value.cantidad
                                      )
                                    : formatMoney(
                                          subtotalIgv(
                                              product,
                                              true,
                                              discount.value
                                          )
                                      )}
                            </span>
                        </div>{" "}
                        <a
                            href={`/cart/servicio/${product.slug}`}
                            class="bg-primary w-full py-3 rounded-md text-white font-bold flex justify-center items-center gap-2"
                        >
                            <i class={storageEmpresa?.setting.type_cart} /> Lo
                            quiero
                        </a>
                        <div class="flex  flex-col gap-1">
                            <span class=" dark:text-white text-xs font-bold ">
                                Compartir
                            </span>
                            <div class="flex gap-2 items-center dark:text-white text-primary">
                                <a
                                    target="_self"
                                    rel="noreferrer"
                                    href={`mailto:?subject=${encodeURIComponent(
                                        `Más información de ${product.name}`
                                    )}&amp;body=${BASE_URL}/${product.slug}`}
                                >
                                    <i class="fas fa-envelope" />
                                </a>
                                <a
                                    target="_blank"
                                    rel="noreferrer"
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
                                >
                                    <i class="fab fa-whatsapp" />
                                </a>
                            </div>
                        </div>
                        <MetodosDePago />
                    </div>
                </div>
                <div class="flex flex-col lg:flex-row gap-4 mt-16 ">
                    <div class="flex flex-col gap-8 w-full p-2 rounded-md">
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
                                            ProductKeys(true) as
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
                                        ProductKeys(true) as
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
                        <div class="gap-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-1 justify-center lg:h-[1200px] p-2 overflow-y-auto items-start">
                            {categoriesproductsrandom.map((service) => (
                                <ServicioCard
                                    servicio={service}
                                    key={service.id}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </section>
        </WebLayout>
    );
}

export default ServicioPage;
