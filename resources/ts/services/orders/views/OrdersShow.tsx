import { ordersShowApi } from "../apis/orders.show.api";
import { showTime, TimePeru } from "~/libs/helpers";
import { printFileUser } from "@/users/libs/helpers";
import View404 from "@/admin/views/404";
import Loading from "@/admin/components/Loading";
import AdminBreadCrumb from "@/admin/components/AdminBreadCrumb";
import OrderFormUpdate from "../components/OrderFormUpdate";
import Invoice from "../components/Invoice";
import Note from "../components/Note";
import Container from "@/admin/components/Container";
import { sweetAlert, sweetModal } from "@vigilio/sweet";
import { reactComponent } from "~/libs/preact";
import { payMethodIcon } from "../libs";
import useCopyToClipboard from "~/hooks/useCopyToClipboard";
import { printFileWithDimension } from "~/libs/upload";
import Guide from "../components/Guide";
import MapValue, { typeMap } from "~/components/MapValue";
import { storageEmpresa } from "@/empresas/stores/empresa.store";
import Recibo from "../components/Ticket";
import { HelperPDF } from "../hooks/usePdfInvoice";
import { formatMoney } from "@vigilio/express-core/helpers";
import { formatDolares } from "@/cart/libs/helpers";
import { typeFiscal } from "@/empresas/libs/helpers";

