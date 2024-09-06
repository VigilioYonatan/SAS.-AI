import { formatMoney } from "../libs/helpers";
import Form from "~/components/form";
import { useForm } from "react-hook-form";
import { valibotVigilio } from "~/libs/valibot";
import { useEffect, useMemo } from "preact/hooks";
import { sweetAlert, sweetModal } from "@vigilio/sweet";
// import useSocketStore from "~/stores/socket.store";
import useCartStore from "../stores/cart.store";
import ProductCart from "./ProductCart";
import {
    ordersStoreDto,
    type OrdersStoreDto,
} from "@/orders/dtos/orders.store.dto";
import { handlerError } from "~/libs/helpers";
import useAuthStore from "@/auth/stores/auth.store";
import { PAYMETHOD, STATUSORDER } from "@/orders/libs";
import { ordersStoreApi } from "@/orders/apis/orders.store.api";
import { printProductVariant, productOBJ } from "@/products/libs/helpers";
import { cartDestroyApi } from "../apis/cart.destroy.api";
import Hr from "@/web/components/Hr";
import { ProductsNormalSchemaFromServer } from "@/products/schemas/products_normal.schema";
import { floorsIndexApi } from "@/orders/apis/mesas/floors.index.api";
import { floorMesasIndexApi } from "@/orders/apis/mesas/floors.mesas.index.api";
import { useSignal } from "@preact/signals";
import { storageEmpresa } from "@/empresas/stores/empresa.store";

