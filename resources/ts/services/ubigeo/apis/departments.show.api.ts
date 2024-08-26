import enviroments from "~/config";
import { useQuery } from "@vigilio/preact-fetching";
import type { DepartmentsSchemaFromServer } from "../schemas/departments.schema";

export function departmentsShowApi(ubigeo: string) {
	return useQuery<DepartmentsShowAPI, unknown>(
		`/ubigeo/departments/${ubigeo}`,
		async (url) => {
			const response = await fetch(`${enviroments.VITE_URL}/api${url}`);
			const result = await response.json();
			if (!result.success) throw result;
			return result;
		},
	);
}

export interface DepartmentsShowAPI {
	success: boolean;
	department: DepartmentsSchemaFromServer;
}
