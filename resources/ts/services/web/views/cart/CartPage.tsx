import {
    printImagesProduct,
    printProductVariant,
} from "@/products/libs/helpers";
import { useEffect } from "preact/hooks";
import { sweetModal } from "@vigilio/sweet";
import Form from "~/components/form";
import { isValidDni, isValidRUC } from "@/orders/libs";
import { type OrdersCartStoreDto } from "@/orders/dtos/orders-cart.dto";
import { NoImage } from "~/config/settings";
import { reactComponent } from "~/libs/preact";
import useCartStore from "@/cart/stores/cart.store";
import useOnCart from "@/cart/hooks/useOnCart";
import Niubiz from "@/cart/views/Niubiz";
import useEmpresastore, {
    storageEmpresa,
} from "@/empresas/stores/empresa.store";
import WebLayout, { HeaderType } from "@/web/components/WebLayout";
import {
    calculatePorcentajeDiscount,
    formatMoney,
    igv,
    subtotalIgv,
} from "@/cart/libs/helpers";
import { ProductsRestaurantSchemaFromServer } from "@/products/schemas/products_restaurant.schema";
import { ProductsNormalSchemaFromServer } from "@/products/schemas/products_normal.schema";
import LoaderSubmit from "~/components/LoaderSubmit";
import { MetodosDePago } from "@/web/components/product/ProductView";
import { DIALCODE, typeFiscal } from "@/empresas/libs/helpers";

interface CartProps {
    cart: { id: number; quantity: number; variant?: number }[] | null;
    header: HeaderType;
}

