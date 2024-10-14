import AdminBreadCrumb from "@/admin/components/AdminBreadCrumb";
import { sweetModal } from "@vigilio/sweet";
import { reactComponent } from "~/libs/preact";
import CategoriesStore from "../components/CategoriesStore";
import VigilioTable from "~/components/table";
import { useTable } from "@vigilio/preact-table";
import finanzasColumns from "../libs/FinanzasColumns";
import { finanzasPaginatorApi } from "@/common/paginator/finanzas.paginator.api";
import { FinanzasStore } from "../components/FinanzasStore";
import dayjs, { NOW, TimePeru } from "~/libs/helpers";
import useDropdown from "~/hooks/useDropdown";
import { useSignal } from "@preact/signals";
import WaterFallFinanzas from "../components/WaterFallFinanzas";
import { finanzasAllApi } from "../apis/finanzas.all.api";
import Loading from "@/admin/components/Loading";
import View404 from "@/admin/views/404";
import { formatMoney } from "@/cart/libs/helpers";
import { useEffect } from "preact/hooks";
import ContainerBox from "@/admin/components/ContainerBox";
import { storageEmpresa } from "@/empresas/stores/empresa.store";
import usePaginatorTimer from "~/hooks/usePaginatorTimer";
import Hr from "@/web/components/Hr";
import LoaderSubmit from "~/components/LoaderSubmit";
import ChartPercentajeFinanzas from "../components/ChartPercentajeFinanzas";
import useAuthStore from "@/auth/stores/auth.store";

