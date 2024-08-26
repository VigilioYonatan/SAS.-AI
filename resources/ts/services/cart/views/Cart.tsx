import enviroments from "~/config";
import Niubiz from "./Niubiz";
import useCartStore from "../stores/cart.store";
import {
    printImagesProduct,
    printProductVariant,
} from "@/products/libs/helpers";
import {
    calculatePorcentajeDiscount,
    formatSoles,
    igv,
    subtotalIgv,
} from "../libs/helpers";
import { useEffect } from "preact/hooks";
import { sweetModal } from "@vigilio/sweet";
import { isValidDni, isValidRUC } from "@/orders/libs";
import type { OrdersCartStoreDto } from "@/orders/dtos/orders-cart.dto";
import { mastercardImage, visaImage, yapeImage } from "~/config/settings";
import { ordersStoreApi } from "@/orders/apis/orders.store.api";
import { reactComponent } from "~/libs/preact";
import Form from "~/components/form";
import useOnCart from "../hooks/useOnCart";
import useInformationStore from "@/information/stores/information.store";

interface CartProps {
    cart: { id: number; quantity: number; variant_id: number }[] | null;
}

function Cart({ cart }: CartProps) {
    const cartStore = useCartStore();

    useEffect(() => {
        if (cart) {
            cartStore.methods.initialCart(cart);
        }
    }, []);

    if (!cartStore.state.cart) {
        return <CartSkeleton />;
    }
    const {
        ordersCartStoreDtoForm,
        arrayKindInvoices,
        documentCode,
        dniMutation,
        rucMUtation,
        districtsSelect,
        districtsIndexQuery,
        distrito,
    } = useOnCart();
    const informationStore = useInformationStore();
    const ordersStoreApiMutation = ordersStoreApi();
    const information = useInformationStore();
    const map_marker = ordersCartStoreDtoForm.watch("map_marker");

    async function onCartOrderStore(body: OrdersCartStoreDto) {
        if (!body.district_id && information.state!.enable_sell_country) {
            ordersCartStoreDtoForm.setError(
                "district_id",
                { message: "Este campo es obligatorio." },
                { shouldFocus: true }
            );
            return;
        }
        if (body.invoice && body.invoice.kind_invoice_code !== "00") {
            if (!body.invoice.identification_number) {
                ordersCartStoreDtoForm.setError(
                    "invoice.identification_number",
                    { message: "Este campo es obligatorio." },
                    { shouldFocus: true }
                );
                return;
            }
            if (
                documentCode === "1" &&
                !isValidDni.test(body.invoice.identification_number)
            ) {
                ordersCartStoreDtoForm.setError(
                    "invoice.identification_number",
                    { message: "Dni no válido" },
                    { shouldFocus: true }
                );
                return;
            }
            if (
                documentCode === "6" &&
                !isValidRUC.test(body.invoice.identification_number)
            ) {
                ordersCartStoreDtoForm.setError(
                    "invoice.identification_number",
                    { message: "Ruc no válido" },
                    { shouldFocus: true }
                );
                return;
            }
            if (!body.invoice.razon_social) {
                ordersCartStoreDtoForm.setError(
                    "invoice.razon_social",
                    { message: "Este campo es obligatorio." },
                    { shouldFocus: true }
                );
                return;
            }
        }

        sweetModal((onClose) => ({
            html: reactComponent(
                <Niubiz
                    ordersCartStoreDtoForm={ordersCartStoreDtoForm}
                    ordersCartStoreDto={body}
                    onClose={onClose}
                />
            ),
            isCloseInBackground: false,
            showCloseButton: true,
        }));
    }

    return (
        <>
            <div class="flex gap-4 flex-col md:flex-row w-full max-w-6xl my-12 mx-auto">
                <div class="flex w-full flex-col dark:bg-paper-dark bg-background-light p-2 sm:p-6 lg:min-h-[500px] rounded-xl shadow-xl">
                    <div class="mb-4">
                        <div class="flex flex-col gap-1 justify-center items-center">
                            <h1 class="flex justify-center text-primary font-bold uppercase text-2xl">
                                Tu carrito
                            </h1>
                        </div>
                    </div>
                    <div class="flex flex-col gap-2 overflow-auto h-full w-full ">
                        {cartStore.computed.showCartLength ? (
                            <>
                                <p class="text-center text-sm font-semibold dark:text-secondary-light text-secondary-dark">
                                    Hay {cartStore.computed.showCartLength}{" "}
                                    producto(s)
                                </p>
                                <table className="w-full">
                                    <thead className="py-3 border-b border-b-border">
                                        <tr className="text-xs text-left text-muted-foreground">
                                            <th className="py-2 font-medium">
                                                Producto
                                            </th>
                                            <th className="py-2 font-medium">
                                                Precio
                                            </th>
                                            <th className="py-2 font-medium">
                                                Cantidad
                                            </th>
                                            <th className="py-2 font-medium">
                                                Subtotal
                                            </th>
                                            <th>a</th>
                                        </tr>
                                    </thead>
                                    <tbody className="pt-5 border-b border-b-border">
                                        {cartStore.state.cart.map((product) => {
                                            const discountCoupon =
                                                calculatePorcentajeDiscount(
                                                    subtotalIgv(product),
                                                    product.subtotal /
                                                        product.quantity
                                                );
                                            return (
                                                <tr key={product.variant.id}>
                                                    <td className="py-3">
                                                        <article className="flex items-center space-x-3">
                                                            <img
                                                                className="w-32 rounded-lg"
                                                                src={
                                                                    printImagesProduct(
                                                                        product.images,
                                                                        500
                                                                    )[0]
                                                                }
                                                                alt={
                                                                    product.name
                                                                }
                                                            />
                                                            <div>
                                                                <h3 className="text-base font-semibold">
                                                                    {
                                                                        product.name
                                                                    }{" "}
                                                                </h3>
                                                                <span>
                                                                    {printProductVariant(
                                                                        product,
                                                                        product.variant
                                                                    )
                                                                        .map(
                                                                            (
                                                                                variant
                                                                            ) => {
                                                                                return variant?.features.map(
                                                                                    (
                                                                                        feature
                                                                                    ) =>
                                                                                        feature?.description
                                                                                );
                                                                            }
                                                                        )
                                                                        .join(
                                                                            " - "
                                                                        )}
                                                                </span>
                                                                <span class="text-xs text-background-dark dark:text-paper-light">
                                                                    {product.discount >
                                                                    0 ? (
                                                                        <>
                                                                            {" "}
                                                                            +
                                                                            {
                                                                                product.discount
                                                                            }
                                                                            % de
                                                                            desc.{" "}
                                                                        </>
                                                                    ) : null}
                                                                    {discountCoupon >
                                                                    0
                                                                        ? `+${discountCoupon}% cupón`
                                                                        : null}
                                                                </span>
                                                                <span className="block font-bold text-zinc-400">
                                                                    {formatMoney(
                                                                        formatMoneyDinamic(
                                                                            product.subtotal /
                                                                                product.quantity
                                                                        )
                                                                    )}
                                                                </span>
                                                                <span className="font-semibold text-sm  bg-danger px-4 py-1 rounded-md text-white">
                                                                    {
                                                                        product.subcategory!
                                                                            .name
                                                                    }
                                                                </span>
                                                            </div>
                                                        </article>
                                                    </td>
                                                    <>
                                                        {!product.enabled ||
                                                        (!product.variant
                                                            .ilimit! &&
                                                            product.variant
                                                                .stock! < 1) ? (
                                                            <td>
                                                                <span class="dark:text-secondary-light text-sm text-center">
                                                                    Este
                                                                    producto
                                                                    está agotado
                                                                </span>
                                                            </td>
                                                        ) : (
                                                            <>
                                                                <td className="py-3">
                                                                    <div className="flex items-center space-x-1">
                                                                        <div className="flex items-center space-x-1">
                                                                            <div class="flex items-center justify-between mr-2 border border-black rounded-md overflow-hidden">
                                                                                <button
                                                                                    aria-label="to increment to cart"
                                                                                    type="button"
                                                                                    class="w-[25px] h-[25px] dark:bg-white bg-black dark:text-black text-white font-bold text-xl hover:bg-opacity-80"
                                                                                    onClick={() =>
                                                                                        cartStore.methods.onIncrementProductToCart(
                                                                                            product
                                                                                        )
                                                                                    }
                                                                                >
                                                                                    +
                                                                                </button>
                                                                                <span class="font-bold dark:text-white text-black ">
                                                                                    {
                                                                                        product.quantity
                                                                                    }
                                                                                </span>
                                                                                <button
                                                                                    onClick={() =>
                                                                                        cartStore.methods.onDecrementProductToCart(
                                                                                            product
                                                                                        )
                                                                                    }
                                                                                    aria-label="to decrement to cart"
                                                                                    type="button"
                                                                                    class="w-[25px] h-[25px] dark:bg-white bg-black dark:text-black text-white font-bold text-xl hover:bg-opacity-80"
                                                                                >
                                                                                    -
                                                                                </button>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </td>
                                                                <td className="py-3">
                                                                    {formatSoles(
                                                                        product.subtotal
                                                                    )}
                                                                </td>
                                                                <td>
                                                                    <button
                                                                        type="button"
                                                                        aria-label="delete poduct to cart"
                                                                    >
                                                                        <i class="fa-regular fa-trash text-primary" />
                                                                    </button>
                                                                </td>
                                                            </>
                                                        )}
                                                    </>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </>
                        ) : (
                            <div className="flex flex-col items-center justify-center">
                                <span class="dark:text-secondary-light">
                                    No se agregó ningún producto
                                </span>
                                <a
                                    class="text-primary text-sm lowercase mt-2  hover:underline"
                                    href={`${enviroments.VITE_URL}/menu`}
                                >
                                    <i class="fa-solid fa-cart-shopping  mr-2" />{" "}
                                    Ir a menú
                                </a>
                            </div>
                        )}
                    </div>
                </div>
                <div class="w-full lg:w-[460px] dark:bg-background-dark bg-background-light flex flex-col gap-1 items-center min-h-[300px] p-2 rounded-xl shadow-xl">
                    {cartStore.computed.showCartLength > 0 ? (
                        <>
                            {ordersCartStoreDtoForm.watch("district_id") ? (
                                <>
                                    <span class="dark:text-secondary-light">
                                        <i class="far fa-truck" /> Precio de
                                        envio:{" "}
                                        <b>
                                            {distrito?.province.department
                                                .priceShipping! > 0
                                                ? formatSoles(
                                                      igv(
                                                          distrito!.province
                                                              .department
                                                              .priceShipping
                                                      )
                                                  )
                                                : "Envio gratis"}
                                        </b>
                                    </span>
                                    <span class="text-xs">
                                        Se te enviará aproximadamente en{" "}
                                        <b>
                                            {distrito?.province.department.days}
                                        </b>{" "}
                                        días
                                    </span>
                                </>
                            ) : null}
                            {informationStore.state!.igv ? (
                                <span class="dark:text-white text-center text-primary">
                                    Incluye igv
                                </span>
                            ) : null}
                            <span class="dark:text-secondary-light">
                                Total:{" "}
                                <b>
                                    {formatSoles(
                                        ordersCartStoreDtoForm.watch("total")
                                    )}
                                </b>
                            </span>
                            {/* si esta habilitado solo personas que estan registrado y esta el usuario */}
                            <Form
                                className="[&>div]:h-auto flex flex-col justify-center items-center"
                                {...ordersCartStoreDtoForm}
                                onSubmit={onCartOrderStore}
                            >
                                <Form.control.web
                                    name={
                                        "telephone" as keyof OrdersCartStoreDto
                                    }
                                    title="Numero de celular"
                                    ico={<span class="font-bold">+51</span>}
                                    placeholder="9XXXXXXXX"
                                    question={
                                        <span>
                                            Este campo no es obligatorio. <br />
                                            Se te enviará comprobante de pago a
                                            whatsapp si se ingresa numero.
                                        </span>
                                    }
                                />
                                <div class="w-full flex flex-col gap-2">
                                    {/* si el cliente venderá en todo el país */}
                                    {information.state!.enable_sell_country ? (
                                        <Form.control.web.selectInput
                                            ico={
                                                <i class="fas fa-map-marked-alt" />
                                            }
                                            title="Distrito"
                                            placeholder="Digite su distrito"
                                            name={
                                                "district_id" as keyof OrdersCartStoreDto
                                            }
                                            array={districtsSelect}
                                            isLoading={
                                                districtsIndexQuery.isLoading ||
                                                false
                                            }
                                        />
                                    ) : null}

                                    {ordersCartStoreDtoForm.watch(
                                        "district_id"
                                    ) ? (
                                        <span class="dark:text-white text-xs mb-2">
                                            <i class="fa-solid fa-truck-fast mr-2" />
                                            {distrito?.province.department
                                                .priceShipping! > 0
                                                ? `Se agregó +${formatSoles(
                                                      igv(
                                                          distrito!.province
                                                              .department
                                                              .priceShipping
                                                      )
                                                  )} costo de envio para ${
                                                      distrito?.province
                                                          .department.name
                                                  }`
                                                : `Envio gratis para ${distrito?.province.department.name}`}
                                        </span>
                                    ) : null}
                                </div>
                                <Form.control.web
                                    ico={<i class="fas fa-map-marker-alt" />}
                                    name={"address" as keyof OrdersCartStoreDto}
                                    title="Dirección"
                                    placeholder="MZ XXXXXXX"
                                />
                                {information.state!.enable_map_marker ? (
                                    <div class="w-full">
                                        <Form.control.map
                                            name={
                                                "map_marker" as keyof OrdersCartStoreDto
                                            }
                                            title="Ubicación para encontrarte mejor"
                                            style={{
                                                height: "200px",
                                                width: "100%",
                                                zIndex: 0,
                                            }}
                                            question="Para encontrarte mejor, por favor indícanos tu ubicación."
                                        />
                                        <span class="text-[10px] dark:text-white">
                                            Lng: {map_marker?.lng}, Lat:{" "}
                                            {map_marker?.lat}
                                        </span>
                                    </div>
                                ) : (
                                    <></>
                                )}

                                <Form.control.web
                                    ico={
                                        <i class="fa-solid fa-location-plus" />
                                    }
                                    name={
                                        "reference" as keyof OrdersCartStoreDto
                                    }
                                    title="Referencia"
                                    placeholder="Cerca de XXXX"
                                    question={
                                        "Lugar de referencia para ubicarte mejor."
                                    }
                                />

                                <Form.control.web.select
                                    title="Tipo de comprobante"
                                    name={
                                        "invoice.kind_invoice_code" as keyof OrdersCartStoreDto
                                    }
                                    placeholder="Seleccione comprobante"
                                    ico={<i class="fas fa-ticket-alt" />}
                                    array={arrayKindInvoices}
                                    disabled={
                                        dniMutation.isLoading ||
                                        ordersStoreApiMutation.isLoading ||
                                        false
                                    }
                                />
                                <>
                                    {documentCode === "1" ||
                                    documentCode === "6" ? (
                                        <>
                                            <Form.control.web
                                                title={
                                                    documentCode === "1"
                                                        ? "Documento Nacional de Identidad (DNI)"
                                                        : "Registro Único de Contribuyentes (RUC)"
                                                }
                                                name={
                                                    "invoice.identification_number"
                                                }
                                                placeholder="Digite su identificación"
                                            />
                                            {dniMutation.isLoading ||
                                            rucMUtation.isLoading ? (
                                                <span>cargando...</span>
                                            ) : null}
                                            <Form.control.web
                                                title={
                                                    documentCode === "1"
                                                        ? "Nombre"
                                                        : "Razon Social"
                                                }
                                                disabled
                                                name={"invoice.razon_social"}
                                                placeholder={
                                                    documentCode === "1"
                                                        ? "Digite su nombre"
                                                        : "Digite su razon social"
                                                }
                                            />
                                        </>
                                    ) : null}
                                </>
                                <span class="text-sm dark:text-white">
                                    Sus datos personales se utilizarán para
                                    procesar su pedido, respaldar su experiencia
                                    en este sitio web y para otros fines
                                    descritos en nuestra{" "}
                                    <a
                                        href="/politica-de-privacidad"
                                        class="text-primary hover:underline"
                                    >
                                        politica de privacidad
                                    </a>
                                    .
                                </span>
                                <Form.button.submit
                                    ico={null}
                                    className="flex justify-center w-full px-5 py-3 text-center"
                                    title="Realizar Pago"
                                    disabled={
                                        dniMutation.isLoading ||
                                        ordersStoreApiMutation.isLoading ||
                                        false
                                    }
                                    isLoading={
                                        ordersStoreApiMutation.isLoading ||
                                        false
                                    }
                                />
                                <ul class="flex flex-col gap-2 w-full bg-orange-100 px-2 py-1 rounded-lg mt-3">
                                    <li class="flex justify-between items-center">
                                        <span class="text-sm font-bold">
                                            Realiza un pedido en efectivo
                                        </span>
                                        <span class="text-sm font-bold">ó</span>
                                        <PaymentsPasarela />
                                    </li>
                                </ul>
                            </Form>
                        </>
                    ) : (
                        <span class="dark:text-white">
                            No hay productos en tu carrito{" "}
                            <a href="/" class="text-primary underline">
                                Comprar
                            </a>
                        </span>
                    )}
                </div>
            </div>
        </>
    );
}

function PaymentsPasarela() {
    return (
        <div class="flex items-center gap-1">
            <img width={30} height={25} src={yapeImage()} alt="" />
            <img width={30} height={30} src={visaImage()} alt="" />
            <img width={30} height={30} src={mastercardImage()} alt="" />
        </div>
    );
}
export function CartSkeleton() {
    return (
        <div class="animate-pulse flex gap-4 flex-col md:flex-row w-full max-w-6xl my-12 mx-auto m-4">
            <div class="w-full flex flex-col gap-2 justify-center items-center">
                <div class=" bg-terciary h-6 w-20" />
                <div class=" bg-terciary h-6 w-full" />
                <div class=" bg-terciary h-8 w-full" />
                <div class=" bg-terciary h-8 w-full" />
                <div class=" bg-terciary h-8 w-full" />
                <div class=" bg-terciary h-8 w-full" />
            </div>
            <div class="w-full flex flex-col gap-2 justify-center items-center">
                <div class=" bg-terciary h-6 w-20" />
                <div class=" bg-terciary h-6 w-full" />
                <div class=" bg-terciary h-12 w-full" />
                <div class=" bg-terciary h-12 w-full" />
                <div class=" bg-terciary h-12 w-full" />
            </div>
        </div>
    );
}

export default Cart;
