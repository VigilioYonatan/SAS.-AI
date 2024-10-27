import { useQuery } from "@vigilio/preact-fetching";
import { CitasSchema } from "../schemas/citas.schema";
import { Signal } from "@preact/signals";
import { ContactsSchema } from "@/empresas/schemas/empresas.schema";

export function citasByDayApi(time: Signal<string>) {
    return useQuery<CitasByDayAPI, CitasByDayErrorAPI>(
        `/citas/day?time=${time}`,
        async (url) => {
            const response = await fetch(`/api${url}`);
            const result = await response.json();
            if (!result.success) throw result;
            return result;
        }
    );
}

export interface CitasByDayAPI {
    success: boolean;
    citas: (CitasSchema & { contact: ContactsSchema })[];
}
export interface CitasByDayErrorAPI {
    success: boolean;
    message: string;
    body: string;
}
