import {
    Column,
    DataType,
    Table,
    Model,
    ForeignKey,
    BelongsTo,
} from "sequelize-typescript";
import { type FavoritesSchema } from "../schemas/favorites.schema";
import { Users } from "@/users/entities/users.entity";
import { ProductsNormal } from "@/products/entities/products_normal.entity";
import { ProductsServicio } from "@/products/entities/products_servicio.entity";
import { ProductsRestaurant } from "@/products/entities/products_restaurant.entity";
import { Empresas } from "@/empresas/entities/empresas.entity";
import type { V } from "~/libs/helpers";

@Table
export class Favorites extends Model implements FavoritesSchema {
    @ForeignKey(() => Users)
    @Column({
        allowNull: false,
        type: DataType.INTEGER,
    })
    user_id: number;

    // product
    @ForeignKey(() => ProductsNormal)
    @Column({ type: DataType.INTEGER })
    product_normal_id: number | null;

    @ForeignKey(() => Empresas)
    @Column({ type: DataType.INTEGER })
    empresa_id: number;

    @ForeignKey(() => ProductsServicio)
    @Column({ type: DataType.INTEGER })
    product_servicio_id: number | null;

    @ForeignKey(() => ProductsRestaurant)
    @Column({ type: DataType.INTEGER })
    product_restaurant_id: number | null;

    @BelongsTo(() => ProductsNormal)
    product_normal: V<ProductsNormal>;

    @BelongsTo(() => ProductsServicio)
    product_servicio: V<ProductsServicio>;

    @BelongsTo(() => ProductsRestaurant)
    product_restaurant: V<ProductsRestaurant>;

    @BelongsTo(() => Empresas)
    empesa: V<Empresas>;
}
