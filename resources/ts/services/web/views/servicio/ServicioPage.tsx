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

export interface VariantFeature {
    option_id: number;
    id: number;
}
interface ServicioPageProps {
    product: ProductsServicioSchemaFromServer;
    categoriesproductsrandom: ProductsServicioSchemaFromServer[];
    category_name: string;
    header: HeaderType;
}

function ServicioPage({ product, category_name, header }: ServicioPageProps) {
    const empresaStore = useEmpresastore();
    const themeStore = useThemeStore();
    const { ShowImage, changeShowImage, state } = useShowImage();
    const { isImagesLength, discount, zoom, images500Variant } = useProduct({
        product,
        isService: true,
    });
    const choose = useSignal<null | { days: number; cantidad: number }>(
        product.days.length ? product.days[0] : null
    );

    return (
        <WebLayout header={header}>
            <section class="max-w-6xl gap-6 mx-auto mb-6 mt-28  lg:mt-6 lg:flex-row px-4">
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
                <div class="flex gap-6 flex-col md:flex-row  product-card p-2">
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
                            className: "w-full  md:w-7/12 relative self-start",
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
                        <h3 class="text-primary font-bold dark:text-white line-clamp-2 text-lg">
                            {product.name}
                        </h3>{" "}
                        <div class="">
                            {product.description ? (
                                <>
                                    <div
                                        class={
                                            "h-[200px] delay-custom-1 overflow-auto"
                                        }
                                    >
                                        <div
                                            class="dark:text-secondary-light text-sm font-normal"
                                            dangerouslySetInnerHTML={{
                                                __html: product.description,
                                            }}
                                        />
                                    </div>
                                </>
                            ) : (
                                <p class="dark:text-white text-sm">
                                    {" "}
                                    No hay descripcion
                                </p>
                            )}
                        </div>
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
                                        content={formatMoney(
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
                                class="font-bold dark:text-white text-xl"
                                itemprop="price"
                                content={formatMoney(
                                    subtotalIgv(product, true)
                                )}
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
                <div class="flex flex-col lg:flex-row gap-4 mt-16">
                    <div class="flex flex-col gap-8 w-full">
                        {" "}
                        <div class="w-full">
                            <h2 class="font-bold dark:text-white text-primary ">
                                Características
                            </h2>
                            <div>
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
                                                        class="text-[12px] odd:bg-white dark:odd:bg-background-dark"
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
                        {/* si el usuario esta logueado que pueda loguear */}
                    </div>
                    <div class="lg:w-[400px]">
                        <TitleSectionTwo>
                            <>Más de {category_name}</>
                        </TitleSectionTwo>
                        <div class="gap-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-1 justify-center lg:h-[800px] p-2 overflow-y-auto">
                            {/* {categoriesproductsrandom.map((product) => (
                                <ProductCard product={product} key={product.id}>
                                    <ProductCard.header>
                                        <ProductCard.buttons isAbsolute />
                                    </ProductCard.header>
                                    <ProductCard.body showDescription={false} />
                                    <ProductCard.footer />
                                </ProductCard>
                            ))} */}
                        </div>
                    </div>
                </div>
            </section>
        </WebLayout>
    );
}

export default ServicioPage;
