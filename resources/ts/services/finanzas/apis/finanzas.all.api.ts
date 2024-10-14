import { Signal } from "@preact/signals";
import { type UseQuery, useQuery } from "@vigilio/preact-fetching";

export function finanzasAllApi(
    date: Signal<{
        year: number;
        month: number;
    }>
): UseQuery<FinanzasAllAPI, FinanzasAllErrorAPI> {
    return useQuery<FinanzasAllAPI, FinanzasAllErrorAPI>(
        "/finanzas/all",
        async (url) => {
            const response = await fetch(
                `/api${url}?year=${date.value.year}&month=${
                    date.value.month + 1
                }`
            );
            const result = await response.json();
            if (!result.success) throw result;
            return result;
        }
    );
}

export interface FinanzasAllAPI {
    success: boolean;
    data: FinanzasResumen;
}

export interface FinanzasAllErrorAPI {
    success: boolean;
    message: string;
}
interface FinanzasResumen {
    ingresosTotales: number;
    egresosTotales: number;
    resumeIngresos: Ingreso[];
    presupuestoEgresos: number;
    presupuestoIngresos: number;
    saldo: number;
    resumeEgresos: Egreso[];
}

export interface Ingreso {
    id: number;
    name: string;
    presupuesto: number;
    monto: number;
}

interface Egreso {
    id: number;
    name: string;
    presupuesto: number;
    monto: number;
}
