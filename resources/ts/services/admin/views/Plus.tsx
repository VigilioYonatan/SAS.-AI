import { storageEmpresa } from "@/empresas/stores/empresa.store";
import AdminBreadCrumb from "../components/AdminBreadCrumb";
import Container from "../components/Container";
import { useSignal } from "@preact/signals";
import {
    vigilioServicesPricingQuery,
    vigilioServicesQuery,
} from "../apis/vigilio-services.api";
import enviroments from "~/config";
import Loading from "../components/Loading";
import View404 from "./404";
import { formatDolares, formatMoney } from "@/cart/libs/helpers";
import { payments } from "../libs";
import { formatDateTwo, NOW, restarDays } from "~/libs/helpers";
import { sweetModal } from "@vigilio/sweet";
import { reactComponent } from "~/libs/preact";
import useDropdown from "~/hooks/useDropdown";
import { preguntasIndexApi } from "@/common/paginator/preguntas.paginator.api";

export type TypePayment =
    | "mensual"
    | "tienda"
    | "facturacion-peru"
    | "telegram"
    | "tokens";
function Plus() {
    const vigilioServices = vigilioServicesQuery();
    const pricing = vigilioServicesPricingQuery();

    let component: JSX.Element | JSX.Element[] | null = null;
    if (pricing.isLoading) {
        component = <Loading />;
    }
    if (pricing.error) {
        component = <View404 message="error" />;
    }
    if (pricing.isSuccess) {
        const price = pricing.data?.country.pricing;

        component = (
            <>
                <div className="p-4 flex flex-col gap-4">
                    <div class="flex gap-2 justify-between">
                        <div />
                        <button
                            type="button"
                            onClick={() => {
                                sweetModal({
                                    html: reactComponent(<Preguntas />),
                                    showCloseButton: true,
                                    isCloseInBackground: false,
                                    sweetWidth: "700px",
                                });
                            }}
                            class=" text-white bg-black font-semibold px-4 py-2 rounded-md shadow text-sm"
                        >
                            Preguntas Frecuentes ¿?
                        </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Tarjeta Grande */}
                        {!storageEmpresa?.payments.tienda.enabled &&
                        storageEmpresa!.tipo_empresa.tipo_servicio_id !== 3 ? (
                            <div className="md:col-span-2 md:w-[400px] mx-auto bg-white dark:bg-admin-background-dark dark:text-white shadow-lg rounded-lg overflow-hidden ">
                                <img
                                    className="w-full h-96 object-cover"
                                    src="/images/settings/others/tienda.jpg"
                                    alt="Producto 1"
                                />
                                <div className="p-6">
                                    <h2 className="text-xl  text-gray-800 font-bold dark:text-white">
                                        Tienda Virtual Con Inteligencia
                                        Artificial
                                    </h2>
                                    <p className="text-gray-600 mt-2 font-bold dark:text-white">
                                        Gratis
                                    </p>
                                    <ul className="mt-4 list-disc font-semibold   pl-5 md:h-[200px] overflow-auto">
                                        {payments.tienda.map((tienda) => (
                                            <li class="text-sm" key={tienda}>
                                                {tienda}
                                            </li>
                                        ))}
                                    </ul>
                                    <a
                                        href={`${
                                            enviroments.VITE_VIGILIO_WEB
                                        }/payment/${
                                            storageEmpresa?.slug
                                        }?type=${"tienda" as TypePayment}`}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="mt-4 bg-primary px-4 py-2 rounded-md text-white font-semibold items-center gap-2 flex justify-center"
                                    >
                                        <i class="fa-regular fa-cart-shopping" />{" "}
                                        {storageEmpresa?.payments.tienda.enabled
                                            ? "Pagado"
                                            : " Realizar Pedido"}
                                    </a>
                                </div>
                            </div>
                        ) : null}

                        {/* Tarjetas Pequeñas */}
                        <ProductCard
                            title="SUSCRIPCIÓN MENSUAL"
                            priceLocal={price!.local.mensual}
                            priceDolar={price!.dolar.mensual}
                            discount={3}
                            imageUrl="/images/settings/others/whatsapp-plus.jpg"
                            link={`${enviroments.VITE_VIGILIO_WEB}/payment/${
                                storageEmpresa?.slug
                            }?type=${"mensual" as TypePayment}`}
                        >
                            {(() => {
                                const isShow = useSignal(false);
                                return (
                                    <div>
                                        <div
                                            className={`mt-4  ${
                                                isShow.value
                                                    ? "max-h-auto delay-custom-1"
                                                    : "max-h-[200px]"
                                            }  overflow-hidden `}
                                        >
                                            <ul className="list-disc font-semibold  pl-5">
                                                {payments.mensual.map(
                                                    (mensual) => (
                                                        <li
                                                            class="text-sm"
                                                            key={mensual}
                                                        >
                                                            {mensual}
                                                        </li>
                                                    )
                                                )}
                                            </ul>
                                        </div>
                                        <button
                                            type="button"
                                            class="font-semibold mt-2 text-xs underline text-primary"
                                            onClick={() => {
                                                isShow.value = !isShow.value;
                                            }}
                                        >
                                            {isShow.value ? (
                                                <>Ocultar</>
                                            ) : (
                                                "Ver más"
                                            )}
                                        </button>
                                    </div>
                                );
                            })()}
                            <div class="flex flex-col  my-2">
                                <span
                                    class={`text-sm font-semibold ${
                                        restarDays(
                                            NOW().toDate(),
                                            storageEmpresa!.payments.mensual
                                                .date as Date,
                                            "day"
                                        ) <= 3
                                            ? "text-danger"
                                            : ""
                                    }`}
                                >
                                    Culmina en{" "}
                                    <b>
                                        {restarDays(
                                            NOW().toDate(),
                                            storageEmpresa!.payments.mensual
                                                .date as Date,
                                            "day"
                                        )}{" "}
                                    </b>
                                    Días
                                </span>
                                <span class="text-sm font-semibold">
                                    {formatDateTwo(
                                        storageEmpresa!.payments.mensual
                                            .date as Date
                                    )}
                                </span>
                            </div>
                        </ProductCard>
                        {price!.local.facturacion ? (
                            <ProductCard
                                title="Sistema de Facturación"
                                priceLocal={price!.local.facturacion!}
                                priceDolar={price!.dolar.facturacion!}
                                discount={3}
                                imageUrl="/images/settings/others/facturacion.jpg"
                                link={`${
                                    enviroments.VITE_VIGILIO_WEB
                                }/payment/${storageEmpresa?.slug}?type=${
                                    "facturacion" as TypePayment
                                }`}
                            >
                                <ul className="mt-4 list-disc font-semibold pl-5">
                                    {payments.facturacion.map((facturacion) => (
                                        <li class="text-sm" key={facturacion}>
                                            {facturacion}
                                        </li>
                                    ))}
                                </ul>
                                <div class="flex flex-col  my-2">
                                    <span
                                        class={`text-sm font-semibold ${
                                            restarDays(
                                                NOW().toDate(),
                                                storageEmpresa!.payments
                                                    .facturacion!.date as Date,
                                                "day"
                                            ) <= 3
                                                ? "text-danger"
                                                : ""
                                        }`}
                                    >
                                        Culmina en{" "}
                                        <b>
                                            {restarDays(
                                                NOW().toDate(),
                                                storageEmpresa!.payments
                                                    .facturacion!.date as Date,
                                                "day"
                                            )}{" "}
                                        </b>
                                        Días
                                    </span>
                                    <span class="text-sm font-semibold">
                                        {formatDateTwo(
                                            storageEmpresa!.payments.mensual
                                                .date as Date
                                        )}
                                    </span>
                                </div>
                            </ProductCard>
                        ) : null}

                        <ProductCard
                            title="Telegram BOT - Inteligencia Artificial"
                            priceLocal={price!.local.telegram!}
                            priceDolar={price!.dolar.telegram!}
                            discount={3}
                            imageUrl="/images/settings/others/telegram.jpg"
                            link={`${enviroments.VITE_VIGILIO_WEB}/payment/${
                                storageEmpresa?.slug
                            }?type=${"telegram" as TypePayment}`}
                        >
                            <ul className="mt-4 list-disc font-semibold pl-5">
                                {payments.telegram.map((telegram) => (
                                    <li class="text-sm" key={telegram}>
                                        {telegram}
                                    </li>
                                ))}
                            </ul>
                            <div class="flex flex-col  my-2">
                                <span
                                    class={`text-sm font-semibold ${
                                        restarDays(
                                            NOW().toDate(),
                                            storageEmpresa!.payments.telegram!
                                                .date as Date,
                                            "day"
                                        ) <= 3
                                            ? "text-danger"
                                            : ""
                                    }`}
                                >
                                    Culmina en{" "}
                                    <b>
                                        {restarDays(
                                            NOW().toDate(),
                                            storageEmpresa!.payments.telegram!
                                                .date as Date,
                                            "day"
                                        )}{" "}
                                    </b>
                                    Días
                                </span>
                                <span class="text-sm font-semibold">
                                    {formatDateTwo(
                                        storageEmpresa!.payments.telegram
                                            .date as Date
                                    )}
                                </span>
                            </div>
                        </ProductCard>
                        <ProductCard
                            isMensual={false}
                            title="10 millones de Tokens"
                            priceLocal={price!.local.tokens!}
                            priceDolar={price!.dolar.tokens!}
                            discount={3}
                            imageUrl="/images/settings/others/tokens.jpg"
                            link={`${enviroments.VITE_VIGILIO_WEB}/payment/${
                                storageEmpresa?.slug
                            }?type=${"tokens" as TypePayment}`}
                        >
                            <span class="font-semibold ">
                                ¿Necesitas mas tokens para el uso de tu
                                inteligencia Aritificial?.
                            </span>
                        </ProductCard>
                    </div>
                </div>
                <div class="mt-4 flex justify-between flex-col md:flex-row">
                    <div>
                        <span class="dark:text-white text-xs">
                            Siguenos en nuestras redes:{" "}
                            {/* <button
                            type="button"
                            class="text-white px-2 py-1 rounded-md bg-black bg-opacity-80 font-bold ml-2"
                            onClick={() => {
                                sweetModal({
                                    html: reactComponent(
                                        <div class="dark:text-white flex flex-col">
                                            <h2 class="text-center">
                                                Siguenos en nuestras redes y
                                                obten premios gratis.
                                            </h2>
                                            <span class="text-primary mb-2 text-lg">
                                                Premios por cada red social
                                                seguido
                                            </span>
                                            <div class="text-sm flex flex-col gap-2">
                                                <span>
                                                    <b>Tokens</b>: +2 millones
                                                    de tokens
                                                </span>
                                            </div>
                                            <Redes
                                                vigilioServices={
                                                    vigilioServices
                                                }
                                            />
                                            <br />
                                            <span class="dark:text-white text-xs text-center">
                                                Enviar captura para verificar y
                                                nombre de tu empresa en nuestro
                                                whatsapp para recibir premios .
                                                .{" "}
                                                <a
                                                    href="https://wa.me/51959884398"
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    class="text-primary ml-2 block"
                                                >
                                                    {" "}
                                                    <i class="fa-brands fa-whatsapp text-2xl" />
                                                </a>
                                            </span>
                                            <br />

                                            <AlertInfo>
                                                Puedes invitar a más amigos para
                                                aumentar tus premios
                                            </AlertInfo>
                                        </div>
                                    ),
                                    showCloseButton: true,
                                });
                            }}
                        >
                            ?
                        </button> */}
                        </span>
                        <Redes vigilioServices={vigilioServices} />
                    </div>
                    <div class="dark:text-white text-xs flex flex-col w-[300px]">
                        <span>
                            <i class="fas fa-user-headset" /> Nosotros te
                            escuchamos:{" "}
                        </span>
                        <span>
                            No dudes en enviarnos tus preguntas y comentarios
                        </span>
                        <span class="font-semibold text-sm">
                            soporte@vigilio-services.com
                        </span>
                    </div>
                </div>
            </>
        );
    }
    return (
        <Container className="p-2 ">
            <div className="flex flex-col gap-4 mx-1">
                <AdminBreadCrumb current="Plus" />
            </div>
            {/* biome-ignore lint/complexity/noUselessFragments: <explanation> */}
            <>{component}</>
        </Container>
    );
}
interface ProductCardProps {
    title: string;
    children: JSX.Element | JSX.Element[];
    imageUrl: string;
    isMensual?: boolean;
    link: string;
    discount: number;
    priceLocal: number;
    priceDolar: number;
}
function ProductCard({
    title,
    children,
    priceDolar,
    priceLocal,
    imageUrl,
    isMensual = true,
    link,
}: ProductCardProps) {
    return (
        <div className="bg-white dark:bg-admin-background-dark dark:text-white shadow-lg rounded-lg overflow-hidden lg:w-[350px] ">
            <img
                className="w-full h-48 object-cover"
                src={imageUrl}
                alt={title}
            />
            <div className="p-6 ">
                <h2 className="text-xl font-semibold text-gray-800 font-bold dark:text-white">
                    {title}
                </h2>
                <p className="text-gray-600 mt-2 font-bold dark:text-white">
                    <span class="font-semibold text-xs f">
                        {isMensual ? "Mensual" : ""}
                    </span>
                    <div class="flex gap-2">
                        {formatDolares(priceDolar)} ó {formatMoney(priceLocal)}{" "}
                    </div>
                </p>
                {children}
                <a
                    href={link}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-4 bg-primary px-4 py-2 rounded-md text-white font-semibold items-center gap-2 flex justify-center"
                >
                    <i class="fa-regular fa-cart-shopping" /> Realizar Pedido
                </a>
            </div>
        </div>
    );
}
interface RedesProps {
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    vigilioServices: any;
}
function Redes({ vigilioServices }: RedesProps) {
    return (
        <div class="dark:text-white flex gap-2 mt-2">
            {vigilioServices.data?.information.facebook ? (
                <a
                    href={vigilioServices.data?.information.facebook}
                    rel="noreferrer"
                    target="_blank"
                >
                    <i class="fa-brands fa-facebook text-xl" />
                </a>
            ) : null}
            {vigilioServices.data?.information.twitter ? (
                <a
                    href={vigilioServices.data?.information.twitter}
                    rel="noreferrer"
                    target="_blank"
                >
                    <i class="fa-brands fa-x-twitter text-xl" />
                </a>
            ) : null}
            {vigilioServices.data?.information.tiktok ? (
                <a
                    href={vigilioServices.data?.information.tiktok}
                    rel="noreferrer"
                    target="_blank"
                >
                    <i class="fa-brands fa-x-twitter text-xl" />
                </a>
            ) : null}
            {vigilioServices.data?.information.instagram ? (
                <a
                    href={vigilioServices.data?.information.instagram}
                    rel="noreferrer"
                    target="_blank"
                >
                    <i class="fa-brands fa-instagram text-xl" />
                </a>
            ) : null}
            {vigilioServices.data?.information.youtube ? (
                <a
                    href={vigilioServices.data?.information.youtube}
                    rel="noreferrer"
                    target="_blank"
                >
                    <i class="fa-brands fa-youtube text-xl" />
                </a>
            ) : null}
            {vigilioServices.data?.information.linkedin ? (
                <a
                    href={vigilioServices.data?.information.linkedin}
                    rel="noreferrer"
                    target="_blank"
                >
                    <i class="fa-brands fa-linkedin text-xl" />
                </a>
            ) : null}
        </div>
    );
}

