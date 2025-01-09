import { CrudUpdateDto } from "@/empresas/dtos/crud.update.dto";
import { useMutation } from "@vigilio/preact-fetching";

export function crudUpdateApi(id: number) {
    return useMutation<CrudUpdateAPI, CrudUpdateDto, CrudUpdateErrorAPI>(
        `/crud/${id}`,
        async (url, body) => {
            const response = await fetch(`/api${url}`, {
                method: "PUT",
                body: JSON.stringify(body),
                headers: {
                    "Content-type": "application/json",
                },
            });
            const result = await response.json();
            if (!result.success) throw result;
            return result;
        }
    );
}

export interface CrudUpdateAPI {
    success: boolean;
    message: string;
}

export interface CrudUpdateErrorAPI {
    success: boolean;
    body: keyof CrudUpdateDto;
    message: string;
}
