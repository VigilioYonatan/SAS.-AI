import { useMutation } from "@vigilio/preact-fetching";

export function citasByDayApi() {
    return useMutation<
        CitasByDayAPI,
        { year: number; month: number },
        CitasByDayErrorAPI
    >("/citas", async (url, body) => {
        const response = await fetch(`/api${url}/${body.year}/${body.month}`);
        const result = await response.json();
        if (!result.success) throw result;
        return result;
    });
}

export interface CitasByDayAPI {
    success: boolean;
    citasCount: Record<number, number>;
}
export interface CitasByDayErrorAPI {
    success: boolean;
    message: string;
}
