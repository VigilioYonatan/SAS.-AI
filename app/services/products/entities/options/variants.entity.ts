import type { VariantsSchema } from "@/products/schemas/options/variants.schema";
import {
    BelongsTo,
    BelongsToMany,
    Column,
    DataType,
    ForeignKey,
    HasMany,
    Model,
    Table,
} from "sequelize-typescript";
import { VariantsFeatures } from "./variants_features.entity";
import { Features } from "./features.entity";
import { Cart } from "@/cart/entites/cart.entity";
import { DetailOrders } from "@/orders/entities/detail_orders.entity";
import { ProductsNormal } from "../products_normal.entity";
import { Empresas } from "@/empresas/entities/empresas.entity";

@Table
export class Variants extends Model implements Omit<VariantsSchema, "id"> {
    @Column({ type: DataType.STRING(100) })
    sku: string;

    @Column({ type: DataType.INTEGER, allowNull: false })
    stock: number;

    @Column({ type: DataType.BOOLEAN, allowNull: false })
    ilimit: boolean;

    @Column({ type: DataType.JSON, allowNull: false })
    images: number[];

    @ForeignKey(() => ProductsNormal)
    @Column({ type: DataType.INTEGER })
    product_normal_id: number | null;

    @BelongsTo(() => ProductsNormal)
    product_normal: unknown;

    @HasMany(() => Cart)
    carts: unknown[];

    @HasMany(() => DetailOrders, { onDelete: "SET NULL" })
    detailsOrders: unknown[];

    @BelongsToMany(() => Features, () => VariantsFeatures)
    features: unknown[];

    @ForeignKey(() => Empresas)
    @Column({ type: DataType.INTEGER, allowNull: false })
    empresa_id: number;

    @BelongsTo(() => Empresas)
    empresa: unknown;
}
