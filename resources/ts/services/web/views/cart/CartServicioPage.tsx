import { useEffect, useMemo, useRef } from "preact/hooks";
import { sweetModal } from "@vigilio/sweet";
import Form from "~/components/form";
import { isValidDni, isValidRUC, PAYMETHOD, STATUSORDER } from "@/orders/libs";
import {
    ordersCartStoreDto,
    type OrdersCartStoreDto,
} from "@/orders/dtos/orders-cart.dto";
import { reactComponent } from "~/libs/preact";
import Niubiz from "@/cart/views/Niubiz";
import useEmpresastore, {
    storageEmpresa,
} from "@/empresas/stores/empresa.store";
import WebLayout, { HeaderType } from "@/web/components/WebLayout";
import { MetodosDePago } from "@/web/components/product/ProductView";
import { DIALCODE, typeFiscal } from "@/empresas/libs/helpers";
import { ProductsServicioSchemaFromServer } from "@/products/schemas/products_servicio.schema";
import { valibotVigilio } from "~/libs/valibot";
import { useForm } from "react-hook-form";
import { rucApi } from "@/orders/apis/others/ruc.api";
import { dniApi } from "@/orders/apis/others/dni.api";
import { kindInvoiceIndexApi } from "@/orders/apis/kind_invoice.index.api";
import useAuthStore from "@/auth/stores/auth.store";
import { useSignal } from "@preact/signals";
import enviroments from "~/config";
import { formatMoney, subtotalIgv } from "@/cart/libs/helpers";
import useProduct, { CouponStore } from "@/products/hooks/useProduct";
import { printImagesProduct } from "@/products/libs/helpers";
import { formatDateTwo, NOW } from "~/libs/helpers";
import Helper from "~/components/Helper";
import { bgPrimaryHover } from "~/config/settings";

interface CartServicioPageProps {
    servicio: ProductsServicioSchemaFromServer;
    header: HeaderType;
}

