import { useQuery } from "@vigilio/preact-fetching";
import { TimeTable } from "~/hooks/usePaginatorTimer";

export function visitantesChartApi(time: TimeTable) {
    const result = useQuery<VisitantesChartApiResult, VisitantesChartApiError>(
        "/paginator/visitantes/chart",
        async (url) => {
            const response = await fetch(
                `/api${url}${time ? `?time=${time}` : ""}`
            );
            const result = await response.json();
            return result;
        }
    );
    return result;
}
interface VisitantesChartApiResult {
    success: true;
    data: {
        page: string;
        time: number;
        visits: number;
    }[];
}
interface VisitantesChartApiError {
    success: false;
    message: string;
}

/**
 * index - /api/visitantes
 * @method GET
 */
export function visitantesDoughnutApi(time: TimeTable) {
    return useQuery<VisitantesDoughnutApiResult, VisitantesDoughnutApiError>(
        "/visitantes/doughnut",
        async (url) => {
            const response = await fetch(
                `/api${url}${time ? `?time=${time}` : ""}`
            );
            const result = await response.json();
            return result;
        }
    );
}
interface VisitantesDoughnutApiResult {
    success: true;
    resultadosOSMapped: { os: string; count: number }[];
    resultadosBrowserMapped: { browser: string; count: number }[];
}
interface VisitantesDoughnutApiError {
    success: false;
    message: string;
}
