import type { ComplaintsSchemaFromServer } from "../schemas/complaints.schema";
import type { ComplaintsStoreDto } from "../dtos/complaints.store.dto";
import { useMutation } from "@vigilio/preact-fetching";
import enviroments from "~/config";

export const complaintsUploadPhoto = "/complaints/";

export function complaintsStoreApi() {
	return useMutation<
		ComplaintsStoreAPI,
		ComplaintsStoreDto,
		ComplaintsStoreErrorAPI
	>("/complaints", async (url, body) => {
		const response = await fetch(`${enviroments.VITE_URL}/api${url}`, {
			body: JSON.stringify({ ...body, dateOfComplaint: new Date() }),
			method: "POST",
			headers: {
				"content-type": "application/json",
			},
		});
		const result: ComplaintsStoreAPI = await response.json();

		if (!result.success) throw result;
		return result;
	});
}

export interface ComplaintsStoreAPI {
	success: boolean;
	complaint: ComplaintsSchemaFromServer;
}

export interface ComplaintsStoreErrorAPI {
	success: boolean;
	message: string;
	body: string;
}
