import enviroments from "~/config";
import { useQuery } from "@vigilio/preact-fetching";
import type { DepartmentsSchemaFromServer } from "../schemas/departments.schema";

export function departmentsIndexApi() {
	return useQuery<DepartmentsIndexAPI, unknown>(
		"/ubigeo/departments",
		async (url) => {
			const response = await fetch(`${enviroments.VITE_URL}/api${url}`);
			const result = await response.json();
			if (!result.success) throw result;
			return result;
		},
	);
}

export interface DepartmentsIndexAPI {
	success: boolean;
	data: DepartmentsSchemaFromServer[];
}
