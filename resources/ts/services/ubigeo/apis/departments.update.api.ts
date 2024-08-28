import enviroments from "~/config";
import { useMutation } from "@vigilio/preact-fetching";
import type { DepartmentsUpdateDto } from "../dtos/departments.update.dto";

export function departmentsUpdateApi(id: string) {
    return useMutation<
        DepartmentsUpdateAPI,
        DepartmentsUpdateDto,
        DepartmentsUpdateErrorAPI
    >(`/ubigeo/departments/${id}`, async (url, body) => {
        const response = await fetch(`/${url}`, {
            method: "PUT",
            body: JSON.stringify(body),
            headers: {
                "Content-Type": "Application/json",
            },
        });
        const result = await response.json();
        if (!result.success) throw result;
        return result;
    });
}

export interface DepartmentsUpdateAPI {
    success: boolean;
    message: string;
}
export interface DepartmentsUpdateErrorAPI {
    success: boolean;
    message: string;
    body: keyof DepartmentsUpdateDto;
}
