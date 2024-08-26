import KRGlue from "@lyracom/embedded-form-glue";
import { useSignal } from "@preact/signals";
import { useEffect } from "preact/hooks";
import { izipayPaymentApi } from "@/payments/apis/izipay.payment.api";
import { izipayPaymentValidateApi } from "@/payments/apis/izipay.payment.validate.api";
import type { OrdersCartStoreDto } from "@/orders/dtos/orders-cart.dto";
import { sweetModal } from "@vigilio/sweet";
import enviroments from "~/config";
import useCartStore from "../stores/cart.store";
import type { UseFormReturn } from "react-hook-form";
import useSocketStore from "~/stores/socket.store";
import useAuthStore from "@/auth/stores/auth.store";
import Loading from "@/admin/components/Loading";
import { PAYMETHOD } from "@/orders/libs";

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
	const cartStore = useCartStore();
	const { io } = useSocketStore();
	const authStore = useAuthStore();

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
						enviroments.VITE_IZIPAY_PUBLIC_KEY,
					)
						.then(({ KR }) => KR.setFormConfig({ formToken: data.token }))
						.then(({ KR }) => KR.onSubmit(validatePayment))
						.then(({ KR }) => KR.renderElements("#form-niubiz"))
						.then(({ KR, result }) => KR.showForm(result.formId))
						.then(() => {
							// que de click al boton
							const form = document.querySelector(
								"#form-niubiz .kr-popin-button",
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
			},
		);
	}

	function validatePayment(body: KRPaymentResponse) {
		izipayPaymentValidateMutation.mutate(body, {
			onSuccess(data) {
				const buttonClose = document.querySelector(
					"#form-niubiz  .fi-x-circle",
				) as HTMLButtonElement;
				buttonClose.click();
				onClose();
				cartStore.methods.cleanStorage();
				ordersCartStoreDtoForm.reset();
				io?.emit("notifications:order-store", {
					user_id: authStore.state ? authStore.state.id : null,
					total: data.order.total,
					order_code: data.order.order_code,
				});
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
		});
	}

	return (
		<div>
			<h1 class="text-xl font-bold text-center py-3 text-primary dark:text-white">
				Tarjeta de credito/debito - YAPE
			</h1>
			<div id="form-niubiz" class="w-full">
				<div class="kr-embedded w-full" kr-popin="kr-popin" />
				<style jsx>{`
                    #form-niubiz .kr-popin-button {
                        width: 100%;
                        background-color: var(--primary) !important;
                        color: white !important;
                    }
                `}</style>
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
