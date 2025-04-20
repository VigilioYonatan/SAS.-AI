import {
    BelongsTo,
    Column,
    DataType,
    ForeignKey,
    HasMany,
    Index,
    Model,
    Table,
} from "sequelize-typescript";
import { ProductsNormal } from "./products_normal.entity";
import type { BrandsSchema } from "../schemas/brands.schema";
import { Empresas } from "@/empresas/entities/empresas.entity";
import type { FilesSchema } from "@/uploads/schemas/uploads.schema";
import type { V } from "~/libs/helpers";

@Table
export class Brands extends Model implements Omit<BrandsSchema, "id"> {
    @Index
    @Column({ type: DataType.STRING(100), allowNull: false })
    name: string;

    @Column({ type: DataType.STRING(80), allowNull: false })
    brand_code: string;

    @Column({
        type: DataType.JSON,
        defaultValue: [],
    })
    image: FilesSchema[] | null;

    @Column({ type: DataType.STRING(100), allowNull: false })
    slug: string;

    @HasMany(() => ProductsNormal)
    products: V<ProductsNormal>[];

    @ForeignKey(() => Empresas)
    @Column({ type: DataType.INTEGER, allowNull: false })
    empresa_id: number;

    @BelongsTo(() => Empresas)
    empresa: V<Empresas>;
}
