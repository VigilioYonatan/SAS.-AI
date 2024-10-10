import { adminEarningApi } from "../apis/admin.earning.api";
import { Fragment } from "preact/jsx-runtime";
import usePaginationNoApi from "~/hooks/useTableNo";
import { sweetModal } from "@vigilio/sweet";
import { reactComponent } from "~/libs/preact";
import { ordersEarningsDateApi } from "@/orders/apis/orders.earnings.date.api";
import Loading from "./Loading";
import View404 from "../views/404";
import { printFileWithDimension } from "~/libs/upload";
import AdminChart from "./AdminChart";
import UsersTopsChart from "./ClientsTopsChart";
import { formatMoney } from "@/cart/libs/helpers";

function ResumeEarning() {
    const adminEarningQuery = adminEarningApi();
    let component: JSX.Element | null = null;
    if (adminEarningQuery.isLoading) {
        component = <Loading className="h-[500px]" />;
    }
    if (adminEarningQuery.isError) {
        component = <span>{JSON.stringify(adminEarningQuery.error)}</span>;
    }
    if (adminEarningQuery.isSuccess) {
        const { data, methods, computeds } = usePaginationNoApi({
            array: adminEarningQuery.data!.results.getYearMonthAmount,
            pageSize: 1,
            page: 1,
        });

        function showempresaMonth(props: {
            monthNumber: number;
            month: string;
            year: number;
        }) {
            sweetModal({
                html: reactComponent(
                    <ShowByYearMonth
                        month={props.month}
                        monthNumber={props.monthNumber}
                        year={props.year}
                    />
                ),
                sweetWidth: "800px",
                showCloseButton: true,
                position: "start",
            });
        }
        component = (
            <div class="flex flex-col gap-4">
                <div class="flex flex-col">
                    <span class="text-primary">Ganancia de este mes</span>
                    <span class="dark:text-secondary-light text-secondary-dark">
                        {String(
                            formatMoney(
                                adminEarningQuery.data!.results.gananciasMensual
                                    .total || 0
                            )
                        )}
                    </span>
                </div>
                <div class="flex flex-col">
                    {data.map((table) => (
                        <Fragment key={table.year}>
                            <span class="text-primary">
                                Tabla de Ganancias anual - {table.year}
                            </span>
                            <table class="text-sm text-left  h-full shadow w-full">
                                <thead class="text-[10px] lg:text-xs bg-paper-light dark:bg-admin-terciary text-secondary-dark dark:text-primaryuppercase  shadow-sm  border-b dark:border-admin-terciary">
                                    <tr>
                                        <th class="px-1 py-1  dark:bg-admin-terciary text-center cursor-pointer dark:text-white">
                                            Mes
                                        </th>
                                        <th class="px-1 py-1  dark:bg-admin-terciary text-center cursor-pointer dark:text-white">
                                            Ganancias
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {table.result.map(
                                        ({ month, monthNumber, total }) => (
                                            <tr
                                                key={month}
                                                class="border-b h-[25px] dark:border-admin-terciary border-paper-light hover:bg-paper-light text-black  dark:text-secondary-light  hover:bg-primary cursor-pointer"
                                                onClick={() => {
                                                    if (Number(total) <= 0)
                                                        return;
                                                    showempresaMonth({
                                                        monthNumber,
                                                        year: table.year,
                                                        month,
                                                    });
                                                }}
                                            >
                                                <td>{month}</td>
                                                <td>
                                                    {String(
                                                        formatMoney(
                                                            Number(total)
                                                        )
                                                    )}
                                                </td>
                                            </tr>
                                        )
                                    )}
                                </tbody>
                            </table>
                        </Fragment>
                    ))}
                    <div class="flex gap-1 mt-1">
                        {!computeds.isPageInitial ? (
                            <button
                                onClick={methods.onPreviousPage}
                                type="button"
                                aria-label="change page"
                            >
                                <i class="fas fa-caret-circle-left text-2xl text-primary" />
                            </button>
                        ) : null}
                        {!computeds.isPageFinal ? (
                            <button
                                onClick={methods.onNextPage}
                                type="button"
                                aria-label="change page"
                            >
                                <i class="fas fa-caret-circle-right text-2xl text-primary" />
                            </button>
                        ) : null}
                    </div>
                </div>
                <div class="flex flex-col">
                    <span class="text-primary">Ganancia de este Año</span>
                    <span class="dark:text-secondary-light text-secondary-dark">
                        {String(
                            formatMoney(
                                adminEarningQuery.data!.results.gananciasAnual
                                    .total || 0
                            )
                        )}
                    </span>
                </div>
                <div class="flex flex-col">
                    <span class="text-primary">Ganancia de Hoy</span>
                    <span class="dark:text-secondary-light text-secondary-dark">
                        {String(
                            formatMoney(
                                adminEarningQuery.data!.results.gananciasDiario
                                    .total || 0
                            )
                        )}
                    </span>
                </div>
                <div class="flex flex-col">
                    <span class="text-primary">Ganancia de Ayer</span>
                    <span class="dark:text-secondary-light text-secondary-dark">
                        {String(
                            formatMoney(
                                adminEarningQuery.data!.results.gananciasAyer
                                    .total || 0
                            )
                        )}
                    </span>
                </div>

                <div class="flex flex-col">
                    <span class="text-primary">
                        Ganancia total desde el primer dia
                    </span>
                    <span class="dark:text-secondary-light text-secondary-dark">
                        {String(
                            formatMoney(
                                adminEarningQuery.data!.results
                                    .gananciasPrimerDay.total || 0
                            )
                        )}
                    </span>
                </div>
            </div>
        );
    }
    return component;
}

