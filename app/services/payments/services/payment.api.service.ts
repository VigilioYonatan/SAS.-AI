import type { MetodosPago } from "@/information/entities/metodosPago.entity";
import type { InformationApiService } from "@/information/services/information.api.service";
import type { OrdersStoreDto } from "@/orders/dtos/orders.store.dto";
import type { OrdersApiService } from "@/orders/services/orders.api.service";
import { BadRequestException, Injectable } from "@vigilio/express-core";
import { MercadoPagoConfig, Preference } from "mercadopago";

@Injectable()
export class PaymentApiService {
    constructor(
        private readonly informationApiService: InformationApiService,
        private readonly ordersApiService: OrdersApiService
    ) {}
    async order(slug: string, orderStore: OrdersStoreDto) {
        const information = await this.informationApiService.show(slug);
        if (!(information.information.metodos_pago as MetodosPago).mercado_pago)
            throw new BadRequestException("No disponible");
        const client = new MercadoPagoConfig({
            accessToken: (information.information.metodos_pago as MetodosPago)
                .mercado_pago!,
            options: {
                timeout: 5000, // Puedes configurar opciones adicionales como el tiempo de espera
            },
        });
        const payment = new Preference(client);

        try {
            const { order } = await this.ordersApiService.store(
                orderStore,
                information.information
            );
            const response = await payment.create({
                body: {
                    items: [
                        {
                            id: order.order_code,
                            title: `${information.information.name_empresa} - Pedido ${order.order_code}`,
                            unit_price: 10,
                            quantity: 1,
                        },
                    ],
                    back_urls: {
                        success: "http://localhost:3000/success",
                        failure: "http://localhost:3000/failure",
                        pending: "http://localhost:3000/pending",
                    },
                    auto_return: "approved",
                },
            });
            return response;
        } catch (error) {
            throw new BadRequestException("Error al procesar el pago");
        }
    }
}
