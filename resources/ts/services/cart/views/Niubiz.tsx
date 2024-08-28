import { useEffect, useState } from "preact/hooks";
import { useForm, type UseFormReturn } from "react-hook-form";
import { valibotVigilio } from "~/libs/valibot";
import Form from "~/components/form";
import useCartStore from "../stores/cart.store";
import {
    formatDolares,
    formatMoney,
    pasarelaComision,
    paypalComision,
} from "../libs/helpers";
import { sweetModal } from "@vigilio/sweet";
import type { OrdersCartStoreDto } from "@/orders/dtos/orders-cart.dto";
import {
    creditCardSchema,
    type CreditCardSchema,
} from "@/payments/schemas/credit-card.schema";
import { ordersStoreApi } from "@/orders/apis/orders.store.api";
import {
    PAYMETHOD,
    STATUSORDER,
    mastercardRegex,
    visaRegex,
} from "@/orders/libs";
import {
    VisaMastercardImage,
    mastercardImage,
    plinImage,
    visaImage,
    yapeImage,
} from "~/config/settings";
import useAuthStore from "@/auth/stores/auth.store";
import useSocketStore from "~/stores/socket.store";
import enviroments from "~/config";
import { handlerError } from "~/libs/helpers";
import {
    ordersStoreDto,
    type OrdersStoreDto,
} from "@/orders/dtos/orders.store.dto";
import useInformationStore from "@/information/stores/information.store";
import { paypalPaymentApi } from "@/payments/apis/paypal.payment.api";
import LoaderSubmit from "~/components/LoaderSubmit";
import { useSignal } from "@preact/signals";
import { websConverterApi } from "@/admin/apis/converter.api";
import Loading from "@/admin/components/Loading";
import { cartDestroyApi } from "../apis/cart.destroy.api";
import { printFileWithDimension } from "~/libs/upload";
import { Fragment } from "preact/jsx-runtime";

export function verifyBank(transferencia: Record<string, string | null>) {
    return Object.values(transferencia).filter((val) => val).length;
}

type PaymentGatewayProps = {
    ordersCartStoreDtoForm: UseFormReturn<OrdersCartStoreDto>;
    ordersCartStoreDto: OrdersCartStoreDto;
    onClose: () => void;
};

