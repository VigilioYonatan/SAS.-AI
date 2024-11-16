import {
    Column,
    DataType,
    Table,
    Model,
    HasMany,
    ForeignKey,
    BelongsTo,
    DefaultScope,
    Index,
} from "sequelize-typescript";
import { Categories } from "./categories.entity";
import type { SubcategoriesSchema } from "../schemas/subcategories.schema";
import type { FilesSchema } from "@/uploads/schemas/uploads.schema";
import { ProductsNormal } from "./products_normal.entity";
import { ProductsRestaurant } from "./products_restaurant.entity";
import { Empresas } from "@/empresas/entities/empresas.entity";

@DefaultScope(() => ({
    include: [{ model: Categories, attributes: ["id", "name", "slug"] }],
}))
@Table
export class Subcategories
    extends Model
    implements Omit<SubcategoriesSchema, "id">
{
    @Index
    @Column({
        allowNull: false,
        type: DataType.STRING(30),
    })
    subcategory_code: string;

    @Index
    @Column({
        allowNull: false,
        unique: true,
        type: DataType.STRING(255),
    })
    name: string;

    @Column({
        allowNull: false,
        type: DataType.JSON,
    })
    image: FilesSchema[];

    @Index
    @Column({
        allowNull: false,
        unique: true,
        type: DataType.STRING(255),
    })
    slug: string;

    @ForeignKey(() => Categories)
    @Column({ allowNull: false, type: DataType.INTEGER })
    category_id: number;

    /****  RELATIONS  *****/

    // subcategories - categories: uno a muchos
    @BelongsTo(() => Categories)
    category: unknown;

    // products - subcategories : uno a muchos
    @HasMany(() => ProductsNormal)
    productsNormals: unknown[];

    @HasMany(() => ProductsRestaurant)
    productsRestaurants: unknown[];

    @ForeignKey(() => Empresas)
    @Column({ type: DataType.INTEGER, allowNull: false })
    empresa_id: number;

    @BelongsTo(() => Empresas)
    empresa: unknown;
}
