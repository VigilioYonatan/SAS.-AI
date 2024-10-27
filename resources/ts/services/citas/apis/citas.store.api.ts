import { useMutation } from "@vigilio/preact-fetching";
import { CitasStoreDto } from "../dtos/citas.store.dto";
import { CitasSchema } from "../schemas/citas.schema";

export function citasStoreApi() {
    return useMutation<CitasStoreAPI, CitasStoreDto, CitasStoreErrorAPI>(
        "/citas",
        async (url, body) => {
            const response = await fetch(`/api${url}`, {
                method: "POST",
                body: JSON.stringify(body),
                headers: {
                    "content-type": "application/json",
                },
            });
            const result = await response.json();
            if (!result.success) throw result;
            return result;
        }
    );
}

export interface CitasStoreAPI {
    success: boolean;
    cita: CitasSchema;
}
export interface CitasStoreErrorAPI {
    success: boolean;
    message: string;
    body: string;
}
