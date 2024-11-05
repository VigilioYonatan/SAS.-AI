import {
	Column,
	DataType,
	Table,
	Model,
	BelongsTo,
	ForeignKey,
	DefaultScope,
	HasMany,
	Index,
	BelongsToMany,
} from "sequelize-typescript";
import { Cart } from "@/cart/entites/cart.entity";
import { Categories } from "./categories.entity";
import type { ProductsNormalSchema } from "../schemas/products_normal.schema";
import type { FilesSchema } from "@/uploads/schemas/uploads.schema";
import { DetailOrders } from "@/orders/entities/detail_orders.entity";
import type { CategoriesSchema } from "../schemas/categories.schema";
import { Brands } from "./brands.entitiy";
import { Empresas } from "@/empresas/entities/empresas.entity";
import { Variants } from "./options/variants.entity";
import { ProductsOptions } from "./options/products_options.entity";
import { Options } from "./options/options.entity";

@DefaultScope(() => ({
	include: [
		{
			model: Categories,
			attributes: ["name", "slug","icon"] as (keyof CategoriesSchema)[],
		},
		{ model: Brands },
	],
}))
@Table
export class ProductsNormal
	extends Model
	implements Omit<ProductsNormalSchema, "id">
{
	@Index
	@Column({
		allowNull: false,
		type: DataType.STRING(80),
	})
	product_code: string;

	@Index
	@Column({ type: DataType.STRING(255) })
	name: string;

	@Column({ type: DataType.STRING(255) })
	url: string;

	@Column({ type: DataType.TEXT })
	description: string;

	@Column({
		type: DataType.JSON,
		allowNull: false,
	})
	characteristics: { name: string; value: string }[];

	@Column({
		type: DataType.DECIMAL(10, 2),
		allowNull: false,
	})
	get price(): number {
		return Number.parseFloat(
			this.getDataValue("price" as keyof ProductsNormalSchema),
		);
	}

	@Column({
		type: DataType.DECIMAL(10, 2),
		defaultValue: 0,
	})
	get discount(): number {
		return Number.parseFloat(
			this.getDataValue("discount" as keyof ProductsNormalSchema),
		);
	}

	@Column({
		type: DataType.BOOLEAN,
		defaultValue: true,
	})
	enabled: boolean;

	@Column({
		type: DataType.JSON,
		defaultValue: [],
	})
	images: FilesSchema[] | null;

	@Index
	@Column({
		allowNull: false,
		type: DataType.STRING(255),
	})
	slug: string;

	@ForeignKey(() => Categories)
	@Column({ type: DataType.INTEGER, allowNull: false })
	category_id: number;

	/*****  RELATIONS *****/
	// products - categorias : uno a muchos
	@BelongsTo(() => Categories)
	category: unknown;

	@ForeignKey(() => Brands)
	@Column({ type: DataType.INTEGER })
	brand_id: number | null;

	/*****  RELATIONS *****/
	// products - categorias : uno a muchos
	@BelongsTo(() => Brands)
	brand: unknown;

	@ForeignKey(() => Empresas)
	@Column({ type: DataType.INTEGER, allowNull: false })
	empresa_id: number;

	@BelongsTo(() => Empresas)
	empresa: unknown;

	// products - cart: uno a muchos
	@HasMany(() => Cart)
	carts: unknown[];

	@BelongsToMany(
		() => Options,
		() => ProductsOptions,
	)
	options: unknown & { ProductsOptions: ProductsOptions }[];

	@HasMany(() => DetailOrders, { onDelete: "SET NULL" })
	detailsOrders: unknown[];

	@HasMany(() => Variants)
	variants: unknown[];
}