function FinanzasIndex() {
    const authStore = useAuthStore();
    if (
        !storageEmpresa?.payments.finanza.enabled ||
        !authStore.guards.permissionAdminGuard()
    ) {
        window.history.back();
        return;
    }
    const dropdown = useDropdown();
    const year = useSignal({
        year: NOW().get("year"),
        month: NOW().get("month"),
    });
    const finanzasAllQuery = finanzasAllApi(year);
    let component = null;
    if (finanzasAllQuery.isLoading) {
        component = <Loading />;
    }

    if (finanzasAllQuery.isError) {
        component = <View404 message={finanzasAllQuery.error?.message} />;
    }
    if (finanzasAllQuery.isSuccess) {
        const result = finanzasAllQuery.data!.data;

        useEffect(() => {
            finanzasAllQuery.refetch(false);
        }, [year.value]);
        component = (
            <div class="m-2">
                <div className="flex flex-col gap-4 mx-1 ">
                    <AdminBreadCrumb current="Finanzas" />
                </div>
                <div class="max-w-8xl  mt-4">
                    <div class="flex flex-col gap-4">
                        <div class="grid lg:grid-cols-2 gap-4 ">
                            <div class="flex flex-col gap-4 ">
                                <ContainerBox>
                                    <div class="w-full relative">
                                        <div class="w-full flex justify-between items-center text-3xl font-bold dark:text-white py-1">
                                            <button
                                                type="button"
                                                class="bg-primary text-white text-xs px-3 mb-2 py-2 rounded-md"
                                                disabled={
                                                    finanzasAllQuery.isFetching ||
                                                    false
                                                }
                                                onClick={() => {
                                                    finanzasAllQuery.refetch(
                                                        false
                                                    );
                                                }}
                                            >
                                                {finanzasAllQuery.isFetching ? (
                                                    <LoaderSubmit />
                                                ) : (
                                                    <i class="fa-solid fa-rotate-right" />
                                                )}
                                            </button>
                                            {year.value.year}
                                            <div class="flex flex-col justify-center items-center gap-2">
                                                {year.value.year <
                                                TimePeru(
                                                    storageEmpresa!
                                                        .createdAt as Date
                                                )
                                                    .toDate()
                                                    .getFullYear() ? (
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            year.value = {
                                                                ...year.value,
                                                                year:
                                                                    year.value
                                                                        .year +
                                                                    1,
                                                                month:
                                                                    NOW().get(
                                                                        "month"
                                                                    ) + 1,
                                                            };
                                                        }}
                                                        class="m-0 flex justify-center items-center  bg-primary px-4 py-2 rounded-md text-white"
                                                    >
                                                        <i class="fa-sharp fa-solid fa-chevron-up text-xs" />
                                                    </button>
                                                ) : null}

                                                {year.value.year >=
                                                TimePeru(
                                                    storageEmpresa!
                                                        .createdAt as Date
                                                )
                                                    .toDate()
                                                    .getFullYear() ? (
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            year.value = {
                                                                ...year.value,
                                                                year:
                                                                    year.value
                                                                        .year -
                                                                    1,
                                                                month:
                                                                    NOW().get(
                                                                        "month"
                                                                    ) + 1,
                                                            };
                                                        }}
                                                        class="m-0 flex justify-center items-center bg-primary px-4 py-2 rounded-md text-white"
                                                    >
                                                        <i class="fa-sharp fa-solid fa-chevron-down text-xs" />
                                                    </button>
                                                ) : null}
                                            </div>
                                        </div>
                                        <div class="grid grid-cols-2 w-full">
                                            <div
                                                class="text-white font-bold uppercase text-md flex justify-between px-2 items-center bg-primary  py-2  "
                                                onClick={() => {
                                                    dropdown.onOpenClose();
                                                }}
                                            >
                                                <div />
                                                {dayjs()
                                                    .month(year.value.month)
                                                    .format("MMMM")}
                                                <button type="button">
                                                    <i class="fa-solid fa-caret-down" />
                                                </button>
                                            </div>
                                            <b class="dark:text-white text-xl flex justify-center items-center font-bold border dark:border-white">
                                                {formatMoney(result.saldo)}
                                            </b>
                                        </div>
                                        <div
                                            class={`${
                                                dropdown.dropdownOpen
                                                    ? "max-h-[200px] overflow-auto"
                                                    : "max-h-[0px] overflow-hidden"
                                            } flex flex-col w-full delay-custom-1 absolute z-[9] dark:bg-admin-terciary bg-paper-light shadow rounded-md`}
                                            ref={dropdown.dropdown}
                                        >
                                            {Array.from({ length: 11 }).map(
                                                (_, i) => (
                                                    <span
                                                        // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                                                        key={i}
                                                        onClick={() => {
                                                            year.value = {
                                                                ...year.value,
                                                                month: i,
                                                            };
                                                        }}
                                                        class={`flex justify-center py-1 text-sm  dark:text-white font-semibold ${
                                                            i ===
                                                            year.value.month
                                                                ? "bg-primary text-white"
                                                                : ""
                                                        }`}
                                                    >
                                                        {dayjs()
                                                            .month(i)
                                                            .format("MMMM")}
                                                    </span>
                                                )
                                            )}
                                        </div>
                                    </div>

                                    <div class="flex gap-2 w-full  shadow">
                                        <table class="w-full ">
                                            <thead class="text-[10px] lg:text-xs bg-paper-light dark:bg-admin-terciary dark:text-secondary-light dark:text-terciary-dark uppercase  shadow-sm  border-b dark:border-admin-terciary">
                                                <tr class="px-1 lg:py-1 whitespace-nowrap text-center  text-white text-xs  bg-primary">
                                                    <td class="py-2 font-semibold">
                                                        Ingresos Totales
                                                    </td>
                                                    <td class="py-2 font-semibold">
                                                        Egresos Totales
                                                    </td>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr class="border-b h-[60px] dark:border-admin-terciary border-paper-light hover:bg-paper-light text-black dark:hover:bg-admin-terciary dark:text-secondary-light dark:hover:text-secondary-light">
                                                    <td class="px-1 lg:py-1 whitespace-nowrap text-center  text-md">
                                                        <b>
                                                            {formatMoney(
                                                                result.ingresosTotales
                                                            )}
                                                        </b>
                                                    </td>
                                                    <td class="px-1 lg:py-1 whitespace-nowrap text-center  text-md">
                                                        <b>
                                                            {formatMoney(
                                                                result.egresosTotales
                                                            )}
                                                        </b>
                                                    </td>
                                                </tr>
                                                <tr class="dark:text-white ">
                                                    <td class="px-1 lg:py-1 whitespace-nowrap text-center  text-xs lg:text-sm">
                                                        Prep:{" "}
                                                        <b>
                                                            {formatMoney(
                                                                result.presupuestoIngresos
                                                            )}
                                                        </b>
                                                    </td>
                                                    <td class="px-1 lg:py-1 whitespace-nowrap text-center  text-xs lg:text-sm">
                                                        Prep:{" "}
                                                        <b>
                                                            {formatMoney(
                                                                result.presupuestoEgresos
                                                            )}
                                                        </b>
                                                    </td>
                                                </tr>
                                                <tr class="dark:text-white ">
                                                    <td class="px-1 lg:py-1 whitespace-nowrap text-center  text-xs lg:text-sm">
                                                        Diferiencia.{" "}
                                                        {formatMoney(
                                                            result.ingresosTotales -
                                                                result.presupuestoIngresos
                                                        )}
                                                    </td>
                                                    <td class="px-1 lg:py-1 whitespace-nowrap text-center  text-xs lg:text-sm">
                                                        Diferiencia.{" "}
                                                        {formatMoney(
                                                            result.egresosTotales -
                                                                result.presupuestoEgresos
                                                        )}
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </ContainerBox>
                                <div class="w-full">
                                    <WaterFallFinanzas
                                        percentajes={result.resumeEgresos}
                                    />
                                </div>
                            </div>
                            <ContainerBox>
                                <FinanzasTable
                                    refetch2={finanzasAllQuery.refetch}
                                />
                            </ContainerBox>
                        </div>

                        <div class="flex flex-col lg:flex-row gap-4 w-full">
                            {/*  */}
                            <ContainerBox>
                                <span class="dark:text-white font-bold text-sm">
                                    Resumen Ingresos
                                </span>
                                <Hr />
                                <div class="flex gap-2 w-full  shadow">
                                    <table class="w-full ">
                                        <thead class="text-[10px] lg:text-xs bg-paper-light dark:bg-admin-terciary dark:text-secondary-light dark:text-terciary-dark uppercase  shadow-sm  border-b dark:border-admin-terciary">
                                            <tr class="px-1 lg:py-1 whitespace-nowrap text-center  text-white text-xs  bg-primary">
                                                <td class="py-2 font-semibold">
                                                    Categoría
                                                </td>
                                                <td class="py-2 font-semibold">
                                                    Presupuesto
                                                </td>
                                                <td class="py-2 font-semibold">
                                                    Monto
                                                </td>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {result.resumeIngresos.map(
                                                (ingreso) => (
                                                    <tr
                                                        class="border-b h-[40px] dark:border-admin-terciary border-paper-light hover:bg-paper-light text-black dark:hover:bg-admin-terciary dark:text-secondary-light dark:hover:text-secondary-light"
                                                        key={ingreso.id}
                                                    >
                                                        <td class="px-1 lg:py-1 whitespace-nowrap text-center  text-xs font-bold">
                                                            <b>
                                                                {ingreso.name}
                                                            </b>
                                                        </td>
                                                        <td class="px-1 lg:py-1 whitespace-nowrap text-center  text-xs">
                                                            <b>
                                                                {formatMoney(
                                                                    ingreso.presupuesto
                                                                )}
                                                            </b>
                                                        </td>
                                                        <td
                                                            class={`px-1 lg:py-1 whitespace-nowrap text-center  text-xs ${
                                                                ingreso.presupuesto <
                                                                ingreso.monto
                                                                    ? "text-danger"
                                                                    : "text-blue-400"
                                                            } `}
                                                        >
                                                            <b>
                                                                {formatMoney(
                                                                    ingreso.monto
                                                                )}
                                                            </b>
                                                        </td>
                                                    </tr>
                                                )
                                            )}
                                            {result.resumeEgresos.length < 8 ? (
                                                <>
                                                    {Array.from({
                                                        length: 6,
                                                    }).map((_, i) => (
                                                        <tr
                                                            class="border-b h-[40px] dark:border-admin-terciary border-paper-light hover:bg-paper-light text-black dark:hover:bg-admin-terciary dark:text-secondary-light dark:hover:text-secondary-light"
                                                            // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                                                            key={i}
                                                        >
                                                            <td />
                                                            <td />
                                                            <td />
                                                        </tr>
                                                    ))}
                                                </>
                                            ) : null}

                                            <tr class="border-b h-[40px] dark:border-admin-terciary border-paper-light hover:bg-paper-light text-black dark:hover:bg-admin-terciary dark:text-secondary-light dark:hover:text-secondary-light">
                                                <td class="px-1 lg:py-1 whitespace-nowrap text-center  text-sm font-bold ">
                                                    <b>Total</b>
                                                </td>
                                                <td class="px-1 lg:py-1 whitespace-nowrap text-center  text-sm font-bold ">
                                                    <b>
                                                        {formatMoney(
                                                            result.resumeIngresos.reduce(
                                                                (a, b) =>
                                                                    a +
                                                                    b.presupuesto,
                                                                0
                                                            )
                                                        )}
                                                    </b>
                                                </td>
                                                <td
                                                    class={`px-1 lg:py-1 whitespace-nowrap text-center  text-sm font-bold ${
                                                        result.resumeIngresos.reduce(
                                                            (a, b) =>
                                                                a +
                                                                b.presupuesto,
                                                            0
                                                        ) <
                                                        result.resumeIngresos.reduce(
                                                            (a, b) =>
                                                                a + b.monto,
                                                            0
                                                        )
                                                            ? "text-danger"
                                                            : "text-blue-400"
                                                    }`}
                                                >
                                                    <b>
                                                        {formatMoney(
                                                            result.resumeIngresos.reduce(
                                                                (a, b) =>
                                                                    a + b.monto,
                                                                0
                                                            )
                                                        )}
                                                    </b>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </ContainerBox>
                            {/*  */}
                            <ContainerBox>
                                <span class="dark:text-white font-bold text-sm">
                                    Resumen Egresos
                                </span>
                                <Hr />
                                <div class="flex gap-2 w-full  shadow">
                                    <table class="w-full ">
                                        <thead class="text-[10px] lg:text-xs bg-paper-light dark:bg-admin-terciary dark:text-secondary-light dark:text-terciary-dark uppercase  shadow-sm  border-b dark:border-admin-terciary">
                                            <tr class="px-1 lg:py-1 whitespace-nowrap text-center  text-white text-xs  bg-primary">
                                                <td class="py-2 font-semibold">
                                                    Categoría
                                                </td>
                                                <td class="py-2 font-semibold">
                                                    Presupuesto
                                                </td>
                                                <td class="py-2 font-semibold">
                                                    Monto
                                                </td>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {result.resumeEgresos.map(
                                                (egreso) => (
                                                    <tr
                                                        class="border-b h-[40px] dark:border-admin-terciary border-paper-light hover:bg-paper-light text-black dark:hover:bg-admin-terciary dark:text-secondary-light dark:hover:text-secondary-light"
                                                        key={egreso.id}
                                                    >
                                                        <td class="px-1 lg:py-1 whitespace-nowrap text-center  text-xs font-bold">
                                                            <b>{egreso.name}</b>
                                                        </td>
                                                        <td class="px-1 lg:py-1 whitespace-nowrap text-center  text-xs">
                                                            <b>
                                                                {formatMoney(
                                                                    egreso.presupuesto
                                                                )}
                                                            </b>
                                                        </td>
                                                        <td
                                                            class={`px-1 lg:py-1 whitespace-nowrap text-center  text-xs ${
                                                                egreso.presupuesto <
                                                                egreso.monto
                                                                    ? "text-danger"
                                                                    : "text-blue-400"
                                                            }`}
                                                        >
                                                            <b>
                                                                {formatMoney(
                                                                    egreso.monto
                                                                )}
                                                            </b>
                                                        </td>
                                                    </tr>
                                                )
                                            )}

                                            <tr class="border-b h-[40px] dark:border-admin-terciary border-paper-light hover:bg-paper-light text-black dark:hover:bg-admin-terciary dark:text-secondary-light dark:hover:text-secondary-light">
                                                <td class="px-1 lg:py-1 whitespace-nowrap text-center  text-sm font-bold ">
                                                    <b>Total</b>
                                                </td>
                                                <td class="px-1 lg:py-1 whitespace-nowrap text-center  text-sm font-bold ">
                                                    <b>
                                                        {formatMoney(
                                                            result.resumeEgresos.reduce(
                                                                (a, b) =>
                                                                    a +
                                                                    b.presupuesto,
                                                                0
                                                            )
                                                        )}
                                                    </b>
                                                </td>{" "}
                                                <td
                                                    class={`px-1 lg:py-1 whitespace-nowrap text-center  text-sm font-bold ${
                                                        result.resumeEgresos.reduce(
                                                            (a, b) =>
                                                                a +
                                                                b.presupuesto,
                                                            0
                                                        ) <
                                                        result.resumeEgresos.reduce(
                                                            (a, b) =>
                                                                a + b.monto,
                                                            0
                                                        )
                                                            ? "text-danger"
                                                            : "text-blue-400"
                                                    }`}
                                                >
                                                    <b>
                                                        {formatMoney(
                                                            result.resumeEgresos.reduce(
                                                                (a, b) =>
                                                                    a + b.monto,
                                                                0
                                                            )
                                                        )}
                                                    </b>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </ContainerBox>{" "}
                            <ChartPercentajeFinanzas
                                percentajes={result.resumeIngresos.map((v) => ({
                                    numeric: v.monto,
                                    value: v.name,
                                }))}
                            />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
    return component;
}