function Niubiz({
    ordersCartStoreDtoForm,
    ordersCartStoreDto,
    onClose,
}: PaymentGatewayProps) {
    const [step, setStep] = useState<"method" | "payment">("method");
    const [paymentMethod, setPaymentMethod] = useState<
        | "card"
        | "yape"
        | "efectivo"
        | "transferencias"
        | "paypal"
        | "qrYape|qrPlin"
    >("efectivo");
    const dolarNow = useSignal<number | null>(null);
    const websConverterMutation = websConverterApi();

    useEffect(() => {
        websConverterMutation.mutate(
            {
                amount: "1",
                from: "PEN",
                to: "USD",
            },
            {
                onSuccess(data) {
                    const value = Number.parseFloat(data.result.todayNumber);
                    dolarNow.value = value;
                },
            }
        );
    }, []);

    let component: null | JSX.Element | JSX.Element[] = null;

    if (websConverterMutation.isLoading) {
        component = <Loading className="h-[600px]" />;
    }
    if (websConverterMutation.isError) {
        component = (
            <span class="text-xs dark:text-white">
                Se está solucionando este problema. Pruebelo más tarde
            </span>
        );
    }
    if (websConverterMutation.isSuccess) {
        const information = useInformationStore();

        component = (
            <div>
                {step === "method" ? (
                    <>
                        <div class="flex font-bold text-xl items-center justify-center py-4 w-full text-primary dark:text-white">
                            METODOS DE PAGO
                        </div>
                        <h3 class="font-bold text-xl dark:text-white text-center mb-3">
                            {formatMoney(
                                ordersCartStoreDtoForm.getValues("total")
                            )}
                        </h3>
                        <p class=" mb-4 dark:text-white">
                            Elige un metodo de pago:
                        </p>
                        <div class="space-y-3">
                            {information.state!.metodos_pago
                                .enabled_efectivo ? (
                                <label class="flex items-start cursor-pointer px-3 py-2 space-x-3 bg-white dark:bg-background-dark dark:text-white dark:border-paper-dark border rounded-md shadow-sm hover:bg-gray-50 border-neutral-200/70">
                                    <input
                                        type="radio"
                                        name="radio-group"
                                        value="card"
                                        class="text-gray-900 translate-y-px focus:ring-gray-700"
                                        checked={paymentMethod === "efectivo"}
                                        onChange={() =>
                                            setPaymentMethod("efectivo")
                                        }
                                    />
                                    <span class="relative flex flex-col text-left space-y-1.5 leading-none">
                                        <span class="font-semibold text-sm">
                                            Pagar en efectivo
                                        </span>
                                        <span class="text-sm text-terciary">
                                            Realizarás el pago cuando recibes el
                                            producto.
                                        </span>
                                    </span>
                                </label>
                            ) : null}

                            {information.state!.transferencias ? (
                                <label class="flex items-start cursor-pointer px-3 py-2 space-x-3 bg-white dark:bg-background-dark dark:text-white dark:border-paper-dark border rounded-md shadow-sm hover:bg-gray-50 border-neutral-200/70 relative">
                                    <input
                                        type="radio"
                                        name="radio-group"
                                        value="transferencias"
                                        class="text-gray-900 translate-y-px focus:ring-gray-700"
                                        checked={
                                            paymentMethod === "transferencias"
                                        }
                                        onChange={() =>
                                            setPaymentMethod("transferencias")
                                        }
                                    />
                                    <span class="relative flex flex-col text-left space-y-1.5 leading-none">
                                        <span class="font-semibold text-sm">
                                            Transferencia Bancaria
                                        </span>
                                        <div class="flex gap-2 items-center">
                                            {information.state!.bancos.map(
                                                (bank) => {
                                                    const tr =
                                                        information.state!
                                                            .transferencias!;
                                                    return (
                                                        <Fragment
                                                            key={bank.key}
                                                        >
                                                            {tr[
                                                                bank.key as keyof typeof tr
                                                            ] &&
                                                            verifyBank(
                                                                tr[
                                                                    bank.key as keyof typeof tr
                                                                ]
                                                            ) ? (
                                                                <img
                                                                    class="h-6 object-contain"
                                                                    width={40}
                                                                    src={
                                                                        bank.image
                                                                    }
                                                                    alt={
                                                                        bank.value
                                                                    }
                                                                />
                                                            ) : null}
                                                        </Fragment>
                                                    );
                                                }
                                            )}
                                        </div>
                                    </span>
                                    <div class="absolute bottom-0 text-xs right-1  font-bold flex-col flex  items-end mr-1 m-1">
                                        <span>Sin comision</span>
                                    </div>
                                </label>
                            ) : null}
                            {information.state!.metodos_pago.mercado_pago
                                .enabled ? (
                                <>
                                    <label class="flex items-start cursor-pointer px-3 py-2 space-x-3 bg-white dark:bg-background-dark dark:text-white dark:border-paper-dark border rounded-md shadow-sm hover:bg-gray-50 border-neutral-200/70 relative">
                                        <input
                                            type="radio"
                                            name="radio-group"
                                            value="card"
                                            class="text-gray-900 translate-y-px focus:ring-gray-700"
                                            checked={paymentMethod === "card"}
                                            onChange={() =>
                                                setPaymentMethod("card")
                                            }
                                        />
                                        <span class="relative flex flex-col text-left space-y-1.5 leading-none">
                                            <span class="font-semibold text-sm">
                                                Tarjeta de credito o debito
                                            </span>
                                            <span class="text-sm opacity-50">
                                                <img
                                                    class="h-6"
                                                    src={VisaMastercardImage()}
                                                    alt=""
                                                />
                                            </span>
                                        </span>
                                        {information.state!
                                            .enabledClientPayComision ? (
                                            <span class="absolute bottom-0 text-xs right-1  font-bold flex-col flex items-end m-1 dark:text-white  text-center ">
                                                + %{" "}
                                                {
                                                    enviroments.VITE_PASARELA_COMISION
                                                }
                                                {" + igv + S/."}
                                                {
                                                    enviroments.VITE_PASARELA_COMISION_TRANSACCION
                                                }{" "}
                                                <br />
                                                comisión pasarela
                                            </span>
                                        ) : null}
                                    </label>
                                    {/* <label class="flex items-start px-3 py-2 space-x-3 bg-white dark:bg-background-dark dark:text-white dark:border-paper-dark border rounded-md shadow-sm hover:bg-gray-50 border-neutral-200/70 cursor-pointer relative">
                                        <input
                                            type="radio"
                                            name="radio-group"
                                            value="card"
                                            class="text-gray-900 translate-y-px focus:ring-gray-700"
                                            checked={paymentMethod === "yape"}
                                            onChange={() =>
                                                setPaymentMethod("yape")
                                            }
                                        />
                                        <span class="relative flex flex-col text-left space-y-1.5 leading-none">
                                            <span class="font-semibold text-sm">
                                                Yape
                                            </span>
                                            <span class="text-sm opacity-50">
                                                <img
                                                    class="h-8 rounded-md"
                                                    src={yapeImage()}
                                                    alt=""
                                                />
                                            </span>
                                        </span>
                                        {information.state!
                                            .enabledClientPayComision ? (
                                            <span class="absolute bottom-0 text-xs right-1  font-bold flex-col flex items-end m-1 dark:text-white  text-center ">
                                                + %{" "}
                                                {
                                                    enviroments.VITE_PASARELA_COMISION
                                                }
                                                {" + igv + S/."}
                                                {
                                                    enviroments.VITE_PASARELA_COMISION_TRANSACCION
                                                }{" "}
                                                <br />
                                                comisión pasarela
                                            </span>
                                        ) : null}
                                    </label> */}
                                </>
                            ) : null}

                            {information.state!.metodos_pago.paypal.enabled ? (
                                <label class="flex items-start px-3 py-4  space-x-3 bg-white dark:bg-background-dark dark:text-white dark:border-paper-dark border rounded-md shadow-sm hover:bg-gray-50 border-neutral-200/70 cursor-pointer relative">
                                    <input
                                        type="radio"
                                        name="radio-group"
                                        value="paypal"
                                        class="text-gray-900 translate-y-px focus:ring-gray-700"
                                        checked={paymentMethod === "paypal"}
                                        onChange={() =>
                                            setPaymentMethod("paypal")
                                        }
                                    />

                                    <span>
                                        {" "}
                                        <i class="fa-brands fa-paypal" /> Pagar
                                        con paypal
                                    </span>
                                    {information.state!
                                        .enabledClientPayComision ? (
                                        <div class="absolute bottom-0 text-xs right-1  font-bold flex-col flex items-end m-1">
                                            <span>Comisión paypal</span>
                                            <span>
                                                +
                                                {
                                                    enviroments.VITE_PAYPAL_COMISION
                                                }
                                                % +{" "}
                                                {
                                                    enviroments.VITE_PAYPAL_TRANSACTION
                                                }{" "}
                                                USD
                                            </span>
                                            <span>Solo disponible en $</span>
                                        </div>
                                    ) : null}
                                </label>
                            ) : null}
                            {information.state!.metodos_pago.qrYape ||
                            information.state!.metodos_pago.qrPlin ? (
                                <label class="flex items-start px-3 py-4  space-x-3 bg-white dark:bg-background-dark dark:text-white dark:border-paper-dark border rounded-md shadow-sm hover:bg-gray-50 border-neutral-200/70 cursor-pointer relative">
                                    <input
                                        type="radio"
                                        name="radio-group"
                                        value="qrYape|qrPlin"
                                        class="text-gray-900 translate-y-px focus:ring-gray-700"
                                        checked={
                                            paymentMethod === "qrYape|qrPlin"
                                        }
                                        onChange={() =>
                                            setPaymentMethod("qrYape|qrPlin")
                                        }
                                    />

                                    <span class="flex gap-2 items-center">
                                        <div class="flex gap-2 items-center">
                                            {information.state!.metodos_pago
                                                .qrYape ? (
                                                <img
                                                    src={yapeImage()}
                                                    width={30}
                                                    height={30}
                                                    alt="yape"
                                                />
                                            ) : null}
                                            {information.state!.metodos_pago
                                                .qrPlin ? (
                                                <img
                                                    src={plinImage()}
                                                    width={30}
                                                    height={30}
                                                    alt="plin"
                                                />
                                            ) : null}
                                        </div>{" "}
                                        Pagar con{" "}
                                        {information.state!.metodos_pago.qrYape
                                            ? "Qr Yape "
                                            : null}
                                        {information.state!.metodos_pago.qrPlin
                                            ? "- Qr Plin"
                                            : null}
                                    </span>
                                    <div class="absolute bottom-0 text-xs right-1  font-bold flex-col flex  items-end mr-1 m-1">
                                        <span>Sin comision</span>
                                    </div>
                                </label>
                            ) : null}
                        </div>
                    </>
                ) : null}
                {step === "payment" ? (
                    <div class="relative">
                        <button
                            class="absolute top-0 left-0 bg-zinc-200 rounded-lg px-2 py-1"
                            type="button"
                            onClick={() => setStep("method")}
                            aria-label="Volver atrás"
                        >
                            <i class="fas fa-arrow-left text-xl" />
                        </button>

                        {paymentMethod === "card" ? (
                            <NiubizCardForm
                                ordersCartStoreDtoForm={ordersCartStoreDtoForm}
                                ordersCartStoreDto={ordersCartStoreDto}
                                onClose={onClose}
                            />
                        ) : paymentMethod === "yape" ? (
                            <></>
                        ) : // <NiubizYapeForm
                        //     ordersCartStoreDtoForm={ordersCartStoreDtoForm}
                        //     ordersCartStoreDto={ordersCartStoreDto}
                        //     onClose={onClose}
                        // />
                        paymentMethod === "transferencias" ? (
                            <TransferenciaPayment
                                ordersCartStoreDtoForm={ordersCartStoreDtoForm}
                                ordersCartStoreDto={ordersCartStoreDto}
                                onClose={onClose}
                                dolarNow={dolarNow.value!}
                            />
                        ) : paymentMethod === "paypal" ? (
                            <PaypalPayment
                                ordersCartStoreDto={ordersCartStoreDto}
                                onClose={onClose}
                                dolarValue={dolarNow.value}
                            />
                        ) : paymentMethod === "qrYape|qrPlin" ? (
                            <QrYapePlin
                                ordersCartStoreDto={ordersCartStoreDto}
                                onClose={onClose}
                                ordersCartStoreDtoForm={ordersCartStoreDtoForm}
                            />
                        ) : (
                            <Efectivo
                                ordersCartStoreDtoForm={ordersCartStoreDtoForm}
                                ordersCartStoreDto={ordersCartStoreDto}
                                onClose={onClose}
                            />
                        )}
                    </div>
                ) : null}
                {step === "method" && (
                    <button
                        type="button"
                        class="w-full mt-4 inline-flex items-center justify-center px-4 py-2 text-sm font-medium tracking-wide text-white transition-colors duration-200 rounded-md bg-neutral-950 hover:bg-neutral-900"
                        onClick={() => setStep("payment")}
                    >
                        Continuar
                    </button>
                )}
            </div>
        );
    }
    return component;
}

