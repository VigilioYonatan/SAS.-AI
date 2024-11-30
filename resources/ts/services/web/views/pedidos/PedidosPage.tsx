import { formatDolares, formatMoney } from "@/cart/libs/helpers";
import { ordersShow2Api } from "@/orders/apis/orders.show.api";
import { STATUSORDER } from "@/orders/libs";
import WebLayout, { type HeaderType } from "@/web/components/WebLayout";
import { object, string, type Input } from "@vigilio/valibot";
import { useMemo } from "preact/hooks";
import { useForm } from "react-hook-form";
import Form from "~/components/form";
import { pedidosImage } from "~/config/settings";
import { valibotVigilio } from "~/libs/valibot";

const searchOrder = object({ order_code: string() });
type SearchOrder = Input<typeof searchOrder>;

interface PedidosPageProps {
    header: HeaderType;
}
function PedidosPage({ header }: PedidosPageProps) {
    const searchOrderForm = useForm<SearchOrder>({
        resolver: valibotVigilio(searchOrder),
        defaultValues: useMemo(() => {
            const queryString = window.location.search;
            const urlParams = new URLSearchParams(queryString);
            const code = urlParams.get("code"); // 'John'
            return {
                order_code: code ?? "",
            };
        }, []),
    });

    const ordersShowMutation = ordersShow2Api();
    function onSearch(data: SearchOrder) {
        ordersShowMutation.mutate(data.order_code, {
            onSuccess() {
                searchOrderForm.reset();
            },
        });
    }
    return (
        <WebLayout header={header}>
            <section class="max-w-6xl py-12 px-2 mx-auto min-h-[500px] mt-12 lg:mt-4">
                <div class="lg:w-[500px] ">
                    <h1 class="text-primary dark:text-white text-2xl font-semibold">
                        Pedidos
                    </h1>
                    <p class=" dark:text-white ">
                        Digite su codigo de orden de Pedido <b>ORD-XXXXXX</b>
                    </p>
                    <Form onSubmit={onSearch} {...searchOrderForm}>
                        <Form.control.auth
                            title="Codigo"
                            name={"order_code" as keyof SearchOrder}
                            placeholder="ORD-XXXXX"
                        />
                        <>
                            {ordersShowMutation.error ? (
                                <p class="text-danger font-normal text-xs">
                                    {ordersShowMutation.error.message}
                                </p>
                            ) : null}
                            {ordersShowMutation.isSuccess ? (
                                <div class="flex flex-col gap-1">
                                    {ordersShowMutation.data?.order
                                        .status_order_id ===
                                    STATUSORDER.entregado ? (
                                        <span>
                                            <b>Estado: </b>{" "}
                                            {
                                                ordersShowMutation.data?.order
                                                    .status_order.name
                                            }
                                        </span>
                                    ) : (
                                        <div class="flex flex-col dark:text-white">
                                            <span>
                                                <b>Estado: </b>{" "}
                                                {
                                                    ordersShowMutation.data
                                                        ?.order.status_order
                                                        .name
                                                }
                                            </span>
                                            <span>
                                                <b>Dirección: </b>{" "}
                                                {
                                                    ordersShowMutation.data
                                                        ?.order.address
                                                }
                                            </span>
                                            {ordersShowMutation.data?.order
                                                .description ? (
                                                <span>
                                                    <b>Dirección: </b>{" "}
                                                    {
                                                        ordersShowMutation.data
                                                            ?.order.description
                                                    }
                                                </span>
                                            ) : null}

                                            <span>
                                                <b>Total: </b>{" "}
                                                {ordersShowMutation.data!.order
                                                    .moneyChange === 1 ? (
                                                    <>
                                                        {formatMoney(
                                                            ordersShowMutation.data!
                                                                .order.total
                                                        )}
                                                    </>
                                                ) : (
                                                    formatDolares(
                                                        ordersShowMutation.data!
                                                            .order.total *
                                                            ordersShowMutation.data!
                                                                .order
                                                                .moneyChange
                                                    )
                                                )}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            ) : null}
                        </>
                        <Form.button.submit
                            isLoading={ordersShowMutation.isLoading || false}
                            title="Buscar"
                            ico={<i class="fa-solid fa-magnifying-glass" />}
                        />
                    </Form>
                </div>
                <img
                    src={pedidosImage()}
                    width={300}
                    height={300}
                    alt="pedidos"
                />
            </section>
        </WebLayout>
    );
}

export default PedidosPage;