function Preguntas() {
    const preguntasIndexQuery = preguntasIndexApi();
    let component = null;
    if (preguntasIndexQuery.isLoading) {
    }
    if (preguntasIndexQuery.isSuccess) {
        const data = preguntasIndexQuery.data?.data;
        const vigilioServices = vigilioServicesQuery();

        component = (
            <div>
                <h3 class="font-bold dark:text-white text-md">
                    Preguntas Frecuentes
                </h3>

                <div>
                    {data?.map((pregunta, i) => {
                        const dropdown = useDropdown();

                        return (
                            <div
                                key={pregunta.id}
                                class={`${
                                    dropdown.dropdownOpen
                                        ? "max-h-[800px]"
                                        : "max-h-9 overflow-hidden"
                                }`}
                            >
                                <button
                                    type="button"
                                    class="dark:text-white text-xs flex justify-between w-full items-center py-2 border-b"
                                    onClick={() => dropdown.onOpenClose()}
                                >
                                    <span class="dark:text-secondary-light font-semibold ">
                                        {i}) {pregunta.title}
                                    </span>
                                    <i class="fa-solid fa-caret-down" />
                                </button>
                                <div class="flex gap-2 flex-wrap p-2 ">
                                    <div
                                        dangerouslySetInnerHTML={{
                                            __html: pregunta.description,
                                        }}
                                        class="text-xs dark:text-white"
                                    />
                                </div>
                            </div>
                        );
                    })}
                </div>
                <span class="text-xs dark:text-white mt-2 block">
                    Estamos aquí para ayudarte. Si tienes alguna consulta, no
                    dudes en enviarnos un mensaje a
                    soporte@vigilio-services.com.
                    <br />
                    Se estará actualizando las preguntas frecuentes.
                </span>
                <Redes vigilioServices={vigilioServices} />
            </div>
        );
    }

    return component;
}
export default Plus;
