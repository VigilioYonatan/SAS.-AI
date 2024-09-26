import { useMutation } from "@vigilio/preact-fetching";
import { ClientsUpdateDto } from "../dtos/clients.update.dto";
import { ClientsSchemaFromServer } from "../schemas/client.schema";

export function clientsUpdateApi(slug: string | number) {
    return useMutation<
        { success: true; client: ClientsSchemaFromServer },
        ClientsUpdateDto,
        ClientsUpdateErrorAPI
    >(`/clients/${slug}`, async (url, body) => {
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
    });
}

export interface ClientsUpdateErrorAPI {
    success: boolean;
    message: string;
    body: string;
}
