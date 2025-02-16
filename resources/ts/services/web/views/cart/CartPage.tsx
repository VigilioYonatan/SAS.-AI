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
import { MetodosDePago } from "@/web/components/product/ProductView";
import { DIALCODE, typeFiscal } from "@/empresas/libs/helpers";
import useAuthStore from "@/auth/stores/auth.store";
import { useMediaQueryNoReactive } from "~/hooks/useMediaQuery";
import { isColorLight } from "~/libs/helpers";
import { formSelectNumber } from "~/components/form/FormSelect";

interface CartProps {
    cart:
        | {
              id: number;
              quantity: number;
              variant?: number;
          }[]
        | {
              id: number;
              quantity: number;
              variant?: number;
              isCuota?: boolean;
          }
        | null;
    header: HeaderType;
}

function CartPage({ cart, header }: CartProps) {
    const cartStore = useCartStore();

    useEffect(() => {
        if (cart) {
            cartStore.methods.initialCart(
                cart instanceof Array ? cart : [cart]
            );
        }
    }, []);

    if (!cartStore.state.cart) {
        return null;
    }
    const empresaStore = useEmpresastore();
    const {
        ordersCartStoreDtoForm,
        arrayKindInvoices,
        documentCode,
        dniMutation,
        rucMUtation,
        city,
        citiesSelect,
        citiesIndexQuery,
        arrayAdress,
    } = useOnCart();
    const kind_invoice_code = ordersCartStoreDtoForm.watch(
        "invoice.kind_invoice_code"
    );
    const empresa = useEmpresastore();
    const map_marker = ordersCartStoreDtoForm.watch("map_marker");
    const authStore = useAuthStore();
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
        if (
            storageEmpresa?.enabled_dni_cart &&
            !body.invoice?.identification_number
        ) {
            ordersCartStoreDtoForm.setError(
                "invoice.identification_number",
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
        if (!authStore.state) {
            if (!password?.length) {
                ordersCartStoreDtoForm.setError("password", {
                    message: "Este campo es obligatorio",
                });
                return;
            }
            if (!repeatPassword?.length) {
                ordersCartStoreDtoForm.setError("repeat_password", {
                    message: "Este campo es obligatorio",
                });
                return;
            }
            if (password !== repeatPassword) {
                ordersCartStoreDtoForm.setError("repeat_password", {
                    message: "Contraseña no similares",
                });
                return;
            }
            ordersCartStoreDtoForm.clearErrors("repeat_password");
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
            position: useMediaQueryNoReactive("(min-width:600px)")
                ? "center"
                : "start",
        }));
    }
    const password = ordersCartStoreDtoForm.watch("password");
    const repeatPassword = ordersCartStoreDtoForm.watch("repeat_password");
    useEffect(() => {
        if (password !== repeatPassword) {
            ordersCartStoreDtoForm.setError("repeat_password", {
                message: "Contraseña no similares",
            });
            return;
        }
        ordersCartStoreDtoForm.clearErrors("repeat_password");
    }, [password, repeatPassword]);
    return (
        <WebLayout header={header}>
            <section class="max-w-6xl mx-auto  items-center justify-center  pb-20 pt-24 lg:pt-8 ">
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
                        Carrito de compra
                    </h1>
                )}

                {cartStore.computed.showCartLength > 0 && (
                    <div class="flex flex-col items-start w-full h-full gap-3 lg:flex-row  ">
                        <div class="flex flex-col w-full gap-4 bg-background-light dark:bg-background-dark  md:p-2 rounded-md">
                            <p class="text-center text-md font-bold dark:text-secondary-light pt-2">
                                Hay {cartStore.computed.showCartLength}{" "}
                                producto(s)
                            </p>
                            <div class="w-full overflow-auto">
                                <table class="w-full ">
                                    <thead class="py-3 border-b border-b-border bg-primary">
                                        <tr class="text-xs text-left text-muted-foreground ">
                                            <th class="py-2 font-medium font-bold text-sm dark:text-white  min-w-[130px] md:min-w-[auto]">
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

                                            const isImagesLength =
                                                images500.length
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
                                                        <article class="flex flex-col items-center justify-center md:justify-start md:flex-row md:gap-2">
                                                            <img
                                                                class="w-[70px] h-[70px] md:w-[100px] md:h-[100px] object-contain rounded-lg "
                                                                src={
                                                                    isImagesLength[0]
                                                                }
                                                                alt={
                                                                    product.name
                                                                }
                                                                loading="lazy"
                                                            />
                                                            <div class="flex flex-col justify-center items-center md:justify-start md:items-start">
                                                                <a
                                                                    href={`/${product.slug}`}
                                                                    class="text-xs md:text-sm font-semibold dark:text-white  block  line-clamp-3    mx-1 text-center md:text-start"
                                                                >
                                                                    {
                                                                        product.name
                                                                    }
                                                                </a>
                                                                {product.variant ? (
                                                                    <span class="text-gray-600 dark:text-gray-300 text-xs text-center md:text-start">
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
                                                                <span class="text-xs text-gray-400 dark:text-paper-light font-semibold text-center md:text-start">
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
                                                                <div class="flex md:gap-3 items-center justify-center mx-2">
                                                                    <button
                                                                        aria-label="to increment to cart"
                                                                        type="button"
                                                                        class={`md:w-[35px] md:h-[35px] w-[25px] h-[25px] rounded-md shadow dark:bg-white  dark:hover:text-white bg-primary ${
                                                                            isColorLight(
                                                                                empresaStore.state!
                                                                                    .setting
                                                                                    .bg_color
                                                                            )
                                                                                ? "!text-black"
                                                                                : "!text-white"
                                                                        } dark:text-black  font-bold text-xl hover:bg-opacity-80  hover:bg-transparent border border-primary hover:!text-primary delay-custom-1`}
                                                                        onClick={() =>
                                                                            cartStore.methods.onIncrementProductToCart(
                                                                                product
                                                                            )
                                                                        }
                                                                    >
                                                                        +
                                                                    </button>
                                                                    <span class="font-bold dark:text-white   w-[20px] flex justify-center items-center ">
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
                                                                        class={`md:w-[35px] md:h-[35px] w-[25px] h-[25px] rounded-md shadow dark:bg-white dark: dark:hover:text-white bg-primary dark:text-black ${
                                                                            isColorLight(
                                                                                empresaStore.state!
                                                                                    .setting
                                                                                    .bg_color
                                                                            )
                                                                                ? "!text-black"
                                                                                : "!text-white"
                                                                        } font-bold text-xl hover:bg-opacity-80  hover:bg-transparent border border-primary hover:!text-primary delay-custom-1`}
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
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>

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
                        <div class="flex h-max w-full md:min-w-[25rem] flex-col gap-4 divide-y-[1px] dark:divide-zinc-700 bg-background-light dark:bg-background-dark shadow-sm lg:max-w-80 rounded-md ">
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
                                        <span class="font-bold dark:text-gray-400 text-gray-400 text-xs ">
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
                                        disabled={!!authStore.state?.telephone}
                                    />
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
                                {storageEmpresa?.enabled_address ? (
                                    <>
                                        <Form.control.web
                                            ico={
                                                <i class="fas fa-map-marker-alt" />
                                            }
                                            name={
                                                "address" as keyof OrdersCartStoreDto
                                            }
                                            placeholder="Av. Los Próceres 123, Urb. San Jua"
                                            title="Dirección de destino"
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
                                    </>
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
                                    title="Referencia de destino"
                                    placeholder="A una cuadra del parque XXXXXX"
                                    question={
                                        "Lugar de referencia para ubicarte mejor."
                                    }
                                    disabled={!!authStore.state?.reference}
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
                                {storageEmpresa?.dial_code === DIALCODE.peru ? (
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
                                                            documentCode === "1"
                                                                ? "Nombre"
                                                                : "Razon Social"
                                                        }
                                                        disabled
                                                        name={
                                                            "invoice.razon_social"
                                                        }
                                                        placeholder={`Digite su ${
                                                            documentCode === "1"
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
                                {!authStore.state ? (
                                    <span class="text-xs text-start block self-start my-2 font-semibold">
                                        <b class="text-danger ">*</b> Estas
                                        apunto de crear una cuenta para realizar
                                        esta compra
                                    </span>
                                ) : (
                                    <></>
                                )}
                                <Form.control.web
                                    ico={<i class="fas fa-at" />}
                                    name={"email" as keyof OrdersCartStoreDto}
                                    title="Correo Electrónico"
                                    type="email"
                                    placeholder="micorreo@gxxx.com"
                                    disabled={!!authStore.state?.email}
                                />
                                <div
                                    class={`${
                                        storageEmpresa?.dial_code !==
                                            DIALCODE.peru &&
                                        storageEmpresa!.enabled_dni_cart
                                            ? "grid grid-cols-2"
                                            : "grid grid-cols-1"
                                    } gap-2 w-full`}
                                >
                                    <Form.control.web
                                        name={
                                            "fullName" as keyof OrdersCartStoreDto
                                        }
                                        title="Nombre Completo"
                                        ico={<i class="fas fa-user" />}
                                        placeholder="John Doe"
                                        disabled={!!authStore.state?.email}
                                    />
                                    {storageEmpresa!.enabled_dni_cart &&
                                    kind_invoice_code === "00" ? (
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
                                </div>
                                {!authStore.state ? (
                                    <div class="grid grid-cols-2 gap-2 w-full">
                                        <Form.control.web
                                            name={
                                                "password" as keyof OrdersCartStoreDto
                                            }
                                            title="Contraseña"
                                            type="password"
                                            ico={
                                                <i class="fas fa-lock text-sm" />
                                            }
                                            question={
                                                <span>
                                                    Contraseña para registrarte
                                                    a nuestra web.
                                                </span>
                                            }
                                            placeholder=""
                                        />
                                        <Form.control.web
                                            name={
                                                "repeat_password" as keyof OrdersCartStoreDto
                                            }
                                            title="Confirmar contraseña"
                                            type="password"
                                            ico={
                                                <i class="fas fa-lock text-sm" />
                                            }
                                            placeholder=""
                                        />
                                    </div>
                                ) : (
                                    <></>
                                )}
                                {/* solo restaurante */}
                                {storageEmpresa!.addresses.length > 1 &&
                                storageEmpresa?.tipo_empresa
                                    .tipo_servicio_id === 2 ? (
                                    <Form.control.select
                                        name={
                                            "address_id" as keyof OrdersCartStoreDto
                                        }
                                        title="Local"
                                        array={arrayAdress || []}
                                        placeholder="Escoger dirección de nuestro local"
                                        options={{
                                            setValueAs: formSelectNumber,
                                        }}
                                    />
                                ) : (
                                    <></>
                                )}
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
                                                <span class="text-sm font-bold dark:text-paper-dark text-black">
                                                    Realiza un pedido en
                                                    efectivo
                                                </span>
                                                <span class="text-sm font-bold text-black">
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
