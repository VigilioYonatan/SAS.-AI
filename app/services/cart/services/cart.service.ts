import { Injectable, Redirect } from "@vigilio/express-core";
import { ProductsApiService } from "@/products/services/products.api.service";
import type { Empresas } from "@/empresas/entities/empresas.entity";
import type { Users } from "@/users/entities/users.entity";
import { Product } from "@/products/libs";

@Injectable()
export class CartService {
    constructor(private readonly productsApiService: ProductsApiService) {}
    async index(
        empresa: Empresas,
        items:
            | {
                  id: number;
                  quantity: number;
                  variant?: number;
                  isCuota?: boolean;
              }[]
            | null
    ) {
        console.log(JSON.stringify({ items }, null, 3));

        const producto = items?.find((item) => item.isCuota);
        if (producto) {
            const product = await Product(empresa, false);
            if (!product) {
                new Redirect("/");
            }
        }
        return {
            title: "Carrito",
            cart: producto ? producto : items?.filter((item) => !item.isCuota),
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