interface EfectivoProps {
    ordersCartStoreDtoForm: UseFormReturn<OrdersCartStoreDto>;
    ordersCartStoreDto: OrdersCartStoreDto;
    onClose: () => void;
}
function Efectivo({
    onClose,
    ordersCartStoreDto,
    ordersCartStoreDtoForm,
}: EfectivoProps) {
    const cartStore = useCartStore();
    const ordersStoreMutation = ordersStoreApi();
    const cartDestroyMutation = cartDestroyApi();
    const authStore = useAuthStore();
    const { io } = useSocketStore();
    function onOrderEfectivo() {
        sweetModal({
            title: "¿Estas seguro de realizar esta compra?",
            text: "",
        }).then(({ isConfirmed }) => {
            if (isConfirmed) {
                const { address, reference, ...rest } = ordersCartStoreDto;

                ordersStoreMutation.mutate(
                    {
                        ...rest,
                        address: `${address} - ${reference}`,
                        status_order_id: STATUSORDER.confirmado,
                    },
                    {
                        async onSuccess(data) {
                            onClose();
                            cartStore.methods.cleanStorage();
                            ordersCartStoreDtoForm.reset();
                            io?.emit("notifications:order-store", {
                                user_id: authStore.state
                                    ? authStore.state.id
                                    : null,
                                total: data.order.total,
                                order_code: data.order.order_code,
                            });
                            if (authStore.state) {
                                await Promise.all(
                                    cartStore.state.cart!.map(
                                        async (cart) =>
                                            await cartDestroyMutation.mutateAsync(
                                                {
                                                    product_id: cart.id,
                                                    variant_id: cart.variant.id,
                                                }
                                            )
                                    )
                                );
                            }
                            sweetModal({
                                icon: "success",
                                html: `<div class="p-3"><div class="flex items-center justify-center mb-2">
                                                <h2 class="text-2xl font-semibold text-primary dark:text-white text-center">Pago Exitoso</h2>
                                            </div>
                                            <div class="text-center">
                                                 <i class="fa-solid fa-circle-check text-green-500 text-6xl"></i>
                                                <p class="mt-4 text-lg text-gray-600 dark:text-gray-300 w-full">Su pago se realizó correctamente  <b class='block w-full'>${data.order.order_code}</b></p>
                                            </div>
                                            <div class="flex justify-center">
                                                <a  target='_blank' href='${enviroments.VITE_URL}/pedidos' class="px-4 py-2 bg-primary text-white rounded-lg  focus:outline-none mt-3">
                                                Ver Pedido
                                                </a>
                                            </div>
                                            </div>
                    `,
                                showCloseButton: true,
                                sweetWidth: "600px",
                            });
                        },
                        onError(error) {
                            onClose();
                            sweetModal({
                                icon: "danger",
                                title: "Hubo un error al realizar esta orden",
                                text: JSON.stringify(error.message),
                                showCloseButton: true,
                            }).then(() => {
                                window.location.reload();
                            });
                        },
                    }
                );
            }
        });
    }

    return (
        <div class="dark:text-white">
            <h1 class="text-xl font-bold text-center py-3 text-primary dark:text-white">
                Pago en Efectivo
            </h1>
            <span class="mx-auto text-xl mb-2 block">
                {formatMoney(ordersCartStoreDtoForm.getValues("total"))}
            </span>
            <div class="flex flex-col gap-3">
                <div class="flex items-center gap-2">
                    <span class="font-semibold">Metodo de pago:</span>
                    <span>Efectivo</span>
                </div>
                <div class="flex items-center gap-2">
                    <span class="font-semibold">Telefono:</span>
                    <span>{ordersCartStoreDto.telephone}</span>
                </div>
                <div class="flex items-center gap-2">
                    <span class="font-semibold">Distrito - Ubigeo:</span>
                    <span>{ordersCartStoreDto.district_id}</span>
                </div>
                <div class="flex items-center gap-2">
                    <span class="font-semibold">Dirección:</span>
                    <span>{ordersCartStoreDto.address}</span>
                </div>
                <div class="flex items-center gap-2">
                    <span class="font-semibold">Referencia:</span>
                    <span>{ordersCartStoreDto.reference}</span>
                </div>
            </div>
            <button
                type="button"
                aria-label="realizar pedido"
                class="bg-primary px-4 py-2 rounded-md text-white uppercase font-bold mt-5 mb-2 text-xs"
                onClick={onOrderEfectivo}
            >
                Realizar Pedido
            </button>
        </div>
    );
}
interface QrYapePlinProps {
    ordersCartStoreDtoForm: UseFormReturn<OrdersCartStoreDto>;
    ordersCartStoreDto: OrdersCartStoreDto;
    onClose: () => void;
}
function QrYapePlin({
    onClose,
    ordersCartStoreDto,
    ordersCartStoreDtoForm,
}: QrYapePlinProps) {
    const information = useInformationStore();
    const ordersStoreMutation = ordersStoreApi();
    const cartDestroyMutation = cartDestroyApi();
    const cartStore = useCartStore();
    const authStore = useAuthStore();
    const transferenciaForm = useForm<OrdersCartStoreDto>({
        resolver: valibotVigilio(ordersStoreDto),
        defaultValues: {
            ...ordersCartStoreDto,
            pay_method_id: PAYMETHOD.yape,
            status_order_id: STATUSORDER.pendiente,
        },
    });

    const { io } = useSocketStore();
    function onTransferenciaStore(data: OrdersCartStoreDto) {
        if (!data.transferencia_image) {
            transferenciaForm.setError("transferencia_image", {
                message: "Este campo es obligatorio.",
            });
            return;
        }
        sweetModal({
            customIcon:
                "<i class='fas fa-store text-5xl dark:text-white text-secondary-dark mb-2' />",
            title: "¿Estás seguro de realizar este orden?",
            text: "",
            showCloseButton: true,
            showCancelButton: true,
        }).then(({ isConfirmed }) => {
            if (isConfirmed) {
                ordersStoreMutation.mutate(data, {
                    async onSuccess(data) {
                        io?.emit("notifications:order-store", {
                            order_code: data.order.order_code,
                            total: data.order.total,
                        });
                        if (authStore.state) {
                            await Promise.all(
                                cartStore.state.cart!.map(
                                    async (cart) =>
                                        await cartDestroyMutation.mutateAsync({
                                            product_id: cart.id,
                                            variant_id: cart.variant.id,
                                        })
                                )
                            );
                        }
                        sweetModal({
                            icon: "success",
                            html: `<div class="p-3"><div class="flex items-center justify-center mb-2">
                                        <h2 class="text-2xl font-semibold text-primary dark:text-white text-center">Se envió su orden correctamente</h2>
                                    </div>
                                    <div class="text-center">
                                         <i class="fa-solid fa-circle-check text-green-500 text-6xl"></i>
                                        <p class="mt-4 text-lg text-gray-600 dark:text-gray-300 w-full">Se realizó orden correctamente <b class='block w-full'>${data.order.order_code}</b></p>
                                    </div>
                                    <div class="flex justify-center">
                                        <a  target='_blank' href='${enviroments.VITE_URL}/pedidos' class="px-4 py-2 bg-primary text-white rounded-lg  focus:outline-none mt-3">
                                        Ver Pedido
                                        </a>
                                    </div>
                                    </div>
            `,
                            showCloseButton: true,
                            sweetWidth: "600px",
                        });
                        onClose();
                        cartStore.methods.cleanStorage();
                        ordersCartStoreDtoForm.reset();
                    },
                    onError(error) {
                        handlerError(transferenciaForm, error);
                    },
                });
            }
        });
    }
    return (
        <div class="dark:text-white">
            <h1 class="text-xl font-bold text-center py-3">
                {information.state!.metodos_pago.qrYape ? "Yape Qr " : ""}
                {information.state!.metodos_pago.qrPlin ? "o Plin Qr" : ""}
            </h1>
            <p class="text-sm">
                Tu pedido no se procesará hasta que se haya recibido el importe
                en nuestra cuenta.
            </p>
            <span class="font-bold">
                {formatMoney(ordersCartStoreDtoForm.getValues("total"))}
            </span>
            <div class="flex gap-4 items-center justify-center">
                {information.state!.metodos_pago.qrYape ? (
                    <div class="flex flex-col items-center justify-center rounded-md">
                        <img
                            class="mx-auto mt-2  w-[200px] h-[200px] lg:w-[300px] lg:h-[300px] object-contain rounded-md"
                            width={500}
                            height={500}
                            src={
                                printFileWithDimension(
                                    information.state!.metodos_pago.qrYape,
                                    500
                                )[0]
                            }
                            alt="qr"
                        />
                        <img
                            src={yapeImage()}
                            width={30}
                            class="mt-2"
                            height={30}
                            alt="yape"
                        />
                    </div>
                ) : null}
                {information.state!.metodos_pago.qrPlin &&
                information.state!.metodos_pago.qrYape ? (
                    <span class="font-bold text-xl">ó</span>
                ) : null}

                {information.state!.metodos_pago.qrPlin ? (
                    <div class="flex flex-col items-center justify-center rounded-md">
                        <img
                            class="mx-auto mt-2 rounded-md w-[200px] h-[200px] lg:w-[300px] lg:h-[300px] object-contain "
                            width={500}
                            height={500}
                            src={
                                printFileWithDimension(
                                    information.state!.metodos_pago.qrPlin,
                                    500
                                )[0]
                            }
                            alt="qr"
                        />
                        <img
                            src={plinImage()}
                            width={30}
                            class="mt-2 rounded-md"
                            height={30}
                            alt="plin"
                        />
                    </div>
                ) : null}
            </div>

            <Form
                className="mt-3"
                {...transferenciaForm}
                onSubmit={onTransferenciaStore}
            >
                <Form.control.file
                    title={`Sube tu comprobante ${
                        information.state!.metodos_pago.qrYape ? "yape" : ""
                    } ${
                        information.state!.metodos_pago.qrYape &&
                        information.state!.metodos_pago.qrPlin
                            ? "ó"
                            : ""
                    } ${information.state!.metodos_pago.qrPlin ? "plin" : ""}`}
                    accept="image/png, image/jpeg, image/jpg, image/webp, image/gif"
                    name={"transferencia_image" as keyof OrdersStoreDto}
                    typeFile="image"
                />
                <Form.button.submit
                    className="mx-auto py-3 px-4 rounded-md mt-3"
                    disabled={ordersStoreMutation.isLoading || false}
                    isLoading={ordersStoreMutation.isLoading || false}
                    title="Subir imagen"
                />
            </Form>
        </div>
    );
}
interface NiubizCardFormProps {
    ordersCartStoreDtoForm: UseFormReturn<OrdersCartStoreDto>;
    ordersCartStoreDto: OrdersCartStoreDto;
    onClose: () => void;
}
function NiubizCardForm({
    ordersCartStoreDtoForm,
    ordersCartStoreDto,
    onClose,
}: NiubizCardFormProps) {
    const cartStore = useCartStore();
    const authStore = useAuthStore();
    const information = useInformationStore();
    const { io } = useSocketStore();

    // 4551708161768059	03/2028	111	000
    const creditCardForm = useForm<CreditCardSchema>({
        resolver: valibotVigilio(creditCardSchema),
    });
    const cardNumber = creditCardForm.watch("cardNumber");
    // const niubizPaymentMutation = niubizPaymentApi();

    const date = creditCardForm.watch("expiration");

    useEffect(() => {
        if (date) {
            let formattedValue = date.replace(/\D/g, "");

            if (formattedValue.length >= 3) {
                formattedValue = `${formattedValue.slice(
                    0,
                    2
                )}/${formattedValue.slice(2)}`;
            }

            if (formattedValue !== date) {
                creditCardForm.setValue("expiration", formattedValue);
            }
        }
    }, [date, creditCardForm.setValue]);

    async function onPaymentForm(body: CreditCardSchema) {
        const { address, reference, ...rest } = ordersCartStoreDto;

        sweetModal({
            customIcon:
                "<i class='fas fa-store text-5xl dark:text-white text-secondary-dark mb-2' />",
            title: "¿Estás seguro de realizar el pago para esta orden?",
            text: "",
            showCloseButton: true,
            showCancelButton: true,
        }).then(({ isConfirmed }) => {
            if (isConfirmed) {
                // niubizPaymentMutation.mutate(
                //     {
                //         ...rest,
                //         address: `${address} - ${reference}`,
                //         creditCard: body,
                //         pay_method_id: PAYMETHOD.tarjeta,
                //         yape: null,
                //     },
                //     {
                //         onSuccess(data) {
                //             creditCardForm.reset();
                //             onClose();
                //             cartStore.methods.cleanStorage();
                //             ordersCartStoreDtoForm.reset();
                //             sweetModal({
                //                 icon: "success",
                //                 html: `<div class="p-3"><div class="flex items-center justify-center mb-2">
                //                             <h2 class="text-2xl font-semibold text-primary dark:text-white text-center">Pago Exitoso</h2>
                //                         </div>
                //                         <div class="text-center">
                //                              <i class="fa-solid fa-circle-check text-green-500 text-6xl"></i>
                //                             <p class="mt-4 text-lg text-gray-600 dark:text-gray-300 w-full">Su pago se realizó correctamente  <b class='block w-full'>${data.order.order_code}</b></p>
                //                         </div>
                //                         <div class="flex justify-center">
                //                             <a  target='_blank' href='${enviroments.VITE_URL}/pedidos' class="px-4 py-2 bg-primary text-white rounded-lg  focus:outline-none mt-3">
                //                             Ver Pedido
                //                             </a>
                //                         </div>
                //                         </div>
                // `,
                //                 showCloseButton: true,
                //                 sweetWidth: "600px",
                //             });
                //             io?.emit("notifications:order-store", {
                //                 user_id: authStore.state
                //                     ? authStore.state.id
                //                     : null,
                //                 total: data.order.total,
                //                 order_code: data.order.order_code,
                //             });
                //         },
                //         onError(error) {
                //             creditCardForm.reset();
                //             onClose();
                //             sweetModal({
                //                 icon: "danger",
                //                 title: "Hubo un error al realizar esta orden",
                //                 text: error.message,
                //                 showCloseButton: true,
                //             });
                //         },
                //     }
                // );
            }
        });
    }

    return (
        <>
            <h1 class="text-xl font-bold text-center py-3 text-primary dark:text-white">
                Tarjeta de credito/debito
            </h1>
            <Form onSubmit={onPaymentForm} {...creditCardForm}>
                <div className="flex gap-2">
                    <Form.control.web
                        ico={<i class="fa-duotone fa-user" />}
                        title="Nombre"
                        name={"firstName" as keyof CreditCardSchema}
                        placeholder="Nombre"
                    />
                    <Form.control.web
                        ico={<i class="fa-duotone fa-user" />}
                        title="Apellido"
                        name={"lastName" as keyof CreditCardSchema}
                        placeholder="Apellido"
                    />
                </div>
                <div class="w-full flex gap-1 items-center">
                    <Form.control.web
                        type="tel"
                        title="Número de tarjeta"
                        name={"cardNumber" as keyof CreditCardSchema}
                        ico={<i class="fa-duotone fa-credit-card-front" />}
                        placeholder="Numero de tarjeta"
                    />
                    {cardNumber &&
                    (visaRegex.test(cardNumber) ||
                        cardNumber.startsWith("4")) ? (
                        <img
                            width={30}
                            height={30}
                            src={visaImage()}
                            alt="visa"
                        />
                    ) : null}
                    {cardNumber &&
                    (mastercardRegex.test(cardNumber) ||
                        cardNumber.startsWith("5")) ? (
                        <img
                            width={30}
                            height={30}
                            src={mastercardImage()}
                            alt="mastercard"
                        />
                    ) : null}
                </div>
                <div className="flex gap-2">
                    <Form.control.web
                        title="MM/AA"
                        name={"expiration" as keyof CreditCardSchema}
                        placeholder="XX/XX"
                        ico={<i class="fa-duotone fa-calendar-range" />}
                    />
                    <Form.control.web
                        title="CCV"
                        type="text"
                        name={"cvv2" as keyof CreditCardSchema}
                        ico={<i class="fa-duotone fa-credit-card" />}
                        placeholder="Fecha de expiracion"
                    />
                </div>
                <Form.control.web
                    type="email"
                    title="Email"
                    name={"email" as keyof CreditCardSchema}
                    ico={<i class="fa-duotone fa-envelope" />}
                    placeholder="Email"
                />
                <>
                    {information.state!.enabledClientPayComision ? (
                        <span class="text-xs text-terciary">
                            Incluye comisión de Niubiz +{" "}
                            {enviroments.VITE_PASARELA_COMISION}% +{" "}
                            {enviroments.VITE_PASARELA_COMISION_IMPUESTO}% IGV.{" "}
                            <a
                                class="text-primary hover:underline"
                                href={enviroments.VITE_NIUBIZ_WEB}
                                target="_blank"
                                rel="noreferrer"
                            >
                                Más información
                            </a>
                        </span>
                    ) : null}
                </>

                <Form.button.submit
                    className="flex justify-center w-full py-3"
                    title={`Pagar ${formatMoney(
                        information.state?.enabledClientPayComision
                            ? ordersCartStoreDto.total +
                                  pasarelaComision(ordersCartStoreDto.total)
                            : ordersCartStoreDto.total
                    )}`}
                    // disabled={niubizPaymentMutation.isLoading || false}
                    // isLoading={niubizPaymentMutation.isLoading || false}
                />
            </Form>
        </>
    );
}

