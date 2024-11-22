import {
	BelongsTo,
	Column,
	DataType,
	DefaultScope,
	ForeignKey,
	HasMany,
	Model,
	Table,
} from "sequelize-typescript";
import type { CommentsSchema } from "../schemas/comments.schema";
import { Users } from "@/users/entities/users.entity";
import { Reactions } from "./reactions.entity";
import { Subcomments } from "./subcomments.entity";
import { Empresas } from "@/empresas/entities/empresas.entity";
import { ProductsNormal } from "@/products/entities/products_normal.entity";
import { ProductsServicio } from "@/products/entities/products_servicio.entity";
import { ProductsRestaurant } from "@/products/entities/products_restaurant.entity";

@DefaultScope(() => ({
	include: [
		{
			model: Users,
			attributes: ["id", "username", "photo"],
		},
	],
}))
@Table
export class Comments extends Model implements Omit<CommentsSchema, "id"> {
	@Column({ allowNull: false, type: DataType.TEXT })
	content: string;

	@ForeignKey(() => Users)
	@Column({ allowNull: false, type: DataType.INTEGER })
	user_id: number;

	@Column({ allowNull: false, type: DataType.INTEGER })
	commentsable_id: number;

	@Column({ allowNull: false, type: DataType.STRING(100) })
	commentsable_type: string;

	@ForeignKey(() => Empresas)
	@Column({ allowNull: false, type: DataType.INTEGER })
	empresa_id: number;

	/*****  RELATIONS   *****/
	//  users - comments : uno a muchos - polimorfismo
	@BelongsTo(() => Users)
	user: unknown;

	//  products - comments : uno a muchos - polimorfismo

	@BelongsTo(() => ProductsNormal, {
		foreignKey: "commentsable_id",
		constraints: false,
	})
	product_normal: unknown;

	@BelongsTo(() => ProductsServicio, {
		foreignKey: "commentsable_id",
		constraints: false,
	})
	product_servicio: unknown;

	@BelongsTo(() => ProductsRestaurant, {
		foreignKey: "commentsable_id",
		constraints: false,
	})
	product_restaurant: unknown;

	// comments - reactions: uno a muchos - polimorfismo
	@HasMany(() => Reactions, {
		foreignKey: "reactionsable_id",
		constraints: false,
		scope: { reactionsable_type: "comments" },
	})
	reactions: unknown[];

	// comments - subcomments
	@HasMany(() => Subcomments)
	subcomments: unknown[];

	@BelongsTo(() => Empresas)
	empresa: unknown;
}
