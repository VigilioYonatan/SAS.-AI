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
import type { V } from "~/libs/helpers";

@DefaultScope(() => ({
    include: { model: Users, attributes: ["id", "username", "photo"] },
}))
@Table
export class Posts extends Model implements Omit<PostsSchema, "id"> {
    @Column({
        allowNull: false,
        type: DataType.TEXT("long"),
    })
    content: string;

    @Column({
        allowNull: false,
        type: DataType.STRING(255),
    })
    title: string;

    @Column({
        type: DataType.STRING(255),
    })
    seo_title: string | null;

    @Column({
        allowNull: false,
        type: DataType.JSON,
    })
    image: FilesSchema[];

    @Column({
        allowNull: false,
        type: DataType.JSON,
    })
    likes: string[];

    @Column({ type: DataType.STRING(250) })
    keywords: string;

    @Column({ type: DataType.DATE })
    date: Date;

    @Column({ type: DataType.BOOLEAN, allowNull: false })
    enabled: boolean;

    @Column({ type: DataType.JSON, defaultValue: [] })
    links: PostsSchema["links"];

    @Column({
        type: DataType.STRING(255),
    })
    slug: string | null;

    @ForeignKey(() => Users)
    @Column({ allowNull: false, type: DataType.INTEGER })
    user_id: number;

    @BelongsTo(() => Users)
    user: V<Users>;

    @ForeignKey(() => Empresas)
    @Column({
        allowNull: false,
        type: DataType.INTEGER,
    })
    empresa_id: number;

    @BelongsTo(() => Empresas)
    empresa: V<Empresas>;
}