function CartServicioPage({ servicio, header }: CartServicioPageProps) {
    const choose = useSignal<null | {
        days: number;
        cantidad: number;
        name: string;
    }>(servicio.days.length ? servicio.days[0] : null);
    const time = useSignal<null | string>(null);
    const error = useSignal<null | string>(null);
    const refTime = useRef<HTMLInputElement>(null);
    const { discount, couponForm, onCoupon, productCouponMutation, coupon } =
        useProduct({
            product: servicio,
            isService: true,
        });

    const authStore = useAuthStore();
    const empresa = useEmpresastore();
    const kindInvoiceIndexQuery = kindInvoiceIndexApi();
    const dniMutation = dniApi();
    const rucMUtation = rucApi();
    const ordersCartStoreDtoForm = useForm<OrdersCartStoreDto>({
        resolver: valibotVigilio(ordersCartStoreDto),
        defaultValues: {
            pay_method_id: PAYMETHOD.efectivo, // efectivo
            status_order_id: STATUSORDER.pendiente, //pedido confirmado
            telephone: authStore.state?.telephone as string,
            description: null,
            invoice: {
                send_sunat: false,
                kind_invoice_code:
                    storageEmpresa?.dial_code === DIALCODE.peru
                        ? undefined
                        : "00",
                identification_number: authStore.state?.identification_number
                    ? authStore.state?.identification_number
                    : null,
            },
            user_id: authStore.state ? authStore.state.id : null,
            isDelivery: true,
            transferencia_image: null,
            total: choose.value
                ? subtotalIgv(servicio, true, discount.value) *
                  choose.value.cantidad
                : subtotalIgv(servicio, true, discount.value),
            map_marker: empresa.state!.enable_map_marker
                ? empresa.state!.map_marker
                : null,
            city_id: null,
            mesa_id: null,
            floor_id: null,
            fullName: null,
            email: authStore.state?.email ? authStore.state.email : undefined,
            reference: "- - - - - - -",
            isService: true,
            address: "- - - - - - -",
            password: null,
            repeat_password: null,
            seller_id: null,
        },
        mode: "all",
    });

    const map_marker = ordersCartStoreDtoForm.watch("map_marker");
    const kindInvoice = ordersCartStoreDtoForm.watch(
        "invoice.kind_invoice_code"
    );
    const documentCode = ordersCartStoreDtoForm.watch("invoice.document_code");
    const identificationNumber = ordersCartStoreDtoForm.watch(
        "invoice.identification_number"
    );
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
    const arrayKindInvoices = useMemo(
        () =>
            kindInvoiceIndexQuery.isSuccess && kindInvoiceIndexQuery.data
                ? kindInvoiceIndexQuery.data.data
                      .filter((kind) =>
                          empresa.state?.certificado &&
                          empresa.state?.enabled_igv
                              ? kind.code === "01" || kind.code === "03"
                              : kind.code === "00"
                      )
                      .map((kind) => ({
                          key: kind.code,
                          value: kind.name,
                      }))
                : [],
        [kindInvoiceIndexQuery]
    );

    useEffect(() => {
        if (kindInvoice) {
            ordersCartStoreDtoForm.setValue(
                "invoice.identification_number",
                null
            );
            ordersCartStoreDtoForm.setValue("invoice.document_code", null);
            ordersCartStoreDtoForm.setValue("invoice.razon_social", null);
            if (kindInvoice === "00") {
                /* @ts-ignore */
                ordersCartStoreDtoForm.setValue("invoice", {
                    razon_social: null,
                    document_code: null,
                    send_sunat: false,
                    identification_number: null,
                    kind_invoice_code: "00",
                });
            }
            if (kindInvoice === "01") {
                ordersCartStoreDtoForm.setValue("invoice.document_code", "6"); //6 ruc
            }
            if (kindInvoice === "03") {
                ordersCartStoreDtoForm.setValue("invoice.document_code", "1"); //1 dni
            }
        }
    }, [kindInvoice]);

    useEffect(() => {
        if (
            identificationNumber &&
            storageEmpresa?.dial_code === DIALCODE.peru
        ) {
            ordersCartStoreDtoForm.clearErrors("invoice.razon_social");

            if (documentCode === "1") {
                if (isValidDni.test(identificationNumber)) {
                    dniMutation.mutate(identificationNumber, {
                        onSuccess(data) {
                            ordersCartStoreDtoForm.setValue(
                                "invoice.razon_social",
                                data.data.nombre_completo
                            );
                            ordersCartStoreDtoForm.setValue(
                                "fullName",
                                data.data.nombre_completo
                            );
                        },
                        onError() {
                            ordersCartStoreDtoForm.setValue(
                                "invoice.razon_social",
                                ""
                            );
                            ordersCartStoreDtoForm.setError(
                                "invoice.identification_number",
                                {
                                    message: "DNI no valido",
                                }
                            );
                        },
                    });
                } else {
                    ordersCartStoreDtoForm.setValue("invoice.razon_social", "");
                    ordersCartStoreDtoForm.setError(
                        "invoice.identification_number",
                        {
                            message: "DNI no valido",
                        }
                    );
                }
            }
            if (documentCode === "6") {
                if (isValidRUC.test(identificationNumber)) {
                    rucMUtation.mutate(identificationNumber, {
                        onSuccess(data) {
                            ordersCartStoreDtoForm.setValue(
                                "invoice.razon_social",
                                data.result.razon_social
                            );
                        },
                        onError() {
                            ordersCartStoreDtoForm.setValue(
                                "invoice.razon_social",
                                ""
                            );
                            ordersCartStoreDtoForm.setError(
                                "invoice.identification_number",
                                {
                                    message: "RUC no valido",
                                }
                            );
                        },
                    });
                } else {
                    ordersCartStoreDtoForm.setValue("invoice.razon_social", "");
                    ordersCartStoreDtoForm.setError(
                        "invoice.identification_number",
                        {
                            message: "RUC no valido",
                        }
                    );
                }
            }
        }
    }, [documentCode, identificationNumber]);
    useEffect(() => {
        ordersCartStoreDtoForm.setValue("details_orders", [
            {
                product_servicio_id: servicio.id,
                product_normal_id: null,
                product_restaurant_id: null,
                coupon: discount.value ? coupon : null,
                price: choose.value
                    ? subtotalIgv(servicio, true, discount.value) *
                      choose.value.cantidad
                    : subtotalIgv(servicio, true, discount.value),
                quantity: 1,
                variant_id: null,
                variante: choose.value ? choose.value.name : time.value,
            },
        ]);
        ordersCartStoreDtoForm.setValue(
            "total",
            choose.value
                ? subtotalIgv(servicio, true, discount.value) *
                      choose.value.cantidad
                : subtotalIgv(servicio, true, discount.value)
        );
    }, [discount.value, choose.value, time.value]);

    function onCartOrderStore(body: OrdersCartStoreDto) {
        if (!body.fullName) {
            ordersCartStoreDtoForm.setError(
                "fullName",
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
        // SERVICIO ERROR
        if (
            (!choose.value && !time.value) ||
            (!choose.value && time.value && error.value)
        ) {
            error.value = "Este campo es obligatorio.";
            return;
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
        }));
    }

    return (
        <WebLayout header={header}>
            <section class="max-w-6xl mx-auto  m-4 items-center justify-center  pb-20 pt-24 lg:pt-8 px-4 flex flex-col md:flex-row gap-4">
                <div class="md:w-1/2 w-full self-start flex justify-center flex-col  gap-4 items-center bg-background-light dark:bg-background-dark rounded-md p-4">
                    <img
                        class="h-[300px] object-cover"
                        width={500}
                        height={500}
                        src={printImagesProduct(servicio.images, 500)[0]}
                        alt={servicio.name}
                    />{" "}
                    <div class="flex flex-col gap-2 items-center justify-center pb-4 w-full">
                        <div class="flex gap-2 text-gray-400 dark:text-gray-300 text-xs font-semibold">
                            {servicio.category?.icon ? (
                                <div
                                    dangerouslySetInnerHTML={{
                                        __html: servicio.category.icon,
                                    }}
                                />
                            ) : null}

                            <span>{servicio.category.name}</span>
                        </div>
                        <a
                            href={`/servicio/${servicio.slug}`}
                            class="text-primary font-bold dark:text-white line-clamp-2 text-xl  "
                        >
                            {servicio.name}
                        </a>{" "}
                        {servicio.days.length ? (
                            <div class="flex gap-2 flex-wrap justify-center">
                                {servicio.days.map((day) => (
                                    <button
                                        key={day.days}
                                        class={`shadow font-bold ${
                                            enviroments.TYPE_BORDER === "square"
                                                ? "rounded-sm"
                                                : "rounded-md"
                                        }  flex text-primary py-1  text-sm min-w-[100px] px-2  justify-center items-center  hover:bg-primary ${bgPrimaryHover()} ${
                                            choose.value?.days === day.days
                                                ? "bg-primary text-white border-2 border-primary"
                                                : "bg-white"
                                        }`}
                                        type="button"
                                        aria-label="change day"
                                        onClick={() => {
                                            choose.value = day;
                                        }}
                                    >
                                        {day.name}
                                    </button>
                                ))}
                            </div>
                        ) : (
                            <>
                                <div
                                    onClick={() => {
                                        refTime.current?.focus();
                                        refTime.current?.click();
                                    }}
                                    class="w-full"
                                >
                                    <span class="dark:text-white font-semibold text-xs">
                                        Fecha - Hora:{" "}
                                    </span>
                                    <div class="flex gap-2 w-full">
                                        <div
                                            onClick={() => {
                                                refTime.current?.focus();
                                                refTime.current?.click();
                                            }}
                                            class={` w-full h-[2.5rem] flex  items-center gap-2 text-xs ${
                                                enviroments.TYPE_BORDER ===
                                                "circle"
                                                    ? "rounded-md"
                                                    : "rounded-sm"
                                            } overflow-hidden     my-1 shadow-sm border `}
                                        >
                                            <div class="bg-primary shadow min-w-[2.8rem]  h-full text-white flex justify-center items-center">
                                                <i class="fa-regular fa-calendar" />
                                            </div>
                                            <input
                                                value={
                                                    time.value
                                                        ? time.value
                                                        : (formatDateTwo(
                                                              NOW().toDate(),
                                                              "YYYY-MM-DDTHH:mm"
                                                          ) as string)
                                                }
                                                onChange={(e) => {
                                                    const timer = (
                                                        e.target as HTMLInputElement
                                                    ).value;
                                                    const times = new Date(
                                                        timer
                                                    );

                                                    time.value = timer;

                                                    const hora =
                                                        storageEmpresa?.citasSetting.horario.find(
                                                            (a) =>
                                                                a.id ===
                                                                times.getDay()
                                                        );
                                                    const horaString = `${
                                                        times.getHours() > 10
                                                            ? times.getHours()
                                                            : `0${times.getHours()}`
                                                    }:${times.getMinutes()}`;
                                                    function compareHours(
                                                        hora: string,
                                                        horaString: string
                                                    ) {
                                                        const [horaH, horaM] =
                                                            hora
                                                                .split(":")
                                                                .map(Number);
                                                        const [
                                                            horaStringH,
                                                            horaStringM,
                                                        ] = horaString
                                                            .split(":")
                                                            .map(Number);

                                                        const totalMinHora =
                                                            horaH * 60 + horaM;
                                                        const totalMinHoraString =
                                                            horaStringH * 60 +
                                                            horaStringM;

                                                        return (
                                                            totalMinHoraString <
                                                            totalMinHora
                                                        );
                                                    }
                                                    if (
                                                        compareHours(
                                                            hora!.openTime,
                                                            horaString
                                                        ) ||
                                                        !compareHours(
                                                            hora!.closeTime,
                                                            horaString
                                                        )
                                                    ) {
                                                        error.value =
                                                            "Hora no válida";
                                                    } else {
                                                        error.value = null;
                                                    }
                                                }}
                                                class="w-full bg-transparent outline-none dark:text-white z-10 relative pr-2 text-sm"
                                                min={
                                                    formatDateTwo(
                                                        NOW().toDate(),
                                                        "YYYY-MM-DDTHH:MM"
                                                    ) as string
                                                }
                                                max={
                                                    formatDateTwo(
                                                        NOW()
                                                            .add(
                                                                storageEmpresa!
                                                                    .citasSetting
                                                                    .max_days,
                                                                "days"
                                                            )
                                                            .toDate(),

                                                        "YYYY-MM-DDTHH:MM"
                                                    ) as string
                                                }
                                                name="time"
                                                type="datetime-local"
                                                ref={refTime}
                                            />
                                        </div>
                                        <div class="relative">
                                            <Helper top={1} right={0}>
                                                <div class="text-black dark:text-white">
                                                    <span class="font-bold">
                                                        Horario de Atención
                                                    </span>
                                                    <div class="flex flex-col justify-center">
                                                        {storageEmpresa?.citasSetting.horario.map(
                                                            (horario) => (
                                                                <div
                                                                    key={
                                                                        horario.id
                                                                    }
                                                                    class="flex gap-2 text-sm"
                                                                >
                                                                    <span class="w-[100px]">
                                                                        {
                                                                            horario.day
                                                                        }
                                                                        :
                                                                    </span>
                                                                    {horario.enabled ? (
                                                                        <span class="font-normal">
                                                                            {
                                                                                horario.openTime
                                                                            }{" "}
                                                                            {Number.parseInt(
                                                                                horario.openTime.split(
                                                                                    ":"
                                                                                )[0]
                                                                            ) >
                                                                            12
                                                                                ? "PM"
                                                                                : "AM"}{" "}
                                                                            -{" "}
                                                                            {
                                                                                horario.closeTime
                                                                            }{" "}
                                                                            {Number.parseInt(
                                                                                horario.closeTime.split(
                                                                                    ":"
                                                                                )[0]
                                                                            ) >
                                                                            12
                                                                                ? "PM"
                                                                                : "AM"}
                                                                        </span>
                                                                    ) : (
                                                                        <span>
                                                                            Sin
                                                                            atención
                                                                        </span>
                                                                    )}
                                                                </div>
                                                            )
                                                        )}
                                                    </div>
                                                </div>
                                            </Helper>
                                        </div>
                                    </div>
                                    {error.value ? (
                                        <p class="text-xs text-danger font-semibold">
                                            {error.value}
                                        </p>
                                    ) : null}
                                </div>
                            </>
                        )}
                    </div>
                    <Form
                        {...couponForm}
                        onSubmit={onCoupon}
                        className="flex gap-2 items-center [&>div>div>div>div>input]:bg-white [&>div>div>div>div>input]:text-black dark:[&>div>div>div>div>input]:bg-background-dark"
                    >
                        <div class="w-full flex-col ">
                            {discount.value ? (
                                <p class="text-xs text-primary">
                                    Se agregó {discount.value}% de descuento
                                </p>
                            ) : null}
                            <Form.control.web
                                type="text"
                                title="¿Tienes un cupón de descuento?"
                                placeholder="XXXXX-XXXXX-XXXXX"
                                name={"coupon" as keyof CouponStore}
                                disabled={!!discount.value}
                            />
                        </div>
                        <Form.button.submit
                            disabled={productCouponMutation.isLoading || false}
                            isLoading={productCouponMutation.isLoading || false}
                            title=""
                            className="w-[40px] h-[40px] flex justify-center items-center"
                            ico={
                                discount.value ? (
                                    <span>x</span>
                                ) : (
                                    <i class="fa-solid fa-magnifying-glass text-base" />
                                )
                            }
                        />
                    </Form>
                </div>
                <Form
                    className="[&>div]:h-auto flex flex-col justify-center items-center p-4 bg-background-light dark:bg-background-dark md:w-1/2"
                    {...ordersCartStoreDtoForm}
                    onSubmit={onCartOrderStore}
                >
                    {storageEmpresa?.enabled_igv ? (
                        <div class="flex items-center justify-between h-max">
                            <span class="dark:text-white font-bold text-base lg:text-xl " />
                            <span class="font-bold dark:text-gray-400 text-gray-400 text-xs ">
                                {storageEmpresa?.tipo_impuesto.toUpperCase()}{" "}
                                Incluido
                            </span>
                        </div>
                    ) : (
                        <></>
                    )}
                    <div class="flex justify-between w-full">
                        <span class="dark:text-white font-semibold">
                            Total:
                        </span>
                        <span class="text-primary font-bold text-xl">
                            {choose.value
                                ? formatMoney(
                                      subtotalIgv(
                                          servicio,
                                          true,
                                          discount.value
                                      ) * choose.value.cantidad
                                  )
                                : formatMoney(
                                      subtotalIgv(
                                          servicio,
                                          true,
                                          discount.value
                                      )
                                  )}
                        </span>
                    </div>
                    <div class="w-full flex gap-2 items-center">
                        <Form.control.web
                            name={"telephone" as keyof OrdersCartStoreDto}
                            title="Numero de celular"
                            type="tel"
                            ico={
                                <span class="font-bold">
                                    +{storageEmpresa?.dial_code}
                                </span>
                            }
                            question={
                                <span>
                                    Este campo no es obligatorio. <br />
                                    Se te enviará comprobante de pago a
                                    whatsapp.
                                </span>
                            }
                        />
                    </div>
                    <Form.control.web
                        ico={<i class="fas fa-at" />}
                        name={"email" as keyof OrdersCartStoreDto}
                        title="Correo Electrónico"
                        type="email"
                    />
                    {storageEmpresa?.enabled_address &&
                    !servicio.showHorario ? (
                        <>
                            <Form.control.web
                                ico={<i class="fas fa-map-marker-alt" />}
                                name={"address" as keyof OrdersCartStoreDto}
                                title="Dirección"
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
                            disabled={dniMutation.isLoading || false}
                        />
                    ) : (
                        <></>
                    )}
                    {storageEmpresa?.dial_code === DIALCODE.peru ? (
                        <>
                            {documentCode === "1" || documentCode === "6" ? (
                                <>
                                    <Form.control.web
                                        title={
                                            documentCode === "1"
                                                ? "Documento Nacional de Identidad (DNI)"
                                                : "Registro Único de Contribuyentes (RUC)"
                                        }
                                        name={"invoice.identification_number"}
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
                                            name={"invoice.razon_social"}
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
                    <div
                        class={`${
                            storageEmpresa!.enabled_dni_cart &&
                            documentCode === "0"
                                ? "grid grid-cols-2"
                                : "grid grid-cols-1"
                        } gap-2 w-full`}
                    >
                        <Form.control.web
                            name={"fullName" as keyof OrdersCartStoreDto}
                            title="Nombre Completo"
                            ico={<i class="fas fa-user" />}
                            placeholder=""
                            disabled={!!authStore.state?.email}
                        />
                        {storageEmpresa?.dial_code !== DIALCODE.peru &&
                        storageEmpresa!.enabled_dni_cart ? (
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
                                name={"invoice.identification_number"}
                                ico={<i class="fas fa-id-card" />}
                            />
                        ) : (
                            <></>
                        )}
                    </div>
                    {!authStore.state ? (
                        <div class="grid grid-cols-2 gap-2 w-full">
                            <Form.control.web
                                name={"password" as keyof OrdersCartStoreDto}
                                title="Contraseña"
                                type="password"
                                ico={<i class="fas fa-lock text-sm" />}
                                question={
                                    <span>
                                        Contraseña para registrarte a nuestra
                                        web.
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
                                ico={<i class="fas fa-lock text-sm" />}
                                placeholder=""
                            />
                        </div>
                    ) : (
                        <></>
                    )}
                    <span class="text-sm dark:text-white mt-3">
                        Sus datos personales se utilizarán para procesar su
                        pedido, respaldar su experiencia en este sitio web y
                        para otros fines descritos en nuestra{" "}
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
                        <li class="flex justify-between items-center flex-col overflow-auto  text-black">
                            {storageEmpresa?.metodos_pago.enable_efectivo ? (
                                <>
                                    <span class="text-sm font-bold dark:text-paper-dark">
                                        Realiza un pedido en efectivo
                                    </span>
                                    <span class="text-sm font-bold">ó</span>
                                </>
                            ) : null}
                            <MetodosDePago isEfectivo={false} />
                        </li>
                    </ul>
                </Form>
            </section>
            <style jsx>{`
                .vigilio-modal {
                    z-index: 999 !important;
                }
            `}</style>
        </WebLayout>
    );
}

export default CartServicioPage;
