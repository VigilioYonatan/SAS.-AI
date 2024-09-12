import { subtotal } from "@/cart/libs/helpers";
import type { Empresas } from "@/empresas/entities/empresas.entity";
import enviroments from "~/config/enviroments.config";

export function pasarelaComision(empresa: Empresas, monto: number) {
	const porcentajeComision = empresa.mercado_pago_comision.comision / 100;
	const comisionPorcentajeTotal = monto * porcentajeComision;

	// Calcular la comisión total sumando la comisión fija
	const comisionTotal =
		comisionPorcentajeTotal + (empresa.mercado_pago_comision.transaccion ?? 0);
	return comisionTotal;
}
export function paypalComision(monto: number, dolarNow: number) {
	return (
		subtotal(monto / dolarNow, enviroments.VITE_PAYPAL_COMISION, true) +
		enviroments.VITE_PAYPAL_TRANSACTION
	);
}
