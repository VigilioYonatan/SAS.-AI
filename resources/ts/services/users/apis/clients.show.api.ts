import { UseMutation, useMutation } from "@vigilio/preact-fetching";
import { ClientsSchemaFromServer } from "../schemas/client.schema";

export function clientsShowApi(): UseMutation<
	ClientsShowAPI,
	string | number,
	ClientsShowErrorAPI
> {
	return useMutation("/clients", async (url, id) => {
		const response = await fetch(`/api${url}/${id}`);
		const result: ClientsShowAPI = await response.json();
		if (!result.success) throw result;
		return result;
	});
}

export interface ClientsShowAPI {
	success: boolean;
	client: ClientsSchemaFromServer;
}

export interface ClientsShowErrorAPI {
	success: boolean;
	message: string;
}
