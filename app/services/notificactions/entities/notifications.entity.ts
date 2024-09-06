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
import { InformationEntity } from "@/information/entities/information.entity";
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

	@BelongsToMany(
		() => Users,
		() => NotificationsUser,
	)
	usernotifications: unknown[];

	@ForeignKey(() => InformationEntity)
	@Column({ type: DataType.INTEGER, allowNull: false })
	information_id: number;

	@BelongsTo(() => InformationEntity)
	information: unknown;

	@ForeignKey(() => Clients)
	@Column({ type: DataType.INTEGER })
	client_id: number | null;

	@BelongsTo(() => Clients)
	client: unknown;
}
