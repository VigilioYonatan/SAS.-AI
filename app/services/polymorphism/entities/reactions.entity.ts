import {
    BelongsTo,
    Column,
    DataType,
    ForeignKey,
    Model,
    Table,
} from "sequelize-typescript";
import type { ReactionsSchema } from "../schemas/reactions.schema";
import { Users } from "@/users/entities/users.entity";
import { Comments } from "./comments.entity";
import { Subcomments } from "./subcomments.entity";
import { Empresas } from "@/empresas/entities/empresas.entity";
import type { V } from "~/libs/helpers";

@Table
export class Reactions extends Model implements Omit<ReactionsSchema, "id"> {
    @Column({ allowNull: false, type: DataType.BOOLEAN })
    isLike: boolean;

    @ForeignKey(() => Users)
    @Column
    user_id: number;

    @Column({ type: DataType.INTEGER, allowNull: false })
    reactionsable_id: number;

    @Column({ type: DataType.STRING(100), allowNull: false })
    reactionsable_type: string;

    @ForeignKey(() => Empresas)
    @Column({ allowNull: false, type: DataType.INTEGER })
    empresa_id: number;

    /*****  RELATIONS   *****/
    // users - reactions: uno a muchos - polimorfismo
    @BelongsTo(() => Users)
    user: V<Users>;

    // product - reactions: uno a muchos - polimorfismo
    @BelongsTo(() => Comments, {
        foreignKey: "reactionsable_id",
        constraints: false,
    })
    comments: V<Comments>;

    @BelongsTo(() => Subcomments, {
        foreignKey: "reactionsable_id",
        constraints: false,
    })
    subcomments: V<Subcomments>;

    @BelongsTo(() => Empresas)
    empresa: V<Empresas>;
}
