import { Injectable } from "@vigilio/express-core";
import { ProductsApiService } from "@/products/services/products.api.service";
import type { Empresas } from "@/empresas/entities/empresas.entity";
import type { Users } from "@/users/entities/users.entity";

@Injectable()
export class CartService {
    constructor(private readonly productsApiService: ProductsApiService) {}
    async index(
        items: { id: number; quantity: number; variant?: number }[] | null
    ) {
        return {
            title: "Carrito",
            cart: items,
        };
    }
    async servicio(empresa: Empresas, slug: string, user: Users | null) {
        const { product } = await this.productsApiService.show(
            empresa,
            slug,
            true,
            true,
            user,
            false
        );
        return {
            title: "Carrito",
            servicio: product,
        };
    }
}