interface ShowByYearMonthProps {
    month: string;
    monthNumber: number;
    year: number;
}

function ShowByYearMonth(props: ShowByYearMonthProps) {
    const ordersEarningsDateQuery = ordersEarningsDateApi(
        props.year,
        props.monthNumber + 1
    );
    let component: JSX.Element | JSX.Element | null = null;
    if (ordersEarningsDateQuery.isLoading) {
        component = <Loading className="h-[500px]" />;
    }
    if (ordersEarningsDateQuery.isError) {
        component = (
            <View404
                message={JSON.stringify(ordersEarningsDateQuery.error!.message)}
            />
        );
    }
    if (ordersEarningsDateQuery.isSuccess) {
        const result = ordersEarningsDateQuery.data?.results;

        component = (
            <div class="flex flex-col gap-3">
                <h3 class="text-lg lg:text-2xl font-bold text-center text-primary my-3">
                    {props.year} - {props.month}
                </h3>
                <div class="flex flex-col lg:flex-row  gap-4">
                    <div class="flex flex-col gap-1 w-full  items-center">
                        <div class="dark:text-white">
                            <b class="">Ganacias de este mes: </b>
                            <span class="text-lg ml-2">
                                {formatMoney(result?.orders.ganancias ?? 0)}
                            </span>
                        </div>
                        <div class="dark:text-white">
                            <b class="">Cantidades de Ordenes: </b>
                            <span class="text-lg ml-2">
                                {result?.orders.ordersTotal ?? 0}{" "}
                            </span>
                        </div>
                        <div class="dark:text-white">
                            <b class="">Cantidades de Ordenes - local: </b>
                            <span class="text-lg ml-2">
                                {result?.orders.orderLocal ?? 0}{" "}
                            </span>
                        </div>
                        <div class="dark:text-white">
                            <b class="">Cantidades de Ordenes - Delivery: </b>
                            <span class="text-lg ml-2">
                                {result?.orders.orderDelivery ?? 0}{" "}
                            </span>
                        </div>
                        <div class="dark:text-white">
                            <b class="">Ordenes Pagados correctamente: </b>
                            <span class="text-lg ml-2">
                                {result?.orders.ordersTotalPay ?? 0}
                            </span>
                        </div>
                        <div class="dark:text-white">
                            <b class="">Ordenes con errores: </b>
                            <span class="text-lg ml-2">
                                {result?.orders.ordersTotalError ?? 0}
                            </span>
                        </div>
                        <div class="flex justify-center items-center flex-wrap">
                            {result?.topThreeProductIds.length ? (
                                <div>
                                    <span class="text-primary text-lg my-2 font-bold text-center block">
                                        Productos Mas vendidos de este mes
                                    </span>
                                    <div class="flex gap-2 items-center ">
                                        {result?.topThreeProductIds
                                            .reverse()
                                            .map((prod) => {
                                                return (
                                                    <div
                                                        class="flex justify-center dark:text-white flex-col items-center"
                                                        key={prod.id}
                                                    >
                                                        <img
                                                            width={100}
                                                            height={100}
                                                            src={
                                                                printFileWithDimension(
                                                                    prod.image,
                                                                    100
                                                                )[0]
                                                            }
                                                            class="rounded-sm h-[100px] w-[100px] object-cover"
                                                            alt={prod.name}
                                                        />
                                                        <span class="text-center text-sm">
                                                            {prod.name}
                                                        </span>
                                                    </div>
                                                );
                                            })}
                                    </div>
                                </div>
                            ) : null}
                        </div>
                    </div>
                    <div class="w-full m-2 flex flex-col gap-2 items-center">
                        <AdminChart
                            data={result?.ratingArray!}
                            refetch={ordersEarningsDateQuery.refetch}
                        />
                        <UsersTopsChart data={result!.usersMostOrders!} />
                    </div>
                </div>
            </div>
        );
    }
    return component;
}
export default ResumeEarning;
