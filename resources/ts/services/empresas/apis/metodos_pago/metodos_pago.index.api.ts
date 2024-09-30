import { MetodosPagoSchema } from "@/empresas/schemas/metodosPago.schema";
import { storageEmpresa } from "@/empresas/stores/empresa.store";
import { useQuery } from "@vigilio/preact-fetching";

export function metodoIndexApi() {
	return useQuery(
		`/empresas/${storageEmpresa?.slug}/metodos_pago`,
		async (url) => {
			const response = await fetch(`/api${url}`);
			const result: MetodoIndexAPI = await response.json();
			if (!result.success) throw result;
			return result;
		},
	);
}

export interface MetodoIndexAPI {
	success: boolean;
	metodo: MetodosPagoSchema;
}

export interface Logo {
	dimension: number;
	file: string;
}
