import KRGlue from "@lyracom/embedded-form-glue";
import { useSignal } from "@preact/signals";
import { useEffect } from "preact/hooks";
import { sweetModal } from "@vigilio/sweet";
import type { UseFormReturn } from "react-hook-form";
import useSocketStore from "~/stores/socket.store";
import Loading from "@/admin/components/Loading";
import { PAYMETHOD } from "@/orders/libs";
import {
    izipayPaymentApi,
    izipayPaymentValidateApi,
} from "@/payments/apis/izipay.payment.api";
import { storageEmpresa } from "@/empresas/stores/empresa.store";
import { OrdersCartStoreDto } from "@/orders/dtos/orders-cart.dto";
import useAuthStore from "@/auth/stores/auth.store";
import useCartStore from "../stores/cart.store";
import { productOBJ } from "@/products/libs/helpers";
import { cartDestroyApi } from "../apis/cart.destroy.api";

interface IzipayFormProps {
    order: OrdersCartStoreDto;
    onClose: () => void;
    ordersCartStoreDtoForm: UseFormReturn<OrdersCartStoreDto>;
}
const IzipayForm = ({
    order,
    onClose,
    ordersCartStoreDtoForm,
}: IzipayFormProps) => {
    const isShow = useSignal<boolean>(false);
    const error = useSignal<Error | null>(null);
    const izipayPaymentMutation = izipayPaymentApi();
    const izipayPaymentValidateMutation = izipayPaymentValidateApi();
    const { io } = useSocketStore();
    const authStore = useAuthStore();
    const cartStore = useCartStore();
    const cartDestroyMutation = cartDestroyApi();

    useEffect(() => {
        payment();
    }, []);

    function payment() {
        izipayPaymentMutation.mutate(
            { ...order, pay_method_id: PAYMETHOD.tarjeta },
            {
                onSuccess(data) {
                    KRGlue.loadLibrary(
                        "https://static.micuentaweb.pe",
                        storageEmpresa!.metodos_pago.izipay.izipay_public_key!
                    )
                        .then(({ KR }) =>
                            KR.setFormConfig({ formToken: data.token })
                        )
                        .then(({ KR }) => KR.onSubmit(validatePayment))
                        .then(({ KR }) => KR.renderElements("#form-niubiz"))
                        .then(({ KR, result }) => KR.showForm(result.formId))
                        .then(() => {
                            // que de click al boton
                            const form = document.querySelector(
                                "#form-niubiz .kr-popin-button"
                            ) as HTMLButtonElement;
                            isShow.value = true;
                            form?.click();
                        })
                        .catch((err) => {
                            error.value = err;
                            isShow.value = true;
                        });
                },
                onError() {
                    isShow.value = true;
                },
            }
        );
    }

    function validatePayment(body: KRPaymentResponse) {
        izipayPaymentValidateMutation.mutate(body, {
            async onSuccess(data) {
                const buttonClose = document.querySelector(
                    "#form-niubiz  .fi-x-circle"
                ) as HTMLButtonElement;
                buttonClose.click();
                onClose();
                ordersCartStoreDtoForm.reset();
                io?.emit("notifications:order-store", {
                    total: data.order.total,
                    order_code: data.order.order_code,
                    user_id: data.order.user_id ?? null,
                });
                if (authStore.state) {
                    await Promise.all(
                        cartStore.state.cart!.map(
                            async (cart) =>
                                await cartDestroyMutation.mutateAsync({
                                    ...productOBJ(cart.id),
                                    variant_id: cart.variant
                                        ? cart.variant.id
                                        : null,
                                })
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
                                <p class="mt-4 text-lg  w-full">Su pago se realizó correctamente  <b class='block w-full'>${data.order.order_code}</b></p>
                            </div>
                            </div>
    `,
                    showCloseButton: true,
                    sweetWidth: "600px",
                });
            },
        });
    }

    return (
        <div>
            <h1 class="text-xl font-bold text-center py-3 text-primary dark:text-white">
                Tarjeta de credito/debito
            </h1>
            <div id="form-niubiz" class="w-full">
                <div class="kr-embedded w-full" kr-popin="kr-popin">
                    <div class="kr-pan" />
                    <div class="!flex justify-between w-full gap-1 items-center">
                        <div class="kr-expiry" />
                        <div class="kr-security-code" />
                    </div>
                    <div class="kr-installment-number !hidden" />
                    <div class="kr-first-installment-delay !hidden" />
                    <div class="kr-card-holder-name" />
                    <div class="kr-card-holder-mail" />
                    <button class="kr-payment-button" type="button" />
                </div>
            </div>
            {izipayPaymentMutation.isLoading || !isShow.value ? (
                <Loading className="h-[300px]" />
            ) : null}
            {izipayPaymentMutation.isError ||
            izipayPaymentValidateMutation.isError ? (
                <p class="text-xs text-danger font-bold">
                    Error:{" "}
                    {izipayPaymentMutation.error?.message ??
                        izipayPaymentValidateMutation.error?.message ??
                        "Error al hacer pago"}
                </p>
            ) : null}
        </div>
    );
};

export default IzipayForm;