function AdminCart() {
    const cartStore = useCartStore();
    const authStore = useAuthStore();
    const ordersStoreApiMutation = ordersStoreApi();
    const cartDestroyMutation = cartDestroyApi();
    const floorsIndexQuery = floorsIndexApi();
    const floorMesasQuery = floorMesasIndexApi();
    const isOpen = useSignal(true);

    const ordersStoreDtoForm = useForm<OrdersStoreDto>({
        resolver: valibotVigilio(ordersStoreDto),
        defaultValues: {
            address: null,
            telephone: null,
            status_order_id: STATUSORDER.confirmado, //confirmado
            pay_method_id: PAYMETHOD.efectivo, //efectivo,
            invoice: null,
            description: null,
            user_id: authStore.state ? authStore.state!.id : null,
            isDelivery: false,
            transferencia_image: null,
            city_id: null,
            map_marker: null,
            floor_id: null,
            mesa_id: null,
            fullName: null,
        },
        mode: "all",
    });
    const floorId = ordersStoreDtoForm.watch("floor_id");

    const arrayFloors = useMemo(
        () =>
            floorsIndexQuery.isSuccess && floorsIndexQuery.data
                ? floorsIndexQuery.data.data.map((floor) => ({
                      key: floor.id,
                      value: floor.name,
                  }))
                : [],
        [floorsIndexQuery]
    );
    const arrayMesas = useMemo(
        () =>
            floorMesasQuery.isSuccess && floorMesasQuery.data
                ? floorMesasQuery.data.data.map((floor) => ({
                      key: floor.id,
                      value: floor.mesa_code,
                  }))
                : [],
        [floorMesasQuery]
    );
    useEffect(() => {
        ordersStoreDtoForm.unregister("mesa_id");
        if (floorId) {
            floorMesasQuery.mutate(floorId);
        }
    }, [floorId]);
    function onOrder(body: OrdersStoreDto) {
        if (storageEmpresa?.tipo_empresa.tipo_servicio_id === 2) {
            if (!body.floor_id) {
                ordersStoreDtoForm.setError("floor_id", {
                    message: "Este campo es obligatorio.",
                });
                return;
            }
            if (!body.mesa_id) {
                ordersStoreDtoForm.setError("mesa_id", {
                    message: "Este campo es obligatorio.",
                });
                return;
            }
        }
        sweetModal({
            customIcon:
                "<i class='fas fa-store text-5xl dark:text-white text-secondary-dark mb-2' />",
            title: "¿Estás seguro de realizar este orden?",
            showCloseButton: true,
            showCancelButton: true,
            text: `
            <div class="flex flex-col gap-2">
                <p>
                    Orden de estado: <b>Confirmado</b>
                </p>
                <p>
                    Total: <b>${
                        /* @ts-ignore */
                        formatMoney(ordersStoreDtoForm.getValues("total"))
                    }</b>
                </p>
            </div>
            `,
        }).then(({ isConfirmed }) => {
            if (isConfirmed) {
                ordersStoreApiMutation.mutate(body, {
                    async onSuccess(data) {
                        sweetAlert({
                            icon: "success",
                            title: `<p>Se realizó orden correctamente <b>${data.order.order_code}</b></p>`,
                        });
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
                        cartStore.methods.cleanStorage();
                        ordersStoreDtoForm.reset();
                    },
                    onError(error) {
                        handlerError(ordersStoreDtoForm, error);
                    },
                });
            }
        });
    }
    useEffect(() => {
        if (cartStore.state.cart) {
            /* @ts-ignore */
            ordersStoreDtoForm.setValue("total", cartStore.methods.getTotal());
            ordersStoreDtoForm.setValue(
                "details_orders",
                cartStore.state.cart.map((cart) => ({
                    price: cart.subtotal,
                    product_id: cart.id,
                    quantity: cart.quantity,
                    coupon: null,
                    variante: cart.variant
                        ? printProductVariant(
                              cart as ProductsNormalSchemaFromServer,
                              cart.variant
                          )
                              .map((variant) => {
                                  // si es color que muestre el color, sino solo el valor
                                  return variant?.features.map(
                                      (feature) => feature?.description
                                  );
                              })
                              .join(" - ")
                        : null,
                    ...productOBJ(cart.id),
                    variant_id: cart.variant ? cart.variant.id : null,
                }))
            );
        }
    }, [cartStore.state.cart]);

    useEffect(() => {
        if (!cartStore.computed.showCartLength) {
            // if cart is empty that  reset form
            ordersStoreDtoForm.reset();
        }
    }, [cartStore.computed.showCartLength]);
    return (
        <div
            class={`${
                cartStore.dropdown.value
                    ? "border-l border-l-terciary"
                    : "hidden"
            } fixed z-[99] right-0 top-0 w-full h-dvh md:w-[400px] dark:bg-admin-paper-dark bg-background-light py-4 shadow`}
        >
            <button
                class="absolute right-0 top-0 m-3 text-2xl dark:text-secondary-light text-secondary-dark"
                onClick={cartStore.dropdown.onClose}
                type="button"
                aria-label="close to cart aside"
            >
                <i class="fas fa-times" />
            </button>
            <div class="mb-4">
                <div class="flex flex-col gap-1 justify-center items-center">
                    <span class="flex justify-center text-primary dark:text-white font-bold uppercase gap-2 items-center">
                        Tu carrito{" "}
                        <b class="bg-primary text-white rounded-full w-[30px] h-[30px] flex justify-center items-center">
                            {cartStore.computed.showCartLength}
                        </b>
                    </span>
                </div>
            </div>
            <Hr />
            <div class="overflow-auto h-[calc(100%-50px)]">
                {!cartStore.state.cart?.length ? (
                    <span class="dark:text-secondary-light flex justify-center mt-4 gap-2">
                        No hay ningun producto añadido
                    </span>
                ) : (
                    <>
                        {cartStore.state?.cart.map((prod) => (
                            <ProductCart
                                product={prod}
                                key={prod.variant ? prod.variant.id : prod.id}
                            />
                        ))}
                    </>
                )}
            </div>
            {cartStore.state.cart?.length ? (
                <Form
                    className={`${
                        isOpen.value ? "max-h-auto" : "max-h-[30px]"
                    } right-0 delay-custom-1 mb-4 shadow-lg left-0 absolute bottom-0  dark:bg-admin-paper-dark bg-background-light px-2`}
                    onSubmit={onOrder}
                    {...ordersStoreDtoForm}
                >
                    <button
                        class=" dark:text-white flex justify-center w-full border-t  py-2"
                        type="button"
                        aria-label="to hidden"
                        onClick={() => {
                            isOpen.value = !isOpen.value;
                        }}
                    >
                        <i class="fas fa-bars" />
                    </button>
                    <Form.control.select
                        title="Piso"
                        name={"floor_id" as keyof OrdersStoreDto}
                        placeholder="Seleccionar Piso"
                        array={arrayFloors}
                        options={{
                            setValueAs: (value) =>
                                Number(value) > 0 ? Number(value) : null,
                        }}
                    />
                    {floorId ? (
                        <Form.control.select
                            title="Mesa"
                            name={"mesa_id" as keyof OrdersStoreDto}
                            placeholder="Seleccionar Mesa"
                            array={arrayMesas}
                            options={{
                                setValueAs: (value) =>
                                    Number(value) > 0 ? Number(value) : null,
                            }}
                        />
                    ) : (
                        <></>
                    )}
                    <hr class="border-dashed border-2 mb-2" />
                    <span class="w-full justify-between mb-2 text-primary dark:text-white  gap-2 flex ">
                        <span>Total:</span>
                        <b>{formatMoney(cartStore.methods.getTotal())}</b>
                    </span>
                    <Form.button.submit
                        disabled={ordersStoreApiMutation.isLoading || false}
                        isLoading={ordersStoreApiMutation.isLoading || false}
                        title="Ordenar"
                        className="flex items-center justify-center w-full gap-2 py-2 bg-primary"
                    />
                </Form>
            ) : null}
        </div>
    );
}

export default AdminCart;
