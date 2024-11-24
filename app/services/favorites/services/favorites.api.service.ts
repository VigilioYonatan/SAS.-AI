import { Favorites } from "../entities/favorites.entity";
import { ProductsApiService } from "@/products/services/products.api.service";
import { NotFoundException, Injectable } from "@vigilio/express-core";
import { Users } from "@/users/entities/users.entity";
import { ProductsNormal } from "@/products/entities/products_normal.entity";
import type { ProductsNormalSchema } from "@/products/schemas/products_normal.schema";
import { ProductsRestaurant } from "@/products/entities/products_restaurant.entity";
import type { ProductsRestaurantSchema } from "@/products/schemas/products_restaurant.schema";
import { ProductsServicio } from "@/products/entities/products_servicio.entity";
import type { ProductsServicioSchema } from "@/products/schemas/products_servicio.schema";
import type { Empresas } from "@/empresas/entities/empresas.entity";
import { productEntityId } from "@/products/libs";

@Injectable()
export class FavoritesApiService {
    constructor(private readonly productsApiService: ProductsApiService) {}
    async index(empresa: Empresas, user: Users) {
        const data = await Favorites.findAll({
            where: {
                user_id: user.id,
                empresa_id: empresa.id,
            },
            include: [
                {
                    model: ProductsNormal,
                    attributes: [
                        "images",
                        "id",
                        "slug",
                        "name",
                        "price",
                        "discount",
                    ] as (keyof ProductsNormalSchema)[],
                },
                {
                    model: ProductsRestaurant,
                    attributes: [
                        "images",
                        "id",
                        "slug",
                        "name",
                        "price",
                        "discount",
                    ] as (keyof ProductsRestaurantSchema)[],
                },
                {
                    model: ProductsServicio,
                    attributes: [
                        "images",
                        "id",
                        "slug",
                        "name",
                        "price",
                        "discount",
                    ] as (keyof ProductsServicioSchema)[],
                },
            ],
        });
        return {
            success: true,
            data,
        };
    }
    async show(
        empresa: Empresas,
        user: Users,
        product_id: string,
        isService: boolean
    ) {
        const productId = productEntityId(empresa, isService);
        const favorite = await Favorites.findOne({
            where: {
                [productId]: product_id,
                user_id: user.id,
                empresa_id: empresa.id,
            },
        });
        if (!favorite)
            throw new NotFoundException("No se encontró este favorito");

        return {
            success: true,
            favorite,
        };
    }

    async store(
        empresa: Empresas,
        user: Users,
        product_id: string,
        isService: boolean
    ) {
        const { product } = await this.productsApiService.show(
            empresa,
            product_id,
            isService,
            false,
            null
        );
        const productId = productEntityId(empresa, isService);

        const react = await Favorites.findOne({
            where: {
                [productId]: product.id,
                user_id: user.id,
                empresa_id: empresa.id,
            },
        });
        if (react) throw new NotFoundException("Ya se elegió como favorito");
        await Favorites.create({
            [productId]: product.id,
            user_id: user.id,
            empresa_id: empresa.id,
        });
        return {
            success: true,
            message: "Agregaste como favorito a este producto correctamente.",
        };
    }

    async destroy(
        empresa: Empresas,
        user: Users,
        product_id: string,
        isService: boolean
    ) {
        const { favorite } = await this.show(
            empresa,
            user,
            product_id,
            isService
        );

        await favorite.destroy();
        return {
            success: true,
            message: "Quitaste el favorito a este producto correctamente.",
        };
    }
}
