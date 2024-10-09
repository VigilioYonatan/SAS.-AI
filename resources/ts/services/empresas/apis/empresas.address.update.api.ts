import { useMutation, type UseMutation } from "@vigilio/preact-fetching";
import type { EmpresaAddressUpdateDto } from "../dtos/empresas.address.update.dto";
export function EmpresaAddressUpdateApi(): UseMutation<
	EmpresaAddressUpdateApi,
	EmpresaAddressUpdateDto,
	EmpresaAddressUpdateApiError
> {
	return useMutation("/empresas/address", async (url, body) => {
		const response = await fetch(`/api${url}`, {
			method: "PUT",
			body: JSON.stringify(body),
			headers: {
				"content-type": "application/json",
			},
		});
		const result = await response.json();

		if (!result.success) throw result;
		return result;
	});
}

interface EmpresaAddressUpdateApi {
	success: true;
	message: string;
}
interface EmpresaAddressUpdateApiError {
	success: true;
	message: string;
	body: keyof EmpresaAddressUpdateDto;
}
