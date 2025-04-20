import {
    BelongsTo,
    Column,
    DataType,
    ForeignKey,
    Model,
    Table,
} from "sequelize-typescript";
import type { CartSchema } from "../schemas/cart.schema";
import { Users } from "@/users/entities/users.entity";
import { ProductsNormal } from "@/products/entities/products_normal.entity";
import { ProductsRestaurant } from "@/products/entities/products_restaurant.entity";
import { Empresas } from "@/empresas/entities/empresas.entity";
import { Variants } from "@/products/entities/options/variants.entity";
import type { V } from "~/libs/helpers";

@Table
export class Cart extends Model implements Omit<CartSchema, "id"> {
    @Column({ type: DataType.INTEGER, allowNull: false })
    quantity: number;

    @Column({ type: DataType.STRING })
    coupon: string | null;

    @ForeignKey(() => Users)
    @Column({ allowNull: false, type: DataType.INTEGER })
    user_id: number;

    // product
    @ForeignKey(() => ProductsNormal)
    @Column({ type: DataType.INTEGER })
    product_normal_id: number | null;

    @ForeignKey(() => ProductsRestaurant)
    @Column({ type: DataType.INTEGER })
    product_restaurant_id: number | null;

    @BelongsTo(() => ProductsNormal)
    product_normal: V<ProductsNormal>;

    @BelongsTo(() => ProductsRestaurant)
    product_restaurant: V<ProductsRestaurant>;
    // end product
    @ForeignKey(() => Empresas)
    @Column({ type: DataType.INTEGER, allowNull: false })
    empresa_id: number;

    @BelongsTo(() => Empresas)
    empresa: V<Empresas>;

    /*****     RELATIONS    *****/
    // user - cart :uno a muchos
    @BelongsTo(() => Users)
    user: V<Users>;

    @ForeignKey(() => Variants)
    @Column({ type: DataType.INTEGER })
    variant_id: number | null;

    @BelongsTo(() => Variants, { onDelete: "CASCADE", onUpdate: "CASCADE" })
    variant: V<Variants>;
}