interface FinanzasTableProps {
    refetch2: (body?: boolean) => void;
}
function FinanzasTable({ refetch2 }: FinanzasTableProps) {
    const table = useTable({
        columns: finanzasColumns,
        pagination: { limit: 8 },
    });
    const { time, SelectTimer } = usePaginatorTimer();
    const query = finanzasPaginatorApi(table, time);

    useEffect(() => {
        query.refetch(false);
    }, [time]);
    return (
        <>
            <button
                type="button"
                onClick={() => {
                    sweetModal((onClose) => ({
                        html: reactComponent(
                            <FinanzasStore
                                onClose={onClose}
                                refetch={query.refetch}
                                refetch2={refetch2}
                            />
                        ),
                        sweetWidth: "700px",
                        showCloseButton: true,
                        isCloseInBackground: false,
                    }));
                }}
                class="bg-primary fixed bottom-10 z-[99] right-10 w-[50px] h-[50px] rounded-full text-2xl font-bold text-white  shadow "
            >
                +
            </button>
            <div class="w-full overflow-auto">
                <div class="flex justify-between gap-2 mb-2">
                    <div />
                    <h1 class="font-bold dark:text-white text-center text-xl">
                        Finanzas
                    </h1>
                    <div>
                        <button
                            class="bg-primary px-4 py-2 rounded-md text-white text-xs"
                            type="button"
                            onClick={() => {
                                sweetModal({
                                    html: reactComponent(<CategoriesStore />),
                                    sweetWidth: "500px",
                                    showCloseButton: true,
                                    showCancelButton: true,
                                    isCloseInBackground: false,
                                });
                            }}
                        >
                            <i class="fa-regular fa-money-check-pen" />{" "}
                            Categorias
                        </button>
                    </div>
                </div>

                <div class="overflow-auto mt-4 w-full">
                    <VigilioTable query={query} table={table}>
                        <VigilioTable.header className="p-0 mb-2 flex justify-between items-center">
                            <SelectTimer />
                            <div class="flex items-center gap-1">
                                <VigilioTable.header.limit />
                                <VigilioTable.header.refetch />
                            </div>
                        </VigilioTable.header>
                        <VigilioTable.table>
                            <VigilioTable.thead>
                                <VigilioTable.thead.row>
                                    <VigilioTable.thead.th />
                                </VigilioTable.thead.row>
                            </VigilioTable.thead>
                            <VigilioTable.tbody>
                                <VigilioTable.tbody.row>
                                    {(data) => (
                                        <VigilioTable.tbody.td data={data} />
                                    )}
                                </VigilioTable.tbody.row>
                            </VigilioTable.tbody>
                        </VigilioTable.table>
                        <VigilioTable.footer>
                            <VigilioTable.footer.paginator />
                            <VigilioTable.footer.show />
                        </VigilioTable.footer>
                    </VigilioTable>
                </div>
            </div>
        </>
    );
}
export default FinanzasIndex;
