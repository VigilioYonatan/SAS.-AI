import {
    BelongsTo,
    BelongsToMany,
    Column,
    DataType,
    DefaultScope,
    ForeignKey,
    Model,
    Table,
} from "sequelize-typescript";
import type {
    NotifcationType,
    NotificationsSchema,
} from "../schemas/notifications.schema";
import { Users } from "@/users/entities/users.entity";
import { NotificationsUser } from "./notifications_user.entity";
import { Empresas } from "@/empresas/entities/empresas.entity";
import type { UsersSchema } from "@/users/schemas/users.schema";
import { V } from "~/libs/helpers";

@DefaultScope(() => ({
    include: [
        {
            model: Users,
            attributes: ["id", "username", "photo" as keyof UsersSchema],
            as: "use",
        },
    ],
}))
@Table
export class Notifications
    extends Model
    implements Omit<NotificationsSchema, "id">
{
    @Column({ type: DataType.STRING(100), allowNull: false })
    type: NotifcationType;

    @Column({ type: DataType.TEXT, allowNull: false })
    url: string;

    @Column({ type: DataType.TEXT, allowNull: false })
    content: string;

    @ForeignKey(() => Empresas)
    @Column({ type: DataType.INTEGER, allowNull: false })
    empresa_id: number;

    @ForeignKey(() => Users)
    @Column({ type: DataType.INTEGER })
    user_id: number | null;

    // RELATIONS
    @BelongsTo(() => Users)
    use: V<Users>;

    @BelongsToMany(() => Users, () => NotificationsUser)
    usernotifications: (V<Users> & { NotificationsUser: NotificationsUser })[];
}
