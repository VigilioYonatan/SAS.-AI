import { useQuery } from "@vigilio/preact-fetching";

export function adminEarningApi() {
	return useQuery<AdminEarningAPI, unknown>("/admin/earning", async (url) => {
		const response = await fetch(`/api${url}`);
		const result = await response.json();
		if (!result.success) throw result;
		return result;
	});
}

export interface AdminEarningAPI {
	success: true;
	results: {
		gananciasMensual: GananciasMensual;
		getYearMonthAmount: GetYearMonthAmount[];
		gananciasAnual: { total: number | null };
		gananciasDiario: { total: number | null };
		gananciasPrimerDay: { total: number | null };
		gananciasAyer: { total: number | null };
	};
}

export interface GananciasMensual {
	total: null;
}

export interface GetYearMonthAmount {
	year: number;
	result: Result[];
}

export interface Result {
	total: string;
	monthNumber: number;
	month: string;
}
