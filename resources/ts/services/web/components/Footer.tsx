import {
    libroReclamacionesImage,
    paypalICOImage,
    VisaMastercardImage,
    yapeImage,
} from "~/config/settings";
import useEmpresastore, {
    storageEmpresa,
} from "@/empresas/stores/empresa.store";
import type { HeaderType } from "./WebLayout";
import TitleSectionTwo from "./TitleSectionTwo";
import AdminEdit from "./AdminEdit";
import { service } from "../views/home/components/ServiciosSection";
import { isColorLight } from "~/libs/helpers";
import { holidayChristmas } from "./Animations";

interface FooterProps {
    categories: HeaderType["categories"];
    categoriesServices: HeaderType["categoriesServices"];
}
function Footer({ categories, categoriesServices }: FooterProps) {
    const empresaStore = useEmpresastore();

    // Lun, Mar,Mier : 08:00 - 22:00
    function agruparHorarios() {
        const grupos: Record<string, string[]> = {};

        for (const { day, openTime, closeTime, enabled } of empresaStore.state!
            .schedule) {
            const key = `${openTime} ${
                Number.parseInt(openTime.split(":")[0]) < 12 ? "AM" : "PM"
            } - ${closeTime} ${
                Number.parseInt(closeTime.split(":")[0]) < 12 ? "AM" : "PM"
            }`;
            if (!grupos[key]) {
                grupos[key] = [];
            }

            grupos[key].push(enabled ? day.slice(0, 3) : "");
        }

        return Object.entries(grupos).map(([horas, dias]) => {
            return {
                days: dias.join(", "),
                hours: horas,
            };
        });
    }

    return (
        <footer
            class=" lg:mb-0 lg:mt-40  mb-[4.3rem] text-white relative "
            id="footer"
            style={{
                backgroundColor: storageEmpresa?.setting.bg_color_footer,
                color: isColorLight(storageEmpresa!.setting.bg_color_footer)
                    ? "#000000"
                    : "#FFFFFF",
            }}
        >
            <div class="h-[0.5px] bg-gray-300 dark:bg-gray-500 my-2 w-full" />
            <div class="max-w-6xl mx-auto px-2 ">
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 py-6">
                    <ul class="">
                        <li
                            class="font-bold"
                            style={{
                                color: isColorLight(
                                    storageEmpresa!.setting.bg_color_footer
                                )
                                    ? "#000000"
                                    : storageEmpresa?.setting
                                          .bg_color_footer ===
                                      storageEmpresa?.setting.bg_color
                                    ? isColorLight(
                                          storageEmpresa!.setting
                                              .bg_color_footer
                                      )
                                        ? "#000"
                                        : "#fff"
                                    : "var(--primary)",
                            }}
                        >
                            <TitleSectionTwo isFooter>
                                Corporación
                            </TitleSectionTwo>
                        </li>
                        <li class=" text-sm  hover:text-primary font-semibold dark:hover:text-primary my-2 ">
                            <a href={"/"}>Inicio</a>
                        </li>
                        <li class=" text-sm   hover:text-primary font-semibold dark:hover:text-primary my-2">
                            <a href={"/nosotros"}>Nosotros</a>
                        </li>
                        <li class=" text-sm   hover:text-primary font-semibold dark:hover:text-primary my-2">
                            <a href={"/shop"}>Nuestra Tienda</a>
                        </li>
                        <li class=" text-sm   hover:text-primary font-semibold dark:hover:text-primary my-2">
                            <a href={"/politica-de-privacidad"}>
                                Politica y privacidad
                            </a>
                        </li>
                        <li class=" text-sm   hover:text-primary font-semibold dark:hover:text-primary my-2">
                            <a href={"/terminos-y-condiciones"}>
                                Términos y Condiciones
                            </a>{" "}
                        </li>
                        <li class=" text-sm   hover:text-primary font-semibold dark:hover:text-primary my-2">
                            <a href={"/libro-de-reclamaciones"}>
                                Libro de Reclamaciones
                            </a>{" "}
                        </li>
                    </ul>
                    {categories.length ? (
                        <ul class="max-h-[500px] overflow-auto">
                            <li
                                class="font-bold"
                                style={{
                                    color: isColorLight(
                                        storageEmpresa!.setting.bg_color_footer
                                    )
                                        ? "#000000"
                                        : storageEmpresa?.setting
                                              .bg_color_footer ===
                                          storageEmpresa?.setting.bg_color
                                        ? isColorLight(
                                              storageEmpresa!.setting
                                                  .bg_color_footer
                                          )
                                            ? "#000"
                                            : "#fff"
                                        : "var(--primary)",
                                }}
                            >
                                <TitleSectionTwo isFooter>Shop</TitleSectionTwo>
                            </li>
                            {categories.map((category) => (
                                <li
                                    class=" text-sm   hover:text-primary font-semibold dark:hover:text-primary my-2"
                                    key={category.id}
                                >
                                    <a href={`/shop/${category.slug}`}>
                                        {category.name}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    ) : null}
                    {categoriesServices.length ? (
                        <ul class="max-h-[500px] overflow-auto">
                            <li
                                class="font-bold"
                                style={{
                                    color: isColorLight(
                                        storageEmpresa!.setting.bg_color_footer
                                    )
                                        ? "#000000"
                                        : storageEmpresa?.setting
                                              .bg_color_footer ===
                                          storageEmpresa?.setting.bg_color
                                        ? isColorLight(
                                              storageEmpresa!.setting
                                                  .bg_color_footer
                                          )
                                            ? "#000"
                                            : "#fff"
                                        : "var(--primary)",
                                }}
                            >
                                <TitleSectionTwo isFooter>
                                    Nuestros Servicios
                                </TitleSectionTwo>
                            </li>
                            {categoriesServices.map((servicio) => (
                                <li
                                    class=" text-sm   hover:text-primary font-semibold dark:hover:text-primary my-2"
                                    key={servicio.id}
                                >
                                    <button
                                        type="button"
                                        aria-label="change service"
                                        onClick={() => {
                                            service.value = servicio;
                                            const section =
                                                document.getElementById(
                                                    "servicios"
                                                );
                                            section?.scrollIntoView({
                                                behavior: "smooth",
                                            });
                                        }}
                                    >
                                        {servicio.name}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    ) : null}

                    <ul class=" flex flex-col gap-2">
                        <li
                            class="font-bold"
                            style={{
                                color: isColorLight(
                                    storageEmpresa!.setting.bg_color_footer
                                )
                                    ? "#000000"
                                    : storageEmpresa?.setting
                                          .bg_color_footer ===
                                      storageEmpresa?.setting.bg_color
                                    ? isColorLight(
                                          storageEmpresa!.setting
                                              .bg_color_footer
                                      )
                                        ? "#000"
                                        : "#fff"
                                    : "var(--primary)",
                            }}
                        >
                            <TitleSectionTwo isFooter>
                                ¿Necesitas Ayuda?
                            </TitleSectionTwo>
                        </li>
                        {empresaStore.state!.telephoneFirst ? (
                            <li class="dark:text-white font-semibold  text-sm">
                                <i
                                    class={`fa${
                                        storageEmpresa?.setting
                                            .type_icons_bars === "normal"
                                            ? "s"
                                            : "r"
                                    } fa-phone mr-2  text-primary text-xl`}
                                />{" "}
                                +{empresaStore.state!.dial_code}{" "}
                                {empresaStore.state!.telephoneFirst.replace(
                                    /(\d{3})(\d{3})(\d{3})/,
                                    "$1 $2 $3"
                                )}
                            </li>
                        ) : null}
                        {empresaStore.state!.telephoneReclamos ? (
                            <li class=" dark:text-white font-semibold  text-sm">
                                <i
                                    class={`fa${
                                        storageEmpresa?.setting
                                            .type_icons_bars === "normal"
                                            ? "s"
                                            : "r"
                                    } fa-phone mr-2  text-primary text-xl`}
                                />{" "}
                                +{empresaStore.state!.dial_code}{" "}
                                {empresaStore.state!.telephoneReclamos.replace(
                                    /(\d{3})(\d{3})(\d{3})/,
                                    "$1 $2 $3"
                                )}
                            </li>
                        ) : null}
                        {empresaStore.state!.telephoneThird ? (
                            <li class="dark:text-white font-semibold  text-sm">
                                <i
                                    class={`fa${
                                        storageEmpresa?.setting
                                            .type_icons_bars === "normal"
                                            ? "s"
                                            : "r"
                                    } fa-phone mr-2   text-primary text-xl`}
                                />{" "}
                                +{empresaStore.state!.dial_code}{" "}
                                {empresaStore.state!.telephoneThird.replace(
                                    /(\d{3})(\d{3})(\d{3})/,
                                    "$1 $2 $3"
                                )}
                            </li>
                        ) : null}

                        {empresaStore.state!.address.direccion ? (
                            <li class="dark:text-white font-semibold  text-sm">
                                <i
                                    class={`fa${
                                        storageEmpresa?.setting
                                            .type_icons_bars === "normal"
                                            ? "s"
                                            : "r"
                                    } text-primary fa-map-marker-alt  text-xl mr-2`}
                                />{" "}
                                {empresaStore.state!.address.direccion}
                            </li>
                        ) : null}

                        <li
                            class="font-bold"
                            style={{
                                color: isColorLight(
                                    storageEmpresa!.setting.bg_color_footer
                                )
                                    ? "#000000"
                                    : storageEmpresa?.setting
                                          .bg_color_footer ===
                                      storageEmpresa?.setting.bg_color
                                    ? isColorLight(
                                          storageEmpresa!.setting
                                              .bg_color_footer
                                      )
                                        ? "#000"
                                        : "#fff"
                                    : "var(--primary)",
                            }}
                        >
                            <TitleSectionTwo isFooter>
                                Horario de atención
                            </TitleSectionTwo>
                        </li>
                        <li>
                            <div class="flex gap-3 items-center ">
                                <i
                                    class={`fa${
                                        storageEmpresa?.setting
                                            .type_icons_bars === "normal"
                                            ? "s"
                                            : "r"
                                    } fa-alarm-clock  text-primary text-3xl mb-1`}
                                />
                                {agruparHorarios().map((horario) => (
                                    <div
                                        class="flex gap-1   text-sm"
                                        key={horario.days}
                                    >
                                        <b class="w-[100px]  font-bold">
                                            {horario.days}:
                                        </b>
                                        <span class="   font-semibold">
                                            {horario.hours}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </li>
                    </ul>
                    <ul class=" flex flex-col">
                        <li
                            class="font-bold"
                            style={{
                                color: isColorLight(
                                    storageEmpresa!.setting.bg_color_footer
                                )
                                    ? "#000000"
                                    : storageEmpresa?.setting
                                          .bg_color_footer ===
                                      storageEmpresa?.setting.bg_color
                                    ? isColorLight(
                                          storageEmpresa!.setting
                                              .bg_color_footer
                                      )
                                        ? "#000"
                                        : "#fff"
                                    : "var(--primary)",
                            }}
                        >
                            <TitleSectionTwo isFooter>Síguenos</TitleSectionTwo>
                        </li>
                        <li class="flex gap-2 items-center  text-sm">
                            {empresaStore.state!.facebook ? (
                                <a
                                    class="w-[35px] h-[35px] flex justify-center items-center  border rounded-md relative"
                                    href={empresaStore.state!.facebook}
                                    target="_blank"
                                    rel="noreferrer"
                                    aria-label="go our facebook"
                                >
                                    <i class="fa-brands fa-facebook text-xl" />
                                    {holidayChristmas() ? (
                                        <img
                                            class="absolute rotate-[20deg] -top-2 -right-2.5 w-[25px] h-[25px] object-contain"
                                            width={60}
                                            height={60}
                                            src="/images/settings/holidays/christmas.hat2.webp"
                                            alt="hat christmas"
                                            title="hat christmas"
                                        />
                                    ) : null}
                                </a>
                            ) : null}
                            {empresaStore.state!.instagram ? (
                                <a
                                    class="w-[35px] h-[35px] flex justify-center items-center  border rounded-md relative"
                                    href={empresaStore.state!.instagram}
                                    target="_blank"
                                    rel="noreferrer"
                                    aria-label="go our instagram"
                                >
                                    <i class="fa-brands fa-instagram text-xl" />
                                    {holidayChristmas() ? (
                                        <img
                                            class="absolute rotate-[20deg] -top-2 -right-2.5 w-[25px] h-[25px] object-contain"
                                            width={60}
                                            height={60}
                                            src="/images/settings/holidays/christmas.hat2.webp"
                                            alt="hat christmas"
                                            title="hat christmas"
                                        />
                                    ) : null}
                                </a>
                            ) : null}
                            {empresaStore.state!.tiktok ? (
                                <a
                                    class="w-[35px] h-[35px] flex justify-center items-center  border rounded-md relative"
                                    href={empresaStore.state!.tiktok}
                                    target="_blank"
                                    rel="noreferrer"
                                    aria-label="go our tik tok"
                                >
                                    <i class="fa-brands fa-tiktok text-xl" />
                                    {holidayChristmas() ? (
                                        <img
                                            class="absolute rotate-[20deg] -top-2 -right-2.5 w-[25px] h-[25px] object-contain"
                                            width={60}
                                            height={60}
                                            src="/images/settings/holidays/christmas.hat2.webp"
                                            alt="hat christmas"
                                            title="hat christmas"
                                        />
                                    ) : null}
                                </a>
                            ) : null}
                            {empresaStore.state!.youtube ? (
                                <a
                                    class="w-[35px] h-[35px] flex justify-center items-center  border rounded-md relative"
                                    href={empresaStore.state!.youtube}
                                    target="_blank"
                                    rel="noreferrer"
                                    aria-label="go our youtube"
                                >
                                    <i class="fa-brands fa-youtube text-xl" />{" "}
                                    {holidayChristmas() ? (
                                        <img
                                            class="absolute rotate-[20deg] -top-2 -right-2.5 w-[25px] h-[25px] object-contain"
                                            width={60}
                                            height={60}
                                            src="/images/settings/holidays/christmas.hat2.webp"
                                            alt="hat christmas"
                                            title="hat christmas"
                                        />
                                    ) : null}
                                </a>
                            ) : null}
                            {empresaStore.state!.twitter ? (
                                <a
                                    class="w-[35px] h-[35px] flex justify-center items-center  border rounded-md relative"
                                    href={empresaStore.state!.twitter}
                                    target="_blank"
                                    aria-label="go our twitter"
                                    rel="noreferrer"
                                >
                                    <i class="fa-brands fa-twitter text-xl" />{" "}
                                    {holidayChristmas() ? (
                                        <img
                                            class="absolute rotate-[20deg] -top-2 -right-2.5 w-[25px] h-[25px] object-contain"
                                            width={60}
                                            height={60}
                                            src="/images/settings/holidays/christmas.hat2.webp"
                                            alt="hat christmas"
                                            title="hat christmas"
                                        />
                                    ) : null}
                                </a>
                            ) : null}
                        </li>
                        <li class="mt-2">
                            <a href={"/libro-de-reclamaciones"}>
                                <img
                                    class="mt-3"
                                    src={libroReclamacionesImage()}
                                    width={100}
                                    height={100}
                                    title="libro de reclamaciones"
                                    alt="libro de reclamaciones"
                                />
                            </a>
                        </li>
                    </ul>
                </div>
                <div class="h-[1px] w-full bg-primary" />
                <div class="w-full flex justify-between items-center  gap-2">
                    <span class="text-sm w-[160px]  md:w-[250px] font-semibold text-center flex flex-col">
                        <span>
                            © Todos los derechos Reservados.{" "}
                            <b
                                class=" font-bold"
                                style={{
                                    color:
                                        storageEmpresa?.setting
                                            .bg_color_footer !==
                                        storageEmpresa?.setting.bg_color
                                            ? storageEmpresa?.setting.bg_color
                                            : isColorLight(
                                                  storageEmpresa!.setting
                                                      .bg_color_footer
                                              )
                                            ? "#000"
                                            : "#fff",
                                }}
                            >
                                {storageEmpresa?.name_empresa}{" "}
                                <span>
                                    {new Date(
                                        empresaStore.state!.yearFounded
                                    ).getFullYear()}
                                    {" - "}
                                    {new Date().getFullYear()}
                                </span>
                            </b>
                        </span>
                    </span>
                    <a
                        href="#start"
                        type="button"
                        class="bg-primary py-4 px-6 text-white  hidden md:block  self-start md:self-start"
                        aria-label="up"
                    >
                        <i class="fa-solid fa-caret-up" />
                    </a>
                    <div class="flex flex-col grayscale">
                        <MetodosDePago />
                    </div>
                </div>
            </div>
        </footer>
    );
}
function MetodosDePago() {
    const empresaStore = useEmpresastore();

    return (
        <div class="flex gap-2 items-center overflow-auto  relative">
            <AdminEdit uri="/admin/payment" isLeft={false} />
            {empresaStore.state?.metodos_pago.mercado_pago.enabled ? (
                <img
                    src={VisaMastercardImage()}
                    width={80}
                    height={80}
                    alt="visa"
                    title="visa"
                    class="w-[60px] md:w-[80px]"
                />
            ) : null}
            {empresaStore.state?.metodos_pago.qrYape ? (
                <img
                    src={yapeImage()}
                    class="w-[20px] md:w-[30px]"
                    width={30}
                    height={30}
                    alt="yape"
                    title="yape"
                />
            ) : null}

            {empresaStore.state?.metodos_pago.paypal.enabled ? (
                <img
                    src={paypalICOImage()}
                    class="w-[20px] md:w-[30px]"
                    width={30}
                    height={30}
                    alt="paypal"
                    title="paypal"
                />
            ) : null}
            {empresaStore.state?.metodos_pago.enable_efectivo ? (
                <p
                    class={`text-xs  text-center border p-1 rounded-md ${
                        storageEmpresa?.setting.bg_color !==
                        storageEmpresa?.setting.bg_color_footer
                            ? "border-primary"
                            : isColorLight(
                                  storageEmpresa!.setting.bg_color_footer
                              )
                            ? "border-black text-black "
                            : "border-white text-white"
                    }   dark:text-white`}
                >
                    <i class="far fa-handshake" /> Efectivo
                </p>
            ) : null}
        </div>
    );
}
export default Footer;
