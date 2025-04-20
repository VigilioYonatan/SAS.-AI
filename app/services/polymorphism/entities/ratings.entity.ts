import {
    BelongsTo,
    Column,
    DataType,
    ForeignKey,
    Model,
    Table,
} from "sequelize-typescript";
import type { RatingsSchema } from "../schemas/ratings.schema";
import { Users } from "@/users/entities/users.entity";
import { ProductsNormal } from "@/products/entities/products_normal.entity";
import { ProductsServicio } from "@/products/entities/products_servicio.entity";
import { ProductsRestaurant } from "@/products/entities/products_restaurant.entity";
import { Empresas } from "@/empresas/entities/empresas.entity";
import type { V } from "~/libs/helpers";

@Table
export class Ratings extends Model implements Omit<RatingsSchema, "id"> {
    @Column({ type: DataType.DECIMAL(10, 2), allowNull: false })
    get rating(): number {
        return Number.parseFloat(
            this.getDataValue("rating" as keyof RatingsSchema)
        );
    }
    @ForeignKey(() => Users)
    @Column({ type: DataType.INTEGER, allowNull: false })
    user_id: number;

    @Column({ allowNull: false, type: DataType.INTEGER })
    ratingsable_id: number;

    @Column({ allowNull: false, type: DataType.STRING(100) })
    ratingsable_type: string;

    @ForeignKey(() => Empresas)
    @Column({ allowNull: false, type: DataType.INTEGER })
    empresa_id: number;

    // Relations
    @BelongsTo(() => Users)
    user: V<Users>;

    @BelongsTo(() => ProductsNormal, {
        foreignKey: "ratingsable_id",
        constraints: false,
    })
    product_normal: V<ProductsNormal>;

    @BelongsTo(() => ProductsServicio, {
        foreignKey: "ratingsable_id",
        constraints: false,
    })
    product_servicio: V<ProductsServicio>;

    @BelongsTo(() => ProductsRestaurant, {
        foreignKey: "ratingsable_id",
        constraints: false,
    })
    product_restaurant: V<ProductsRestaurant>;
}
