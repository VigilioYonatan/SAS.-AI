import { useQuery } from "@vigilio/preact-fetching";
import { CitasSchema } from "../schemas/citas.schema";
import { Signal } from "@preact/signals";
import { ContactsSchema } from "@/empresas/schemas/empresas.schema";
import { TimePeru } from "~/libs/helpers";

export function citasByDayApi(time: Signal<string>) {
    return useQuery<CitasByDayAPI, CitasByDayErrorAPI>(
        `/citas/day?time=${time}`,
        async (url) => {
            const response = await fetch(`/api${url}`);
            const result = await response.json();
            const timer = TimePeru(time.value);
            const response2 = await fetch(
                `/api/citas/${timer.year()}/${timer.month() + 1}`
            );
            const result2 = await response2.json();

            if (!result.success) throw result;
            return { ...result, citasCount: result2.citasCount };
        }
    );
}

export interface CitasByDayAPI {
    success: boolean;
    citas: (CitasSchema & { contact: ContactsSchema })[];
    citasCount: Record<number, number>;
}
export interface CitasByDayErrorAPI {
    success: boolean;
    message: string;
    body: string;
}
