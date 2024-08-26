import enviroments from "~/config";
import { type UseQuery, useQuery } from "@vigilio/preact-fetching";
import type { PayMethodsSchemaFromServer } from "../schemas/pay_methods.schema";

export type PayMethodsIndexApiMethod = UseQuery<PayMethodsIndexAPI, unknown>;

export function payMethodsIndexApi(): PayMethodsIndexApiMethod {
	return useQuery<PayMethodsIndexAPI, unknown>("/pay_methods", async (url) => {
		const response = await fetch(`${enviroments.VITE_URL}/api${url}`);
		const result = await response.json();
		if (!result.success) throw result;

		return result;
	});
}

export interface PayMethodsIndexAPI {
	success: boolean;
	data: PayMethodsSchemaFromServer[];
}
