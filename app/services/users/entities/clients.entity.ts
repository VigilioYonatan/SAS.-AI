import {
    Column,
    DataType,
    Table,
    Model,
    DefaultScope,
    ForeignKey,
    BelongsTo,
    HasMany,
} from "sequelize-typescript";
import { InformationEntity } from "@/information/entities/information.entity";
import type { ClientSchema } from "../schemas/client.schema";
import { Orders } from "@/orders/entities/orders.entity";
import { Notifications } from "@/notificactions/entities/notifications.entity";

@DefaultScope(() => ({
    include: [
        {
            model: InformationEntity,
            attributes: ["id", "slug", "name_empresa"],
        },
    ],
}))
@Table
export class Clients extends Model implements Omit<ClientSchema, "id"> {
    @Column({
        allowNull: false,
        type: DataType.STRING(30),
    })
    fullname: string;

    @Column({
        type: DataType.STRING(100),
    })
    address: string | null;

    @Column({
        type: DataType.STRING(30),
    })
    telephone: string;

    @Column({
        allowNull: false,
        type: DataType.BOOLEAN,
        defaultValue: false,
    })
    enabled: boolean;

    @ForeignKey(() => InformationEntity)
    @Column({ type: DataType.INTEGER, allowNull: false })
    information_id: number;

    @BelongsTo(() => InformationEntity)
    information: unknown;

    @HasMany(() => Orders)
    orders: unknown[];

    @HasMany(() => Notifications)
    notifications: unknown[];
}