interface TransferenciaPaymentProps {
    ordersCartStoreDtoForm: UseFormReturn<OrdersCartStoreDto>;
    ordersCartStoreDto: OrdersCartStoreDto;
    onClose: () => void;
    dolarNow: number;
}
function TransferenciaPayment({
    onClose,
    ordersCartStoreDto,
    ordersCartStoreDtoForm,
    dolarNow,
}: TransferenciaPaymentProps) {
    const information = useInformationStore();
    const ordersStoreMutation = ordersStoreApi();
    const cartStore = useCartStore();
    const authStore = useAuthStore();
    const cartDestroyMutation = cartDestroyApi();
    const transferenciaForm = useForm<OrdersCartStoreDto>({
        resolver: valibotVigilio(ordersStoreDto),
        defaultValues: {
            ...ordersCartStoreDto,
            pay_method_id: PAYMETHOD.transferencia,
            status_order_id: STATUSORDER.pendiente,
        },
    });

    const { io } = useSocketStore();
    function onTransferenciaStore(data: OrdersCartStoreDto) {
        if (!data.transferencia_image) {
            transferenciaForm.setError("transferencia_image", {
                message: "Este campo es obligatorio.",
            });
            return;
        }
        sweetModal({
            customIcon:
                "<i class='fas fa-store text-5xl dark:text-white text-secondary-dark mb-2' />",
            title: "¿Estás seguro de realizar este orden?",
            text: "",
            showCloseButton: true,
            showCancelButton: true,
        }).then(({ isConfirmed }) => {
            if (isConfirmed) {
                ordersStoreMutation.mutate(data, {
                    async onSuccess(data) {
                        io?.emit("notifications:order-store", {
                            order_code: data.order.order_code,
                            total: data.order.total,
                        });
                        if (authStore.state) {
                            await Promise.all(
                                cartStore.state.cart!.map(
                                    async (cart) =>
                                        await cartDestroyMutation.mutateAsync({
                                            product_id: cart.id,
                                            variant_id: cart.variant.id,
                                        })
                                )
                            );
                        }
                        sweetModal({
                            icon: "success",
                            html: `<div class="p-3"><div class="flex items-center justify-center mb-2">
                                        <h2 class="text-2xl font-semibold text-primary dark:text-white text-center">Se envió su orden correctamente</h2>
                                    </div>
                                    <div class="text-center">
                                         <i class="fa-solid fa-circle-check text-green-500 text-6xl"></i>
                                        <p class="mt-4 text-lg text-gray-600 dark:text-gray-300 w-full">Se realizó orden correctamente <b class='block w-full'>${data.order.order_code}</b></p>
                                    </div>
                                    <div class="flex justify-center">
                                        <a  target='_blank' href='${enviroments.VITE_URL}/pedidos' class="px-4 py-2 bg-primary text-white rounded-lg  focus:outline-none mt-3">
                                        Ver Pedido
                                        </a>
                                    </div>
                                    </div>`,
                            showCloseButton: true,
                            sweetWidth: "600px",
                        });
                        onClose();
                        cartStore.methods.cleanStorage();
                        ordersCartStoreDtoForm.reset();
                    },
                    onError(error) {
                        handlerError(transferenciaForm, error);
                    },
                });
            }
        });
    }
    return (
        <div class="dark:text-white">
            <h1 class="text-xl font-bold text-center py-3">
                Transferencia Bancaria
            </h1>
            <p class="text-sm">
                Realiza tu pago directamente en nuestra cuentas bancaria. Por
                favor, usa el numero del pedido como referencia de pago. Tu
                pedido no se procesará hasta que se haya recibido el importe en
                nuestra cuenta.
            </p>
            <span class="font-bold">
                {formatMoney(cartStore.methods.getTotal())} /{" "}
                {formatDolares(cartStore.methods.getTotal() / dolarNow)}
            </span>
            {information.state!.bancos.map((bank) => {
                const tr = information.state!.transferencias!;
                const money = information.state!.money;
                return (
                    <Fragment key={bank.key}>
                        {tr[bank.key as keyof typeof tr] &&
                        verifyBank(tr[bank.key as keyof typeof tr]) ? (
                            <>
                                <div class="flex flex-col my-2">
                                    <span class="font-bold text-primary dark:text-white">
                                        {bank.value}
                                    </span>
                                    {tr[bank.key as keyof typeof tr].titular}
                                    <br />
                                    {tr[bank.key as keyof typeof tr][
                                        money.simbolo
                                    ] ? (
                                        <b class="text-sm">
                                            {money.money}:{" "}
                                            <span class="font-normal">
                                                {
                                                    tr[
                                                        bank.key as keyof typeof tr
                                                    ][money.simbolo]
                                                }
                                            </span>
                                        </b>
                                    ) : null}
                                    {tr[bank.key as keyof typeof tr].dolares ? (
                                        <b class="text-sm">
                                            Dolares:{" "}
                                            <span class="font-normal">
                                                {
                                                    tr[
                                                        bank.key as keyof typeof tr
                                                    ]
                                                }
                                            </span>
                                        </b>
                                    ) : null}
                                </div>
                                <div class="h-[1px] w-full bg-terciary" />
                            </>
                        ) : null}
                    </Fragment>
                );
            })}

            <Form
                className="mt-3"
                {...transferenciaForm}
                onSubmit={onTransferenciaStore}
            >
                <Form.control.file
                    title="Imagen de voucher"
                    accept="image/png, image/jpeg, image/jpg, image/webp, image/gif"
                    name={"transferencia_image" as keyof OrdersStoreDto}
                    typeFile="image"
                />
                <Form.button.submit
                    className="mx-auto py-3 px-4 rounded-md mt-3"
                    disabled={ordersStoreMutation.isLoading || false}
                    isLoading={ordersStoreMutation.isLoading || false}
                    title="Subir imagen"
                />
            </Form>
        </div>
    );
}

