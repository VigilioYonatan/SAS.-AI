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
import {
    formatDateTwo,
    NOW,
    restarDays,
    showTime,
    TimePeru,
} from "~/libs/helpers";
import { sweetModal } from "@vigilio/sweet";
import { reactComponent } from "~/libs/preact";
import useDropdown from "~/hooks/useDropdown";
import { preguntasIndexApi } from "@/common/paginator/preguntas.paginator.api";
import VigilioTable from "~/components/table";
import { useEffect } from "preact/hooks";
import usePaginatorTimer, { TimeTable } from "~/hooks/usePaginatorTimer";
import { UseTable, useTable } from "@vigilio/preact-table";
import { useQuery } from "@vigilio/preact-fetching";
import { colorByOrdersId } from "@/orders/libs";
import { PdfImage } from "~/config/settings";
import LoaderSubmit from "~/components/LoaderSubmit";
export type TypePayment =
    | "mensual"
    | "tienda"
    | "facturacion-peru"
    | "telegram"
    | "tokens"
    | "finanza"
    | "email";
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
                        <div class="flex gap-2 items-center">
                            <button
                                type="button"
                                onClick={() => {
                                    sweetModal({
                                        html: reactComponent(
                                            <FacturacionClient />
                                        ),
                                        showCloseButton: true,
                                        isCloseInBackground: false,
                                        sweetWidth: "700px",
                                    });
                                }}
                                class=" text-white bg-black font-semibold px-4 py-2 rounded-md shadow text-sm"
                            >
                                Facturación
                            </button>
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
                            title="Suscripción Normal I.A"
                            priceLocal={price!.local.mensual}
                            priceDolar={price!.dolar.mensual}
                            ico={
                                <p class="dark:text-gray-300 text-gray-700 text-base flex  flex-wrap gap-2 self-start  mb-3">
                                    <i class="fa-brands fa-whatsapp text-4xl" />
                                    <i class="fa-brands fa-telegram  text-4xl" />
                                    <i class="fas fa-globe  text-4xl" />
                                </p>
                            }
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
                                ico={
                                    <p class="dark:text-gray-300 text-gray-700 text-base flex  flex-wrap gap-2 self-start  mb-3">
                                        <i class="fas fa-file-invoice  text-4xl" />
                                    </p>
                                }
                                link={`${
                                    enviroments.VITE_VIGILIO_WEB
                                }/payment/${storageEmpresa?.slug}?type=${
                                    "facturacion" as TypePayment
                                }`}
                            >
                                <ul className="mt-4 list-disc font-semibold pl-5 h-[220px]">
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
                        {/* redes */}
                        <div className="bg-white dark:bg-admin-background-dark p-6  dark:text-white shadow-lg rounded-lg overflow-hidden lg:w-[350px] ">
                            <p class=" dark:text-gray-300 text-gray-700  flex  flex-wrap gap-2 self-start  mb-3 text-ellipsis text-4xl">
                                <i class="fa-brands fa-facebook-messenger" />
                                <i class="fa-brands fa-instagram" />
                                <i class="fa-brands fa-tiktok" />
                                <i class="fas fa-phone-volume text-3xl" />
                            </p>
                            <div className="">
                                <h2 className="text-xl font-semibold text-gray-800 font-bold dark:text-white">
                                    Suscripción Redes Sociales I.A
                                </h2>
                                <p className="text-gray-600 mt-2 font-bold dark:text-white">
                                    Muy Pronto
                                </p>
                                <ul className="mt-4 list-disc font-semibold pl-5">
                                    {payments.redes.map((red) => (
                                        <li class="text-sm" key={red}>
                                            {red}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                        {/* end redes */}
                        <ProductCard
                            isMensual={false}
                            title="10 millones de Tokens I.A"
                            priceLocal={price!.local.tokens!}
                            priceDolar={price!.dolar.tokens!}
                            ico={
                                <p class="dark:text-gray-300 text-gray-700 text-base flex  flex-wrap gap-2 self-start  mb-3">
                                    <i class="far fa-microchip text-4xl" />
                                </p>
                            }
                            link={`${enviroments.VITE_VIGILIO_WEB}/payment/${
                                storageEmpresa?.slug
                            }?type=${"finanza" as TypePayment}`}
                        >
                            <span class="font-semibold block h-[300px] ">
                                <span
                                    class={`${
                                        storageEmpresa!.payments.tokens.tokens <
                                        100000
                                            ? "text-danger"
                                            : ""
                                    } font-semibold text-xs`}
                                >
                                    Quedan{" "}
                                    {storageEmpresa?.payments.tokens.tokens}{" "}
                                    tokens
                                </span>
                                <br />
                                <br />
                                ¿Necesitas mas tokens para el uso de tu
                                inteligencia Aritificial?.
                            </span>
                        </ProductCard>
                        {!storageEmpresa?.enabled_zoho_mail ? (
                            <ProductCard
                                isMensual={false}
                                title="Email Empresarial"
                                priceLocal={price!.local.email!}
                                priceDolar={price!.dolar.email!}
                                ico={
                                    <p class="dark:text-gray-300 text-gray-700 text-base flex  flex-wrap gap-2 self-start  mb-3">
                                        <i class="fas fa-envelope-open text-3xl" />
                                    </p>
                                }
                                link={`${
                                    enviroments.VITE_VIGILIO_WEB
                                }/payment/${storageEmpresa?.slug}?type=${
                                    "email" as TypePayment
                                }`}
                            >
                                <span class="">
                                    Envia correos electrónicos a clientes y
                                    manejar correos corporativos con dominio
                                    personalizado, ideal para mejorar la
                                    comunicación empresarial. Ofrece integración
                                    para automatizar y personalizar mensajes.
                                    Esta solución es perfecta para empresas que
                                    buscan profesionalizar su comunicación y
                                    optimizar su marketing por correo
                                    electrónico.
                                </span>
                                <p class="text-center text-xs text-primary">
                                    Enviár mensaje a la empresa por correo
                                    electrónico{" "}
                                    <a
                                        href={enviroments.VITE_VIGILIO_WEB}
                                        target="_blank"
                                        rel="noreferrer"
                                    >
                                        Vigilio Services{" "}
                                    </a>
                                    para la instalación, si se realizó el pedido
                                    correctamente.{" "}
                                </p>
                            </ProductCard>
                        ) : null}

                        <ProductCard
                            isMensual={false}
                            title="Sistema de Finanzas"
                            priceLocal={0}
                            priceDolar={0}
                            ico={
                                <p class="dark:text-gray-300 text-gray-700 text-base flex  flex-wrap gap-2 self-start  mb-3">
                                    <i class="far fa-sack-dollar text-4xl" />
                                </p>
                            }
                            link={`${enviroments.VITE_VIGILIO_WEB}/payment/${
                                storageEmpresa?.slug
                            }?type=${"finanza" as TypePayment}`}
                        >
                            <span class="text-success font-semibold">
                                Se desbloqueará en{" "}
                                {restarDays(
                                    NOW().toDate(),
                                    TimePeru(
                                        storageEmpresa!.createdAt as Date
                                    ).add(31, "days"),
                                    "days"
                                )}{" "}
                                dias
                            </span>
                            <br />
                            <span class="font-semibold ">
                                Una herramienta intuitiva para gestionar tus
                                finanzas. Permite agregar y clasificar
                                fácilmente tus ingresos y egresos,
                                proporcionando una visión clara de tu situación
                                financiera. Con gráficos y reportes detallados,
                                podrás analizar tus gastos, establecer
                                presupuestos, y tomar decisiones informadas para
                                mejorar tu salud financiera. Ideal para llevar
                                un control preciso de tus finanzas personales y
                                lograr tus objetivos económicos.
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
    ico: JSX.Element | JSX.Element[];
    isMensual?: boolean;
    link: string;
    priceLocal: number;
    priceDolar: number;
}
function ProductCard({
    title,
    children,
    priceDolar,
    priceLocal,
    ico,
    isMensual = true,
    link,
}: ProductCardProps) {
    return (
        <div className="bg-white dark:bg-admin-background-dark p-6  dark:text-white shadow-lg rounded-lg overflow-hidden lg:w-[350px] ">
            {ico}
            <div className="">
                <h2 className="text-xl font-semibold text-gray-800 font-bold dark:text-white">
                    {title}
                </h2>
                <p className="text-gray-600 mt-2 font-bold dark:text-white">
                    <span class="font-semibold text-xs f">
                        {isMensual ? "Mensual" : ""}
                    </span>
                    <div class="flex gap-2">
                        {priceDolar === 0
                            ? "GRATIS"
                            : formatDolares(priceDolar)}{" "}
                        ó{" "}
                        {priceLocal === 0 ? "GRATIS" : formatMoney(priceLocal)}
                    </div>
                </p>
                {children}
                {title === "Sistema de Finanzas" &&
                restarDays(
                    NOW().toDate(),
                    TimePeru(storageEmpresa!.createdAt as Date).toDate(),
                    "days"
                ) < 31 ? null : (
                    <a
                        href={link}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-4 bg-primary px-4 py-2 rounded-md text-white font-semibold items-center gap-2 flex justify-center"
                    >
                        <i class="fa-regular fa-cart-shopping" /> Realizar
                        Pedido
                    </a>
                )}
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
export function ordersPaginatorApi(
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    table: UseTable<any, "actions">,
    time: TimeTable
) {
    const result = useQuery(
        "/paginator/facturación_saas",
        async (url) => {
            const data = new URLSearchParams();
            data.append("empresa_id", String(storageEmpresa!.id));
            data.append("offset", String(table.pagination.value.offset));
            data.append("limit", String(table.pagination.value.limit));
            data.append("search", String(table.search.value));
            data.append("time", time);
            if (!Object.keys(table.sort.value).length) {
                data.append("id", "DESC");
            }
            for (const [key, value] of Object.entries(table.sort.value)) {
                data.append(key, value as string);
            }
            const response = await fetch(
                `${enviroments.VITE_VIGILIO_WEB}/api${url}?${data}`
            );
            const result = await response.json();
            if (!result.success) throw result;
            return result;
        },
        {
            onSuccess(data) {
                table.updateData({
                    count: data.count,
                    methods: { refetch: result.refetch },
                    result: data.results,
                });
            },
            refetchOnReconnect: true,
            clean: false,
        }
    );
    return result;
}
export function FacturacionClient() {
    const { time, SelectTimer } = usePaginatorTimer();
    const tableLocal = useTable({
        columns: [
            { key: "id", isSort: true },
            { key: "order_code", header: "código" },
            {
                key: "pedido",
                cell: (props) =>
                    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
                    (props as any).details_orders_saas[0].type,
            },
            {
                key: "status_order_id",
                header: "estado",
                cell: (props) => {
                    return (
                        <div
                            class={`${colorByOrdersId(
                                props.status_order_id
                            )} py-1 px-2 rounded-md text-white text-xs font-semibold`}
                        >
                            {/* biome-ignore lint/suspicious/noExplicitAny: <explanation> */}
                            {(props as any).status_order.name}
                        </div>
                    );
                },
                isSort: true,
            },
            {
                key: "pay_method_id",
                header: "Metódo de pago",
                cell: (props) => (
                    <span class="mx-auto">
                        {/* biome-ignore lint/suspicious/noExplicitAny: <explanation> */}
                        {(props as any).pay_method.name}
                    </span>
                ),
            },
            {
                key: "total",
                cell: (props) => {
                    return (
                        <div class="relative">
                            <span class="font-bold">
                                {/* biome-ignore lint/suspicious/noExplicitAny: <explanation> */}
                                {(props as any).moneyChange === 1 ? (
                                    formatMoney(props.total)
                                ) : (
                                    <>
                                        {formatMoney(props.total)} -{" "}
                                        <span class="text-xs">
                                            {formatDolares(
                                                props.total *
                                                    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
                                                    (props as any).moneyChange
                                            )}
                                        </span>
                                    </>
                                )}
                            </span>
                        </div>
                    );
                },
                isSort: true,
            },
            {
                key: "createdAt",
                header: "Fecha",
                cell: (props) => <div>{showTime(props.createdAt)}</div>,
                isSort: true,
            },
            {
                key: "actions",
                header: "Facturación",
                cell: (props) => {
                    const ordersPDFQuery = useQuery<Blob, OrdersPDFErrorAPI>(
                        `/orders/${props.order_code}/pdf?type=${
                            // biome-ignore lint/suspicious/noExplicitAny: <explanation>
                            (props as any).note ? "note" : "invoice"
                        }`,
                        async (url) => {
                            const response = await fetch(
                                `${enviroments.VITE_VIGILIO_WEB}/api${url}`
                            );
                            const result = await response.blob();
                            return result;
                        }
                    );

                    interface OrdersPDFErrorAPI {
                        success: boolean;
                        message: string;
                    }
                    let component = null;
                    if (ordersPDFQuery.isLoading) {
                        component = <LoaderSubmit />;
                    }
                    if (ordersPDFQuery.isSuccess) {
                        const pdf = URL.createObjectURL(ordersPDFQuery.data!);
                        const nameFile = `${props.order_code}-${
                            // biome-ignore lint/suspicious/noExplicitAny: <explanation>
                            (props as any).note
                                ? "note"
                                : // biome-ignore lint/suspicious/noExplicitAny: <explanation>
                                (props as any).invoice?.kind_invoice_code ===
                                  "01"
                                ? "Factura"
                                : "Boleta"
                        }`;
                        component = (
                            <div
                                class="flex gap-2 items-center justify-center z-10"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <a href={pdf} download={nameFile}>
                                    <img
                                        src={PdfImage()}
                                        class={`object-cover ${
                                            // biome-ignore lint/suspicious/noExplicitAny: <explanation>
                                            !(props as any).invoice
                                                ? "grayscale"
                                                : ""
                                        }`}
                                        width={40}
                                        height={100}
                                        alt="pdf"
                                    />
                                </a>
                            </div>
                        );
                    }

                    return component;
                },
            },
        ],
        pagination: { limit: 10 },
    });

    const ordersLocalsPaginatorQuery = ordersPaginatorApi(
        // biome-ignore lint/suspicious/noExplicitAny: <explanation>
        tableLocal as any,
        time
    );

    useEffect(() => {
        // cuando cambie el time en el select. hacer peticion
        ordersLocalsPaginatorQuery.refetch(false);
    }, [time]);

    return (
        <Container className="p-2 ">
            <div class="overflow-auto">
                <VigilioTable
                    query={ordersLocalsPaginatorQuery}
                    table={tableLocal}
                >
                    <VigilioTable.header className="flex justify-center md:justify-between items-center mb-3  flex-wrap gap-2">
                        <SelectTimer />
                        <div className="flex items-center gap-1">
                            <VigilioTable.header.limit />
                            <VigilioTable.header.refetch />
                        </div>
                    </VigilioTable.header>
                    <VigilioTable.table>
                        <VigilioTable.thead>
                            <VigilioTable.thead.row>
                                <VigilioTable.thead.th />
                            </VigilioTable.thead.row>
                        </VigilioTable.thead>
                        <VigilioTable.tbody>
                            <VigilioTable.tbody.row>
                                {(data) => (
                                    <VigilioTable.tbody.td data={data} />
                                )}
                            </VigilioTable.tbody.row>
                        </VigilioTable.tbody>
                    </VigilioTable.table>
                    <VigilioTable.footer>
                        <div className="flex justify-center flex-col items-center gap-2">
                            <VigilioTable.footer.paginator />
                            <VigilioTable.footer.show />
                        </div>
                    </VigilioTable.footer>
                </VigilioTable>
            </div>
        </Container>
    );
}
export default Plus;
