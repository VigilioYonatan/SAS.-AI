import { useMutation } from "@vigilio/preact-fetching";
import { CitasSchema } from "../schemas/citas.schema";
import { CitasUpdateDto } from "../dtos/citas.update.dto";

export function citasUpdateApi(id: number) {
    return useMutation<CitasUpdateAPI, CitasUpdateDto, CitasUpdateErrorAPI>(
        `/citas/${id}`,
        async (url, body) => {
            const response = await fetch(`/api${url}`, {
                method: "PUT",
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

export interface CitasUpdateAPI {
    success: boolean;
    cita: CitasSchema;
}
export interface CitasUpdateErrorAPI {
    success: boolean;
    message: string;
    body: string;
}
