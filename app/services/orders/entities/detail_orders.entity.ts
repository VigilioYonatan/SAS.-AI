import {
    BelongsTo,
    Column,
    DataType,
    ForeignKey,
    Model,
    Table,
} from "sequelize-typescript";
import type { DetailOrdersSchema } from "../schemas/detail_orders.schema";
import { Orders } from "./orders.entity";
import { Empresas } from "@/empresas/entities/empresas.entity";
import { ProductsNormal } from "@/products/entities/products_normal.entity";
import { ProductsServicio } from "@/products/entities/products_servicio.entity";
import { ProductsRestaurant } from "@/products/entities/products_restaurant.entity";
import { Variants } from "@/products/entities/options/variants.entity";
import type { V } from "~/libs/helpers";

@Table({ tableName: "detail_orders" })
export class DetailOrders
    extends Model
    implements Omit<DetailOrdersSchema, "id">
{
    @Column({ allowNull: false, type: DataType.INTEGER })
    quantity: number;

    @Column({ allowNull: false, type: DataType.DECIMAL(10, 2) })
    get price(): number {
        return Number.parseFloat(
            this.getDataValue("price" as keyof DetailOrdersSchema)
        );
    }

    @Column({ type: DataType.STRING(100) })
    coupon: string | null;

    @Column({ type: DataType.STRING(100) })
    variante: string | null;

    @ForeignKey(() => Orders)
    @Column({
        allowNull: false,
        type: DataType.INTEGER,
    })
    order_id: number;

    // product
    @ForeignKey(() => ProductsNormal)
    @Column({ type: DataType.INTEGER })
    product_normal_id: number | null;

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
    // end product

    @BelongsTo(() => Orders)
    order: V<Orders>;

    @ForeignKey(() => Empresas)
    @Column({ type: DataType.INTEGER, allowNull: false })
    empresa_id: number;

    @BelongsTo(() => Empresas)
    empresa: V<Empresas>;

    @ForeignKey(() => Variants)
    @Column({ type: DataType.INTEGER })
    variant_id: number | null;

    @BelongsTo(() => Variants, { onDelete: "SET NULL", onUpdate: "CASCADE" })
    variant: V<Variants> | null;
}
