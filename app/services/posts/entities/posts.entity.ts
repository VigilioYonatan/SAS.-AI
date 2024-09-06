import {
    Column,
    DataType,
    Table,
    Model,
    ForeignKey,
    BelongsTo,
    DefaultScope,
} from "sequelize-typescript";
import type { PostsSchema } from "../schemas/posts.schema";
import type { FilesSchema } from "@/uploads/schemas/uploads.schema";
import { Users } from "@/users/entities/users.entity";
import { Empresas } from "@/empresas/entities/empresas.entity";

@DefaultScope(() => ({
    include: { model: Users, attributes: ["id", "username", "photo"] },
}))
@Table
export class Posts extends Model implements Omit<PostsSchema, "id"> {
    @Column({
        allowNull: false,
        type: DataType.STRING(255),
    })
    content: string;
    @Column({
        allowNull: false,
        type: DataType.STRING(100),
    })
    title: string;
    @Column({
        allowNull: false,
        type: DataType.JSON,
    })
    image: FilesSchema[];

    @ForeignKey(() => Users)
    @Column({ allowNull: false, type: DataType.INTEGER })
    user_id: number;

    @BelongsTo(() => Users)
    user: unknown;

    @ForeignKey(() => Empresas)
    @Column({
        allowNull: false,
        type: DataType.INTEGER,
    })
    empresa_id: number;

    @BelongsTo(() => Empresas)
    empresa: unknown;
}