interface OrdersShowProps {
    params: { order_code?: string };
    refetch?: (clean?: boolean) => void;
}
function OrdersShow({ params: { order_code }, refetch }: OrdersShowProps) {
    const ordersShowQuery = ordersShowApi(order_code!);
    let component = null;

    if (ordersShowQuery.isLoading) {
        component = <Loading />;
    }
    if (ordersShowQuery.isError) {
        component = (
            <View404 message={`No se encontró un orden ${order_code}`} />
        );
    }
    if (ordersShowQuery.isSuccess && ordersShowQuery.data) {
        const order = ordersShowQuery.data.order;

        component = (
            <Container className="p-2">
                <div className=" flex flex-col gap-4 self-start">
                    <AdminBreadCrumb
                        uris={[{ title: "orders", uri: "/orders" }]}
                        current={String(order.id)}
                    />
                </div>
                <div className="flex gap-4 flex-col text-start p-2">
                    <div className="flex  flex-wrap justify-center  font-semibold ">
                        <div class="flex gap-2 w-full">
                            <div class="flex gap-1 flex-col mb-3  py-2  flex-1  p-2">
                                <span class="text-primary dark:text-terciary font-bold">
                                    ID:
                                </span>
                                <span class="dark:text-secondary-light text-secondary-dark tracking-wide">
                                    {order.id}
                                </span>
                            </div>
                            <div class="flex gap-1 flex-col mb-3  py-2 flex-1  p-2">
                                <span class="text-primary dark:text-terciary font-bold">
                                    Código:
                                </span>
                                <div class="flex gap-2 items-center">
                                    <span class="text-sm dark:text-white">
                                        <i
                                            class={`fas  text-xl ${
                                                !order.isDelivery
                                                    ? "fa-store"
                                                    : " fa-motorcycle"
                                            }`}
                                        />
                                    </span>
                                    <span class="dark:text-secondary-light text-secondary-dark tracking-wide text-xs lg:text-base">
                                        {order.order_code}
                                    </span>
                                    <button
                                        type="button"
                                        class="self-start ml-2 text-xs text-white bg-primary px-3 py-2 rounded-md relative"
                                        onClick={() => {
                                            const printWindow = window.open(
                                                "",
                                                "",
                                                "height=150,width=220"
                                            )!;
                                            printWindow.document.write(
                                                '<html lang="es"><head>'
                                            );
                                            printWindow.document.write(
                                                '<meta charset="UTF-8" />'
                                            );
                                            printWindow.document.write(
                                                '<meta name="viewport" content="width=device-width, initial-scale=1.0" />'
                                            );
                                            printWindow.document.write(
                                                "<title>Ticket PDF</title>"
                                            );
                                            printWindow.document.write(
                                                "<style>*{margin:0;}.flex{display:flex;}.justify-center{justify-content:center;}.items-center{align-items:center;}.relative{position:relative;}.flex-col{flex-direction:column;}.gap-2{gap:0.3rem;}.dark\\:text-white{color:white;}.text-black{color:black;}.text-3xl{font-size:1.875rem;}.font-bold{font-weight:bold;}.absolute{position:absolute;}.bottom-0{bottom:0;}.right-0{right:0;}.opacity-20{opacity:0.2;}</style>"
                                            );
                                            printWindow.document.write(
                                                "</head><body>"
                                            );
                                            printWindow.document.write(`
											  <div class="flex justify-center items-center relative flex-col gap-2 dark:text-white text-black">
												<h1 class="text-3xl font-bold">${order.order_code}</h1>
												<h2 class="text-xl font-bold">${
                                                    order.moneyChange === 1
                                                        ? formatMoney(
                                                              order.total
                                                          )
                                                        : formatDolares(
                                                              order.total /
                                                                  order.moneyChange
                                                          )
                                                }</h2>
												<span class="font-bold">${TimePeru(order.createdAt).format(
                                                    "DD/MM/YYYY hh:mm"
                                                )}</span>
												${
                                                    storageEmpresa?.logo
                                                        ? `
												  <img src="${
                                                      printFileWithDimension(
                                                          storageEmpresa.logo,
                                                          100
                                                      )[0]
                                                  }" width="60" height="60" class="absolute bottom-0 right-0 opacity-20" alt="logo" />
												`
                                                        : ""
                                                }
											  </div>
											`);
                                            printWindow.document.write(
                                                "</body></html>"
                                            );
                                            printWindow.document.close();
                                            printWindow.print();
                                        }}
                                    >
                                        <i class="far fa-ticket" />{" "}
                                        <HelperPDF right={0} top={1} />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/*form  */}
                        <div class="my-4 w-full">
                            <OrderFormUpdate
                                showRefetch={ordersShowQuery.refetch}
                                refetch={refetch!}
                                order={order}
                            />
                        </div>

                        <div class="flex flex-col md:flex-row gap-2 w-full">
                            {order.invoice?.kind_invoice_code === "01" ||
                            order.invoice?.kind_invoice_code === "03" ? (
                                <Invoice
                                    order={order}
                                    refetch={ordersShowQuery.refetch}
                                />
                            ) : null}
                            {order.invoice?.kind_invoice_code === "00" ? (
                                <Recibo order={order} />
                            ) : null}
                            {order.note?.kind_invoice_code === "07" ||
                            order.note?.kind_invoice_code === "08" ? (
                                <Note
                                    refetch={ordersShowQuery.refetch}
                                    order={order}
                                />
                            ) : null}
                            {order.guide ? (
                                <Guide
                                    refetch={ordersShowQuery.refetch}
                                    order={order}
                                />
                            ) : null}
                        </div>
                        {order.guide?.kind_guide_code}
                        <div class="grid md:grid-cols-2 gap-2 w-full">
                            {order.city ? (
                                <div class="w-full flex gap-1 flex-col mb-3  p-2">
                                    <span class="text-primary dark:text-terciary font-bold">
                                        Ubigeo:
                                    </span>
                                    <span class="dark:text-secondary-light text-secondary-dark tracking-wide text-wrap break-words">
                                        {order.city.region.name} -
                                        {order.city.name}
                                    </span>
                                </div>
                            ) : null}
                            <div class="w-full flex gap-1 flex-col mb-3  p-2">
                                <span class="text-primary dark:text-terciary font-bold">
                                    Dirección:
                                </span>
                                <span class="dark:text-secondary-light text-secondary-dark tracking-wide text-wrap break-words">
                                    {order.address || "No se ingresó"}{" "}
                                    {order.reference || ""}
                                </span>
                            </div>
                            {order.invoice?.identification_number ? (
                                <div class="w-full flex gap-1 flex-col mb-3  p-2">
                                    <span class="text-primary dark:text-terciary font-bold">
                                        {
                                            typeFiscal[
                                                storageEmpresa?.dial_code as keyof typeof typeFiscal
                                            ].type_dni
                                        }
                                        /
                                        {
                                            typeFiscal[
                                                storageEmpresa?.dial_code as keyof typeof typeFiscal
                                            ].type_fiscal
                                        }
                                        :
                                    </span>
                                    <span class="dark:text-secondary-light text-secondary-dark tracking-wide text-wrap break-words">
                                        {order.invoice?.identification_number ||
                                            "No se ingresó"}
                                    </span>
                                </div>
                            ) : null}

                            {order.map_marker ? (
                                <div class="w-full flex gap-1 flex-col mb-3  p-2">
                                    <span class="text-primary dark:text-terciary font-bold">
                                        Coordenadas:
                                    </span>
                                    {/* google maps <iframe
                                        src={`https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d15619.018177660344!2d${order.map_marker.lng}!3d${order.map_marker.lat}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1ses-419!2spe!4v1720461125024!5m2!1ses-419!2spe`}
                                        width="600"
                                        height="450"
                                        style="border:0;"
                                        allowfullscreen=""
                                        loading="lazy"
                                        referrerpolicy="no-referrer-when-downgrade"
                                    ></iframe> */}
                                    <MapValue
                                        value={order.map_marker}
                                        zoom={14}
                                        url={typeMap.normal.url}
                                        attribution={typeMap.normal.attribution}
                                    />
                                    <div class="flex gap-2 items-center justify-between mt-2">
                                        <span class="text-primary dark:text-terciary font-bold text-[10px]">
                                            {order.map_marker.lat},
                                            {order.map_marker.lng}
                                        </span>
                                        <a
                                            class="text-[10px] text-primary hover:underline text-center"
                                            target="_blank"
                                            rel="noreferrer"
                                            href={`https://www.google.com/maps/?q=${order.map_marker.lat},${order.map_marker.lng}`}
                                        >
                                            <i class="fas fa-map-marked-alt" />{" "}
                                            Google maps
                                        </a>
                                    </div>
                                </div>
                            ) : null}
                            {order.seller ? (
                                <div class="w-full flex gap-1 flex-col mb-3  p-2">
                                    <span class="text-primary dark:text-terciary font-bold">
                                        Trabajador
                                    </span>
                                    <img
                                        class="rounded-full w-[40px] h-[40px] "
                                        src={
                                            printFileUser(
                                                order.seller.photo,
                                                100
                                            )[0]
                                        }
                                        width={100}
                                        height={100}
                                        alt={order.seller.username}
                                    />
                                    <a
                                        href={`/admin/usuarios/${order.user.id}`}
                                        target="_blank"
                                        rel="noreferrer"
                                        class="dark:text-secondary-light text-secondary-dark tracking-wide text-xs"
                                    >
                                        {order.seller.username}
                                    </a>
                                </div>
                            ) : null}
                            {order.user ? (
                                <div class="w-full flex gap-1 flex-col mb-3  p-2">
                                    <span class="text-primary dark:text-terciary font-bold">
                                        Cliente
                                    </span>

                                    <span class="dark:text-secondary-light text-secondary-dark tracking-wide text-xs">
                                        {order.user.username}
                                    </span>
                                </div>
                            ) : (
                                <div class="w-full flex gap-1 flex-col mb-3  p-2">
                                    <span class="text-primary dark:text-terciary font-bold">
                                        Cliente
                                    </span>
                                    <span class="dark:text-secondary-light text-secondary-dark tracking-wide ">
                                        No registrado
                                    </span>
                                </div>
                            )}
                            <div class="flex w-full gap-1 flex-col mb-3   relative">
                                <span class="text-primary dark:text-terciary font-bold">
                                    Metódo de pago:
                                </span>
                                <span class="dark:text-secondary-light self-start text-secondary-dark tracking-wide">
                                    <div
                                        dangerouslySetInnerHTML={{
                                            __html: payMethodIcon()[
                                                order.pay_method_id
                                            ],
                                        }}
                                    />
                                    {order.pasarela_response ? (
                                        <button
                                            type="button"
                                            aria-label="show"
                                            class="text-xs bg-primary px-2 py-1 rounded-md text-white ml-2"
                                            onClick={() => {
                                                sweetModal({
                                                    html: reactComponent(
                                                        <div class="w-full">
                                                            <h1 class="text-primary text-center font-bold">
                                                                Transacción
                                                            </h1>
                                                            <pre class="dark:text-white break-words w-full   text-wrap">
                                                                <p>
                                                                    {JSON.stringify(
                                                                        order.pasarela_response,
                                                                        null,
                                                                        1
                                                                    )}
                                                                </p>
                                                            </pre>
                                                        </div>
                                                    ),
                                                    showCloseButton: true,
                                                    sweetWidth: "600px",
                                                    position: "start",
                                                });
                                            }}
                                        >
                                            <i class="fa-solid fa-eye mr-1" />{" "}
                                            Ver Transacción
                                        </button>
                                    ) : null}
                                    {order.paypal_response ? (
                                        <button
                                            type="button"
                                            aria-label="show"
                                            class="text-xs bg-primary px-2 py-1 rounded-md text-white ml-2"
                                            onClick={() => {
                                                sweetModal({
                                                    html: reactComponent(
                                                        <div class="w-full break-words text-wrap">
                                                            <h1 class="text-primary text-center font-bold">
                                                                Transacción
                                                            </h1>
                                                            <pre class="dark:text-white break-words w-full text-wrap">
                                                                <p>
                                                                    {JSON.stringify(
                                                                        order.paypal_response,
                                                                        null,
                                                                        1
                                                                    )}
                                                                </p>
                                                            </pre>
                                                        </div>
                                                    ),
                                                    showCloseButton: true,
                                                    sweetWidth: "600px",
                                                    position: "start",
                                                });
                                            }}
                                        >
                                            <i class="fa-solid fa-eye mr-1" />{" "}
                                            Ver Transacción
                                        </button>
                                    ) : null}
                                    {order.transferencia_image ? (
                                        <img
                                            src={
                                                printFileWithDimension(
                                                    order.transferencia_image,
                                                    800
                                                )[0]
                                            }
                                            width={300}
                                            height={300}
                                            alt={order.order_code}
                                        />
                                    ) : null}
                                </span>
                            </div>

                            <div class="flex gap-1 flex-col mb-3  py-2 rounded-md w-full">
                                <span class="text-primary dark:text-terciary font-bold">
                                    Creado:
                                </span>
                                <span class="dark:text-secondary-light text-secondary-dark tracking-wide">
                                    {showTime(order.createdAt)}
                                </span>
                            </div>
                            <div class="flex gap-1 flex-col mb-3  py-2 rounded-md w-full">
                                <span class="text-primary dark:text-terciary font-bold">
                                    Actualizado:
                                </span>
                                <span class="dark:text-secondary-light text-secondary-dark tracking-wide">
                                    {showTime(order.updatedAt)}
                                </span>
                            </div>
                        </div>
                        {order.telephone ? (
                            <div class="grid md:grid-cols-2 gap-2 w-full">
                                <div class="flex gap-1 flex-col mb-3  py-2 rounded-md w-full">
                                    <span class="text-primary dark:text-terciary font-bold">
                                        Numero de Telefono
                                    </span>
                                    <span class="dark:text-secondary-light text-secondary-dark tracking-wide flex gap-2 items-center">
                                        <i class="fab fa-whatsapp" />
                                        {order.telephone}
                                        {(() => {
                                            const [copy] = useCopyToClipboard();
                                            return (
                                                <button
                                                    class="active:text-primary"
                                                    type="button"
                                                    aria-label="copy"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        copy(order.telephone!);
                                                        sweetAlert({
                                                            icon: "success",
                                                            title: "Copiado correctamente",
                                                        });
                                                    }}
                                                >
                                                    <span class="">
                                                        <i class="far fa-copy text-base" />
                                                    </span>
                                                </button>
                                            );
                                        })()}
                                    </span>
                                </div>
                            </div>
                        ) : null}
                        <span class="dark:text-white text-xs">
                            {order.igv
                                ? `${storageEmpresa?.tipo_impuesto} includo`
                                : `${storageEmpresa?.tipo_impuesto} no incluido`}
                        </span>
                    </div>
                </div>
            </Container>
        );
    }
    return component;
}

export default OrdersShow;
