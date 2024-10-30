import { formatMoney, subtotalIgv } from "@/cart/libs/helpers";
import { storageEmpresa } from "@/empresas/stores/empresa.store";
import { printImagesProduct } from "@/products/libs/helpers";
import TitleSection from "@/web/components/TitleSection";
import { HeaderType } from "@/web/components/WebLayout";
import { signal } from "@preact/signals";
import { useEffect } from "preact/hooks";
import enviroments from "~/config";
import { NoImage } from "~/config/settings";
import { printFileWithDimension } from "~/libs/upload";

interface serviciosSectionProps {
    servicios: HeaderType["categoriesServices"];
}
export const service = signal<null | HeaderType["categoriesServices"][0]>();
function ServiciosSection({ servicios }: serviciosSectionProps) {
    if (!servicios.length) return null;
    useEffect(() => {
        service.value = servicios[0];
    }, []);
    return (
        <section
            class="max-w-6xl mx-auto  px-4 flex flex-col gap-4 my-12 "
            data-aos={`${
                storageEmpresa?.setting.isScrolling ? "fade-up" : ""
            } `}
            id="servicios"
        >
            <TitleSection>Nuestros Servicios</TitleSection>
            <div class="flex flex-col gap-6">
                <div class="w-full flex flex-col md:flex-row gap-3 max-h-[400px] overflow-auto">
                    <div
                        class={`md:w-[300px] flex flex-col gap-1 dark:bg-background-dark bg-white p-2 rounded-md ${
                            enviroments.TYPE_BORDER === "square"
                                ? ""
                                : "rounded-md overflow-hidden"
                        }`}
                    >
                        {servicios.map((servicio) => (
                            <button
                                type="button"
                                aria-label="change servicio"
                                onClick={() => {
                                    service.value = servicio;
                                }}
                                class={`dark:text-white font-semibold text-sm py-3 hover:bg-primary px-2 ${
                                    service.value?.id === servicio.id
                                        ? "bg-primary text-white"
                                        : ""
                                } flex items-center hover:text-white gap-2 rounded-md`}
                                key={servicio.id}
                            >
                                {servicio.icon ? (
                                    <div
                                        dangerouslySetInnerHTML={{
                                            __html: servicio.icon,
                                        }}
                                    />
                                ) : null}

                                <span>{servicio.name}</span>
                            </button>
                        ))}
                    </div>{" "}
                    <div
                        class={`w-full ${
                            enviroments.TYPE_BORDER === "square"
                                ? ""
                                : "rounded-md overflow-hidden"
                        } group shadow-md`}
                    >
                        <img
                            class="w-full h-full object-cover group-hover:scale-110 delay-custom-1 shadow-md"
                            width={800}
                            height={800}
                            src={
                                service.value?.image
                                    ? printFileWithDimension(
                                          service.value.image,
                                          800
                                      )[0]
                                    : NoImage()
                            }
                            alt={service.value?.name}
                        />
                    </div>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {service.value?.products.map((servicio) => (
                        <div
                            class={`dark:bg-background-dark bg-background-light ${
                                enviroments.TYPE_BORDER === "square"
                                    ? ""
                                    : "rounded-md overflow-hidden"
                            }   shadow-md w-full `}
                            key={servicio.id}
                        >
                            <div class="group overflow-hidden">
                                <img
                                    src={printImagesProduct(servicio.images)[0]}
                                    class={`w-full   mx-auto group-hover:scale-105 delay-custom-1 h-[180px] md:h-[250px] ${
                                        storageEmpresa?.setting.isCoverImage
                                            ? "object-cover"
                                            : "object-contain"
                                    } group-hover:scale-110`}
                                    width={500}
                                    height={500}
                                    alt={servicio.name}
                                />
                            </div>
                            <div class="flex flex-col gap-2 justify-center pt-2">
                                <a
                                    href={`/servicio/${servicio.slug}`}
                                    class="line-clamp-2 text-sm   md:text-base font-semibold dark:text-white hover:text-primary dark:hover:text-primary delay-custom-1  text-center h-[38px]"
                                >
                                    {servicio.name}
                                </a>
                                <div class="flex justify-center items-center">
                                    {servicio.discount > 0 ? (
                                        <span class="text-gray-400 line-through   font-semibold   text-xs  text-center  h-[15px]">
                                            {formatMoney(
                                                subtotalIgv(servicio, false)
                                            )}
                                        </span>
                                    ) : null}
                                    <p class="text-primary dark:text-white text-lg font-bold   leading-tight">
                                        {formatMoney(subtotalIgv(servicio))}
                                    </p>
                                </div>
                                <a
                                    href={`/cart/servicio/${servicio.slug}`}
                                    class="bg-primary
                         text-white font-bold gap-2 uppercase py-3 px-4 tracking-widest text-sm text-center w-full flex justify-center items-center"
                                >
                                    <i
                                        class={
                                            storageEmpresa?.setting.type_cart
                                        }
                                    />
                                    {"  "}
                                    Adquirir
                                </a>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

export default ServiciosSection;
