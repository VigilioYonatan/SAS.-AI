import { storageEmpresa } from "@/empresas/stores/empresa.store";
import AdminBreadCrumb from "../components/AdminBreadCrumb";
import Container from "../components/Container";
import { useSignal } from "@preact/signals";
import {
    vigilioServicesPricingQuery,
    vigilioServicesQuery,
} from "../apis/vigilio-services.api";
import AlertInfo from "~/components/Alerts/AlertInfo";
import { reactComponent } from "~/libs/preact";
import { sweetModal } from "@vigilio/sweet";
import enviroments from "~/config";
import Loading from "../components/Loading";
import View404 from "./404";
import { formatDolares } from "@/cart/libs/helpers";
import { formatMoney } from "@vigilio/express-core/helpers";

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
                <div className="max-w-3xl w-full p-6 ">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Tarjeta Grande */}
                        <div className="md:col-span-2 md:w-[400px] mx-auto bg-white dark:bg-admin-background-dark dark:text-white shadow-lg rounded-lg overflow-hidden md:h-[800px]">
                            <img
                                className="w-full h-96 object-cover"
                                src="/images/settings/others/tienda.jpg"
                                alt="Producto 1"
                            />
                            <div className="p-6">
                                <h2 className="text-xl  text-gray-800 font-bold dark:text-white">
                                    Tienda Virtual Con Inteligencia Artificial
                                </h2>
                                <p className="text-gray-600 mt-2 font-bold dark:text-white">
                                    Gratis
                                </p>
                                <ul className="mt-4 list-disc font-semibold   pl-5">
                                    <li class="text-sm">
                                        Agregar Categorías, Marcas y Productos.
                                    </li>
                                    <li class="text-sm">
                                        Agregar Cupones de descuento.
                                    </li>
                                    <li class="text-sm">
                                        Carrito de Compra Y Metodos de pagos.
                                    </li>
                                    <li class="text-sm">Gestion de Pedidos.</li>
                                    <li class="text-sm">
                                        Perzonalicación de tu web.
                                    </li>
                                    <li class="text-sm">
                                        Boton de WhatsApp y Chat Inteligencia
                                        Artificial.
                                    </li>
                                    <li class="text-sm">Short Links.</li>
                                    <li class="text-sm">
                                        Reclamaciones, noticia y publicaciónes.
                                    </li>
                                    <li class="text-sm">
                                        Vender en Todo el País (opcional)
                                    </li>
                                    <li class="text-sm">
                                        Multiplataforma - Todos los
                                        dispositivos.
                                    </li>
                                    <li class="text-sm">
                                        Pasarela de Pagos y mucho más...
                                    </li>
                                </ul>
                                <a
                                    href={`${
                                        enviroments.VITE_VIGILIO_WEB
                                    }/payment/${storageEmpresa?.slug}?type=${
                                        "facturacion" as TypePayment
                                    }`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="mt-4 bg-primary px-4 py-2 rounded-md text-white font-semibold items-center gap-2 flex justify-center"
                                >
                                    <i class="fa-regular fa-cart-shopping" />{" "}
                                    Realizar Pedido
                                </a>
                            </div>
                        </div>

                        {/* Tarjetas Pequeñas */}
                        <ProductCard
                            title="PLAN MENSUAL"
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
                                                <li class="text-sm">
                                                    Acceso a la tienda y
                                                    administrador de tu web.
                                                </li>
                                                <li class="text-sm">
                                                    Usuarios ilimitado
                                                </li>
                                                <li class="text-sm">
                                                    Productos ilimitado
                                                </li>
                                                <li class="text-sm">
                                                    Clientes ilimitado
                                                </li>
                                                <li class="text-sm">
                                                    Ventas Local y Delivery.
                                                </li>
                                                <li class="text-sm">
                                                    Notificaciones de tus
                                                    pedidos.
                                                </li>
                                                <li class="text-sm">
                                                    Whatsapp CRM - Enviar
                                                    mensajes másivos.
                                                </li>
                                                {storageEmpresa?.tipo_empresa
                                                    .tipo_servicio_id === 2 ? (
                                                    <li class="text-sm">
                                                        Pisos y Mesas en tiempo
                                                        Real.
                                                    </li>
                                                ) : null}

                                                <li class="text-sm">
                                                    Inteligencia Artificial
                                                    CLAUDE AI Y OPEN AI.
                                                </li>
                                                <li class="text-sm">
                                                    Genera links de Pago
                                                </li>
                                                <li class="text-sm">
                                                    Asistente Artificial -
                                                    Entrenamiento personalizado.
                                                </li>
                                                <li class="text-sm">
                                                    Gestion de ordenes o
                                                    pedidos.
                                                </li>

                                                <li class="text-sm">
                                                    Automatización de Respuestas
                                                    y tareas.
                                                </li>
                                                <li class="text-sm">
                                                    Reconocimiento de Voz
                                                    Whatsapp.
                                                </li>
                                                <li class="text-sm">
                                                    15 millones de tokens para
                                                    el uso de la Inteligencia
                                                    Artificial mensualmente
                                                    GRATIS
                                                </li>
                                                <li class="text-sm">
                                                    Soporte, mantenimiento y
                                                    mucho más..
                                                </li>
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
                        </ProductCard>
                        {price!.local.facturacion ? (
                            <ProductCard
                                title="Sistema de Facturación Sunat"
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
                                    <li class="text-sm">
                                        Acceso al Dashboard de Facturación.
                                    </li>
                                    <li class="text-sm">
                                        Emitir Boleta, Notas, Guías.
                                    </li>
                                    <li class="text-sm">PDF ilimitado</li>
                                    <li class="text-sm">XML ilimitado</li>
                                    <li class="text-sm">CDR ilimitado.</li>
                                    <li class="text-sm">
                                        Soporte y mantenimiento
                                    </li>
                                </ul>
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
                                <li class="text-sm">
                                    Inteligencia Artificial CLAUDE AI Y OPEN AI.
                                </li>
                                <li class="text-sm">
                                    Bot Artificial - Entrenamiento
                                    personalizado.
                                </li>
                                <li class="text-sm">Genera links de Pago</li>
                                <li class="text-sm">
                                    Gestion de ordenes o pedidos.
                                </li>

                                <li class="text-sm">
                                    Automatización de Respuestas y tareas.
                                </li>
                                <li class="text-sm">
                                    Reconocimiento de Voz Whatsapp.
                                </li>
                                <li class="text-sm">
                                    Soporte, mantenimiento y mucho más..
                                </li>
                            </ul>
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
                <div class="mt-4">
                    <span class="dark:text-white text-xs">
                        Siguenos en nuestras redes y obtén regalos gratis{" "}
                        <button
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
                        </button>
                    </span>
                    <Redes vigilioServices={vigilioServices} />
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
                    Realizar Pedido
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
export default Plus;
