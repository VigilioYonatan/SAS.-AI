import { useMutation } from "@vigilio/preact-fetching";
import type { UsersSchemaFromServer } from "../schemas/users.schema";
import type { UsersUpdatePremioDto } from "../dtos/users.update.premio.dto";

export function usersUpdatePremioApi() {
    return useMutation<
        { success: true; user: UsersSchemaFromServer },
        UsersUpdatePremioDto,
        UsersUpdateErrorAPI
    >("/users/premios", async (url, body) => {
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

export interface UsersUpdateErrorAPI {
    success: boolean;
    message: string;
    body: string;
}