function CartPage({ cart, header }: CartProps) {
    const cartStore = useCartStore();
    useEffect(() => {
        if (cart) {
            cartStore.methods.initialCart(cart);
        }
    }, []);

    if (!cartStore.state.cart) {
        return null;
    }
    const {
        ordersCartStoreDtoForm,
        arrayKindInvoices,
        documentCode,
        dniMutation,
        rucMUtation,
        city,
        clientsShowQuery,
        citiesSelect,
        citiesIndexQuery,
    } = useOnCart();
    const empresa = useEmpresastore();
    const map_marker = ordersCartStoreDtoForm.watch("map_marker");

    function onCartOrderStore(body: OrdersCartStoreDto) {
        if (!body.fullName) {
            ordersCartStoreDtoForm.setError(
                "fullName",
                { message: "Este campo es obligatorio." },
                { shouldFocus: true }
            );
            return;
        }

        if (!body.city_id && storageEmpresa?.enable_sell_country) {
            ordersCartStoreDtoForm.setError(
                "city_id",
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
        <WebLayout header={header}>
            <section class="max-w-6xl mx-auto  items-center justify-center  pb-20 pt-24 lg:pt-8 px-4">
                {cartStore.computed.showCartLength === 0 ? (
                    <div class="flex h-[50vh] w-full flex-col items-center justify-center gap-6 text-center">
                        <h3 class="text-lg font-bold md:text-3xl dark:text-white">
                            Su carrito esta vacio
                        </h3>
                        <a
                            class="bg-primary px-4 py-2 rounded-md text-white shadow font-bold text-xs"
                            href={"/shop"}
                            aria-label="shop"
                        >
                            <i class="fas fa-store mr-2" /> Ir a tienda
                        </a>
                    </div>
                ) : (
                    <h1 class="mb-4 text-xl text-center font-bold dark:text-white">
                        Carrito de compras
                    </h1>
                )}

                {cartStore.computed.showCartLength > 0 && (
                    <div class="flex flex-col items-start w-full h-full gap-8 lg:flex-row  ">
                        <div class="flex flex-col w-full gap-4 bg-white dark:bg-background-dark p-2 rounded-md">
                            <p class="text-center text-md font-bold dark:text-secondary-light text-secondary-dark">
                                Hay {cartStore.computed.showCartLength}{" "}
                                producto(s)
                            </p>
                            <table class="w-full">
                                <thead class="py-3 border-b border-b-border bg-primary">
                                    <tr class="text-xs text-left text-muted-foreground text-white">
                                        <th class="py-2 font-medium font-bold text-sm dark:text-white ">
                                            <span class="flex justify-center items-center">
                                                Producto
                                            </span>
                                        </th>
                                        <th class="py-2 font-medium font-bold text-sm dark:text-white ">
                                            <span class="flex justify-center items-center">
                                                Precio
                                            </span>
                                        </th>
                                        <th class="py-2 font-medium font-bold text-sm dark:text-white ">
                                            <span class="flex justify-center items-center">
                                                Cantidad
                                            </span>
                                        </th>
                                        <th class="py-2 font-medium font-bold text-sm dark:text-white ">
                                            <span class="flex justify-center items-center mx-2">
                                                Subtotal
                                            </span>
                                        </th>
                                        <th />
                                    </tr>
                                </thead>
                                <tbody class="pt-5 border-b border-b-border">
                                    {cartStore.state.cart.map((product) => {
                                        const discountCoupon =
                                            calculatePorcentajeDiscount(
                                                subtotalIgv(product),
                                                product.subtotal /
                                                    product.quantity
                                            );
                                        const images500 = product.variant
                                            ? printImagesProduct(
                                                  product.images,
                                                  500
                                              ).filter((_, i) => {
                                                  return product.variant?.images.some(
                                                      (img) => img === i + 1
                                                  );
                                              })
                                            : printImagesProduct(
                                                  product.images,
                                                  500
                                              );

                                        const isImagesLength = images500.length
                                            ? images500
                                            : [NoImage()];
                                        return (
                                            <tr
                                                class=" odd:bg-paper-light  dark:odd:bg-paper-dark"
                                                key={
                                                    product.variant
                                                        ? product.variant.id
                                                        : product.id
                                                }
                                            >
                                                <td class="py-3">
                                                    <article class="flex items-center gap-2">
                                                        <img
                                                            class="w-[100px] h-[100px] object-contain rounded-lg hidden md:block"
                                                            src={
                                                                isImagesLength[0]
                                                            }
                                                            alt={product.name}
                                                        />
                                                        <div>
                                                            <a
                                                                href={`/${product.slug}`}
                                                                class="text-xs md:text-sm font-semibold dark:text-white  block  line-clamp-3    mx-1"
                                                            >
                                                                {product.name}
                                                            </a>
                                                            {product.variant ? (
                                                                <span class="text-gray-600 dark:text-gray-300 text-xs">
                                                                    {printProductVariant(
                                                                        product as ProductsNormalSchemaFromServer,
                                                                        product.variant
                                                                    )
                                                                        .map(
                                                                            (
                                                                                variant
                                                                            ) => {
                                                                                return variant?.features
                                                                                    .filter(
                                                                                        (
                                                                                            val
                                                                                        ) =>
                                                                                            val.option_id !==
                                                                                            1
                                                                                    )
                                                                                    .map(
                                                                                        (
                                                                                            feature
                                                                                        ) =>
                                                                                            feature?.description
                                                                                    );
                                                                            }
                                                                        )
                                                                        .join(
                                                                            ", "
                                                                        )}
                                                                </span>
                                                            ) : null}
                                                            <span class="text-xs text-background-dark dark:text-paper-light font-semibold">
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
                                                        </div>
                                                    </article>
                                                </td>
                                                <td class="  dark:text-white font-bold  text-xs  md:text-base">
                                                    <div class="flex justify-center items-center">
                                                        {formatMoney(
                                                            product.subtotal /
                                                                product.quantity
                                                        )}
                                                    </div>
                                                </td>
                                                <>
                                                    {!product.enabled ||
                                                    (!product.variant
                                                        ?.ilimit! &&
                                                        product.variant
                                                            ?.stock! < 1) ||
                                                    (!(
                                                        product as ProductsRestaurantSchemaFromServer
                                                    )?.ilimit! &&
                                                        (
                                                            product as ProductsRestaurantSchemaFromServer
                                                        )?.stock! < 1) ? (
                                                        <>
                                                            <td>
                                                                <span class="dark:text-secondary-light text-sm text-center">
                                                                    Este
                                                                    producto
                                                                    está agotado
                                                                </span>
                                                            </td>
                                                            <td>
                                                                <button
                                                                    class="w-[30px]"
                                                                    onClick={() =>
                                                                        cartStore.methods.onRemoveProductToCart(
                                                                            product.id,
                                                                            product.variant
                                                                                ? product
                                                                                      .variant
                                                                                      .id
                                                                                : null
                                                                        )
                                                                    }
                                                                    type="button"
                                                                    aria-label="delete poduct to cart"
                                                                >
                                                                    <i class="fa-regular fa-trash text-primary text-lg" />
                                                                </button>
                                                            </td>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <td class="py-3 mx-2 w-[100px]">
                                                                <div class="flex gap-3 items-center justify-center mx-2">
                                                                    <button
                                                                        aria-label="to increment to cart"
                                                                        type="button"
                                                                        class="md:w-[35px] md:h-[35px] w-[25px] h-[25px] rounded-md shadow dark:bg-white dark:hover:bg-primary dark:hover:text-white bg-primary dark:text-black text-white font-bold text-xl hover:bg-opacity-80  hover:bg-transparent border border-primary hover:text-primary delay-custom-1"
                                                                        onClick={() =>
                                                                            cartStore.methods.onIncrementProductToCart(
                                                                                product
                                                                            )
                                                                        }
                                                                    >
                                                                        +
                                                                    </button>
                                                                    <span class="font-bold dark:text-white text-black  w-[20px] flex justify-center items-center">
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
                                                                        class="md:w-[35px] md:h-[35px] w-[25px] h-[25px] rounded-md shadow dark:bg-white dark:hover:bg-primary dark:hover:text-white bg-primary dark:text-black text-white font-bold text-xl hover:bg-opacity-80  hover:bg-transparent border border-primary hover:text-primary delay-custom-1"
                                                                    >
                                                                        -
                                                                    </button>
                                                                </div>
                                                            </td>
                                                            <td class="py-3  dark:text-white font-bold text-xs md:text-base ">
                                                                <div class="flex justify-center">
                                                                    {formatMoney(
                                                                        product.subtotal
                                                                    )}
                                                                </div>
                                                            </td>
                                                            <td>
                                                                <button
                                                                    class="w-[30px]"
                                                                    onClick={() =>
                                                                        cartStore.methods.onRemoveProductToCart(
                                                                            product.id,
                                                                            product.variant
                                                                                ? product
                                                                                      .variant
                                                                                      .id
                                                                                : null
                                                                        )
                                                                    }
                                                                    type="button"
                                                                    aria-label="delete poduct to cart"
                                                                >
                                                                    <i class="fa-regular fa-trash text-primary text-lg" />
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
                            {/* <div>
                                <div class="col-xl-6 col-md-8" />
                                <div class="flex justify-end w-full">
                                    <button
                                        type="button"
                                        aria-label="vaciar carrito"
                                        class="font-semibold text-white bg-danger text-xs px-4 py-2 rounded-md shadow"
                                    >
                                        Vaciar carrito
                                    </button>
                                </div>
                            </div> */}
                        </div>
                        <div class="flex h-max w-full min-w-80 flex-col gap-4 divide-y-[1px] dark:divide-zinc-700 bg-white dark:bg-background-dark shadow-sm lg:max-w-80 rounded-md ">
                            <div class="flex flex-col px-4 pt-4 gap-2">
                                {ordersCartStoreDtoForm.watch("city_id") ? (
                                    <>
                                        <span class="dark:text-secondary-light text-sm">
                                            Precio de envio:{" "}
                                            <b>
                                                {city?.value?.priceShipping! > 0
                                                    ? formatMoney(
                                                          igv(
                                                              city.value!
                                                                  .priceShipping
                                                          )
                                                      )
                                                    : "Envio gratis"}
                                            </b>
                                        </span>
                                        <span class="text-xs dark:text-white font-semibold">
                                            Se te enviará tu pedido
                                            aproximadamente en{" "}
                                            <b>{city?.value?.days}</b> días
                                        </span>
                                    </>
                                ) : null}
                                {storageEmpresa?.enabled_igv ? (
                                    <div class="flex items-center justify-between h-max">
                                        <span class="dark:text-white font-bold text-base lg:text-xl " />
                                        <span class="font-bold dark:text-gray-400 text-gray-600 text-xs ">
                                            {storageEmpresa?.tipo_impuesto.toUpperCase()}{" "}
                                            Incluido
                                        </span>
                                    </div>
                                ) : null}

                                <div class="flex items-center justify-between  text-xl font-medium h-max">
                                    <span class="dark:text-white font-bold text-base lg:text-xl ">
                                        Total:
                                    </span>
                                    <span class="font-bold dark:text-white text-base lg:text-xl ">
                                        {formatMoney(
                                            ordersCartStoreDtoForm.watch(
                                                "total"
                                            )
                                        )}
                                    </span>
                                </div>
                            </div>

                            <Form
                                className="[&>div]:h-auto flex flex-col justify-center items-center p-4"
                                {...ordersCartStoreDtoForm}
                                onSubmit={onCartOrderStore}
                            >
                                <div class="w-full flex gap-2 items-center">
                                    <Form.control.web
                                        name={
                                            "telephone" as keyof OrdersCartStoreDto
                                        }
                                        title="Numero de celular"
                                        type="tel"
                                        ico={
                                            <span class="font-bold">
                                                +{storageEmpresa?.dial_code}
                                            </span>
                                        }
                                        question={
                                            <span>
                                                Este campo no es obligatorio.{" "}
                                                <br />
                                                Se te enviará comprobante de
                                                pago a whatsapp.
                                            </span>
                                        }
                                    />
                                    {clientsShowQuery.isLoading ? (
                                        <LoaderSubmit color="var(--primary)" />
                                    ) : null}
                                </div>
                                {empresa.state!.enable_sell_country ? (
                                    <Form.control.web.selectInput
                                        ico={<i class="fas fa-map" />}
                                        title="Ciudad"
                                        array={citiesSelect}
                                        name={
                                            "city_id" as keyof OrdersCartStoreDto
                                        }
                                        disabled={
                                            citiesIndexQuery.isLoading || false
                                        }
                                        isLoading={
                                            citiesIndexQuery.isLoading || false
                                        }
                                    />
                                ) : (
                                    <></>
                                )}
                                <Form.control.web
                                    ico={<i class="fas fa-at" />}
                                    name={"email" as keyof OrdersCartStoreDto}
                                    title="Correo Electrónico"
                                    type="email"
                                />
                                <Form.control.web
                                    ico={<i class="fas fa-map-marker-alt" />}
                                    name={"address" as keyof OrdersCartStoreDto}
                                    title="Dirección"
                                    disabled={
                                        clientsShowQuery.isLoading || false
                                    }
                                />
                                {empresa.state!.enable_map_marker ? (
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
                                            isLocal
                                            disabled={
                                                clientsShowQuery.isLoading ||
                                                false
                                            }
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
                                    placeholder="Cerca de ..."
                                    question={
                                        "Lugar de referencia para ubicarte mejor."
                                    }
                                />
                                {[DIALCODE.peru].includes(
                                    storageEmpresa!.dial_code as DIALCODE
                                ) ? (
                                    <Form.control.web.select
                                        title="Tipo de comprobante"
                                        name={
                                            "invoice.kind_invoice_code" as keyof OrdersCartStoreDto
                                        }
                                        placeholder="Seleccione comprobante"
                                        ico={<i class="fas fa-ticket-alt" />}
                                        array={arrayKindInvoices}
                                        disabled={
                                            dniMutation.isLoading || false
                                        }
                                    />
                                ) : (
                                    <></>
                                )}
                                <>
                                    {storageEmpresa?.dial_code ===
                                    DIALCODE.peru ? (
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
                                                    ) : (
                                                        <></>
                                                    )}
                                                    {storageEmpresa?.dial_code ===
                                                    DIALCODE.peru ? (
                                                        <Form.control.web
                                                            title={
                                                                documentCode ===
                                                                "1"
                                                                    ? "Nombre"
                                                                    : "Razon Social"
                                                            }
                                                            disabled
                                                            name={
                                                                "invoice.razon_social"
                                                            }
                                                            placeholder={`Digite su ${
                                                                documentCode ===
                                                                "1"
                                                                    ? "Nombre"
                                                                    : "Razon Social"
                                                            }`}
                                                        />
                                                    ) : (
                                                        <></>
                                                    )}
                                                </>
                                            ) : (
                                                <></>
                                            )}
                                        </>
                                    ) : (
                                        <></>
                                    )}
                                </>
                                <>
                                    {" "}
                                    {storageEmpresa?.dial_code !==
                                    DIALCODE.peru ? (
                                        <Form.control.web
                                            title={`${
                                                typeFiscal[
                                                    storageEmpresa?.dial_code as keyof typeof typeFiscal
                                                ].type_dni
                                            }/${
                                                typeFiscal[
                                                    storageEmpresa?.dial_code as keyof typeof typeFiscal
                                                ].type_fiscal
                                            }`}
                                            name={
                                                "invoice.identification_number"
                                            }
                                            ico={<i class="fas fa-id-card" />}
                                        />
                                    ) : (
                                        <></>
                                    )}
                                </>
                                <Form.control.web
                                    name={
                                        "fullName" as keyof OrdersCartStoreDto
                                    }
                                    title="Nombre Completo"
                                    ico={<i class="fas fa-user" />}
                                    placeholder=""
                                    disabled={
                                        clientsShowQuery.isLoading || false
                                    }
                                />
                                <span class="text-sm dark:text-white mt-3">
                                    Sus datos personales se utilizarán para
                                    procesar su pedido, respaldar su experiencia
                                    en este sitio web y para otros fines
                                    descritos en nuestra{" "}
                                    <a
                                        href="/politica-de-privacidad"
                                        class=" hover:underline  text-primary font-semibold"
                                    >
                                        politica de privacidad
                                    </a>
                                    .
                                </span>
                                <Form.button.submit
                                    ico={null}
                                    className="flex justify-center w-full px-5 py-3 text-center"
                                    title="Realizar Pago"
                                    disabled={dniMutation.isLoading || false}
                                    isLoading={false}
                                />
                                <ul class="flex flex-col gap-2 w-full bg-orange-100 px-2 py-5 rounded-lg mt-3">
                                    <li class="flex justify-between items-center flex-col overflow-auto">
                                        {storageEmpresa?.metodos_pago
                                            .enable_efectivo ? (
                                            <>
                                                <span class="text-sm font-bold dark:text-paper-dark">
                                                    Realiza un pedido en
                                                    efectivo
                                                </span>
                                                <span class="text-sm font-bold">
                                                    ó
                                                </span>
                                            </>
                                        ) : null}
                                        <MetodosDePago isEfectivo={false} />
                                    </li>
                                </ul>
                            </Form>
                        </div>
                    </div>
                )}
            </section>
            <style jsx>{`
                .vigilio-modal {
                    z-index: 999 !important;
                }
            `}</style>
        </WebLayout>
    );
}

export default CartPage;