interface PaypalPaymentProps {
    ordersCartStoreDto: OrdersCartStoreDto;
    onClose: () => void;
    dolarValue: number | null;
}
function PaypalPayment({
    onClose,
    ordersCartStoreDto,
    dolarValue,
}: PaypalPaymentProps) {
    const information = useInformationStore();
    const transferenciaForm = useForm<OrdersCartStoreDto>({
        resolver: valibotVigilio(ordersStoreDto),
        defaultValues: {
            ...ordersCartStoreDto,
            pay_method_id: PAYMETHOD.transferencia,
            status_order_id: STATUSORDER.pendiente,
        },
    });
    const paypalPaymentMutation = paypalPaymentApi();

    function onPaymentPaypal() {
        paypalPaymentMutation.mutate(
            { ...ordersCartStoreDto, pay_method_id: PAYMETHOD.paypal },
            {
                onSuccess(data) {
                    // Get: "https://www.sandbox.paypal.com/checkoutnow?token=9GV26179CU8491828"
                    window.location.href = data.result.links[1].href;
                    onClose();
                },
                onError(error) {
                    handlerError(transferenciaForm, error);
                },
            }
        );
    }

    return (
        <div>
            <h1 class="text-xl font-bold text-center py-3 dark:text-white ">
                <i class="fa-brands fa-paypal" /> Paypal
            </h1>
            <span class="text-2xl font-bold text-center block dark:text-white">
                {dolarValue ? (
                    formatDolares(
                        information.state!.enabledClientPayComision
                            ? paypalComision(
                                  ordersCartStoreDto.total,
                                  dolarValue
                              )
                            : ordersCartStoreDto.total / dolarValue
                    )
                ) : (
                    <LoaderSubmit />
                )}
            </span>
            {information.state?.enabledClientPayComision ? (
                <>
                    <p class="text-sm dark:text-white">
                        PayPal solo permite transacciones en dólares
                        estadounidenses y aplica una comisión del{" "}
                        {enviroments.VITE_PAYPAL_COMISION}% más $
                        {enviroments.VITE_PAYPAL_TRANSACTION} USD por cada
                        transacción. Por esta razón, el precio original se
                        convierte a dólares, y se le añade la comisión
                        correspondiente.
                    </p>
                    <a
                        class="text-primary hover:underline text-xs"
                        target="_blank"
                        rel="noreferrer"
                        href="https://www.paypal.com/pe/webapps/mpp/business-support/pricing#:~:text=Comisi%C3%B3n%20por%20transacci%C3%B3n%205.40%20%25%20%2B%20USD,para%20solicitar%20nuestras%20tarifas%20preferenciales."
                    >
                        Más información
                    </a>
                </>
            ) : (
                <p class="text-sm dark:text-white">
                    PayPal solo permite transacciones en dólares estadounidenses
                    por esta razón, el precio original se convierte a dólares.
                </p>
            )}

            <button
                class="bg-primary px-4 py-2 rounded-md text-white block mx-auto mt-4"
                type="button"
                aria-label="pay to paypal"
                onClick={onPaymentPaypal}
            >
                {paypalPaymentMutation.isLoading ? (
                    <LoaderSubmit />
                ) : (
                    "Realizar pago"
                )}
            </button>
        </div>
    );
}

export default Niubiz;
