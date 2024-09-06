import {
    BelongsTo,
    BelongsToMany,
    Column,
    DataType,
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
import { Clients } from "@/users/entities/clients.entity";

@Table
export class Notifications
    extends Model
    implements Omit<NotificationsSchema, "id">
{
    @Column({ type: DataType.STRING(100), allowNull: false })
    type: NotifcationType;

    @Column({ type: DataType.STRING(100), allowNull: false })
    url: string;

    @Column({ type: DataType.STRING(100), allowNull: false })
    content: string;

    @BelongsToMany(() => Users, () => NotificationsUser)
    usernotifications: unknown[];

    @ForeignKey(() => Empresas)
    @Column({ type: DataType.INTEGER, allowNull: false })
    empresa_id: number;

    @BelongsTo(() => Empresas)
    empresa: unknown;

    @ForeignKey(() => Clients)
    @Column({ type: DataType.INTEGER })
    client_id: number | null;

    @BelongsTo(() => Clients)
    client: unknown;
}
