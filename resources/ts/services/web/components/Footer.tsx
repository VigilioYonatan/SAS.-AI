import {
    libroReclamacionesImage,
    paypalICOImage,
    plinImage,
    VisaMastercardImage,
    yapeImage,
} from "~/config/settings";
import useEmpresastore from "@/empresas/stores/empresa.store";
import type { HeaderType } from "./WebLayout";
import TitleSectionTwo from "./TitleSectionTwo";
import { transferencias } from "@/empresas/libs/helpers";
import { Fragment } from "preact/jsx-runtime";
import { verifyBank } from "@/cart/views/Niubiz";

interface FooterProps {
    categories: HeaderType["categories"];
}
function Footer({ categories }: FooterProps) {
    const empresaStore = useEmpresastore();

    // Lun, Mar,Mier : 08:00 - 22:00
    function agruparHorarios() {
        const grupos: Record<string, string[]> = {};

        for (const { day, openTime, closeTime } of empresaStore.state!
            .schedule) {
            const key = `${openTime} - ${closeTime}`;
            if (!grupos[key]) {
                grupos[key] = [];
            }
            grupos[key].push(day.slice(0, 3));
        }
        return Object.entries(grupos).map(([horas, dias]) => {
            return { days: dias.join(", "), hours: horas };
        });
    }

    return (
        <footer
            class="dark:bg-background-dark  lg:mb-0 bg-background-light mb-[4.5rem]"
            id="footer"
        >
            <div class="max-w-6xl mx-auto px-2 ">
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 py-6">
                    <ul class="">
                        <li class="font-bold">
                            <TitleSectionTwo>Corporación</TitleSectionTwo>
                        </li>
                        <li class="dark:text-gray-400 text-gray-600 hover:text-primary font-semibold dark:hover:text-primary my-2">
                            <a href={"/"}>Inicio</a>
                        </li>
                        <li class="dark:text-gray-400 text-gray-600 hover:text-primary font-semibold dark:hover:text-primary my-2">
                            <a href={"/nosotros"}>Nosotros</a>
                        </li>
                        <li class="dark:text-gray-400 text-gray-600 hover:text-primary font-semibold dark:hover:text-primary my-2">
                            <a href={"/shop"}>Nuestra Tienda</a>
                        </li>
                        <li class="dark:text-gray-400 text-gray-600 hover:text-primary font-semibold dark:hover:text-primary my-2">
                            <a href={"/politica-de-privacidad"}>
                                Politica y privacidad
                            </a>
                        </li>
                        <li class="dark:text-gray-400 text-gray-600 hover:text-primary font-semibold dark:hover:text-primary my-2">
                            <a href={"/terminos-y-condiciones"}>
                                Términos y Condiciones
                            </a>{" "}
                        </li>
                        <li class="dark:text-gray-400 text-gray-600 hover:text-primary font-semibold dark:hover:text-primary my-2">
                            <a href={"/libro-de-reclamaciones"}>
                                Libro de Reclamaciones
                            </a>{" "}
                        </li>
                    </ul>
                    <ul class="max-h-[500px] overflow-auto">
                        <li class="font-bold">
                            <TitleSectionTwo>Shop</TitleSectionTwo>
                        </li>
                        {categories.map((category) => (
                            <li
                                class="dark:text-gray-400 text-gray-600 hover:text-primary font-semibold dark:hover:text-primary my-2"
                                key={category.id}
                            >
                                <a href={`/shop/${category.slug}`}>
                                    {category.name}
                                </a>
                            </li>
                        ))}
                    </ul>
                    <ul class=" flex flex-col gap-2">
                        <li class="font-bold">
                            <TitleSectionTwo>¿Necesitas Ayuda?</TitleSectionTwo>
                        </li>
                        {empresaStore.state!.telephoneFirst ? (
                            <li class="dark:text-gray-400  text-gray-600 font-semibold">
                                📞 +{empresaStore.state!.dial_code}{" "}
                                {empresaStore.state!.telephoneFirst.replace(
                                    /(\d{3})(\d{3})(\d{3})/,
                                    "$1 $2 $3"
                                )}
                            </li>
                        ) : null}
                        {empresaStore.state!.telephoneReclamos ? (
                            <li class="dark:text-gray-400  text-gray-600 font-semibold">
                                📞 +{empresaStore.state!.dial_code}{" "}
                                {empresaStore.state!.telephoneReclamos.replace(
                                    /(\d{3})(\d{3})(\d{3})/,
                                    "$1 $2 $3"
                                )}
                            </li>
                        ) : null}
                        {empresaStore.state!.telephoneThird ? (
                            <li class="dark:text-gray-400  text-gray-600 font-semibold">
                                📞 +{empresaStore.state!.dial_code}{" "}
                                {empresaStore.state!.telephoneThird.replace(
                                    /(\d{3})(\d{3})(\d{3})/,
                                    "$1 $2 $3"
                                )}
                            </li>
                        ) : null}

                        <li class="dark:text-white font-semibold">
                            {empresaStore.state!.address.direccion}
                        </li>
                        <li class="font-bold">
                            <TitleSectionTwo>
                                Horario de atención
                            </TitleSectionTwo>
                        </li>
                        <li>
                            {agruparHorarios().map((horario) => (
                                <div
                                    class="flex gap-2 dark:text-gray-400"
                                    key={horario.days}
                                >
                                    <b class="w-[120px] dark:text-white">
                                        {horario.days}:
                                    </b>
                                    <span class="dark:text-gray-400  text-gray-600 font-semibold">
                                        {horario.hours}
                                    </span>
                                </div>
                            ))}
                        </li>
                    </ul>
                    <ul class=" flex flex-col gap-2">
                        <li class="font-bold">
                            <TitleSectionTwo>Siguenos</TitleSectionTwo>
                        </li>
                        <div class="flex gap-2 items-center">
                            {empresaStore.state!.facebook ? (
                                <i class="fa-brands fa-facebook" />
                            ) : null}
                            {empresaStore.state!.instagram ? (
                                <i class="fa-brands fa-instagram" />
                            ) : null}
                            {empresaStore.state!.tiktok ? (
                                <i class="fa-brands fa-tiktok" />
                            ) : null}
                            {empresaStore.state!.youtube ? (
                                <i class="fa-brands fa-youtube" />
                            ) : null}
                            {empresaStore.state!.twitter ? (
                                <i class="fa-brands fa-twitter" />
                            ) : null}
                        </div>
                        <a href={"/libro-de-reclamaciones"}>
                            <img
                                class="mt-3"
                                src={libroReclamacionesImage()}
                                width={100}
                                height={100}
                                alt="libro de reclamaciones"
                            />
                        </a>
                    </ul>
                </div>
                <div class="h-[1px] w-full bg-primary" />
                <div class="w-full flex justify-between items-center">
                    <span class="text-sm w-[160px]  md:w-[250px] font-semibold text-center dark:text-gray-400">
                        © Todos los derechos Reservados.{" "}
                        {new Date(
                            empresaStore.state!.yearFounded
                        ).getFullYear()}
                        {" - "}
                        {new Date().getFullYear()}
                    </span>
                    <a
                        href="#start"
                        type="button"
                        class="bg-primary py-4 px-6 text-white"
                        aria-label="up"
                    >
                        <i class="fa-solid fa-caret-up" />
                    </a>
                    <div class="flex flex-col">
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
        <div class="flex gap-2 items-center overflow-auto ">
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
                <img src={paypalICOImage()} width={30} height={30} alt="yape" />
            ) : null}
            {empresaStore.state?.metodos_pago.enable_efectivo ? (
                <p class="text-xs  text-center border p-1 rounded-md border-gray-400 text-black dark:text-white">
                    <i class="far fa-handshake" /> Efectivo
                </p>
            ) : null}
            {empresaStore.state!.metodos_pago.transferencias &&
            transferencias(empresaStore.state!.metodos_pago.transferencias) ? (
                <>
                    {empresaStore.state!.bancos.map((bank) => {
                        const tr =
                            empresaStore.state!.metodos_pago.transferencias!;
                        return (
                            <Fragment key={bank.key}>
                                {tr[bank.key as keyof typeof tr] &&
                                verifyBank(tr[bank.key as keyof typeof tr]) ? (
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
    );
}
export default Footer;
