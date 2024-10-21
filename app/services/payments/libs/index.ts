import { subtotal } from "@/cart/libs/helpers";
import type { Empresas } from "@/empresas/entities/empresas.entity";
import enviroments from "~/config/enviroments.config";
export type PASARELA =
    | "stripe"
    | "mercado_pago"
    | "izipay"
    | "normal"
    | "paypal";
export function pasarelaComision(
    empresa: Empresas,
    monto: number,
    type: PASARELA
) {
    let comision: number | null = null;
    switch (type) {
        case "mercado_pago": {
            const porcentajeComision =
                empresa.mercado_pago_comision.comision / 100;
            const comisionPorcentajeTotal = monto * porcentajeComision;

            // Calcular la comisión total sumando la comisión fija
            comision =
                comisionPorcentajeTotal +
                (empresa.mercado_pago_comision.transaccion ?? 0);
            break;
        }
        case "izipay": {
            const tasaIziPay = enviroments.VITE_IZIPAY_COMISION / 100;
            const tasaIGV = enviroments.VITE_IZIPAY_COMISION_IMPUESTO / 100;

            const comisionIziPay = monto * tasaIziPay;
            const igvIziPay = comisionIziPay * tasaIGV;

            const igvCanalVirtual =
                enviroments.VITE_IZIPAY_COMISION_TRANSACCION * tasaIGV;

            const comisionTotal =
                comisionIziPay +
                igvIziPay +
                enviroments.VITE_IZIPAY_COMISION_TRANSACCION +
                igvCanalVirtual;

            comision = subtotal(comisionTotal, 18, true);
            break;
        }
        case "stripe": {
            const porcentajeComision = enviroments.VITE_STRIPE_COMISION / 100;
            const comisionPorcentajeTotal = monto * porcentajeComision;
            comision =
                comisionPorcentajeTotal +
                (enviroments.VITE_STRIPE_COMISION_TRANSACCION ?? 0);
            break;
        }
        default:
            comision = 0;
            break;
    }

    return comision;
}
export function paypalComision(monto: number, dolarNow: number) {
    return (
        subtotal(monto / dolarNow, enviroments.VITE_PAYPAL_COMISION, true) +
        enviroments.VITE_PAYPAL_TRANSACTION
    );
}
