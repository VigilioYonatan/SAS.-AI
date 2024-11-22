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
import type { SubcommentsSchema } from "../schemas/subcomments.schema";
import { Users } from "@/users/entities/users.entity";
import { Reactions } from "./reactions.entity";
import { Comments } from "./comments.entity";
import { ProductsNormal } from "@/products/entities/products_normal.entity";
import { ProductsServicio } from "@/products/entities/products_servicio.entity";
import { ProductsRestaurant } from "@/products/entities/products_restaurant.entity";
import { Empresas } from "@/empresas/entities/empresas.entity";

@DefaultScope(() => ({
    include: [
        {
            model: Users,
            attributes: ["id", "username", "photo"],
        },
    ],
}))
@Table
export class Subcomments
    extends Model
    implements Omit<SubcommentsSchema, "id">
{
    @Column({ allowNull: false, type: DataType.TEXT })
    content: string;

    @ForeignKey(() => Users)
    @Column({ allowNull: false, type: DataType.INTEGER })
    user_id: number;

    @ForeignKey(() => Empresas)
    @Column({ allowNull: false, type: DataType.INTEGER })
    empresa_id: number;

    @ForeignKey(() => Comments)
    @Column({ allowNull: false, type: DataType.INTEGER })
    comment_id: number;

    @Column({ allowNull: false, type: DataType.INTEGER })
    subcommentsable_id: number;

    @Column({ allowNull: false, type: DataType.STRING(100) })
    subcommentsable_type: string;

    /*****  RELATIONS   *****/

    //  users - subcomments : uno a muchos - polimorfismo
    @BelongsTo(() => Users)
    user: unknown;

    //  products - comments : uno a muchos - polimorfismo

    product: unknown;
    @BelongsTo(() => ProductsNormal, {
        foreignKey: "subcommentsable_id",
        constraints: false,
    })
    product_normal: unknown;

    @BelongsTo(() => ProductsServicio, {
        foreignKey: "subcommentsable_id",
        constraints: false,
    })
    product_servicio: unknown;

    @BelongsTo(() => ProductsRestaurant, {
        foreignKey: "subcommentsable_id",
        constraints: false,
    })
    product_restaurant: unknown;

    //  subcomments - comments : uno a muchos - polimorfismo
    @BelongsTo(() => Comments)
    comment: unknown;

    // subcomments - reactions: uno a muchos - polimorfismo
    @HasMany(() => Reactions, {
        foreignKey: "reactionsable_id",
        constraints: false,
        scope: { reactionsable_type: "subcomments" },
    })
    reactions: unknown[];

    @BelongsTo(() => Empresas)
    empresa: unknown;
}
