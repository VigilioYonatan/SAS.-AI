import { type UseQuery, useQuery } from "@vigilio/preact-fetching";
import { ComplaintsSchemaFromServer } from "../schemas/complaints.schema";

export function complaintsShowApi(
    id: number
): UseQuery<ComplaintsShowAPI, ComplaintsShowErrorAPI> {
    return useQuery(`/complaints/${id}`, async (url) => {
        const response = await fetch(`/api${url}`);
        const result = await response.json();
        if (!result.success) throw result;
        return result;
    });
}

export interface ComplaintsShowAPI {
    success: boolean;
    complaint: ComplaintsSchemaFromServer;
}

export interface ComplaintsShowErrorAPI {
    success: boolean;
    message: string;
}
