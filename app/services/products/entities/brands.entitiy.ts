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
import { InformationEntity } from "@/information/entities/information.entity";
import type { FilesSchema } from "@/uploads/schemas/uploads.schema";

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
	products: ProductsNormal[];

	@ForeignKey(() => InformationEntity)
	@Column({ type: DataType.INTEGER, allowNull: false })
	information_id: number;

	@BelongsTo(() => InformationEntity)
	information: unknown;
}
