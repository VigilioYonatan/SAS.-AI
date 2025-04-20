import {
    Column,
    DataType,
    Table,
    Model,
    HasMany,
    Index,
    ForeignKey,
    BelongsTo,
} from "sequelize-typescript";
import { ProductsNormal } from "@/products/entities/products_normal.entity";
import type { CategoriesSchema } from "../schemas/categories.schema";
import { Empresas } from "@/empresas/entities/empresas.entity";
import { ProductsRestaurant } from "./products_restaurant.entity";
import type { FilesSchema } from "@/uploads/schemas/uploads.schema";
import { ProductsServicio } from "./products_servicio.entity";
import { Subcategories } from "./subcategories.entity";
import type { V } from "~/libs/helpers";

@Table
export class Categories extends Model implements Omit<CategoriesSchema, "id"> {
    @Index
    @Column({
        allowNull: false,
        type: DataType.STRING(30),
    })
    category_code: string;

    @Index
    @Column({
        allowNull: false,
        type: DataType.STRING(255),
    })
    name: string;

    @Column({
        allowNull: false,
        type: DataType.BOOLEAN,
    })
    isService: boolean;

    @Column({
        type: DataType.JSON,
        defaultValue: [],
    })
    image: FilesSchema[] | null;

    @Column({
        type: DataType.JSON,
    })
    wallpaper: FilesSchema[] | null;

    @Column({
        type: DataType.STRING(255),
    })
    icon: string;

    @Index
    @Column({
        allowNull: false,
        type: DataType.STRING(255),
    })
    slug: string;

    // products - subcategories : uno a muchos
    @HasMany(() => ProductsNormal)
    productsNormals: V<ProductsNormal>[];

    @HasMany(() => Subcategories)
    subcategories: V<Subcategories>[];

    @HasMany(() => ProductsRestaurant)
    productsRestaurants: V<ProductsRestaurant>[];

    @HasMany(() => ProductsServicio)
    productsServicios:  V<ProductsServicio>[];

    @ForeignKey(() => Empresas)
    @Column({ type: DataType.INTEGER, allowNull: false })
    empresa_id: number;

    @BelongsTo(() => Empresas)
    empresa: V<Empresas>;
}
