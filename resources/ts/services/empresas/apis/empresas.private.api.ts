import { type UseQuery, useQuery } from "@vigilio/preact-fetching";
import { EmpresasSchemaFromServer } from "../schemas/empresas.schema";
import { TipoEmpresaSchema } from "../schemas/tipo_empresa.schema";

export function empresaPrivateApi(): UseQuery<
	empresaPrivateAPI,
	empresaPrivateErrorAPI
> {
	return useQuery("/empresas/private", async (url) => {
		const response = await fetch(`/api${url}`);
		const result: empresaPrivateAPI = await response.json();
		if (!result.success) throw result;
		return result;
	});
}

export interface empresaPrivateAPI {
	success: boolean;
	empresa: EmpresasSchemaFromServer & { tipo_empresa: TipoEmpresaSchema };
}

export interface empresaPrivateErrorAPI {
	success: boolean;
	message: string;
}
