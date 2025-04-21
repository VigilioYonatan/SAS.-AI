import {
    BelongsTo,
    Column,
    DataType,
    DefaultScope,
    ForeignKey,
    Model,
    Table,
} from "sequelize-typescript";
import { Users } from "@/users/entities/users.entity";
import { Notifications } from "./notifications.entity";
import type { UsersSchema } from "@/users/schemas/users.schema";
import type { NotificationsUserSchema } from "../schemas/notifications_user.schema";
import { Empresas } from "@/empresas/entities/empresas.entity";
import type { V } from "~/libs/helpers";

@DefaultScope(() => ({
    include: [
        {
            model: Users,
            attributes: [
                "id",
                "username",
                "photo",
                "role_id" as keyof UsersSchema,
            ],
        },
    ],
}))
@Table
export class NotificationsUser
    extends Model
    implements NotificationsUserSchema
{
    @Column({ type: DataType.BOOLEAN, allowNull: false })
    isRead: boolean;

    @ForeignKey(() => Users)
    @Column({ type: DataType.INTEGER, allowNull: false })
    user_id: number;

    @ForeignKey(() => Notifications)
    @Column({ type: DataType.INTEGER, allowNull: false })
    notification_id: number;

    @BelongsTo(() => Users)
    user: V<typeof Users>[];

    @BelongsTo(() => Notifications)
    notification: V<typeof Notifications>[];

    @ForeignKey(() => Empresas)
    @Column({ type: DataType.INTEGER, allowNull: false })
    empresa_id: number;

    @BelongsTo(() => Empresas)
    empresa: V<typeof Empresas>;
}
