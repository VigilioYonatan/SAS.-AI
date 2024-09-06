import {
    Column,
    DataType,
    Table,
    Model,
    Scopes,
    HasMany,
    BelongsToMany,
    Index,
    ForeignKey,
    BelongsTo,
    DefaultScope,
} from "sequelize-typescript";
import type { Subscription, UsersSchema } from "../schemas/users.schema";
import { Orders } from "@/orders/entities/orders.entity";
import { Cart } from "@/cart/entites/cart.entity";
import { Notifications } from "@/notificactions/entities/notifications.entity";
import type { FilesSchema } from "@/uploads/schemas/uploads.schema";
import { NotificationsUser } from "@/notificactions/entities/notifications_user.entity";
import { Empresas } from "@/empresas/entities/empresas.entity";
import { Posts } from "@/posts/entities/posts.entity";

@DefaultScope(() => ({
    include: [
        {
            model: Empresas,
            attributes: ["id", "slug", "name_empresa"],
        },
    ],
}))
@Scopes(() => ({
    hiddePassword: {
        attributes: { exclude: ["password"] as (keyof UsersSchema)[] },
    },
}))
@Table
export class Users extends Model implements Omit<UsersSchema, "id"> {
    @Index
    @Column({
        allowNull: false,
        type: DataType.STRING(30),
    })
    user_code: string;

    @Column({
        allowNull: false,
        type: DataType.STRING(30),
    })
    username: string;

    @Column({
        allowNull: false,
        type: DataType.STRING(30),
    })
    name: string;

    @Column({
        type: DataType.STRING(100),
    })
    lastname: string | null;

    @Column({
        type: DataType.STRING(100),
    })
    email: string | null;

    @Column({
        allowNull: false,
        type: DataType.STRING(200),
    })
    password: string;

    @Column({
        type: DataType.STRING(100),
    })
    address: string | null;

    @Column({
        type: DataType.STRING(80),
        allowNull: false,
    })
    telephone: string;

    @Column({
        type: DataType.JSON,
    })
    photo: FilesSchema[] | null;

    @Column({
        allowNull: false,
        type: DataType.BOOLEAN,
        defaultValue: false,
    })
    enabled: boolean;

    @Column({
        type: DataType.BOOLEAN,
        defaultValue: false,
    })
    enabledNotification: boolean | null;

    @Column({
        type: DataType.BOOLEAN,
        defaultValue: false,
    })
    enabledEmailsOffers: boolean | null;

    @Column({
        type: DataType.BOOLEAN,
        defaultValue: false,
    })
    isOnline: boolean;

    @Column({
        type: DataType.JSON,
    })
    subscription: Subscription | null;

    @Column({
        type: DataType.DATE,
    })
    birthday: Date;

    @Column({
        type: DataType.STRING(255),
    })
    token: string | null;

    @Index
    @Column({
        allowNull: false,
        type: DataType.STRING(30),
    })
    slug: string;

    @Column({ allowNull: false, type: DataType.INTEGER })
    role_id: number;

    @ForeignKey(() => Empresas)
    @Column({ allowNull: false, type: DataType.INTEGER })
    empresa_id: number;

    @BelongsTo(() => Empresas)
    empresa: Empresas;

    /*****  RELATIONS *****/

    // user - roles : uno a muchos

    @HasMany(() => Orders)
    orders: Orders[];

    @HasMany(() => Cart)
    carts: Cart[];

    @BelongsToMany(() => Notifications, () => NotificationsUser)
    notificationsusers: Notifications[];

    @HasMany(() => Posts)
    posts: unknown[];
}
